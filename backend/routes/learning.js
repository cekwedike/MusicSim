const express = require('express');
const router = express.Router();
const { LearningProgress, User } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/learning/module/start
 * @desc    Mark module as started
 * @access  Private
 */
router.post('/module/start', async (req, res, next) => {
  try {
    const { moduleId, moduleName } = req.body;

    if (!moduleId || !moduleName) {
      return res.status(400).json({
        success: false,
        message: 'Module ID and name are required'
      });
    }

    // Check if progress already exists
    let progress = await LearningProgress.findOne({
      where: {
        userId: req.userId,
        moduleId: moduleId
      }
    });

    if (progress) {
      return res.json({
        success: true,
        message: 'Module already started',
        data: {
          progressId: progress.id,
          moduleId: progress.moduleId,
          attemptsCount: progress.attemptsCount,
          completed: progress.completed,
          quizScore: progress.quizScore
        }
      });
    }

    // Create new progress record
    progress = await LearningProgress.create({
      userId: req.userId,
      moduleId: moduleId,
      moduleName: moduleName,
      completed: false,
      attemptsCount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Module started successfully',
      data: {
        progressId: progress.id,
        moduleId: progress.moduleId,
        moduleName: progress.moduleName,
        startedAt: progress.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/learning/module/complete
 * @desc    Mark module as completed with quiz score
 * @access  Private
 */
router.post('/module/complete', async (req, res, next) => {
  try {
    const { moduleId, quizScore } = req.body;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'Module ID is required'
      });
    }

    if (quizScore !== undefined && (quizScore < 0 || quizScore > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Quiz score must be between 0 and 100'
      });
    }

    let progress = await LearningProgress.findOne({
      where: {
        userId: req.userId,
        moduleId: moduleId
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Module not found. Please start the module first.'
      });
    }

    // Update progress
    progress.completed = true;
    progress.quizScore = quizScore || null;
    progress.attemptsCount = (progress.attemptsCount || 0) + 1;
    progress.completedAt = new Date();
    await progress.save();

    res.json({
      success: true,
      message: 'Module completed successfully',
      data: {
        progressId: progress.id,
        moduleId: progress.moduleId,
        moduleName: progress.moduleName,
        quizScore: progress.quizScore,
        attemptsCount: progress.attemptsCount,
        completedAt: progress.completedAt,
        timeSpent: progress.completedAt 
          ? Math.round((new Date(progress.completedAt) - new Date(progress.createdAt)) / (1000 * 60)) // minutes
          : null
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/learning/quiz/attempt
 * @desc    Record quiz attempt (without completing module)
 * @access  Private
 */
router.post('/quiz/attempt', async (req, res, next) => {
  try {
    const { moduleId, score } = req.body;

    if (!moduleId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Module ID and score are required'
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 0 and 100'
      });
    }

    let progress = await LearningProgress.findOne({
      where: {
        userId: req.userId,
        moduleId: moduleId
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Module not found. Please start the module first.'
      });
    }

    // Update attempts and score (keep highest score)
    const previousScore = progress.quizScore;
    progress.attemptsCount = (progress.attemptsCount || 0) + 1;
    if (!progress.quizScore || score > progress.quizScore) {
      progress.quizScore = score;
    }
    await progress.save();

    res.json({
      success: true,
      message: 'Quiz attempt recorded successfully',
      data: {
        attemptsCount: progress.attemptsCount,
        bestScore: progress.quizScore,
        currentScore: score,
        improved: score > (previousScore || 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/learning/progress
 * @desc    Get all learning progress for user
 * @access  Private
 */
router.get('/progress', async (req, res, next) => {
  try {
    const { completed } = req.query;

    // Build where clause
    const whereClause = { userId: req.userId };
    if (completed !== undefined) {
      whereClause.completed = completed === 'true';
    }

    const progress = await LearningProgress.findAll({
      where: whereClause,
      order: [['updatedAt', 'DESC']]
    });

    // Calculate summary statistics
    const completedModules = progress.filter(p => p.completed);
    const scores = completedModules.filter(p => p.quizScore !== null).map(p => p.quizScore);

    const summary = {
      total: progress.length,
      completed: completedModules.length,
      inProgress: progress.filter(p => !p.completed).length,
      averageScore: calculateAverageScore(progress),
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      totalAttempts: progress.reduce((sum, p) => sum + (p.attemptsCount || 0), 0)
    };

    res.json({
      success: true,
      data: {
        progress,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/learning/progress/:moduleId
 * @desc    Get progress for specific module
 * @access  Private
 */
router.get('/progress/:moduleId', async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const progress = await LearningProgress.findOne({
      where: {
        userId: req.userId,
        moduleId: moduleId
      }
    });

    if (!progress) {
      return res.json({
        success: true,
        data: {
          exists: false,
          moduleId: moduleId
        }
      });
    }

    res.json({
      success: true,
      data: {
        exists: true,
        progress: {
          ...progress.toJSON(),
          timeSpent: progress.completedAt 
            ? Math.round((new Date(progress.completedAt) - new Date(progress.createdAt)) / (1000 * 60)) // minutes
            : Math.round((new Date() - new Date(progress.createdAt)) / (1000 * 60)) // current time spent
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/learning/stats
 * @desc    Get comprehensive learning statistics
 * @access  Private
 */
router.get('/stats', async (req, res, next) => {
  try {
    // Get all progress for user
    const allProgress = await LearningProgress.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    // Calculate detailed statistics
    const completedModules = allProgress.filter(p => p.completed);
    const scores = completedModules.filter(p => p.quizScore !== null).map(p => p.quizScore);
    
    const stats = {
      totalModulesStarted: allProgress.length,
      totalModulesCompleted: completedModules.length,
      completionRate: allProgress.length > 0 
        ? Math.round((completedModules.length / allProgress.length) * 100) 
        : 0,
      averageQuizScore: scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0,
      highestQuizScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestQuizScore: scores.length > 0 ? Math.min(...scores) : 0,
      totalQuizAttempts: allProgress.reduce((sum, p) => sum + (p.attemptsCount || 0), 0),
      averageAttemptsPerModule: allProgress.length > 0
        ? parseFloat((allProgress.reduce((sum, p) => sum + (p.attemptsCount || 0), 0) / allProgress.length).toFixed(1))
        : 0,
      lastCompletedModule: completedModules.length > 0
        ? {
            moduleId: completedModules[0].moduleId,
            moduleName: completedModules[0].moduleName,
            completedAt: completedModules[0].completedAt,
            score: completedModules[0].quizScore
          }
        : null
    };

    // Get modules by score range
    const scoreDistribution = {
      excellent: scores.filter(s => s >= 90).length,  // 90-100
      good: scores.filter(s => s >= 70 && s < 90).length,  // 70-89
      fair: scores.filter(s => s >= 50 && s < 70).length,  // 50-69
      poor: scores.filter(s => s < 50).length  // 0-49
    };

    // Calculate learning trend
    const learningTrend = calculateLearningTrend(completedModules);

    res.json({
      success: true,
      data: {
        stats,
        scoreDistribution,
        learningTrend,
        recentProgress: allProgress.slice(-5).map(p => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          completed: p.completed,
          quizScore: p.quizScore,
          updatedAt: p.updatedAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/learning/recommendations
 * @desc    Get recommended modules based on progress
 * @access  Private
 */
router.get('/recommendations', async (req, res, next) => {
  try {
    const progress = await LearningProgress.findAll({
      where: {
        userId: req.userId
      },
      order: [['updatedAt', 'DESC']]
    });

    const completedModuleIds = progress.filter(p => p.completed).map(p => p.moduleId);
    const startedButNotCompleted = progress.filter(p => !p.completed);

    // Simple recommendation logic
    const recommendations = [];

    // Recommend incomplete modules first
    if (startedButNotCompleted.length > 0) {
      recommendations.push({
        type: 'incomplete',
        priority: 'high',
        message: 'Continue your learning journey',
        modules: startedButNotCompleted.map(p => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          attemptsCount: p.attemptsCount,
          timeSpent: Math.round((new Date() - new Date(p.createdAt)) / (1000 * 60)) // minutes
        }))
      });
    }

    // Recommend modules with low scores for retry
    const lowScoreModules = progress.filter(p => p.completed && p.quizScore && p.quizScore < 70);
    if (lowScoreModules.length > 0) {
      recommendations.push({
        type: 'retry',
        priority: 'medium',
        message: 'Improve your understanding with these modules',
        modules: lowScoreModules.map(p => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          score: p.quizScore,
          attempts: p.attemptsCount
        }))
      });
    }

    // Recommend reviewing high-scoring modules for reinforcement
    const highScoreModules = progress.filter(p => p.completed && p.quizScore && p.quizScore >= 90);
    if (highScoreModules.length > 0 && completedModuleIds.length >= 3) {
      recommendations.push({
        type: 'review',
        priority: 'low',
        message: 'Reinforce your excellent knowledge',
        modules: highScoreModules.slice(0, 2).map(p => ({
          moduleId: p.moduleId,
          moduleName: p.moduleName,
          score: p.quizScore
        }))
      });
    }

    res.json({
      success: true,
      data: {
        completedCount: completedModuleIds.length,
        recommendationCount: recommendations.reduce((sum, r) => sum + r.modules.length, 0),
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/learning/progress/:moduleId
 * @desc    Reset module progress
 * @access  Private
 */
router.delete('/progress/:moduleId', async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const result = await LearningProgress.destroy({
      where: {
        userId: req.userId,
        moduleId: moduleId
      }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Module progress not found'
      });
    }

    res.json({
      success: true,
      message: 'Module progress reset successfully',
      data: {
        moduleId: moduleId
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/learning/leaderboard
 * @desc    Get learning leaderboard (anonymous)
 * @access  Private
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { metric = 'completion', limit = 10 } = req.query;

    const { sequelize } = require('../models');

    let leaderboardData = [];

    if (metric === 'completion') {
      // Leaderboard by completion count
      leaderboardData = await LearningProgress.findAll({
        attributes: [
          'userId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'completedModules'],
          [sequelize.fn('AVG', sequelize.col('quizScore')), 'averageScore']
        ],
        where: {
          completed: true
        },
        group: ['userId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: parseInt(limit),
        raw: true
      });
    } else if (metric === 'score') {
      // Leaderboard by average score
      leaderboardData = await LearningProgress.findAll({
        attributes: [
          'userId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'completedModules'],
          [sequelize.fn('AVG', sequelize.col('quizScore')), 'averageScore']
        ],
        where: {
          completed: true,
          quizScore: { [Op.ne]: null }
        },
        group: ['userId'],
        having: sequelize.literal('COUNT(id) >= 3'), // At least 3 completed modules
        order: [[sequelize.fn('AVG', sequelize.col('quizScore')), 'DESC']],
        limit: parseInt(limit),
        raw: true
      });
    }

    // Get user's position
    const userProgress = await LearningProgress.findAll({
      where: {
        userId: req.userId,
        completed: true
      }
    });

    const userStats = {
      completedModules: userProgress.length,
      averageScore: userProgress.length > 0 
        ? Math.round(userProgress.filter(p => p.quizScore !== null)
            .reduce((sum, p) => sum + p.quizScore, 0) / userProgress.filter(p => p.quizScore !== null).length) || 0
        : 0
    };

    res.json({
      success: true,
      data: {
        leaderboard: leaderboardData.map((entry, index) => ({
          rank: index + 1,
          completedModules: parseInt(entry.completedModules),
          averageScore: entry.averageScore ? Math.round(parseFloat(entry.averageScore)) : 0,
          anonymous: true // Don't expose user IDs
        })),
        userStats,
        metric,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function calculateAverageScore(progressArray) {
  const scores = progressArray
    .filter(p => p.completed && p.quizScore !== null)
    .map(p => p.quizScore);
  
  if (scores.length === 0) return 0;
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function calculateLearningTrend(completedModules) {
  if (completedModules.length < 3) return 'insufficient_data';
  
  // Sort by completion date
  const sorted = completedModules.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
  
  const firstHalfAvg = firstHalf.filter(m => m.quizScore !== null)
    .reduce((sum, m) => sum + m.quizScore, 0) / firstHalf.filter(m => m.quizScore !== null).length || 0;
  
  const secondHalfAvg = secondHalf.filter(m => m.quizScore !== null)
    .reduce((sum, m) => sum + m.quizScore, 0) / secondHalf.filter(m => m.quizScore !== null).length || 0;
  
  const improvement = secondHalfAvg - firstHalfAvg;
  
  if (improvement > 10) return 'improving_strongly';
  if (improvement > 5) return 'improving';
  if (improvement > -5) return 'stable';
  if (improvement > -10) return 'declining';
  return 'declining_strongly';
}

module.exports = router;