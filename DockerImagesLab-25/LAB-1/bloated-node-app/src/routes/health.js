const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/', (req,res)=> {
  res.json({
    status:'healthy',
    uptime: process.uptime(),
    timestamp:new Date().toISOString(),
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpus: os.cpus().length,
      totalMemory:`${Math.round(os.totalmem()/ 1024 / 1024)}MB`,
      freeMemory:`${Math.round(os.freemem()/ 1024 / 1024)}MB`,
    },
    process: {
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
    },
  });
});

router.get('/ready', (req,res)=> {
  res.json({ ready:true });
});

router.get('/live', (req,res)=> {
  res.json({ alive:true });
});

module.exports = router;