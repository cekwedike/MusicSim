const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

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
  password: {
    type: DataTypes.STRING,
    allowNull: true // Allow null for OAuth users
  },
  authProvider: {
    type: DataTypes.STRING,
    defaultValue: 'local', // 'local' or 'google'
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
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Instance method to get safe user data (without password)
User.prototype.toSafeObject = function() {
  const { id, email, username, lastLogin, isActive, createdAt, updatedAt, profileImage } = this;
  return { id, email, username, lastLogin, isActive, createdAt, updatedAt, profileImage };
};

module.exports = User;