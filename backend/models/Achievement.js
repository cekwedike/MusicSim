const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the achievement (e.g., "first_career", "millionaire")'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Display name of the achievement'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of how to unlock this achievement'
  },
  iconUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL or path to achievement icon/badge image'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'general',
    comment: 'Category: career, learning, financial, social, etc.'
  },
  rarity: {
    type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
    defaultValue: 'common',
    comment: 'Rarity tier of the achievement'
  },
  unlockCondition: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object defining unlock conditions (e.g., {type: "cash", value: 1000000})'
  },
  pointsValue: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    comment: 'Points awarded when this achievement is unlocked'
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this is a secret achievement'
  }
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['category'] },
    { fields: ['rarity'] }
  ]
});

// Instance method to check if a user has unlocked this achievement
Achievement.prototype.isUnlockedBy = async function(userId) {
  const UserAchievement = require('./UserAchievement');
  const unlock = await UserAchievement.findOne({
    where: {
      userId,
      achievementId: this.id
    }
  });
  return !!unlock;
};

module.exports = Achievement;
