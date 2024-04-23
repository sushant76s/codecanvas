const express = require('express');
const { getData, postData } = require('../controllers/submissionController');
const router = express.Router();

// get all the submitted code entries
router.route("/data").get(getData);

// post a code entry
router.route("/data").post(postData);

module.exports = router;