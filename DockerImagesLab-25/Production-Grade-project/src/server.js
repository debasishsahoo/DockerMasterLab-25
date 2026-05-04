const app = require("./app");
const config = require("config");

const PORT = process.env.PORT || config.get("port");

const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT} in ${config.get("env")} mode`);
});

// Graceful shutdown (handles SIGTERM sent by Docker)
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
