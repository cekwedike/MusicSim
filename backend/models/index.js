const sequelize = require('../config/database');
const User = require('./User');
const GameSave = require('./GameSave');
const LearningProgress = require('./LearningProgress');
const CareerHistory = require('./CareerHistory');
const PlayerStatistics = require('./PlayerStatistics');

// Define relationships

// User -> GameSave (One to Many)
User.hasMany(GameSave, { 
  foreignKey: 'userId', 
  as: 'saves',
  onDelete: 'CASCADE'
});
GameSave.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

// User -> LearningProgress (One to Many)
User.hasMany(LearningProgress, { 
  foreignKey: 'userId', 
  as: 'learningProgress',
  onDelete: 'CASCADE'
});
LearningProgress.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

// User -> CareerHistory (One to Many)
User.hasMany(CareerHistory, { 
  foreignKey: 'userId', 
  as: 'careerHistory',
  onDelete: 'CASCADE'
});
CareerHistory.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

// User -> PlayerStatistics (One to One)
User.hasOne(PlayerStatistics, { 
  foreignKey: 'userId', 
  as: 'statistics',
  onDelete: 'CASCADE'
});
PlayerStatistics.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  GameSave,
  LearningProgress,
  CareerHistory,
  PlayerStatistics
};

// Export individual models for easier importing
module.exports.models = {
  User,
  GameSave,
  LearningProgress,
  CareerHistory,
  PlayerStatistics
};