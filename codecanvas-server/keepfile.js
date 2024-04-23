const Redis = require("ioredis");
const { Queue } = require("bullmq");
const db = require("../config/database");

const Docker = require("dockerode");
const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require("fs");

const client = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const snipQueue = new Queue("snipQueue", {
  connection: client,
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

exports.addSnip = async (req, res) => {
  const { username, language, input, code } = req.body;

  try {
    // db.run(
    //   "INSERT INTO submissions (username, code_language, stdIn, stdOut, code) VALUES (?, ?, ?, ?, ?)",
    //   [username, language, input, output, code],
    //   (error) => {
    //     if (error) {
    //       console.error(error);
    //       return res
    //         .status(500)
    //         .json({ error: "An error occurred while adding data" });
    //     }
    //     res.send("Data added successfully!");
    //   }
    // );

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
    console.log("output: ", output);
    unlinkSync(fileName);
    const binaryPath = fileName + code;
    if (existsSync(binaryPath)) {
      unlinkSync(binaryPath);
    }
  } catch (error) {
    console.log("Problem running code.", error);
  }
  //   console.log("username: ", username);
  //   console.log("language: ", language);
  //   console.log("input: ", input);
  //   console.log("code: ", code);
};

exports.getSnips = async (req, res) => {
  console.log("In get.");
};

const { Worker } = require("bullmq");
const Redis = require("ioredis");
const Docker = require("dockerode");
const { exec } = require("child_process");
const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const client = new Redis({
  host: "localhost",
  port: 6380,
  maxRetriesPerRequest: null,
});

const docker = new Docker();

const runCode = async (language) => {
  if (language === "c" || language === "c++") {
    language = "cpp";
  }

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
      stdout: true,
      stderr: true,
    });

    logs.on("data", (chunk) => {
      returnChunks += chunk.toString();
    });

    logs.on("error", (err) => {
      console.error("Error reading logs:", err);
    });
    await container.wait();

    const timeout = setTimeout(async () => {
      await container.remove();
      returnChunks = "Timeout";
    }, 3000);

    clearTimeout(timeout);

    await container.remove();

    return returnChunks;
  } catch (err) {
    console.error("Error running container:", err);
  }
};

const work = async (job) => {
  let { id, username, language, stdin, sourceCode } = job.data;
  const code = handleInput(sourceCode, stdin);

  const languageExtensions = {
    javascript: "js",
    python: "py",
    java: "java",
    "c++": "cpp",
    c: "c",
  };

  const extension = languageExtensions[language.toLowerCase()];

  const filePath = `${__dirname}/Code/`;
  const fileName = filePath + `code.${extension}`;

  if (!existsSync(filePath)) {
    mkdirSync(filePath);
  }

  writeFileSync(fileName, code);

  let output = await runCode(language.toLowerCase());

  if (output == "") {
    output = "No output available to print";
  }

  const newSnippet = await prisma.codeSnippet.update({
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
};

const worker = new Worker("codeQueue", work, {
  connection: client,
  autorun: false,
});
worker.run();

const initialSetup = async () => {
  const images = ["python", "java", "javascript", "cpp"];
  images.map(async (image) => {
    exec(
      `docker build -t ${image}-runner Docker/${image}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          return;
        }
      }
    );
  });

  console.log(await prisma.codeSnippet.findMany());
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
