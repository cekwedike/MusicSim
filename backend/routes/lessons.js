const express = require('express');
const router = express.Router();
const { User, PlayerStatistics } = require('../models');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/lessons/view
 * @desc    Track lesson view from scenario
 * @access  Private
 */
router.post('/view', async (req, res, next) => {
  try {
    const { 
      lessonTitle, 
      scenarioTitle, 
      conceptTaught,
      timeSpent,
      difficulty 
    } = req.body;

    if (!lessonTitle) {
      return res.status(400).json({
        success: false,
        message: 'Lesson title is required'
      });
    }

    // Get or create player statistics
    let stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats) {
      stats = await PlayerStatistics.create({
        userId: req.userId
      });
    }

    // Update lesson view count and tracking
    stats.totalLessonsViewed = (stats.totalLessonsViewed || 0) + 1;
    
    // Track concepts taught (using JSON field for flexibility)
    let conceptsLearned = stats.conceptsLearned || [];
    if (conceptTaught && !conceptsLearned.includes(conceptTaught)) {
      conceptsLearned.push(conceptTaught);
      stats.conceptsLearned = conceptsLearned;
    }

    // Update time spent learning (in minutes)
    if (timeSpent && timeSpent > 0) {
      stats.totalLearningTime = (stats.totalLearningTime || 0) + timeSpent;
    }

    await stats.save();

    res.json({
      success: true,
      message: 'Lesson view recorded successfully',
      data: {
        totalLessonsViewed: stats.totalLessonsViewed,
        uniqueConceptsLearned: conceptsLearned.length,
        totalLearningTime: stats.totalLearningTime || 0,
        newConceptLearned: conceptTaught && !conceptsLearned.includes(conceptTaught)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/lessons/concept/master
 * @desc    Mark concept as mastered through gameplay
 * @access  Private
 */
router.post('/concept/master', async (req, res, next) => {
  try {
    const { conceptId, conceptName, masteryLevel = 'basic' } = req.body;

    if (!conceptId || !conceptName) {
      return res.status(400).json({
        success: false,
        message: 'Concept ID and name are required'
      });
    }

    // Validate mastery level
    const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
    if (!validLevels.includes(masteryLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mastery level. Must be: basic, intermediate, advanced, or expert'
      });
    }

    // Get or create player statistics
    let stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats) {
      stats = await PlayerStatistics.create({
        userId: req.userId
      });
    }

    // Track concept mastery
    let conceptsMastered = stats.conceptsMastered || {};
    
    // Only update if new mastery level is higher
    const levelOrder = { basic: 1, intermediate: 2, advanced: 3, expert: 4 };
    const currentLevel = conceptsMastered[conceptId]?.level || 'none';
    
    if (!conceptsMastered[conceptId] || levelOrder[masteryLevel] > levelOrder[currentLevel]) {
      conceptsMastered[conceptId] = {
        name: conceptName,
        level: masteryLevel,
        masteredAt: new Date(),
        timesReinforced: conceptsMastered[conceptId]?.timesReinforced || 0
      };
    } else {
      // Reinforce existing concept
      conceptsMastered[conceptId].timesReinforced = (conceptsMastered[conceptId].timesReinforced || 0) + 1;
      conceptsMastered[conceptId].lastReinforcedAt = new Date();
    }

    stats.conceptsMastered = conceptsMastered;
    await stats.save();

    res.json({
      success: true,
      message: 'Concept mastery recorded successfully',
      data: {
        conceptId,
        conceptName,
        masteryLevel: conceptsMastered[conceptId].level,
        timesReinforced: conceptsMastered[conceptId].timesReinforced,
        totalConceptsMastered: Object.keys(conceptsMastered).length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/lessons/engagement
 * @desc    Track detailed lesson engagement metrics
 * @access  Private
 */
router.post('/engagement', async (req, res, next) => {
  try {
    const { 
      lessonId,
      scenarioId,
      engagementType, // 'complete', 'skip', 'revisit'
      timeSpent,
      userRating,
      difficulty
    } = req.body;

    if (!lessonId || !engagementType) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID and engagement type are required'
      });
    }

    const validEngagementTypes = ['complete', 'skip', 'revisit'];
    if (!validEngagementTypes.includes(engagementType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid engagement type'
      });
    }

    // Get or create player statistics
    let stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats) {
      stats = await PlayerStatistics.create({
        userId: req.userId
      });
    }

    // Track engagement metrics
    let engagementMetrics = stats.lessonEngagement || {};
    
    if (!engagementMetrics[lessonId]) {
      engagementMetrics[lessonId] = {
        totalViews: 0,
        completions: 0,
        skips: 0,
        revisits: 0,
        totalTimeSpent: 0,
        averageRating: 0,
        ratingCount: 0
      };
    }

    const lessonMetrics = engagementMetrics[lessonId];
    lessonMetrics.totalViews += 1;
    lessonMetrics[engagementType + 's'] += 1;

    if (timeSpent && timeSpent > 0) {
      lessonMetrics.totalTimeSpent += timeSpent;
    }

    if (userRating && userRating >= 1 && userRating <= 5) {
      const totalRating = lessonMetrics.averageRating * lessonMetrics.ratingCount + userRating;
      lessonMetrics.ratingCount += 1;
      lessonMetrics.averageRating = Math.round((totalRating / lessonMetrics.ratingCount) * 10) / 10;
    }

    stats.lessonEngagement = engagementMetrics;
    await stats.save();

    res.json({
      success: true,
      message: 'Lesson engagement recorded successfully',
      data: {
        lessonId,
        engagementType,
        metrics: lessonMetrics
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/lessons/stats
 * @desc    Get comprehensive lesson viewing and learning statistics
 * @access  Private
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats) {
      return res.json({
        success: true,
        data: {
          totalLessonsViewed: 0,
          uniqueConceptsLearned: 0,
          conceptsMastered: 0,
          totalLearningTime: 0,
          engagementMetrics: {},
          conceptMastery: []
        }
      });
    }

    // Process concept mastery data
    const conceptsMastered = stats.conceptsMastered || {};
    const conceptMasteryArray = Object.entries(conceptsMastered).map(([id, data]) => ({
      conceptId: id,
      conceptName: data.name,
      masteryLevel: data.level,
      masteredAt: data.masteredAt,
      timesReinforced: data.timesReinforced || 0
    }));

    // Calculate mastery distribution
    const masteryDistribution = {
      basic: conceptMasteryArray.filter(c => c.masteryLevel === 'basic').length,
      intermediate: conceptMasteryArray.filter(c => c.masteryLevel === 'intermediate').length,
      advanced: conceptMasteryArray.filter(c => c.masteryLevel === 'advanced').length,
      expert: conceptMasteryArray.filter(c => c.masteryLevel === 'expert').length
    };

    // Process lesson engagement data
    const lessonEngagement = stats.lessonEngagement || {};
    const engagementSummary = {
      totalLessonsEngaged: Object.keys(lessonEngagement).length,
      totalCompletions: Object.values(lessonEngagement).reduce((sum, lesson) => sum + (lesson.completions || 0), 0),
      totalSkips: Object.values(lessonEngagement).reduce((sum, lesson) => sum + (lesson.skips || 0), 0),
      averageRating: calculateAverageRating(lessonEngagement),
      completionRate: calculateCompletionRate(lessonEngagement)
    };

    res.json({
      success: true,
      data: {
        totalLessonsViewed: stats.totalLessonsViewed || 0,
        uniqueConceptsLearned: (stats.conceptsLearned || []).length,
        conceptsMastered: Object.keys(conceptsMastered).length,
        totalLearningTime: stats.totalLearningTime || 0, // in minutes
        masteryDistribution,
        engagementSummary,
        conceptMastery: conceptMasteryArray.sort((a, b) => new Date(b.masteredAt) - new Date(a.masteredAt)).slice(0, 10),
        recentConcepts: (stats.conceptsLearned || []).slice(-5)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/lessons/concepts
 * @desc    Get detailed concept mastery information
 * @access  Private
 */
router.get('/concepts', async (req, res, next) => {
  try {
    const { masteryLevel } = req.query;

    const stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats || !stats.conceptsMastered) {
      return res.json({
        success: true,
        data: {
          concepts: [],
          summary: {
            total: 0,
            byLevel: { basic: 0, intermediate: 0, advanced: 0, expert: 0 }
          }
        }
      });
    }

    const conceptsMastered = stats.conceptsMastered;
    let concepts = Object.entries(conceptsMastered).map(([id, data]) => ({
      conceptId: id,
      conceptName: data.name,
      masteryLevel: data.level,
      masteredAt: data.masteredAt,
      timesReinforced: data.timesReinforced || 0,
      lastReinforcedAt: data.lastReinforcedAt
    }));

    // Filter by mastery level if specified
    if (masteryLevel) {
      concepts = concepts.filter(c => c.masteryLevel === masteryLevel);
    }

    // Sort by mastery date (most recent first)
    concepts.sort((a, b) => new Date(b.masteredAt) - new Date(a.masteredAt));

    // Calculate summary
    const allConcepts = Object.values(conceptsMastered);
    const summary = {
      total: allConcepts.length,
      byLevel: {
        basic: allConcepts.filter(c => c.level === 'basic').length,
        intermediate: allConcepts.filter(c => c.level === 'intermediate').length,
        advanced: allConcepts.filter(c => c.level === 'advanced').length,
        expert: allConcepts.filter(c => c.level === 'expert').length
      },
      mostReinforced: allConcepts.reduce((max, concept) => 
        (concept.timesReinforced || 0) > (max.timesReinforced || 0) ? concept : max, 
        allConcepts[0] || {}
      )
    };

    res.json({
      success: true,
      data: {
        concepts,
        summary,
        filter: { masteryLevel }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/lessons/engagement/:lessonId
 * @desc    Get detailed engagement metrics for specific lesson
 * @access  Private
 */
router.get('/engagement/:lessonId', async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    const stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    if (!stats || !stats.lessonEngagement || !stats.lessonEngagement[lessonId]) {
      return res.json({
        success: true,
        data: {
          exists: false,
          lessonId
        }
      });
    }

    const lessonMetrics = stats.lessonEngagement[lessonId];

    res.json({
      success: true,
      data: {
        exists: true,
        lessonId,
        metrics: {
          ...lessonMetrics,
          engagementScore: calculateEngagementScore(lessonMetrics),
          averageTimePerView: lessonMetrics.totalViews > 0 
            ? Math.round(lessonMetrics.totalTimeSpent / lessonMetrics.totalViews) 
            : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function calculateAverageRating(lessonEngagement) {
  const lessons = Object.values(lessonEngagement);
  const ratedLessons = lessons.filter(lesson => lesson.ratingCount > 0);
  
  if (ratedLessons.length === 0) return 0;
  
  const totalWeightedRating = ratedLessons.reduce((sum, lesson) => 
    sum + (lesson.averageRating * lesson.ratingCount), 0
  );
  const totalRatings = ratedLessons.reduce((sum, lesson) => sum + lesson.ratingCount, 0);
  
  return Math.round((totalWeightedRating / totalRatings) * 10) / 10;
}

function calculateCompletionRate(lessonEngagement) {
  const lessons = Object.values(lessonEngagement);
  const totalViews = lessons.reduce((sum, lesson) => sum + lesson.totalViews, 0);
  const totalCompletions = lessons.reduce((sum, lesson) => sum + lesson.completions, 0);
  
  if (totalViews === 0) return 0;
  
  return Math.round((totalCompletions / totalViews) * 100);
}

function calculateEngagementScore(lessonMetrics) {
  // Simple engagement score based on completion rate, time spent, and rating
  const completionRate = lessonMetrics.totalViews > 0 
    ? (lessonMetrics.completions / lessonMetrics.totalViews) * 100 
    : 0;
  
  const ratingScore = lessonMetrics.averageRating * 20; // Convert 1-5 to 0-100 scale
  const timeScore = Math.min(lessonMetrics.totalTimeSpent / 10, 100); // Cap at 100
  
  return Math.round((completionRate * 0.5 + ratingScore * 0.3 + timeScore * 0.2));
}

module.exports = router;