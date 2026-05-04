const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

router.get("/health", healthController.healthCheck);
router.get("/", healthController.healthCheck); // optional root health

module.exports = router;
