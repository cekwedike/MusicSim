const express = require('express');
const router = express.Router();
const { CareerHistory, User, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/career/complete:
 *   post:
 *     summary: Record a completed career (game over)
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               artistName:
 *                 type: string
 *               genre:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               finalStats:
 *                 type: object
 *               gameEndReason:
 *                 type: string
 *               weeksPlayed:
 *                 type: integer
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Career recorded
 *       400:
 *         description: Missing required fields
 */
router.post('/complete', async (req, res, next) => {
  try {
    const { 
      artistName, 
      genre, 
      difficulty, 
      finalStats, 
      gameEndReason, 
      weeksPlayed,
      achievements,
      finalScore 
    } = req.body;

    // Validate required fields
    if (!artistName || !genre || !difficulty || !finalStats || !gameEndReason || !weeksPlayed) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: artistName, genre, difficulty, finalStats, gameEndReason, weeksPlayed'
      });
    }

    // Validate finalStats structure
    if (!finalStats.cash && finalStats.cash !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid finalStats structure - cash field required'
      });
    }

    // Validate difficulty
    const validDifficulties = ['beginner', 'realistic', 'hardcore'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty. Must be: beginner, realistic, or hardcore'
      });
    }

    // Calculate years survived
    const yearsSurvived = Math.floor(weeksPlayed / 48);

    const careerRecord = await CareerHistory.create({
      userId: req.userId,
      artistName,
      genre,
      difficulty,
      finalStats,
      gameEndReason,
      weeksPlayed,
      yearsSurvived,
      achievements: achievements || [],
      finalScore: finalScore || 0,
      completedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Career recorded successfully',
      data: {
        careerHistoryId: careerRecord.id,
        artistName: careerRecord.artistName,
        genre: careerRecord.genre,
        difficulty: careerRecord.difficulty,
        weeksPlayed: careerRecord.weeksPlayed,
        yearsSurvived: careerRecord.yearsSurvived,
        finalScore: careerRecord.finalScore,
        completedAt: careerRecord.completedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/history:
 *   get:
 *     summary: Get user's career history with pagination
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Career history
 */
router.get('/history', async (req, res, next) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      difficulty, 
      genre,
      sortBy = 'completedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause
    const whereClause = { userId: req.userId };
    if (difficulty) whereClause.difficulty = difficulty;
    if (genre) whereClause.genre = genre;

    // Validate sort options
    const validSortFields = ['completedAt', 'weeksPlayed', 'yearsSurvived', 'finalScore', 'artistName'];
    const validSortOrders = ['asc', 'desc'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'completedAt';
    const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC';

    const careers = await CareerHistory.findAll({
      where: whereClause,
      attributes: [
        'id',
        'artistName',
        'genre',
        'difficulty',
        'gameEndReason',
        'weeksPlayed',
        'yearsSurvived',
        'finalScore',
        'achievements',
        'completedAt',
        'createdAt'
      ],
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalCount = await CareerHistory.count({
      where: whereClause
    });

    res.json({
      success: true,
      data: {
        careers,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: totalCount > (parseInt(offset) + parseInt(limit))
        },
        filters: {
          difficulty,
          genre,
          sortBy: finalSortBy,
          sortOrder: finalSortOrder.toLowerCase()
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/stats:
 *   get:
 *     summary: Get career statistics and analytics
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Career statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    // Basic stats
    const totalCareers = await CareerHistory.count({
      where: { userId: req.userId }
    });

    // Best career by weeks survived
    const bestCareer = await CareerHistory.findOne({
      where: { userId: req.userId },
      order: [['weeksPlayed', 'DESC']],
      attributes: ['artistName', 'genre', 'difficulty', 'weeksPlayed', 'yearsSurvived', 'finalScore', 'completedAt']
    });

    // Average weeks survived by difficulty
    const avgByDifficulty = await CareerHistory.findAll({
      where: { userId: req.userId },
      attributes: [
        'difficulty',
        [sequelize.fn('AVG', sequelize.col('weeksPlayed')), 'avgWeeks'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalCareers'],
        [sequelize.fn('MAX', sequelize.col('weeksPlayed')), 'bestWeeks']
      ],
      group: ['difficulty'],
      raw: true
    });

    // Most played genres
    const genreStats = await CareerHistory.findAll({
      where: { userId: req.userId },
      attributes: [
        'genre',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('weeksPlayed')), 'avgWeeks']
      ],
      group: ['genre'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true
    });

    // Game end reasons analysis
    const endReasons = await CareerHistory.findAll({
      where: { userId: req.userId },
      attributes: [
        'gameEndReason',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['gameEndReason'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      raw: true
    });

    // Recent careers (last 5)
    const recentCareers = await CareerHistory.findAll({
      where: { userId: req.userId },
      attributes: ['artistName', 'genre', 'difficulty', 'weeksPlayed', 'gameEndReason', 'completedAt'],
      order: [['completedAt', 'DESC']],
      limit: 5
    });

    // Achievement analysis
    const achievementData = await CareerHistory.findAll({
      where: { 
        userId: req.userId,
        achievements: { [Op.ne]: null }
      },
      attributes: ['achievements'],
      raw: true
    });

    // Process achievements
    const achievementCounts = {};
    let totalAchievements = 0;

    achievementData.forEach(record => {
      if (record.achievements && Array.isArray(record.achievements)) {
        record.achievements.forEach(achievement => {
          achievementCounts[achievement] = (achievementCounts[achievement] || 0) + 1;
          totalAchievements++;
        });
      }
    });

    const topAchievements = Object.entries(achievementCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: {
        overview: {
          totalCareers,
          totalAchievements,
          uniqueAchievements: Object.keys(achievementCounts).length
        },
        bestCareer,
        statistics: {
          byDifficulty: avgByDifficulty.map(stat => ({
            difficulty: stat.difficulty,
            averageWeeks: Math.round(parseFloat(stat.avgWeeks) || 0),
            totalCareers: parseInt(stat.totalCareers),
            bestWeeks: parseInt(stat.bestWeeks)
          })),
          byGenre: genreStats.map(stat => ({
            genre: stat.genre,
            count: parseInt(stat.count),
            averageWeeks: Math.round(parseFloat(stat.avgWeeks) || 0)
          })),
          endReasons: endReasons.map(reason => ({
            reason: reason.gameEndReason,
            count: parseInt(reason.count)
          }))
        },
        achievements: {
          topAchievements,
          totalEarned: totalAchievements,
          uniqueCount: Object.keys(achievementCounts).length
        },
        recentCareers
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/leaderboard:
 *   get:
 *     summary: Get leaderboard data (anonymous)
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Leaderboard
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { difficulty = 'all', metric = 'weeksPlayed', limit = 10 } = req.query;

    // Build where clause
    const whereClause = {};
    if (difficulty !== 'all') {
      whereClause.difficulty = difficulty;
    }

    // Validate metric
    const validMetrics = ['weeksPlayed', 'finalScore', 'yearsSurvived'];
    const finalMetric = validMetrics.includes(metric) ? metric : 'weeksPlayed';

    const leaderboard = await CareerHistory.findAll({
      where: whereClause,
      attributes: [
        'artistName',
        'genre',
        'difficulty',
        finalMetric,
        'completedAt'
      ],
      order: [[finalMetric, 'DESC']],
      limit: parseInt(limit)
    });

    // Get user's best in this category
    const userBest = await CareerHistory.findOne({
      where: {
        userId: req.userId,
        ...whereClause
      },
      attributes: [
        'artistName',
        'genre',
        'difficulty',
        finalMetric,
        'completedAt'
      ],
      order: [[finalMetric, 'DESC']]
    });

    res.json({
      success: true,
      data: {
        leaderboard,
        userBest,
        filters: {
          difficulty,
          metric: finalMetric,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/{careerHistoryId}:
 *   get:
 *     summary: Get detailed career information
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: careerHistoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Career details
 *       404:
 *         description: Career not found
 */
router.get('/:careerHistoryId', async (req, res, next) => {
  try {
    const { careerHistoryId } = req.params;

    const career = await CareerHistory.findOne({
      where: {
        id: careerHistoryId,
        userId: req.userId
      }
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/{careerHistoryId}:
 *   delete:
 *     summary: Delete a career record
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: careerHistoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Career deleted
 *       404:
 *         description: Career not found
 */
router.delete('/:careerHistoryId', async (req, res, next) => {
  try {
    const { careerHistoryId } = req.params;

    const career = await CareerHistory.findOne({
      where: {
        id: careerHistoryId,
        userId: req.userId
      }
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    await career.destroy();

    res.json({
      success: true,
      message: 'Career deleted successfully',
      data: {
        careerHistoryId: career.id,
        artistName: career.artistName
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/career/achievements/summary:
 *   get:
 *     summary: Get achievement summary across all careers
 *     tags: [Career]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Achievement summary
 */
router.get('/achievements/summary', async (req, res, next) => {
  try {
    const careers = await CareerHistory.findAll({
      where: { 
        userId: req.userId,
        achievements: { [Op.ne]: null }
      },
      attributes: ['achievements', 'difficulty', 'completedAt'],
      order: [['completedAt', 'DESC']]
    });

    const achievementsByDifficulty = {
      beginner: {},
      realistic: {},
      hardcore: {}
    };

    const chronologicalAchievements = [];

    careers.forEach(career => {
      if (career.achievements && Array.isArray(career.achievements)) {
        career.achievements.forEach(achievement => {
          // Count by difficulty
          if (!achievementsByDifficulty[career.difficulty][achievement]) {
            achievementsByDifficulty[career.difficulty][achievement] = 0;
          }
          achievementsByDifficulty[career.difficulty][achievement]++;

          // Add to chronological list
          chronologicalAchievements.push({
            name: achievement,
            difficulty: career.difficulty,
            earnedAt: career.completedAt
          });
        });
      }
    });

    // Get unique achievements
    const allAchievements = new Set();
    Object.values(achievementsByDifficulty).forEach(difficultyAchievements => {
      Object.keys(difficultyAchievements).forEach(achievement => {
        allAchievements.add(achievement);
      });
    });

    res.json({
      success: true,
      data: {
        totalUniqueAchievements: allAchievements.size,
        achievementsByDifficulty,
        recentAchievements: chronologicalAchievements.slice(0, 20),
        allUniqueAchievements: Array.from(allAchievements).sort()
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;