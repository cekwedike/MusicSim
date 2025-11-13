const express = require('express');
const router = express.Router();
const { User, PlayerStatistics, GameSave } = require('../models');
const authMiddleware = require('../middleware/auth');
const { sanitizeInput } = require('../utils/validation');
const supabaseAdmin = require('../config/supabase');

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
      const username = req.supabaseUser.user_metadata?.username ||
                      req.supabaseUser.user_metadata?.name ||
                      req.supabaseUser.email.split('@')[0];
      const displayName = req.supabaseUser.user_metadata?.display_name ||
                         req.supabaseUser.user_metadata?.full_name ||
                         username;
      const profileImage = req.supabaseUser.user_metadata?.profile_image ||
                          req.supabaseUser.user_metadata?.avatar_url ||
                          req.supabaseUser.user_metadata?.picture;
      const authProvider = req.supabaseUser.app_metadata?.provider || 'google';

      // Create user profile on-the-fly
      user = await User.create({
        id: req.userId,
        email: req.supabaseUser.email,
        username,
        displayName,
        profileImage,
        authProvider,
        lastLogin: new Date(),
        isActive: true
      });

      // Create associated PlayerStatistics
      await PlayerStatistics.create({
        userId: user.id
      });

      console.log(`[/auth/me] ✅ Auto-created profile for OAuth user: ${username}`);
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
router.post('/sync-profile', authMiddleware, async (req, res, next) => {
  try {
    const { userId, email, username, displayName, profileImage, authProvider } = req.body;

    console.log('[sync-profile] Request received:', { userId, email, username, displayName, authProvider });

    // Check if user already exists
    let user = await User.findByPk(userId || req.userId);

    if (user) {
      // Update existing user
      console.log('[sync-profile] User exists, updating:', user.id);
      user.email = email || user.email;
      user.username = username || user.username;
      user.displayName = displayName || user.displayName || user.username;
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
            displayName: user.displayName,
            profileImage: user.profileImage,
            lastLogin: user.lastLogin
          }
        }
      });
    }

    // Create new user profile
    console.log('[sync-profile] Creating new user with data:', { userId: userId || req.userId, email, username, displayName, authProvider });

    user = await User.create({
      id: userId || req.userId,
      email,
      username,
      displayName: displayName || username,
      profileImage,
      authProvider: authProvider || 'google',
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
router.post('/update-username', authMiddleware, async (req, res, next) => {
  try {
    const { username } = req.body;

    console.log('[update-username] Request from user:', req.userId, 'New username:', username);

    if (!username || username.length < 3 || username.length > 20) {
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

    const sanitizedUsername = sanitizeInput(username);

    // Check if username is taken
    const existingUser = await User.findOne({
      where: {
        username: sanitizedUsername,
        id: { [require('sequelize').Op.ne]: req.userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    let user = await User.findByPk(req.userId);

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
      });

      // Create associated PlayerStatistics
      await PlayerStatistics.create({
        userId: user.id
      });

      console.log('[update-username] Profile created successfully');
    } else if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      // Update existing user's username
      user.username = sanitizedUsername;
      await user.save();
    }

    console.log(`[update-username] Username updated for user ${req.userId}: ${sanitizedUsername}`);

    res.json({
      success: true,
      message: 'Username updated successfully',
      data: {
        username: user.username
      }
    });
  } catch (error) {
    console.error('[update-username] Error:', error);
    next(error);
  }
});

module.exports = router;
