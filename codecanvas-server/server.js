const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const healthCheck = require("./routes/healthCheck");
const submission = require("./routes/submissions");
const judgeCode = require("./routes/judge");
const addSnip = require("./routes/snip");
const getSnip = require("./routes/snip");
const runCode = require("./routes/runCode");

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running :)");
});

app.use("/api", healthCheck);
app.use("/api", submission);
app.use("/api", judgeCode);
app.use("/api", addSnip);
app.use("/api", getSnip);
app.use("/api", runCode);

app.listen(port, () =>
  console.log(`server is running on: http://localhost:${port}`)
);
