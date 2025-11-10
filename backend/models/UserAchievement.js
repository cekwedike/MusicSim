const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Reference to the user who unlocked this achievement'
  },
  achievementId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Reference to the achievement that was unlocked'
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Timestamp when the achievement was unlocked'
  },
  progress: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Progress tracking for multi-step achievements (e.g., {current: 5, target: 10})'
  }
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId', 'achievementId'] }, // Prevent duplicate unlocks
    { fields: ['userId'] },
    { fields: ['achievementId'] },
    { fields: ['unlockedAt'] }
  ]
});

// Static method to unlock an achievement for a user
UserAchievement.unlockForUser = async function(userId, achievementCode) {
  const Achievement = require('./Achievement');

  // Find the achievement by code
  const achievement = await Achievement.findOne({ where: { code: achievementCode } });

  if (!achievement) {
    throw new Error(`Achievement with code "${achievementCode}" not found`);
  }

  // Check if already unlocked
  const existing = await this.findOne({
    where: {
      userId,
      achievementId: achievement.id
    }
  });

  if (existing) {
    return { unlocked: false, message: 'Achievement already unlocked', achievement };
  }

  // Create the unlock record
  const unlock = await this.create({
    userId,
    achievementId: achievement.id,
    unlockedAt: new Date()
  });

  // Update user's achievement count
  const PlayerStatistics = require('./PlayerStatistics');
  const stats = await PlayerStatistics.findOne({ where: { userId } });

  if (stats) {
    stats.totalAchievementsUnlocked += 1;
    if (achievement.rarity === 'rare' || achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
      stats.rareAchievementsUnlocked += 1;
    }
    await stats.save();
  }

  return { unlocked: true, achievement, unlock };
};

// Static method to get all achievements for a user
UserAchievement.getForUser = async function(userId) {
  const Achievement = require('./Achievement');

  const unlocks = await this.findAll({
    where: { userId },
    include: [{
      model: Achievement,
      as: 'achievement'
    }],
    order: [['unlockedAt', 'DESC']]
  });

  return unlocks;
};

module.exports = UserAchievement;
