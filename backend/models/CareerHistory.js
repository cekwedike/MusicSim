const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CareerHistory = sequelize.define('CareerHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'realistic', 'hardcore'),
    allowNull: false
  },
  weeksPlayed: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  outcome: {
    type: DataTypes.ENUM('debt', 'burnout', 'abandoned', 'completed'),
    allowNull: false
  },
  finalStats: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  achievementsEarned: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: null
  },
  lessonsLearned: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: null
  },
  contractsSigned: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: null
  },
  peakCash: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lowestCash: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  peakFame: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  peakCareerProgress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  historicalData: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  majorEvents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  sessionDurationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  decisionsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['difficulty'] },
    { fields: ['outcome'] },
    { fields: ['weeksPlayed'] },
    { fields: ['createdAt'] }
  ]
});

// Instance method to get career summary
CareerHistory.prototype.getSummary = function() {
  const { 
    id, artistName, genre, difficulty, weeksPlayed, outcome, 
    peakCash, peakFame, peakCareerProgress, achievementsEarned, 
    createdAt 
  } = this;
  
  return { 
    id, artistName, genre, difficulty, weeksPlayed, outcome, 
    peakCash, peakFame, peakCareerProgress, 
    achievementsCount: achievementsEarned.length,
    playedAt: createdAt 
  };
};

// Static method to get user statistics
CareerHistory.getUserStats = async function(userId) {
  const careers = await this.findAll({
    where: { userId },
    attributes: [
      'difficulty', 'outcome', 'weeksPlayed', 'peakCash', 
      'peakFame', 'peakCareerProgress', 'achievementsEarned'
    ]
  });
  
  const totalCareers = careers.length;
  const careersByDifficulty = {
    beginner: careers.filter(c => c.difficulty === 'beginner').length,
    realistic: careers.filter(c => c.difficulty === 'realistic').length,
    hardcore: careers.filter(c => c.difficulty === 'hardcore').length
  };
  
  const outcomeStats = {
    debt: careers.filter(c => c.outcome === 'debt').length,
    burnout: careers.filter(c => c.outcome === 'burnout').length,
    abandoned: careers.filter(c => c.outcome === 'abandoned').length,
    completed: careers.filter(c => c.outcome === 'completed').length
  };
  
  const bestCareer = careers.reduce((best, current) => {
    return current.weeksPlayed > (best?.weeksPlayed || 0) ? current : best;
  }, null);
  
  return {
    totalCareers,
    careersByDifficulty,
    outcomeStats,
    bestCareer: bestCareer?.getSummary() || null,
    totalWeeksPlayed: careers.reduce((sum, c) => sum + c.weeksPlayed, 0),
    averageWeeksPlayed: totalCareers > 0 ? Math.round(careers.reduce((sum, c) => sum + c.weeksPlayed, 0) / totalCareers) : 0
  };
};

module.exports = CareerHistory;