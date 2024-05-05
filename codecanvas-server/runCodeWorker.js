const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");
const Docker = require("dockerode");
const { writeFileSync, unlinkSync, existsSync, mkdirSync } = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const docker = new Docker();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const work = async (job) => {
  const { language, code, input } = job.data;

  try {
    const output = await executeCode(language, code, input);
    return output;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to execute code");
  }
};

const worker = new Worker("codeExecutionQueue", work, {
  connection: client,
  autorun: false,
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

worker.run();

async function executeCode(language, code, input) {
  const sourceCode = handleInput(code, input);
  const extension = getLanguageExtension(language);

  // Write code to a file
  const filePath = `${__dirname}/Code/`;
  const fileName = filePath + `code.${extension}`;
  if (!existsSync(filePath)) {
    mkdirSync(filePath);
  }
  writeFileSync(fileName, sourceCode);

  let lang = language.toLowerCase();
  if (lang === "c" || lang === "c++") {
    lang = "cpp";
  }

  try {
    let returnChunks = "";
    const container = await docker.createContainer({
      Image: `${lang}-runner`,
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
    unlinkSync(fileName);
    if (returnChunks == "") {
      returnChunks = "No output available to print";
    }
    returnChunks = returnChunks.replace(/[\x00-\x1F\x7F]/g, "");
    return returnChunks;
  } catch (error) {
    console.error("error running container: ", error);
    throw error;
  }
}

function getLanguageExtension(language) {
  // Language to file extension mapping
  const langExt = {
    javascript: "js",
    python: "py",
    java: "java",
    "c++": "cpp",
    c: "c",
  };
  return langExt[language.toLowerCase()];
}

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

module.exports = worker;
