
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config/environment');
const logger = require('./middleware/logger');
const apiRoutes = require('./routes/api');
const healthRoutes = require('./routes/health');
const envRoutes = require('./routes/env');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// Logging — different format per environment
if (config.env=== 'development') {
  app.use(morgan('dev'));
}else if (config.env=== 'staging') {
  app.use(morgan('short'));
}else {
  app.use(morgan('combined'));
}

// Request ID middleware
app.use((req,res,next)=> {
  const {v4:uuidv4 }= require('uuid');
  req.requestId= req.headers['x-request-id']|| uuidv4();
  res.setHeader('X-Request-ID', req.requestId);
  res.setHeader('X-Environment', config.env);
  res.setHeader('X-Build-Env', config.buildEnv);
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/health', healthRoutes);
app.use('/env', envRoutes);

// Root endpoint — shows environment info
app.get('/', (req,res)=> {
  const response = {
    message:`${config.appName} running in ${config.env} mode`,
    environment: config.env,
    buildEnvironment: config.buildEnv,
    version: config.buildVersion,
    port: config.port,
    features: config.features,
    debugMode: config.debugMode,
    timestamp:new Date().toISOString(),
  };

  // Only show detailed info in dev/staging
  if (config.features.detailedErrors) {
    response.config= {
      logLevel: config.logLevel,
      corsOrigin: config.corsOrigin,
      rateLimitMax: config.rateLimitMax,
      enableSwagger: config.enableSwagger,
      enableMetrics: config.enableMetrics,
      runningUser: config.runningUser,
      buildTimestamp: config.buildTimestamp,
    };
  }

  res.json(response);
});

// Error handling — detailed in dev, minimal in prod
app.use((req,res)=> {
  res.status(404).json({
    error:'Not Found',
    path: req.path,
    ...(config.features.detailedErrors&& {
      availableRoutes: ['/','/health','/api/items','/api/stats','/env/info'],
    }),
  });
});

app.use((err,req,res,next)=> {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  const response = { error:'Internal Server Error' };

  // Show stack traces ONLY in dev mode
  if (config.features.detailedErrors) {
    response.message= err.message;
    response.stack= err.stack;
  }

  res.status(500).json(response);
});

// Start server
app.listen(config.port,'0.0.0.0', ()=> {
  logger.info('='.repeat(60));
  logger.info(`  ${config.appName} started successfully`);
  logger.info(`  Environment:    ${config.env}`);
  logger.info(`  Build Env:      ${config.buildEnv}`);
  logger.info(`  Port:           ${config.port}`);
  logger.info(`  Debug Mode:     ${config.debugMode}`);
  logger.info(`  Log Level:      ${config.logLevel}`);
  logger.info(`  Running User:   ${config.runningUser}`);
  logger.info(`  Build Version:  ${config.buildVersion}`);
  logger.info(`  Node Version:   ${process.version}`);
  logger.info(`  PID:            ${process.pid}`);
  logger.info('='.repeat(60));
});

module.exports = app;