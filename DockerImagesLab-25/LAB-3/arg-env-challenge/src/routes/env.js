
const express = require('express');
const router = express.Router();
const config = require('../config/environment');

// Show environment information (safe version)
router.get('/info', (req,res)=> {
  const info = {
    environment: config.env,
    buildEnvironment: config.buildEnv,
    port: config.port,
    debugMode: config.debugMode,
    features: config.features,
    buildVersion: config.buildVersion,
    buildTimestamp: config.buildTimestamp,
  };

  // In dev mode, show more details
  if (config.debugMode) {
    info.allEnvVars= {};
    const safeKeys = [
      'NODE_ENV','PORT','APP_NAME','LOG_LEVEL','DEBUG_MODE',
      'API_PREFIX','CORS_ORIGIN','RATE_LIMIT_MAX','BUILD_ENVIRONMENT',
      'BUILD_TIMESTAMP','BUILD_VERSION','RUNNING_USER','ENABLE_SWAGGER',
      'ENABLE_METRICS','DETAILED_ERRORS','REQUEST_LOGGING',
      'HEALTH_DETAILS','MOCK_DATA',
    ];
    safeKeys.forEach(key => {
      info.allEnvVars[key]= process.env[key]|| '(not set)';
    });
  }

  res.json(info);
});

// Demonstrate ARG vs ENV
router.get('/arg-vs-env', (req,res)=> {
  res.json({
    explanation: {
      ARG:'Build-time only. Set with --build-arg. NOT available at runtime.',
      ENV:'Build-time AND runtime. Persists in the image. Available to the app.',
    },
    demonstration: {
      BUILD_ENV_arg:'Was used DURING build to make decisions. Now GONE at runtime.',
      NODE_ENV_env: process.env.NODE_ENV || '(not set)',
      PORT_env: process.env.PORT || '(not set)',
      BUILD_ENVIRONMENT_env: process.env.BUILD_ENVIRONMENT || '(not set — ARG was converted to ENV)',
      BUILD_TIMESTAMP_env: process.env.BUILD_TIMESTAMP || '(not set)',
    },
    note:'BUILD_ENV (ARG) drove conditional logic during build. BUILD_ENVIRONMENT (ENV) stores the value for runtime reference.',
  });
});

module.exports = router;