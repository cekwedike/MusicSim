const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import models to ensure they're loaded
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const gameStateRoutes = require('./routes/gameState');
const careerHistoryRoutes = require('./routes/careerHistory');
const learningRoutes = require('./routes/learning');
const lessonsRoutes = require('./routes/lessons');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Middleware
// Handle multiple frontend URLs (comma-separated)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}. Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'MusicSim Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Swagger Documentation
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the server status and basic information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MusicSim API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Game state routes
app.use('/api/game', gameStateRoutes);

// Career history routes
app.use('/api/career', careerHistoryRoutes);

// Learning analytics routes
app.use('/api/learning', learningRoutes);

// Lesson tracking routes
app.use('/api/lessons', lessonsRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server with database connection
let server;
let isDatabaseConnected = false;

const startServer = async () => {
  // Determine base URL based on environment
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    isDatabaseConnected = true;

    // Sync models (create tables if they don't exist)
    // Using alter: true will create tables and update existing ones without dropping data
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    console.log('Tables created/updated: Users, PlayerStatistics, GameSaves, CareerHistory, LearningProgress');

    // Start listening
    server = app.listen(PORT, () => {
      console.log(`MusicSim Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: ${baseUrl}/api/health`);
      console.log(`API Documentation: ${baseUrl}/api-docs`);
      console.log(`Auth endpoints: ${baseUrl}/api/auth`);
      console.log(`Game state endpoints: ${baseUrl}/api/game`);
      console.log(`Career history endpoints: ${baseUrl}/api/career`);
      console.log(`Learning analytics endpoints: ${baseUrl}/api/learning`);
      console.log(`Lesson tracking endpoints: ${baseUrl}/api/lessons`);
      console.log(`Analytics dashboard endpoints: ${baseUrl}/api/analytics`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Server starting without database connection...');

    // Start server anyway (for development)
    server = app.listen(PORT, () => {
      console.log(`MusicSim Backend running on port ${PORT} (NO DATABASE)`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: ${baseUrl}/api/health`);
      console.log(`API Documentation: ${baseUrl}/api-docs`);
      console.log(`Auth endpoints: ${baseUrl}/api/auth (limited functionality)`);
      console.log(`Game state endpoints: ${baseUrl}/api/game (limited functionality)`);
      console.log(`Career history endpoints: ${baseUrl}/api/career (limited functionality)`);
      console.log(`Learning analytics endpoints: ${baseUrl}/api/learning (limited functionality)`);
      console.log(`Lesson tracking endpoints: ${baseUrl}/api/lessons (limited functionality)`);
      console.log(`Analytics dashboard endpoints: ${baseUrl}/api/analytics (limited functionality)`);
      console.log('Database connection failed - some features may not work');
    });
  }
};

// Graceful shutdown
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received, shutting down gracefully...`);
  
  try {
    // Close server first
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      console.log('Server closed successfully');
    }
    
    // Close database connection if it was established
    if (isDatabaseConnected) {
      await sequelize.close();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
  
  console.log('Shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (!isShuttingDown) {
    console.log('Exiting due to uncaught exception...');
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process for unhandled rejections in development
  if (process.env.NODE_ENV === 'production' && !isShuttingDown) {
    console.log('Exiting due to unhandled rejection in production...');
    process.exit(1);
  }
});

startServer();

module.exports = app;