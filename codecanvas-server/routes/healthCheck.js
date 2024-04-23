const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController');
const router = express.Router();

router.route("/server-check").get(healthCheck)

module.exports = router;