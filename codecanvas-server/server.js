const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { exec } = require("child_process");

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// manage to ensure server is running or not from frontend
const healthCheck = require("./routes/healthCheck");
app.use("/api", healthCheck);

// manage to get and post submitted code entries
const submission = require("./routes/submissions");
app.use("/api", submission);

// manage the execution, and fetching the result of code after compilation
const judgeCode = require("./routes/judge");
app.use("/api", judgeCode);

const addSnip = require("./routes/snip");
app.use("/api", addSnip);

const getSnip = require("./routes/snip");
app.use("/api", getSnip);

// let i = 1;

// const initialSetup = async () => {
//   const image = "python";
//   exec(
//     `docker build -t ${image}-runner Docker/${image}`,
//     (err, stdout, stderr) => {
//       if (err) {
//         console.log(`exec error: ${err}`);
//       }
//     }
//   );
//   console.log("image built.");
// };
// if (i == 1) {
//   initialSetup();
//   i++;
// }

app.listen(port, () =>
  console.log(`server is running on: http://localhost:${port}`)
);
