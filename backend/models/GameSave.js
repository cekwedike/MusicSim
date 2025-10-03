const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameSave = sequelize.define('GameSave', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  slotName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'auto'
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gameState: {
    type: DataTypes.JSONB, // PostgreSQL JSON type for flexible game state storage
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'realistic', 'hardcore'),
    allowNull: false,
    defaultValue: 'realistic'
  },
  weeksPlayed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastPlayedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  saveVersion: {
    type: DataTypes.STRING,
    defaultValue: '1.0.0'
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['isActive'] },
    { fields: ['difficulty'] },
    { fields: ['lastPlayedAt'] }
  ]
});

// Instance method to get save summary
GameSave.prototype.getSummary = function() {
  const { id, slotName, artistName, genre, difficulty, weeksPlayed, lastPlayedAt, createdAt } = this;
  return { id, slotName, artistName, genre, difficulty, weeksPlayed, lastPlayedAt, createdAt };
};

module.exports = GameSave;