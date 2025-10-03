const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, PlayerStatistics } = require('../models');
const authMiddleware = require('../middleware/auth');
const { 
  validateRegistrationData, 
  validateLoginData,
  sanitizeInput 
} = require('../utils/validation');
const { Op } = require('sequelize');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Validate input data
    const validation = validateRegistrationData({ email, username, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedUsername = sanitizeInput(username);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: sanitizedEmail },
          { username: sanitizedUsername }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === sanitizedEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
          field: 'email'
        });
      }
      if (existingUser.username === sanitizedUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
          field: 'username'
        });
      }
    }

    // Create user (password will be hashed automatically by model hook)
    const user = await User.create({
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: password
    });

    // Create player statistics record
    await PlayerStatistics.create({
      userId: user.id
    });

    // Generate token
    const token = generateToken(user.id);

    // Log successful registration
    console.log(`New user registered: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validate input data
    const validation = validateLoginData({ emailOrUsername, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Sanitize input
    const sanitizedInput = sanitizeInput(emailOrUsername).toLowerCase();

    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: sanitizedInput },
          { username: sanitizedInput }
        ],
        isActive: true // Only allow login for active users
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    // Log successful login
    console.log(`User logged in: ${user.username}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'username', 'lastLogin', 'createdAt', 'isActive'],
      include: [
        {
          model: PlayerStatistics,
          as: 'statistics',
          attributes: [
            'totalGamesPlayed', 'totalWeeksPlayed', 'longestCareerWeeks',
            'totalAchievementsUnlocked', 'highestCash', 'highestFame',
            'highestCareerProgress', 'preferredDifficulty', 'lastPlayedAt'
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify if JWT token is valid
 * @access  Private
 */
router.post('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.userId,
      username: req.user.username
    }
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (mainly client-side in stateless JWT)
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  // In a stateless JWT system, logout is mainly client-side
  // Server can optionally track revoked tokens in Redis/database for enhanced security
  
  console.log(`User logged out: ${req.user.username}`);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token (extend expiration)
 * @access  Private
 */
router.post('/refresh', authMiddleware, (req, res) => {
  try {
    // Generate new token
    const newToken = generateToken(req.userId);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

module.exports = router;