const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlayerStatistics = sequelize.define('PlayerStatistics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Game Statistics
  totalGamesPlayed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalWeeksPlayed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  gamesLostToDebt: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  gamesLostToBurnout: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  careersAbandoned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  careersCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Learning Statistics
  totalLessonsViewed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalModulesCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageQuizScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalStudyTimeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Achievement Statistics
  totalAchievementsUnlocked: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rareAchievementsUnlocked: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Session Tracking
  totalPlayTimeMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageSessionDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Preferences and Settings
  preferredDifficulty: {
    type: DataTypes.ENUM('beginner', 'realistic', 'hardcore'),
    defaultValue: 'realistic'
  },
  favoriteGenre: {
    type: DataTypes.STRING
  },
  
  // Additional Tracking
  totalDecisionsMade: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  contractsSigned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId'] },
    { fields: ['totalGamesPlayed'] },
    { fields: ['lastPlayedAt'] }
  ]
});

// Instance method to get player level based on experience
PlayerStatistics.prototype.getPlayerLevel = function() {
  const experience = this.totalWeeksPlayed + (this.totalModulesCompleted * 10);
  
  if (experience < 50) return { level: 'Rookie', tier: 1 };
  if (experience < 150) return { level: 'Amateur', tier: 2 };
  if (experience < 300) return { level: 'Semi-Pro', tier: 3 };
  if (experience < 500) return { level: 'Professional', tier: 4 };
  if (experience < 750) return { level: 'Expert', tier: 5 };
  return { level: 'Legend', tier: 6 };
};

// Instance method to get success rate
PlayerStatistics.prototype.getSuccessRate = function() {
  if (this.totalGamesPlayed === 0) return 0;
  
  const successfulGames = this.careersCompleted;
  return Math.round((successfulGames / this.totalGamesPlayed) * 100);
};

// Instance method to get completion summary
PlayerStatistics.prototype.getSummary = function() {
  const playerLevel = this.getPlayerLevel();
  const successRate = this.getSuccessRate();

  return {
    level: playerLevel,
    totalGames: this.totalGamesPlayed,
    totalWeeks: this.totalWeeksPlayed,
    successRate,
    achievements: this.totalAchievementsUnlocked,
    modulesCompleted: this.totalModulesCompleted
  };
};

// Static method to update statistics after game completion
PlayerStatistics.updateAfterGame = async function(userId, gameData) {
  let stats = await this.findOne({ where: { userId } });
  
  if (!stats) {
    stats = await this.create({ userId });
  }
  
  // Update game statistics
  stats.totalGamesPlayed += 1;
  stats.totalWeeksPlayed += gameData.weeksPlayed;

  // Update based on outcome
  switch (gameData.outcome) {
    case 'debt':
      stats.gamesLostToDebt += 1;
      break;
    case 'burnout':
      stats.gamesLostToBurnout += 1;
      break;
    case 'abandoned':
      stats.careersAbandoned += 1;
      break;
    case 'completed':
      stats.careersCompleted += 1;
      break;
  }
  
  await stats.save();
  return stats;
};

module.exports = PlayerStatistics;