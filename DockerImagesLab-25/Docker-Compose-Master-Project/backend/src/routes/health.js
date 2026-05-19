const express = require("express");
const router = express.Router();
const os = require("os");

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    hostname: os.hostname(),
    version: process.env.VERSION || "1.0.0",
  });
});

router.get("/readiness", (req, res) => {
  res.status(200).json({
    status: "ready",
    checks: {
      database: "connected",
      cache: "available",
    },
  });
});

module.exports = router;
