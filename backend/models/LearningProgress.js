const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningProgress = sequelize.define('LearningProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  moduleId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  moduleName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  quizScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  },
  attemptsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  timeSpentMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completedAt: {
    type: DataTypes.DATE
  },
  conceptsMastered: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  lastAccessed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['moduleId'] },
    { fields: ['completed'] },
    { unique: true, fields: ['userId', 'moduleId'] }
  ]
});

// Instance method to calculate completion percentage
LearningProgress.prototype.getCompletionRate = function() {
  if (!this.completed) return 0;
  return this.quizScore || 0;
};

// Static method to get user's learning summary
LearningProgress.getUserSummary = async function(userId) {
  const progress = await this.findAll({
    where: { userId },
    attributes: ['moduleId', 'moduleName', 'completed', 'quizScore', 'completedAt']
  });
  
  const totalModules = progress.length;
  const completedModules = progress.filter(p => p.completed).length;
  const averageScore = progress
    .filter(p => p.completed && p.quizScore)
    .reduce((acc, p, _, arr) => acc + p.quizScore / arr.length, 0);
  
  return {
    totalModules,
    completedModules,
    completionRate: totalModules > 0 ? (completedModules / totalModules) * 100 : 0,
    averageScore: Math.round(averageScore || 0),
    progress
  };
};

module.exports = LearningProgress;