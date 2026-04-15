const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        system: {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            cpus: os.cpus().length,
            freeMemory: os.freemem(),
            totalMemory: os.totalmem()
        }
    });
});

router.get('/ready', (req, res) => {
    // Readiness probe
    res.json({ ready: true });
});

router.get('/live', (req, res) => {
    // Liveness probe
    res.json({ alive: true });
});

module.exports = router;