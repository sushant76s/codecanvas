const Docker = require("dockerode");
const {
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
  rmdirSync,
} = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const rimraf = promisify(require("rimraf"));
const { v4: uuidv4 } = require("uuid");

const docker = new Docker();

exports.runCode = async (req, res) => {
  const { language, input, code } = req.body;

  // if (existsSync(`${__dirname}/RunCode`)) {
  //   console.log("Yes exists dir.");
  //   await rimraf(`${__dirname}/RunCode`);
  // }

  try {
    const langExt = {
      javascript: "js",
      python: "py",
      java: "java",
      "c++": "cpp",
      c: "c",
    };

    const requestId = generateUniqueId();
    const ext = langExt[language.toLowerCase()];
    const filePath = `${__dirname}/RunCode/${requestId}/`;
    const fileName = filePath + `code.${ext}`;
    const inputFileName = filePath + "input.txt";

    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    writeFileSync(fileName, code);
    writeFileSync(inputFileName, input);

    // let output = await executeCode(language.toLowerCase());
    let output = await processCode(language.toLowerCase(), filePath);

    if (output == "") {
      output = "No output available to print";
    }

    unlinkSync(fileName);
    unlinkSync(inputFileName);

    // const binaryPath = filePath + "code";
    // if (existsSync(binaryPath)) {
    //   unlinkSync(binaryPath);
    // }

    // rmdirSync(filePath, { recursive: true }); //deprecated
    await rimraf(filePath);

    res.json({ output: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const executeCode = async (language) => {
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
        Binds: [`${__dirname}/RunCode:/judge`],
      },
    });

    await container.start();

    const logs = await container.logs({
      follow: true,
      stderr: true,
      stdout: true,
    });

    logs.on("data", (chunk) => {
      // console.log("Chunk: ", chunk.toString());
      returnChunks += chunk.toString().replace(/[\x00-\x1F\x7F]/g, "");
      returnChunks += "\n";
    });

    logs.on("error", (err) => {
      console.error("error reading logs: ", err);
    });

    const timeout = setTimeout(async () => {
      logs.removeAllListeners("data");
      await container.stop();
      output = "Timeout";
    }, 10000);

    await container.wait();
    clearTimeout(timeout);
    await container.remove();

    return returnChunks;
  } catch (error) {
    console.error("error running container: ", error);
  }
};

const processCode = async (language, filePath) => {
  if (language === "c" || language === "c++") {
    language = "cpp";
  }

  try {
    const container = await docker.createContainer({
      Image: `${language}-runner`,
      AttachStdout: true,
      AttachStderr: true,

      HostConfig: {
        Binds: [`${filePath}:/judge`],
      },
      name: `code-runner-${generateUniqueId()}`,
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

    // const filePath = `${__dirname}/RunCode/`;
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

function generateUniqueId() {
  return uuidv4();
}
