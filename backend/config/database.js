const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Force IPv4 to avoid IPv6 connectivity issues
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Add connection timeout
    connectTimeout: 30000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10, // Increased max connections for better handling under load
    min: 2, // Maintain minimum connections to avoid cold starts
    acquire: 60000, // Increased to 60 seconds for slow connections
    idle: 10000, // Close idle connections after 10 seconds
    evict: 1000, // Check for idle connections every second
    handleDisconnects: true // Automatically handle disconnections
  },
  retry: {
    max: 5, // Increased retries
    match: [
      /ENETUNREACH/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/
    ],
    backoffBase: 1000, // Start with 1 second
    backoffExponent: 1.5 // Exponential backoff
  }
});

// Add connection event listeners for monitoring
sequelize.beforeConnect(() => {
  // Log only in development to reduce noise
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB] Attempting database connection...');
  }
});

sequelize.afterConnect(() => {
  // Log only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB] Database connection established');
  }
});

// Graceful connection error handling
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('[DB] Database connection closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('[DB] Error closing database connection:', error);
    process.exit(1);
  }
});

module.exports = sequelize;