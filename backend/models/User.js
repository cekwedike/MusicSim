const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for OAuth users initially
    unique: true,
    validate: {
      len: [3, 30]
    }
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: true, // Optional - defaults to username if not provided
    validate: {
      len: [1, 100]
    }
  },
  authProvider: {
    type: DataTypes.STRING,
    defaultValue: 'google', // Only OAuth supported now
    allowNull: false
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  profileData: {
    type: DataTypes.JSONB,
    defaultValue: null
  },
  profileImage: {
    type: DataTypes.TEXT, // Store base64 image or URL
    allowNull: true
  }
}, {
  timestamps: true
});

// Instance method to get safe user data
User.prototype.toSafeObject = function() {
  const { id, email, username, displayName, lastLogin, isActive, createdAt, updatedAt, profileImage } = this;
  return { id, email, username, displayName, lastLogin, isActive, createdAt, updatedAt, profileImage };
};

module.exports = User;