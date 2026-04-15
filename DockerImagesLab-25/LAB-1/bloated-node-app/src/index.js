const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const moment = require("moment");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

const app = express();
const PORT = 5000;

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(compression());
app.use(express.json());

const apiRoutes = require("./routes/api");
const healthRoutes = require("./routes/health");

app.use("/api", apiRoutes);
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Docker Optimization Challenge - Node.js App",
    version: "1.0.0",
    requestId: uuidv4(),
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.post("/api/process", (req, res) => {
  const data = _.range(1, 101).map((i) => ({
    id: uuidv4(),
    value: _.random(1, 1000),
    name: `Item-${i}`,
    timestamp: moment().subtract(_.random(1, 365), "days").toISOString(),
  }));

  const result = {
    total: _.sumBy(data, "value"),
    average: _.meanBy(data, "value"),
    max: _.maxBy(data, "value"),
    min: _.minBy(data, "value"),
    sorted: _.orderBy(data, ["value"], ["desc"]).slice(0, 5),
    processedAt: moment().toISOString(),
    requestId: uuidv4(),
  };

  logger.info("Data processed", { itemCount: data.length });
  res.json(result);
});

app.use((err, req, res, next) => {
  logger.error("Error", { error: err.message });
  res.status(500).json({ error: "Internal Server Error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`, {
    nodeVersion: process.version,
    pid: process.pid,
    env: "development",
  });
});

module.exports = app;
