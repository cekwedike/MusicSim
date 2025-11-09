const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, PlayerStatistics, GameSave } = require('../models');
const authMiddleware = require('../middleware/auth');
const {
  validateRegistrationData,
  validateLoginData,
  sanitizeInput
} = require('../utils/validation');
const { Op } = require('sequelize');
const passport = require('../config/passport');
const supabaseAdmin = require('../config/supabase');

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
    const { email, username, password, profileImage } = req.body;

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
      profileImage: profileImage || null
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
 * @route   POST /api/auth/get-email-from-username
 * @desc    Get email address from username (for Supabase login)
 * @access  Public
 */
router.post('/get-email-from-username', async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Find user by username
    const user = await User.findOne({
      where: {
        username: sanitizeInput(username),
        isActive: true
      },
      attributes: ['email']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Username not found'
      });
    }

    res.json({
      success: true,
      data: {
        email: user.email
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
    let user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'username', 'lastLogin', 'createdAt', 'isActive', 'profileImage'],
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

    // If user doesn't exist in DB but has valid Supabase token, create profile
    if (!user && req.supabaseUser) {
      console.log('[/auth/me] User authenticated but no profile found. Creating profile...');

      // Extract profile data from Supabase user
      const username = req.supabaseUser.user_metadata?.username ||
                      req.supabaseUser.user_metadata?.name ||
                      req.supabaseUser.email.split('@')[0];
      const profileImage = req.supabaseUser.user_metadata?.profile_image ||
                          req.supabaseUser.user_metadata?.avatar_url ||
                          req.supabaseUser.user_metadata?.picture ||
                          null;
      const authProvider = req.supabaseUser.app_metadata?.provider || 'local';

      // Create user profile
      user = await User.create({
        id: req.supabaseUser.id,
        email: req.supabaseUser.email,
        username,
        profileImage,
        authProvider,
        lastLogin: new Date()
      });

      // Create associated player statistics
      await PlayerStatistics.create({
        userId: user.id
      });

      console.log(`[/auth/me] Profile created for user: ${username} (${user.email})`);

      // Fetch user again with statistics
      user = await User.findByPk(user.id, {
        attributes: ['id', 'email', 'username', 'lastLogin', 'createdAt', 'isActive', 'profileImage'],
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
    }

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
 *     summary: Update user profile (username, name, and image)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input or username already taken
 */
router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { username, profileImage } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Handle username update
    if (username !== undefined && username !== user.username) {
      // Validate username length
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
          success: false,
          message: 'Username must be between 3 and 30 characters',
          field: 'username'
        });
      }

      // Sanitize username
      const sanitizedUsername = sanitizeInput(username);

      // Check if username is already taken by another user
      const existingUser = await User.findOne({
        where: {
          username: sanitizedUsername,
          id: { [Op.ne]: userId } // Exclude current user
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
          field: 'username'
        });
      }

      user.username = sanitizedUsername;
    }

    // Update other fields if provided
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
    const { email, username, password, guestData, profileImage } = req.body;

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
      profileImage: profileImage || null
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
 * @desc    Delete user account and all associated data (including Supabase auth)
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

    // Delete the user from database (CASCADE will delete all associated data: saves, stats, etc.)
    await user.destroy();

    console.log(`User account deleted from database: ${username} (${email})`);

    // Delete from Supabase Auth (using admin client with service role key)
    try {
      const { error: supabaseError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (supabaseError) {
        console.error(`Failed to delete Supabase auth user ${userId}:`, supabaseError);
        // Don't fail the request - database is already deleted
        return res.json({
          success: true,
          message: 'Account data deleted. Authentication user deletion failed - please contact support.',
          data: {
            userId,
            deletedFromDatabase: true,
            deletedFromAuth: false,
            authError: supabaseError.message
          }
        });
      }

      console.log(`Supabase auth user deleted: ${userId}`);

      res.json({
        success: true,
        message: 'Account completely deleted',
        data: {
          userId,
          deletedFromDatabase: true,
          deletedFromAuth: true
        }
      });
    } catch (supabaseError) {
      console.error('Error deleting Supabase auth user:', supabaseError);
      // Database is deleted, but Supabase auth user might remain
      res.json({
        success: true,
        message: 'Account data deleted. Authentication deletion encountered an error.',
        data: {
          userId,
          deletedFromDatabase: true,
          deletedFromAuth: false
        }
      });
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects to Google OAuth consent screen
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth login
 * @access  Public
 */
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on this server'
    });
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
});

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}?error=oauth_not_configured`);
  }

  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173'
  })(req, res, (err) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}?error=oauth_failed`);
    }

    try {
      // Generate JWT token
      const token = generateToken(req.user.id);

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?token=${token}&authType=google`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?error=oauth_failed`);
    }
  });
});

/**
 * @swagger
 * /api/auth/sync-profile:
 *   post:
 *     summary: Sync Supabase user with backend profile
 *     description: Creates or updates user profile in backend database from Supabase auth
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               authProvider:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile synced successfully
 *       201:
 *         description: Profile created successfully
 */

/**
 * @route   POST /api/auth/sync-profile
 * @desc    Sync Supabase user profile with backend database
 * @access  Private (requires Supabase JWT)
 */
router.post('/sync-profile', authMiddleware, async (req, res, next) => {
  try {
    const { userId, email, username, profileImage, authProvider } = req.body;

    console.log('[sync-profile] Request received:', { userId, email, username, authProvider });

    // Check if user already exists
    let user = await User.findByPk(userId || req.userId);

    if (user) {
      // Update existing user
      console.log('[sync-profile] User exists, updating:', user.id);
      user.email = email || user.email;
      user.username = username || user.username;
      user.profileImage = profileImage || user.profileImage;
      user.authProvider = authProvider || user.authProvider;
      user.lastLogin = new Date();

      await user.save();

      console.log(`[sync-profile] User profile updated: ${user.username} (${user.email})`);

      return res.json({
        success: true,
        message: 'Profile synced successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            lastLogin: user.lastLogin
          }
        }
      });
    }

    // Create new user profile
    console.log('[sync-profile] Creating new user with data:', { userId: userId || req.userId, email, username, authProvider });

    user = await User.create({
      id: userId || req.userId,
      email,
      username,
      profileImage,
      authProvider: authProvider || 'local',
      lastLogin: new Date(),
      isActive: true
    });

    console.log('[sync-profile] User created successfully:', user.id);

    // Create associated PlayerStatistics record
    console.log('[sync-profile] Creating PlayerStatistics for user:', user.id);
    await PlayerStatistics.create({
      userId: user.id
    });

    console.log(`[sync-profile] ✅ New user profile created: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('[sync-profile] ❌ Error syncing profile:', error.message);
    console.error('[sync-profile] Error details:', error);
    next(error);
  }
});

/**
 * @route   POST /api/auth/sync-guest-data
 * @desc    Sync guest data to user profile after registration
 * @access  Private
 */
router.post('/sync-guest-data', authMiddleware, async (req, res, next) => {
  try {
    const { userId, guestData } = req.body;

    if (!guestData || !guestData.statistics) {
      return res.json({
        success: true,
        message: 'No guest data to sync'
      });
    }

    const targetUserId = userId || req.userId;

    // Find user's statistics
    const statistics = await PlayerStatistics.findOne({ where: { userId: targetUserId } });

    if (!statistics) {
      return res.status(404).json({
        success: false,
        message: 'User statistics not found'
      });
    }

    // Merge guest statistics
    const guestStats = guestData.statistics;
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

    // Sync game saves if provided
    if (guestData.saves) {
      const saves = guestData.saves;
      const savePromises = [];

      // Iterate through each save slot and create GameSave records
      for (const [slotName, saveData] of Object.entries(saves)) {
        if (saveData && typeof saveData === 'object') {
          savePromises.push(
            GameSave.findOrCreate({
              where: {
                userId: targetUserId,
                slotName: slotName
              },
              defaults: {
                userId: targetUserId,
                slotName: slotName,
                gameState: saveData.state || saveData,
                timestamp: saveData.timestamp || Date.now(),
                version: saveData.version || '1.0.0'
              }
            }).then(([gameSave, created]) => {
              if (!created) {
                // Update existing save
                gameSave.gameState = saveData.state || saveData;
                gameSave.timestamp = saveData.timestamp || Date.now();
                gameSave.version = saveData.version || '1.0.0';
                return gameSave.save();
              }
              return gameSave;
            })
          );
        }
      }

      await Promise.all(savePromises);
      console.log(`Guest saves synced for user: ${targetUserId} (${savePromises.length} saves)`);
    }

    console.log(`Guest data synced for user: ${targetUserId}`);

    res.json({
      success: true,
      message: 'Guest data synced successfully'
    });
  } catch (error) {
    console.error('Error syncing guest data:', error);
    next(error);
  }
});

/**
 * @route   POST /api/auth/update-username
 * @desc    Update user's username
 * @access  Private
 */
router.post('/update-username', async (req, res, next) => {
  try {
    const { username } = req.body;

    // Get user from Supabase session (set by supabase-auth middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Validate username
    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters'
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Find and update user
    const dbUser = await User.findOne({ where: { id: user.id } });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    dbUser.username = username;
    await dbUser.save();

    res.json({
      success: true,
      message: 'Username updated successfully',
      user: dbUser.toSafeObject()
    });
  } catch (error) {
    console.error('Error updating username:', error);
    next(error);
  }
});

module.exports = router;