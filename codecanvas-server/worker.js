const { Worker } = require("bullmq");
const Redis = require("ioredis");
const Docker = require("dockerode");
const { exec } = require("child_process");
const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const client = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const docker = new Docker();

const runCode = async (language) => {
  try {
    let returnChunks = "";
    const container = await docker.createContainer({
      Image: `${language}-runner`,
      AttachStdout: true,
      AttachStderr: true,

      HostConfig: {
        Binds: [`${__dirname}/Code:/judge`],
      },
    });
    await container.start();
    const logs = await container.logs({
      follow: true,
      stderr: true,
      stdout: true,
    });
    logs.on("data", (chunk) => {
      returnChunks += chunk.toString();
    });
    logs.on("error", (err) => {
      console.error("error reading logs: ", err);
    });
    await container.wait();
    const timeout = setTimeout(async () => {
      await container.remove();
      returnChunks = "Timeout";
    }, 3000);
    clearTimeout(timeout);
    await container.remove();
    return returnChunks;
  } catch (error) {
    console.error("error running container: ", error);
  }
};

const work = async (job) => {
  let { id, username, language, stdin, sourceCode } = job.data;
  console.log("Processing job: ", id);
  const code = handleInput(sourceCode, stdin);

  const ext = "py";
  const filePath = `${__dirname}/Code/`;
  const fileName = filePath + `code.${ext}`;

  if (!existsSync(filePath)) {
    mkdirSync(filePath);
  }

  writeFileSync(fileName, code);

  let output = await runCode(language.toLowerCase());
  if (output == "") {
    output = "No output available to print";
  }

  console.log("Output: ", output);
  output = output.replace(/[\x00-\x1F\x7F]/g, "");

  const newSnippet = await prisma.snips.update({
    data: {
      stdout: output,
    },
    where: {
      id: id,
    },
  });

  await client.set(
    `snip:${newSnippet.id}`,
    JSON.stringify(newSnippet),
    "EX",
    20
  );
  unlinkSync(fileName);
  const binaryPath = filePath + "code";
  if (existsSync(binaryPath)) {
    unlinkSync(binaryPath);
  }
  console.log("finished Job: ", id);
};

const worker = new Worker("snipQueue", work, {
  connection: client,
  autorun: false,
});

worker.run();

const initialSetup = async () => {
  const image = "python";
  exec(
    `docker build -t ${image}-runner Docker/${image}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(`exec error: ${err}`);
      }
    }
  );
  console.log("image built.");
};

const handleInput = (source, input) => {
  const placeholders = source.match(/\$(\w+)/g);
  const inputData = input.split(",");

  if (placeholders) {
    if (inputData.length !== placeholders.length) {
      console.log("invalid number of codes");
    }
    let idx = 0;
    placeholders.forEach((placeholder) => {
      source = source.replace(placeholder, inputData[idx]);
      idx++;
    });
  }
  return source;
};

initialSetup();
