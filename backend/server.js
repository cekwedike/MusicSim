const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import models to ensure they're loaded
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const gameStateRoutes = require('./routes/gameState');
const careerHistoryRoutes = require('./routes/careerHistory');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Auth routes
app.use('/api/auth', authRoutes);

// Game state routes
app.use('/api/game', gameStateRoutes);

// Career history routes
app.use('/api/career', careerHistoryRoutes);

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
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    isDatabaseConnected = true;

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: false }); // Set to true only during development
    console.log('✅ Database models synchronized.');

    // Start listening
    server = app.listen(PORT, () => {
      console.log(`🚀 MusicSim Backend running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🎮 Game state endpoints: http://localhost:${PORT}/api/game`);
      console.log(`📈 Career history endpoints: http://localhost:${PORT}/api/career`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error('🔄 Server starting without database connection...');
    
    // Start server anyway (for development)
    server = app.listen(PORT, () => {
      console.log(`⚠️  MusicSim Backend running on port ${PORT} (NO DATABASE)`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth (limited functionality)`);
      console.log(`🎮 Game state endpoints: http://localhost:${PORT}/api/game (limited functionality)`);
      console.log(`📈 Career history endpoints: http://localhost:${PORT}/api/career (limited functionality)`);
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