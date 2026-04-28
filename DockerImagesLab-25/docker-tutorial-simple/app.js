// app.js - Simple Express Web Server
// This is a beginner-friendly Node.js application
// designed for Docker image learning

const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "Simple Docker App";

// ─────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Simple request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────

// Root route - returns basic app information
app.get("/", (req, res) => {
  res.json({
    success: true,
    app: APP_NAME,
    message:
      "Hello from Docker! Your container is running successfully and Congratulate ",
    container: {
      hostname: os.hostname(), // Container ID (used as hostname)
      platform: os.platform(), // Always 'linux' inside Docker
      arch: os.arch(), // CPU architecture
      nodeVersion: process.version, // Node.js version
    },
    server: {
      port: PORT,
      uptime: `${Math.floor(process.uptime())} seconds`,
      memoryUsage: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check route - used by Docker and load balancers
// to verify the container is alive and responding
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "docker-simple-app",
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
  });
});

// Info route - returns system and environment information
app.get("/info", (req, res) => {
  res.json({
    system: {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      uptime: `${Math.floor(process.uptime())} seconds`,
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: PORT,
      APP_NAME: APP_NAME,
    },
  });
});

// Echo route - returns back whatever JSON you send to it
// Useful for testing that the container receives data correctly
app.post("/echo", (req, res) => {
  res.json({
    success: true,
    message: "Echo from Docker container",
    received: req.body,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - catches all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    availableRoutes: ["GET /", "GET /health", "GET /info", "POST /echo"],
  });
});

// ─────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log("─────────────────────────────────────────");
  console.log(`  ${APP_NAME}`);
  console.log("─────────────────────────────────────────");
  console.log(`  Server    : http://localhost:${PORT}`);
  console.log(`  Health    : http://localhost:${PORT}/health`);
  console.log(`  Info      : http://localhost:${PORT}/info`);
  console.log(`  Echo      : POST http://localhost:${PORT}/echo`);
  console.log(`  Node.js   : ${process.version}`);
  console.log(`  Platform  : ${os.platform()}`);
  console.log("─────────────────────────────────────────");
});
