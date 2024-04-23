const express = require("express");
const { addCodeSnip, getCodeSnips } = require("../controllers/snipController");
const router = express.Router();

router.route("/add-snip").post(addCodeSnip);
router.route("/get-snips").get(getCodeSnips);

module.exports = router;
