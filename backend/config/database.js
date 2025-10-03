const { Sequelize } = require('sequelize');
require('dotenv').config();

// Default to a mock URL if DATABASE_URL is not provided
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/musicsim';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: false,
    freezeTableName: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  }
});

module.exports = sequelize;