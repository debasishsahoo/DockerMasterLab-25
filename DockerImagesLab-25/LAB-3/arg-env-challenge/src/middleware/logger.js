
const winston = require('winston');
const config = require('../config/environment');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack:true }),
    config.env=== 'development'
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({timestamp,level,message,...meta })=> {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta): '';
            return `${timestamp} ${level}: ${message} ${metaStr}`;
          })
        )
      : winston.format.json()
  ),
  defaultMeta: {
    service: config.appName,
    environment: config.env,
  },
  transports: [new winston.transports.Console()],
});

module.exports = logger;