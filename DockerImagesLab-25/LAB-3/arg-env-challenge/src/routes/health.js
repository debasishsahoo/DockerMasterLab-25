
const express = require('express');
const router = express.Router();
const os = require('os');
const config = require('../config/environment');

router.get('/', (req,res)=> {
  const health = {
    status:'healthy',
    environment: config.env,
    buildEnvironment: config.buildEnv,
    uptime: process.uptime(),
    timestamp:new Date().toISOString(),
  };

  // Detailed health info only in dev/staging
  if (config.features.healthDetails) {
    health.details= {
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        totalMemory:`${Math.round(os.totalmem()/ 1024 / 1024)}MB`,
        freeMemory:`${Math.round(os.freemem()/ 1024 / 1024)}MB`,
        loadAverage: os.loadavg(),
      },
      process: {
        pid: process.pid,
        memoryUsage: {
          rss:`${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
          heapUsed:`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal:`${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        },
        user: config.runningUser,
      },
      config: {
        port: config.port,
        logLevel: config.logLevel,
        debugMode: config.debugMode,
        features: config.features,
      },
      build: {
        environment: config.buildEnv,
        timestamp: config.buildTimestamp,
        version: config.buildVersion,
      },
    };
  }

  res.json(health);
});

router.get('/ready', (req,res)=> res.json({ ready:true }));
router.get('/live', (req,res)=> res.json({ alive:true }));

module.exports = router;