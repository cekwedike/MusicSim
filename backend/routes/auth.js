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
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Unique username
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *     LoginRequest:
 *       type: object
 *       required:
 *         - emailOrUsername
 *         - password
 *       properties:
 *         emailOrUsername:
 *           type: string
 *           description: User's email or username
 *         password:
 *           type: string
 *           description: User's password
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT authentication token
 *             user:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email, username, and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password, profileImage, displayName } = req.body;

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
      password: password,
      profileImage: profileImage || null,
      displayName: displayName || sanitizedUsername
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
          displayName: user.displayName,
          profileImage: user.profileImage,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email/username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
          displayName: user.displayName,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify if JWT token is valid
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
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
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update user profile (name and image)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { displayName, profileImage } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (displayName !== undefined) {
      user.displayName = displayName;
    }
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    console.log(`User profile updated: ${user.username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (stateless JWT)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authMiddleware, (req, res) => {
  // In a stateless JWT system, logout is mainly client-side
  console.log(`User logged out: ${req.user.username}`);
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh JWT token (extend expiration)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', authMiddleware, (req, res) => {
  try {
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

/**
 * @swagger
 * /api/auth/register-from-guest:
 *   post:
 *     summary: Register a new user from guest mode and transfer history
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               guestData:
 *                 type: object
 *                 description: Guest statistics and history to transfer
 *     responses:
 *       201:
 *         description: User registered successfully with transferred history
 */
router.post('/register-from-guest', async (req, res, next) => {
  try {
    const { email, username, password, guestData, profileImage, displayName } = req.body;

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

    // Create user
    const user = await User.create({
      email: sanitizedEmail,
      username: sanitizedUsername,
      password: password,
      profileImage: profileImage || null,
      displayName: displayName || sanitizedUsername
    });

    // Create or update player statistics with guest data
    let statistics = await PlayerStatistics.create({
      userId: user.id
    });

    // If guest data provided, merge it with the statistics
    if (guestData && guestData.statistics) {
      const guestStats = guestData.statistics;

      // Merge guest statistics into user statistics
      statistics.totalGamesPlayed = guestStats.totalGamesPlayed || 0;
      statistics.totalWeeksPlayed = guestStats.totalWeeksPlayed || 0;
      statistics.longestCareerWeeks = guestStats.longestCareerWeeks || 0;
      statistics.highestCash = guestStats.highestCash || 0;
      statistics.highestFame = guestStats.highestFameReached || 0;
      statistics.totalPlayTimeMinutes = guestStats.totalPlayTimeMinutes || 0;
      statistics.totalAchievementsUnlocked = guestStats.achievementsUnlocked || 0;
      statistics.totalModulesCompleted = guestStats.modulesCompleted || 0;
      statistics.averageQuizScore = guestStats.averageQuizScore || 0;
      statistics.totalCashEarned = guestStats.totalCashEarned || 0;

      await statistics.save();
    }

    // Generate token
    const token = generateToken(user.id);

    console.log(`New user registered from guest: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully with history transferred',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/account:
 *   delete:
 *     summary: Delete user account and all associated data
 *     description: Permanently deletes the user account and all related data (saves, statistics, learning progress, career history)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account and all associated data
 * @access  Private
 */
router.delete('/account', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const username = user.username;
    const email = user.email;

    // Delete the user (CASCADE will delete all associated data)
    await user.destroy();

    console.log(`User account deleted: ${username} (${email})`);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
});

module.exports = router;