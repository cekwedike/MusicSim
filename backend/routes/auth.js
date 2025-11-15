const express = require('express');
const router = express.Router();
const { User, PlayerStatistics, GameSave } = require('../models');
const authMiddleware = require('../middleware/auth');
const { sanitizeInput } = require('../utils/validation');
const supabaseAdmin = require('../config/supabase');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests to avoid penalizing normal usage
  skipSuccessfulRequests: true
});

// Stricter rate limiting for sensitive operations
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for sensitive operations
  message: {
    success: false,
    message: 'Too many sensitive operations. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Webhook signature verification middleware
const verifyWebhookSignature = (req, res, next) => {
  try {
    // Skip verification in development if no secret is set
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[WARNING] SUPABASE_WEBHOOK_SECRET not set. Skipping webhook verification in development.');
        return next();
      } else {
        return res.status(500).json({
          success: false,
          message: 'Webhook secret not configured'
        });
      }
    }

    const signature = req.headers['x-supabase-signature'];
    if (!signature) {
      return res.status(401).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload, 'utf8')
      .digest('hex');

    // Use secure comparison to prevent timing attacks
    const providedSignature = signature.replace('sha256=', '');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );

    if (!isValid) {
      console.error('[Webhook Security] Invalid signature detected from:', req.ip);
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    next();
  } catch (error) {
    console.error('[Webhook Security] Signature verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook verification failed'
    });
  }
};

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
 *       429:
 *         description: Too many requests
 */
router.get('/me', authLimiter, authMiddleware, async (req, res, next) => {
  try {
    let user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'username', 'displayName', 'lastLogin', 'createdAt', 'isActive', 'profileImage'],
      include: [
        {
          model: PlayerStatistics,
          as: 'statistics',
          attributes: [
            'totalGamesPlayed', 'totalWeeksPlayed', 'gamesLostToDebt',
            'gamesLostToBurnout', 'careersAbandoned', 'careersCompleted',
            'totalLessonsViewed', 'totalModulesCompleted', 'averageQuizScore',
            'totalStudyTimeMinutes', 'totalPlayTimeMinutes', 'averageSessionDuration',
            'preferredDifficulty', 'favoriteGenre'
          ]
        }
      ]
    });

    // If user doesn't exist in DB but has valid Supabase token, create profile
    if (!user && req.supabaseUser) {
      console.log('[/auth/me] User authenticated but no profile found. Creating profile...');

      // Extract profile data from Supabase user
      let username = req.supabaseUser.user_metadata?.username ||
                     req.supabaseUser.user_metadata?.name ||
                     req.supabaseUser.email.split('@')[0];
      const displayName = req.supabaseUser.user_metadata?.display_name ||
                         req.supabaseUser.user_metadata?.full_name ||
                         username;
      const profileImage = req.supabaseUser.user_metadata?.profile_image ||
                          req.supabaseUser.user_metadata?.avatar_url ||
                          req.supabaseUser.user_metadata?.picture;
      const authProvider = req.supabaseUser.app_metadata?.provider || 'google';

      try {
        // Ensure unique username
        let uniqueUsername = username;
        let counter = 1;
        while (await User.findOne({ where: { username: uniqueUsername } })) {
          uniqueUsername = `${username}${counter}`;
          counter++;
          if (counter > 100) break; // Safety limit
        }

        // Create user profile on-the-fly
        user = await User.create({
          id: req.userId,
          email: req.supabaseUser.email,
          username: uniqueUsername,
          displayName,
          profileImage,
          authProvider,
          lastLogin: new Date(),
          isActive: true
        });

        // Create associated PlayerStatistics if it doesn't exist
        const existingStats = await PlayerStatistics.findOne({ where: { userId: user.id } });
        if (!existingStats) {
          await PlayerStatistics.create({
            userId: user.id
          });
          console.log(`[/auth/me] Created PlayerStatistics for user: ${user.id}`);
        }

        console.log(`[/auth/me] ✅ Auto-created profile for OAuth user: ${uniqueUsername}`);
      } catch (createError) {
        // Handle race condition - user might have been created by parallel request
        if (createError.name === 'SequelizeUniqueConstraintError') {
          console.log('[/auth/me] User created by parallel request, fetching...');
          user = await User.findByPk(req.userId, {
            include: [
              {
                model: PlayerStatistics,
                as: 'statistics',
                attributes: [
                  'totalGamesPlayed', 'totalWeeksPlayed', 'gamesLostToDebt',
                  'gamesLostToBurnout', 'careersAbandoned', 'careersCompleted',
                  'totalLessonsViewed', 'totalModulesCompleted', 'averageQuizScore',
                  'totalStudyTimeMinutes', 'totalPlayTimeMinutes', 'averageSessionDuration',
                  'preferredDifficulty', 'favoriteGenre'
                ]
              }
            ]
          });

          if (!user) {
            throw createError; // Re-throw if we still can't find the user
          }
        } else {
          throw createError; // Re-throw other errors
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('[/auth/me] Error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update user profile
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
 *               username:
 *                 type: string
 *               displayName:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.patch('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { username, displayName, profileImage } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update only provided fields
    if (username !== undefined) {
      // Check if username is already taken
      const existingUser = await User.findOne({
        where: {
          username: sanitizeInput(username),
          id: { [require('sequelize').Op.ne]: user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
          field: 'username'
        });
      }

      user.username = sanitizeInput(username);
    }

    if (displayName !== undefined) {
      user.displayName = sanitizeInput(displayName);
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    console.log(`Profile updated for user: ${user.username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          profileImage: user.profileImage
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
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
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

    // Attempt to delete profile images stored in Supabase Storage (bucket: 'profile-images')
    try {
      const bucketName = 'profile-images';
      console.log(`Attempting to remove storage objects for user: ${userId} from bucket: ${bucketName}`);

      // List files under the user's folder (e.g., `${userId}/`)
      const { data: listData, error: listError } = await supabaseAdmin.storage.from(bucketName).list(userId, { limit: 100 });

      if (listError) {
        console.error(`Failed to list storage objects for user ${userId}:`, listError);
      } else if (listData && listData.length > 0) {
        const paths = listData.map(f => `${userId}/${f.name}`);
        const { data: removedData, error: removeError } = await supabaseAdmin.storage.from(bucketName).remove(paths);

        if (removeError) {
          console.error(`Failed to remove some storage objects for user ${userId}:`, removeError);
        } else {
          console.log(`Removed storage objects for user ${userId}:`, paths);
        }
      } else {
        console.log(`No storage objects found for user ${userId} in bucket ${bucketName}`);
      }
    } catch (storageErr) {
      console.error('Error while attempting to delete storage objects:', storageErr);
    }

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
 * /api/auth/sync-profile:
 *   post:
 *     summary: Sync OAuth user profile to database
 *     description: Create or update user profile in database after OAuth authentication
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
 *                 format: uuid
 *                 description: User ID (optional, uses token if not provided)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               username:
 *                 type: string
 *                 description: Username
 *               displayName:
 *                 type: string
 *                 description: Display name
 *               profileImage:
 *                 type: string
 *                 description: Profile image URL
 *               authProvider:
 *                 type: string
 *                 description: OAuth provider (google, github, etc.)
 *     responses:
 *       200:
 *         description: Profile synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       201:
 *         description: Profile created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @route   POST /api/auth/sync-profile
 * @desc    Sync OAuth user profile to database (create or update)
 * @access  Private
 */
router.post('/sync-profile', authLimiter, authMiddleware, async (req, res, next) => {
  try {
    const { userId, email, username, displayName, profileImage, authProvider } = req.body;

    console.log('[sync-profile] Request received:', { userId, email, username, displayName, authProvider });

    const targetUserId = userId || req.userId;

    // Check if user already exists
    let user = await User.findByPk(targetUserId);

    if (user) {
      // Update existing user
      console.log('[sync-profile] User exists, updating:', user.id);
      user.email = email || user.email;
      user.lastLogin = new Date();

      // Update username only if provided and different (check for uniqueness)
      if (username && username !== user.username) {
        const existingUser = await User.findOne({
          where: {
            username: sanitizeInput(username),
            id: { [require('sequelize').Op.ne]: targetUserId }
          }
        });

        if (existingUser) {
          // Username taken - generate unique alternative
          let uniqueUsername = sanitizeInput(username);
          let counter = 1;
          
          while (await User.findOne({
            where: {
              username: uniqueUsername,
              id: { [require('sequelize').Op.ne]: targetUserId }
            }
          })) {
            uniqueUsername = `${sanitizeInput(username)}${counter}`;
            counter++;
          }
          
          console.log(`[sync-profile] Username '${username}' taken, using '${uniqueUsername}'`);
          user.username = uniqueUsername;
        } else {
          user.username = sanitizeInput(username);
        }
      }

      user.displayName = displayName || user.displayName || user.username;
      user.profileImage = profileImage || user.profileImage;
      user.authProvider = authProvider || user.authProvider;

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
            displayName: user.displayName,
            profileImage: user.profileImage,
            lastLogin: user.lastLogin
          }
        }
      });
    }

    // Create new user profile with unique username
    console.log('[sync-profile] Creating new user with data:', { userId: targetUserId, email, username, displayName, authProvider });

    // Ensure username is unique before creating
    let uniqueUsername = sanitizeInput(username || email.split('@')[0]);
    let counter = 1;
    
    while (await User.findOne({ where: { username: uniqueUsername } })) {
      const baseUsername = sanitizeInput(username || email.split('@')[0]);
      uniqueUsername = `${baseUsername}${counter}`;
      counter++;
    }
    
    if (uniqueUsername !== username) {
      console.log(`[sync-profile] Username '${username}' taken, using '${uniqueUsername}' for new user`);
    }

    try {
      user = await User.create({
        id: targetUserId,
        email,
        username: uniqueUsername,
        displayName: displayName || uniqueUsername,
        profileImage,
        authProvider: authProvider || 'google',
        lastLogin: new Date(),
        isActive: true
      });

      console.log('[sync-profile] User created successfully:', user.id);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' && error.fields && error.fields.id) {
        // User ID already exists in database, try to find and update instead
        console.log(`[sync-profile] User ID ${targetUserId} already exists, attempting to update existing record`);
        
        user = await User.findByPk(targetUserId);
        if (user) {
          // Update the existing user record
          user.email = email || user.email;
          user.lastLogin = new Date();
          user.displayName = displayName || user.displayName || uniqueUsername;
          user.profileImage = profileImage || user.profileImage;
          user.authProvider = authProvider || user.authProvider || 'google';
          user.isActive = true;
          
          // Only update username if it's different and unique
          if (uniqueUsername !== user.username) {
            // Check if the unique username is still available
            const usernameConflict = await User.findOne({
              where: {
                username: uniqueUsername,
                id: { [require('sequelize').Op.ne]: targetUserId }
              }
            });
            
            if (!usernameConflict) {
              user.username = uniqueUsername;
            }
          }
          
          await user.save();
          console.log(`[sync-profile] Updated existing user: ${user.username} (${user.email})`);
        } else {
          // Still can't find the user - this shouldn't happen but handle gracefully
          console.error('[sync-profile] Could not find user after unique constraint error');
          throw new Error('User creation failed: ID conflict with non-existent user');
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    // Create associated PlayerStatistics record if it doesn't exist
    console.log('[sync-profile] Checking PlayerStatistics for user:', user.id);
    const existingStats = await PlayerStatistics.findOne({ where: { userId: user.id } });

    if (!existingStats) {
      console.log('[sync-profile] Creating PlayerStatistics for user:', user.id);
      await PlayerStatistics.create({
        userId: user.id
      });
      console.log('[sync-profile] PlayerStatistics created successfully');
    } else {
      console.log('[sync-profile] PlayerStatistics already exists for user:', user.id);
    }

    console.log(`[sync-profile] ✅ User profile synced: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
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
    console.error('[sync-profile] ❌ Error syncing profile:', error.message);
    console.error('[sync-profile] Error details:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/sync-guest-data:
 *   post:
 *     summary: Sync guest data to user profile
 *     description: Transfer guest gameplay data to authenticated user profile after registration
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
 *                 format: uuid
 *                 description: User ID (optional, uses token if not provided)
 *               guestData:
 *                 type: object
 *                 properties:
 *                   statistics:
 *                     type: object
 *                     description: Guest gameplay statistics
 *                   saves:
 *                     type: array
 *                     items:
 *                       type: object
 *                     description: Guest game saves
 *     responses:
 *       200:
 *         description: Guest data synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

    // Update PlayerStatistics with guest data
    const stats = await PlayerStatistics.findOne({ where: { userId: targetUserId } });

    if (stats && guestData.statistics) {
      // Merge guest statistics with existing stats
      const guestStats = guestData.statistics;

      stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + (guestStats.totalGamesPlayed || 0);
      stats.totalWeeksPlayed = (stats.totalWeeksPlayed || 0) + (guestStats.totalWeeksPlayed || 0);
      stats.gamesLostToDebt = (stats.gamesLostToDebt || 0) + (guestStats.gamesLostToDebt || 0);
      stats.gamesLostToBurnout = (stats.gamesLostToBurnout || 0) + (guestStats.gamesLostToBurnout || 0);
      stats.careersAbandoned = (stats.careersAbandoned || 0) + (guestStats.careersAbandoned || 0);
      stats.careersCompleted = (stats.careersCompleted || 0) + (guestStats.careersCompleted || 0);
      stats.totalLessonsViewed = (stats.totalLessonsViewed || 0) + (guestStats.totalLessonsViewed || 0);
      stats.totalModulesCompleted = (stats.totalModulesCompleted || 0) + (guestStats.totalModulesCompleted || 0);

      await stats.save();
    }

    // Sync game saves if provided
    if (guestData.saves && Array.isArray(guestData.saves)) {
      for (const save of guestData.saves) {
        await GameSave.create({
          userId: targetUserId,
          saveName: save.name || 'Guest Save',
          gameState: save.state || save.gameState,
          lastPlayed: new Date()
        });
      }
    }

    console.log(`Guest data synced for user ${targetUserId}`);

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
 * @swagger
 * /api/auth/update-username:
 *   post:
 *     summary: Update username for current user
 *     description: Update the username for the authenticated user with validation
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 description: New username (3-20 characters, letters, numbers, underscore only)
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *       400:
 *         description: Invalid username or username already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
/**
 * @route   POST /api/auth/update-username
 * @desc    Update username for current user
 * @access  Private
 */
router.post('/update-username', strictAuthLimiter, authMiddleware, async (req, res, next) => {
  // Use database transaction to prevent race conditions
  const transaction = await require('../models').sequelize.transaction();
  
  try {
    const { username } = req.body;

    console.log('[update-username] Request from user:', req.userId, 'New username:', username);

    if (!username || username.length < 3 || username.length > 20) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters'
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }

    const sanitizedUsername = sanitizeInput(username);

    // Check if username is taken by ANY other user (strict uniqueness) within transaction
    const existingUser = await User.findOne({
      where: {
        username: sanitizedUsername,
        id: { [require('sequelize').Op.ne]: req.userId }
      },
      lock: true, // Lock the row to prevent concurrent access
      transaction
    });

    if (existingUser) {
      await transaction.rollback();
      
      // Generate alternative suggestions
      const suggestions = [];
      for (let i = 1; i <= 3; i++) {
        const suggestion = `${sanitizedUsername}${i}`;
        const isTaken = await User.findOne({ 
          where: { username: suggestion },
          transaction: await require('../models').sequelize.transaction()
        });
        if (!isTaken) {
          suggestions.push(suggestion);
        }
      }

      return res.status(400).json({
        success: false,
        message: `Username '${sanitizedUsername}' is already taken`,
        suggestions: suggestions.length > 0 ? suggestions : [`${sanitizedUsername}1`, `${sanitizedUsername}2`],
        field: 'username'
      });
    }

    let user = await User.findByPk(req.userId, {
      lock: true, // Lock user record during update
      transaction
    });

    // If user doesn't exist yet (OAuth user not synced), create profile on the fly
    if (!user && req.supabaseUser) {
      console.log('[update-username] Creating profile for OAuth user:', req.userId);

      const authProvider = req.supabaseUser.app_metadata?.provider || 'google';

      user = await User.create({
        id: req.userId,
        email: req.supabaseUser.email,
        username: sanitizedUsername,
        displayName: sanitizedUsername,
        authProvider,
        lastLogin: new Date(),
        isActive: true,
        profileImage: req.supabaseUser.user_metadata?.avatar_url || req.supabaseUser.user_metadata?.picture
      }, { transaction });

      // Create associated PlayerStatistics
      await PlayerStatistics.create({
        userId: user.id
      }, { transaction });

      console.log('[update-username] Profile created successfully with username:', sanitizedUsername);
    } else if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      // Update existing user's username
      const oldUsername = user.username;
      user.username = sanitizedUsername;
      await user.save({ transaction });
      
      console.log(`[update-username] Username updated for user ${req.userId}: ${oldUsername} → ${sanitizedUsername}`);
    }

    // Commit the transaction
    await transaction.commit();

    res.json({
      success: true,
      message: 'Username updated successfully',
      data: {
        username: user.username
      }
    });
  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    console.error('[update-username] Error:', error);
    
    // Handle database unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken',
        field: 'username'
      });
    }
    
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/webhook/user-deleted:
 *   post:
 *     summary: Supabase webhook for user deletion cleanup
 *     description: Handles database cleanup when a user is deleted from Supabase Auth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Event type
 *               record:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID that was deleted
 *     responses:
 *       200:
 *         description: Database cleanup completed
 *       404:
 *         description: User not found in database
 *       500:
 *         description: Cleanup failed
 */
router.post('/webhook/user-deleted', verifyWebhookSignature, async (req, res, next) => {
  try {
    const { type, record } = req.body;
    
    console.log('[webhook/user-deleted] Received:', { type, record });
    
    if (type !== 'DELETE' || !record?.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook payload'
      });
    }
    
    const userId = record.id;
    
    // Find and delete user from database
    const user = await User.findByPk(userId);
    
    if (!user) {
      console.log(`[webhook/user-deleted] User ${userId} not found in database (already cleaned up?)`);
      return res.json({
        success: true,
        message: 'User not found in database (already cleaned up)'
      });
    }
    
    const username = user.username;
    const email = user.email;
    
    // Delete user from database (CASCADE will delete associated data)
    await user.destroy();
    
    console.log(`[webhook/user-deleted] ✅ Database cleanup completed for deleted user: ${username} (${email})`);
    
    res.json({
      success: true,
      message: 'Database cleanup completed',
      data: {
        deletedUserId: userId,
        deletedUser: { username, email }
      }
    });
  } catch (error) {
    console.error('[webhook/user-deleted] ❌ Database cleanup failed:', error);
    next(error);
  }
});

module.exports = router;
