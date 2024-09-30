const { exec, spawn } = require("child_process");

// Function to run a command and return a promise (for short-lived scripts)
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(`node ${command}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}:`, stderr);
        return reject(error);
      }
      console.log(`Output of ${command}:`, stdout);
      resolve(stdout);
    });
  });
};

// Function to spawn long-running processes (Worker.js and server.js)
const runLongProcess = (command) => {
  const process = spawn("node", [command], { stdio: "inherit" });

  process.on("error", (error) => {
    console.error(`Error in ${command}:`, error);
  });

  process.on("close", (code) => {
    console.log(`${command} exited with code ${code}`);
  });
};

// Sequentially running the build-images, then running Worker and server in parallel
const runAllScripts = async () => {
  try {
    console.log("Running build-images.js (this may take longer)...");
    await runCommand("build-images.js"); // Wait for this to complete
    console.log("build-images.js completed.");

    console.log("Starting Worker.js and server.js...");
    runLongProcess("worker.js"); // Run Worker.js
    runLongProcess("server.js"); // Run server.js
    console.log("worker.js and server.js are running...");
  } catch (error) {
    console.error("Error running scripts:", error);
  }
};

runAllScripts();
