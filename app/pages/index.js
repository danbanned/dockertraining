// src/index.js - Main application entry point
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.example' });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { createLogger, format, transports } = require('winston');
const { Pool } = require('pg');
const redis = require('redis');

// Initialize logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

// Initialize database connection
let dbPool;
let redisClient;

const initializeDatabase = async () => {
  try {
    if (process.env.DATABASE_URL) {
      dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      
      // Test database connection
      await dbPool.query('SELECT NOW()');
      logger.info('Database connected successfully');
    }
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
};

const initializeRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = redis.createClient({
        url: process.env.REDIS_URL
      });
      
      redisClient.on('error', (err) => logger.error('Redis Client Error', err));
      
      await redisClient.connect();
      logger.info('Redis connected successfully');
    }
  } catch (error) {
    logger.error('Redis connection failed:', error);
  }
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(compression()); // Gzip compression
app.use(express.json()); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded parsing

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: dbPool ? 'connected' : 'disconnected',
    redis: redisClient?.isReady ? 'connected' : 'disconnected'
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to My App API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Example database route
app.get('/api/users', async (req, res) => {
  try {
    if (!dbPool) {
      return res.status(503).json({ error: 'Database not available' });
    }
    
    const result = await dbPool.query('SELECT * FROM users LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example Redis route
app.get('/api/cache/:key', async (req, res) => {
  try {
    if (!redisClient?.isReady) {
      return res.status(503).json({ error: 'Redis not available' });
    }
    
    const value = await redisClient.get(req.params.key);
    res.json({ key: req.params.key, value });
  } catch (error) {
    logger.error('Error accessing Redis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await initializeRedis();
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, closing connections...');
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        if (dbPool) {
          await dbPool.end();
          logger.info('Database pool closed');
        }
        
        if (redisClient) {
          await redisClient.quit();
          logger.info('Redis connection closed');
        }
        
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing