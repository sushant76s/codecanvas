// Build the compiler images for the used languages

const { exec } = require("child_process");

const checkImageExists = (image) => {
  return new Promise((resolve, reject) => {
    exec(`docker image inspect ${image}-runner`, (err, stdout, stderr) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const buildImage = (image) => {
  return new Promise((resolve, reject) => {
    exec(
      `docker build -t ${image}-runner ./Docker/${image}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(`Error building image ${image}: ${err}`);
          reject(err);
        } else {
          console.log(`Image: ${image} built successfully.`);
          resolve(stdout);
        }
      }
    );
  });
};

const initialSetup = async () => {
  const images = ["python", "cpp", "java", "javascript"];

  await Promise.all(
    images.map(async (image) => {
      const exists = await checkImageExists(image);
      if (!exists) {
        console.log(`Building image: ${image}...`);
        await buildImage(image);
      } else {
        console.log(`Image: ${image} already exists. Skipping build.`);
      }
    })
  );

  console.log("Docker images checked and built successfully.");
};

initialSetup();
