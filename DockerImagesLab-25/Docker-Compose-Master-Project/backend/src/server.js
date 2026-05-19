const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const healthRoutes = require("./routes/health");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Docker Teaching API",
    version: config.version,
    environment: config.nodeEnv,
  });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(
      `Server running on port ${config.port} in ${config.nodeEnv} mode`,
    );
    console.log(`Health check: http://localhost:${config.port}/health`);
  });
}

module.exports = app;
