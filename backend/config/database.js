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
    keepAliveInitialDelayMillis: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Increased to 60 seconds for slow connections
    idle: 10000
  },
  retry: {
    max: 5, // Increased retries
    match: [
      /ENETUNREACH/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /SequelizeConnectionError/
    ]
  }
});

module.exports = sequelize;