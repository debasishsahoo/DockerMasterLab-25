const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgres://localhost:5432/mydb",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  version: process.env.VERSION || "1.0.0",
};

module.exports = config;
