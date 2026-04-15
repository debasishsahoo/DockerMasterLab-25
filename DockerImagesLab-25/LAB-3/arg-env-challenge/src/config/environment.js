// This module reads ENV variables set by Docker
// and makes them available throughout the application
const config = {
  // Core settings (set by Dockerfile ENV)
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT) || 3000,
  appName: process.env.APP_NAME || "arg-env-challenge",

  // Environment-specific settings (set by Dockerfile based on BUILD_ENV)
  logLevel: process.env.LOG_LEVEL || "info",
  debugMode: process.env.DEBUG_MODE === "true",
  apiPrefix: process.env.API_PREFIX || "/api",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  enableSwagger: process.env.ENABLE_SWAGGER === "true",
  enableMetrics: process.env.ENABLE_METRICS === "true",

  // Build info (ARG converted to ENV during build)
  buildEnv: process.env.BUILD_ENVIRONMENT || "unknown",
  buildTimestamp: process.env.BUILD_TIMESTAMP || "unknown",
  buildVersion: process.env.BUILD_VERSION || "unknown",
  runningUser: process.env.RUNNING_USER || "unknown",

  // Feature flags per environment
  features: {
    detailedErrors: process.env.DETAILED_ERRORS === "true",
    requestLogging: process.env.REQUEST_LOGGING !== "false",
    healthDetails: process.env.HEALTH_DETAILS === "true",
    mockData: process.env.MOCK_DATA === "true",
  },
};

// Validation
const requiredVars = ["NODE_ENV", "PORT"];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missing.join(", ")}`);
}

module.exports = config;
