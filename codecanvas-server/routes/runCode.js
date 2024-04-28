const express = require("express");
const { runCode } = require("../controllers/runCodeController");
const router = express.Router();

router.route("/run-code").post(runCode);

module.exports = router;
