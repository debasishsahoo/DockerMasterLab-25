const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;
const REQUEST_ID_HEADER = 'X-Request-Id';

// ─── Middleware ───
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));

// Attach unique request ID
app.use((req, res, next) => {
    const requestId = req.headers[REQUEST_ID_HEADER.toLowerCase()] || uuidv4();
    req.requestId = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);
    next();
});

// ─── Routes ───
app.use('/health', healthRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Layer Cache Demo API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        requestId: req.requestId
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.originalUrl,
        requestId: req.requestId
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`, {
        stack: err.stack,
        requestId: req.requestId
    });
    res.status(500).json({
        error: 'Internal Server Error',
        requestId: req.requestId
    });
});

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server started on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;