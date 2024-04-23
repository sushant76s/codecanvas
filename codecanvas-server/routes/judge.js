const express = require('express');
const { languagesAvailable, createSubmission, getSubmission } = require('../controllers/judgeController');
const router = express.Router();

// languages available
router.route("/languages").get(languagesAvailable);

// Create a submission
router.route("/submit_code").post(createSubmission);

// get a submission
router.route("/submit_code/:submissionId").get(getSubmission);

module.exports = router;