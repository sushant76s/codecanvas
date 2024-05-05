const { Worker } = require("bullmq");
const Redis = require("ioredis");
const Docker = require("dockerode");
const { exec } = require("child_process");
const {
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
} = require("fs");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
dotenv.config();

const prisma = new PrismaClient();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const docker = new Docker();

const runCode = async (language) => {
  if (language === "c" || language === "c++") {
    language = "cpp";
  }

  try {
    const container = await docker.createContainer({
      Image: `${language}-runner`,
      AttachStdout: true,
      AttachStderr: true,

      HostConfig: {
        Binds: [`${__dirname}/Code:/judge`],
      },
    });

    await container.start();
    await container.wait();
    await container.stop().catch((error) => {
      if (error.statusCode === 304) {
        console.log("Container is already stopped.");
      } else {
        throw error;
      }
    });
    await container.remove();

    const filePath = `${__dirname}/Code/`;
    const outputFileName = filePath + "output.txt";
    const errorFileName = filePath + "error.txt";

    let output = "";
    if (existsSync(outputFileName)) {
      const outputRes = readFileSync(outputFileName, "utf-8");
      output += outputRes;
    }

    if (existsSync(errorFileName)) {
      const errorRes = readFileSync(errorFileName, "utf-8");
      output += errorRes;
    }
    return output;
  } catch (error) {
    console.error("error running container: ", error);
  }
};

const work = async (job) => {
  let { id, username, language, stdin, sourceCode } = job.data;
  try {
    const langExt = {
      javascript: "js",
      python: "py",
      java: "java",
      "c++": "cpp",
      c: "c",
    };

    const ext = langExt[language.toLowerCase()];
    const filePath = `${__dirname}/Code/`;
    const fileName = filePath + `code.${ext}`;
    const inputFileName = filePath + "input.txt";

    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }

    writeFileSync(fileName, sourceCode);
    writeFileSync(inputFileName, stdin);

    let output = await runCode(language.toLowerCase());

    if (output == "") {
      output = "No output available to print";
    }

    unlinkSync(fileName);
    unlinkSync(inputFileName);
    const binaryPath = filePath + "code";
    if (existsSync(binaryPath)) {
      unlinkSync(binaryPath);
    }

    await rimraf(filePath);

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

    console.log("finished Job: ", id);
  } catch (error) {
    console.log("Something went wrong: ", id);
  }
};

const worker = new Worker("snipQueue", work, {
  connection: client,
  autorun: false,
});

worker.run();

const initialSetup = async () => {
  const images = ["python", "cpp", "java", "javascript"];
  images.map(async (image) => {
    exec(
      `docker build -t ${image}-runner Docker/${image}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(`exec error: ${err}`);
        }
      }
    );
  });
  console.log("image built.");
};

// const handleInput = (source, input) => {
//   const placeholders = source.match(/\$(\w+)/g);
//   const inputData = input.split(",");

//   if (placeholders) {
//     if (inputData.length !== placeholders.length) {
//       console.log("invalid number of codes");
//     }
//     let idx = 0;
//     placeholders.forEach((placeholder) => {
//       source = source.replace(placeholder, inputData[idx]);
//       idx++;
//     });
//   }
//   return source;
// };

initialSetup();
