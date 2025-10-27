const express = require('express');
const router = express.Router();
const { 
  User, 
  LearningProgress, 
  CareerHistory, 
  PlayerStatistics,
  GameSave 
} = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Personal analytics overview combining learning and gaming data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview analytics
 */
router.get('/overview', async (req, res, next) => {
  try {
    // Get user's complete analytics
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: PlayerStatistics,
          as: 'statistics'
        },
        {
          model: LearningProgress,
          as: 'learningProgress'
        },
        {
          model: CareerHistory,
          as: 'careerHistory'
        },
        {
          model: GameSave,
          as: 'saves',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate learning effectiveness
    const completedModules = user.learningProgress.filter(p => p.completed);
    const avgQuizScore = completedModules.length > 0
      ? Math.round(
          completedModules
            .filter(p => p.quizScore !== null)
            .reduce((sum, p) => sum + p.quizScore, 0) / 
          completedModules.filter(p => p.quizScore !== null).length
        )
      : 0;

    // Calculate game performance
    const totalCareers = user.careerHistory.length;
    const longestCareer = totalCareers > 0
      ? Math.max(...user.careerHistory.map(c => c.weeksPlayed))
      : 0;

    const avgCareerLength = totalCareers > 0
      ? Math.round(user.careerHistory.reduce((sum, c) => sum + c.weeksPlayed, 0) / totalCareers)
      : 0;

    // Calculate learning-to-performance correlation
    const learningScore = (completedModules.length * 10) + (avgQuizScore * 0.5);
    const performanceScore = (avgCareerLength / 10) + (longestCareer / 20);
    const correlationStrength = calculateCorrelation(learningScore, performanceScore);

    const overview = {
      user: {
        username: user.username,
        email: user.email,
        joinedAt: user.createdAt,
        lastActive: user.lastLogin
      },
      learning: {
        modulesStarted: user.learningProgress.length,
        modulesCompleted: completedModules.length,
        completionRate: user.learningProgress.length > 0 
          ? Math.round((completedModules.length / user.learningProgress.length) * 100)
          : 0,
        averageQuizScore: avgQuizScore,
        totalLessonsViewed: user.statistics?.totalLessonsViewed || 0,
        totalLearningTime: user.statistics?.totalLearningTime || 0,
        conceptsMastered: Object.keys(user.statistics?.conceptsMastered || {}).length
      },
      gaming: {
        totalCareers: totalCareers,
        averageCareerLength: avgCareerLength,
        longestCareerWeeks: longestCareer,
        activeSaves: user.saves.length,
        totalGamesPlayed: user.statistics?.totalGamesPlayed || 0,
        gamesLostToDebt: user.statistics?.gamesLostToDebt || 0,
        gamesLostToBurnout: user.statistics?.gamesLostToBurnout || 0
      },
      achievements: {
        totalUnlocked: user.statistics?.totalAchievementsUnlocked || 0
      },
      insights: {
        learningToPerformanceCorrelation: correlationStrength,
        recommendedFocus: getRecommendedFocus(user.learningProgress, user.careerHistory),
        overallEngagement: calculateOverallEngagement(user.statistics, user.learningProgress, user.careerHistory)
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/analytics/learning-journey:
 *   get:
 *     summary: Detailed learning journey with timeline and insights
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning journey
 */
router.get('/learning-journey', async (req, res, next) => {
  try {
    const progress = await LearningProgress.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    const journey = progress.map((p, index) => {
      const timeToComplete = p.completedAt 
        ? Math.round((new Date(p.completedAt) - new Date(p.createdAt)) / (1000 * 60)) // minutes
        : null;
      
      return {
        moduleId: p.moduleId,
        moduleName: p.moduleName,
        orderInJourney: index + 1,
        startedAt: p.createdAt,
        completedAt: p.completedAt,
        completed: p.completed,
        quizScore: p.quizScore,
        attempts: p.attemptsCount,
        timeToComplete: timeToComplete,
        difficulty: categorizeDifficulty(p.attemptsCount, timeToComplete, p.quizScore)
      };
    });

    // Calculate learning patterns
    const completedJourney = journey.filter(j => j.completed);
    const patterns = {
      averageTimeToComplete: completedJourney.length > 0
        ? Math.round(completedJourney.reduce((sum, j) => sum + (j.timeToComplete || 0), 0) / completedJourney.length)
        : 0,
      averageAttempts: progress.length > 0
        ? (progress.reduce((sum, p) => sum + (p.attemptsCount || 0), 0) / progress.length).toFixed(1)
        : 0,
      learningVelocity: calculateLearningVelocity(completedJourney),
      strongestAreas: identifyStrongestAreas(completedJourney),
      improvementAreas: identifyImprovementAreas(journey)
    };

    const insights = {
      totalModules: progress.length,
      completionRate: progress.length > 0
        ? Math.round((progress.filter(p => p.completed).length / progress.length) * 100)
        : 0,
      learningConsistency: calculateConsistency(progress),
      patterns
    };

    res.json({
      success: true,
      data: {
        journey,
        insights,
        milestones: identifyMilestones(journey)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/analytics/performance-trends:
 *   get:
 *     summary: Performance trends over time with learning correlation
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance trends
 */
router.get('/performance-trends', async (req, res, next) => {
  try {
    const careers = await CareerHistory.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']],
      limit: 20 // Last 20 careers
    });

    const learningProgress = await LearningProgress.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    const trends = careers.map((career, index) => {
      // Find completed modules before this career
      const modulesBeforeCareer = learningProgress.filter(lp => 
        lp.completed && new Date(lp.completedAt) < new Date(career.createdAt)
      ).length;

      return {
        careerNumber: index + 1,
        date: career.createdAt,
        weeksPlayed: career.weeksPlayed,
        gameEndReason: career.gameEndReason,
        difficulty: career.difficulty,
        finalScore: career.finalScore,
        achievementsEarned: (career.achievements || []).length,
        modulesCompletedBeforeCareer: modulesBeforeCareer,
        learningAdvantage: modulesBeforeCareer > 0
      };
    });

    // Calculate improvement metrics
    const improvementTrend = calculateDetailedImprovementTrend(trends);
    const learningImpact = calculateLearningImpact(trends);

    const insights = {
      totalCareers: careers.length,
      averageSurvival: careers.length > 0
        ? Math.round(careers.reduce((sum, c) => sum + c.weeksPlayed, 0) / careers.length)
        : 0,
      improvementTrend,
      learningImpact,
      bestPerformance: trends.length > 0 
        ? trends.reduce((best, current) => 
            current.weeksPlayed > best.weeksPlayed ? current : best
          )
        : null,
      recentTrend: trends.length >= 3 
        ? calculateRecentTrend(trends.slice(-3))
        : 'insufficient_data'
    };

    res.json({
      success: true,
      data: {
        trends,
        insights,
        correlations: {
          learningToPerformance: calculateLearningPerformanceCorrelation(trends),
          difficultyToSurvival: calculateDifficultyCorrelation(trends)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/analytics/educational-effectiveness:
 *   get:
 *     summary: Analyze the effectiveness of learning on game performance
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Educational effectiveness analysis
 */
router.get('/educational-effectiveness', async (req, res, next) => {
  try {
    const learningProgress = await LearningProgress.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    const careers = await CareerHistory.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'ASC']]
    });

    const stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    // Analyze performance before and after learning milestones
    const effectiveness = {
      overallEffectiveness: calculateOverallEffectiveness(learningProgress, careers),
      moduleEffectiveness: analyzeModuleEffectiveness(learningProgress, careers),
      learningMilestones: identifyLearningMilestones(learningProgress, careers),
      conceptApplication: analyzeConceptApplication(stats, careers),
      timeToApplication: calculateTimeToApplication(learningProgress, careers)
    };

    // Generate insights and recommendations
    const insights = {
      mostEffectiveModules: effectiveness.moduleEffectiveness
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, 3),
      leastEffectiveModules: effectiveness.moduleEffectiveness
        .sort((a, b) => a.effectiveness - b.effectiveness)
        .slice(0, 3),
      recommendedLearningPath: generateLearningPath(effectiveness, learningProgress),
      learningROI: calculateLearningROI(learningProgress, careers)
    };

    res.json({
      success: true,
      data: {
        effectiveness,
        insights,
        summary: {
          totalModulesCompleted: learningProgress.filter(lp => lp.completed).length,
          totalCareers: careers.length,
          averagePerformanceImprovement: effectiveness.overallEffectiveness.performanceImprovement,
          learningEffectivenessScore: effectiveness.overallEffectiveness.effectivenessScore
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/analytics/progress-dashboard:
 *   get:
 *     summary: Comprehensive dashboard data for analytics visualization
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/progress-dashboard', async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      case 'all': startDate.setFullYear(2000); break;
      default: startDate.setDate(now.getDate() - 30);
    }

    // Get filtered data
    const learningProgress = await LearningProgress.findAll({
      where: { 
        userId: req.userId,
        createdAt: { [Op.gte]: startDate }
      },
      order: [['createdAt', 'ASC']]
    });

    const careers = await CareerHistory.findAll({
      where: { 
        userId: req.userId,
        createdAt: { [Op.gte]: startDate }
      },
      order: [['createdAt', 'ASC']]
    });

    const stats = await PlayerStatistics.findOne({
      where: { userId: req.userId }
    });

    // Build dashboard data
    const dashboard = {
      timeframe,
      dateRange: { start: startDate, end: now },
      learning: {
        modulesStarted: learningProgress.length,
        modulesCompleted: learningProgress.filter(lp => lp.completed).length,
        averageScore: calculateAverageScore(learningProgress.filter(lp => lp.completed)),
        totalTime: learningProgress.reduce((sum, lp) => {
          if (lp.completedAt) {
            return sum + Math.round((new Date(lp.completedAt) - new Date(lp.createdAt)) / (1000 * 60));
          }
          return sum;
        }, 0),
        dailyProgress: generateDailyProgress(learningProgress, startDate, now)
      },
      gaming: {
        careersPlayed: careers.length,
        averageSurvival: careers.length > 0 
          ? Math.round(careers.reduce((sum, c) => sum + c.weeksPlayed, 0) / careers.length)
          : 0,
        bestPerformance: careers.length > 0 
          ? Math.max(...careers.map(c => c.weeksPlayed))
          : 0,
        difficultyDistribution: calculateDifficultyDistribution(careers),
        performanceTimeline: generatePerformanceTimeline(careers, startDate, now)
      },
      engagement: {
        totalLessonsViewed: stats?.totalLessonsViewed || 0,
        conceptsMastered: Object.keys(stats?.conceptsMastered || {}).length,
        engagementScore: calculateEngagementScore(stats, learningProgress, careers),
        streaks: calculateStreaks(learningProgress, careers)
      }
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function calculateCorrelation(learningScore, performanceScore) {
  // Simple correlation categorization
  const ratio = performanceScore / (learningScore || 1);
  if (ratio > 1.5) return 'strong_positive';
  if (ratio > 1.0) return 'positive';
  if (ratio > 0.5) return 'neutral';
  return 'negative';
}

function getRecommendedFocus(learningProgress, careerHistory) {
  const completedModules = learningProgress.filter(lp => lp.completed).length;
  const avgPerformance = careerHistory.length > 0 
    ? careerHistory.reduce((sum, c) => sum + c.weeksPlayed, 0) / careerHistory.length
    : 0;

  if (completedModules < 3) return 'learning';
  if (avgPerformance < 50) return 'practice';
  return 'advanced_strategies';
}

function calculateOverallEngagement(stats, learningProgress, careerHistory) {
  const learningEngagement = (learningProgress.length * 10) + (stats?.totalLessonsViewed || 0);
  const gameEngagement = careerHistory.length * 5;
  const totalEngagement = learningEngagement + gameEngagement;
  
  if (totalEngagement > 100) return 'high';
  if (totalEngagement > 50) return 'medium';
  return 'low';
}

function categorizeDifficulty(attempts, timeToComplete, score) {
  let difficultyScore = 0;
  
  if (attempts > 3) difficultyScore += 2;
  else if (attempts > 1) difficultyScore += 1;
  
  if (timeToComplete > 60) difficultyScore += 2;
  else if (timeToComplete > 30) difficultyScore += 1;
  
  if (score < 60) difficultyScore += 2;
  else if (score < 80) difficultyScore += 1;
  
  if (difficultyScore >= 4) return 'very_hard';
  if (difficultyScore >= 3) return 'hard';
  if (difficultyScore >= 2) return 'medium';
  return 'easy';
}

function calculateLearningVelocity(completedJourney) {
  if (completedJourney.length < 2) return 'insufficient_data';
  
  const totalTime = completedJourney.reduce((sum, j) => sum + (j.timeToComplete || 0), 0);
  const avgTimePerModule = totalTime / completedJourney.length;
  
  if (avgTimePerModule < 20) return 'fast';
  if (avgTimePerModule < 40) return 'moderate';
  return 'slow';
}

function identifyStrongestAreas(completedJourney) {
  return completedJourney
    .filter(j => j.quizScore >= 85)
    .map(j => j.moduleName)
    .slice(0, 3);
}

function identifyImprovementAreas(journey) {
  return journey
    .filter(j => !j.completed || (j.quizScore && j.quizScore < 70))
    .map(j => j.moduleName)
    .slice(0, 3);
}

function calculateConsistency(progress) {
  if (progress.length < 3) return 'insufficient_data';
  
  // Calculate gaps between learning sessions
  const dates = progress.map(p => new Date(p.createdAt)).sort((a, b) => a - b);
  const gaps = [];
  
  for (let i = 1; i < dates.length; i++) {
    const gap = (dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24); // days
    gaps.push(gap);
  }
  
  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  
  if (avgGap <= 2) return 'very_consistent';
  if (avgGap <= 7) return 'consistent';
  if (avgGap <= 14) return 'moderate';
  return 'inconsistent';
}

function identifyMilestones(journey) {
  const milestones = [];
  
  if (journey.length >= 1) {
    milestones.push({
      type: 'first_module',
      date: journey[0].startedAt,
      description: 'Started learning journey'
    });
  }
  
  const completedModules = journey.filter(j => j.completed);
  if (completedModules.length >= 1) {
    milestones.push({
      type: 'first_completion',
      date: completedModules[0].completedAt,
      description: 'First module completed'
    });
  }
  
  if (completedModules.length >= 5) {
    milestones.push({
      type: 'learning_momentum',
      date: completedModules[4].completedAt,
      description: '5 modules completed'
    });
  }
  
  const excellentScores = completedModules.filter(j => j.quizScore >= 90);
  if (excellentScores.length >= 1) {
    milestones.push({
      type: 'mastery_achieved',
      date: excellentScores[0].completedAt,
      description: 'First excellent score (90+)'
    });
  }
  
  return milestones;
}

function calculateDetailedImprovementTrend(trends) {
  if (trends.length < 3) return 'insufficient_data';
  
  const firstThird = trends.slice(0, Math.floor(trends.length / 3));
  const lastThird = trends.slice(-Math.floor(trends.length / 3));
  
  const avgFirstThird = firstThird.reduce((sum, t) => sum + t.weeksPlayed, 0) / firstThird.length;
  const avgLastThird = lastThird.reduce((sum, t) => sum + t.weeksPlayed, 0) / lastThird.length;
  
  const improvement = ((avgLastThird - avgFirstThird) / avgFirstThird) * 100;
  
  if (improvement > 30) return 'improving_significantly';
  if (improvement > 10) return 'improving';
  if (improvement > -10) return 'stable';
  if (improvement > -30) return 'declining';
  return 'declining_significantly';
}

function calculateLearningImpact(trends) {
  const withLearning = trends.filter(t => t.learningAdvantage);
  const withoutLearning = trends.filter(t => !t.learningAdvantage);
  
  if (withLearning.length === 0 || withoutLearning.length === 0) {
    return 'insufficient_data';
  }
  
  const avgWithLearning = withLearning.reduce((sum, t) => sum + t.weeksPlayed, 0) / withLearning.length;
  const avgWithoutLearning = withoutLearning.reduce((sum, t) => sum + t.weeksPlayed, 0) / withoutLearning.length;
  
  const improvement = ((avgWithLearning - avgWithoutLearning) / avgWithoutLearning) * 100;
  
  return {
    improvement: Math.round(improvement),
    avgWithLearning: Math.round(avgWithLearning),
    avgWithoutLearning: Math.round(avgWithoutLearning),
    significance: improvement > 20 ? 'high' : improvement > 10 ? 'medium' : 'low'
  };
}

function calculateRecentTrend(recentTrends) {
  const first = recentTrends[0].weeksPlayed;
  const last = recentTrends[recentTrends.length - 1].weeksPlayed;
  const improvement = ((last - first) / first) * 100;
  
  if (improvement > 15) return 'improving';
  if (improvement > -15) return 'stable';
  return 'declining';
}

function calculateLearningPerformanceCorrelation(trends) {
  if (trends.length < 5) return 'insufficient_data';
  
  const correlation = trends.reduce((sum, t) => {
    return sum + (t.modulesCompletedBeforeCareer * t.weeksPlayed);
  }, 0) / trends.length;
  
  if (correlation > 100) return 'strong_positive';
  if (correlation > 50) return 'positive';
  if (correlation > 20) return 'weak_positive';
  return 'no_correlation';
}

function calculateDifficultyCorrelation(trends) {
  const difficulties = { beginner: [], realistic: [], hardcore: [] };
  
  trends.forEach(t => {
    if (difficulties[t.difficulty]) {
      difficulties[t.difficulty].push(t.weeksPlayed);
    }
  });
  
  const averages = {};
  Object.keys(difficulties).forEach(diff => {
    if (difficulties[diff].length > 0) {
      averages[diff] = difficulties[diff].reduce((sum, weeks) => sum + weeks, 0) / difficulties[diff].length;
    }
  });
  
  return averages;
}

function calculateOverallEffectiveness(learningProgress, careers) {
  // Implementation for overall effectiveness calculation
  const completedModules = learningProgress.filter(lp => lp.completed).length;
  const avgScore = learningProgress.filter(lp => lp.completed && lp.quizScore)
    .reduce((sum, lp) => sum + lp.quizScore, 0) / Math.max(1, learningProgress.filter(lp => lp.completed && lp.quizScore).length);
  
  const avgPerformance = careers.length > 0 
    ? careers.reduce((sum, c) => sum + c.weeksPlayed, 0) / careers.length
    : 0;
  
  const effectivenessScore = (completedModules * 10) + (avgScore * 0.5) + (avgPerformance * 0.2);
  const performanceImprovement = calculatePerformanceImprovement(careers);
  
  return {
    effectivenessScore: Math.round(effectivenessScore),
    performanceImprovement: Math.round(performanceImprovement),
    learningUtilization: Math.round((avgPerformance / (completedModules || 1)) * 10)
  };
}

function analyzeModuleEffectiveness(learningProgress, careers) {
  // Analyze effectiveness of each module
  return learningProgress
    .filter(lp => lp.completed)
    .map(lp => ({
      moduleId: lp.moduleId,
      moduleName: lp.moduleName,
      effectiveness: Math.random() * 100, // Placeholder - would need more complex analysis
      completedAt: lp.completedAt
    }));
}

function identifyLearningMilestones(learningProgress, careers) {
  // Identify key milestones in learning journey
  return [];
}

function analyzeConceptApplication(stats, careers) {
  // Analyze how learned concepts are applied in gameplay
  return {
    conceptsApplied: Object.keys(stats?.conceptsMastered || {}).length,
    applicationRate: 75 // Placeholder
  };
}

function calculateTimeToApplication(learningProgress, careers) {
  // Calculate time between learning and application
  return 'insufficient_data';
}

function generateLearningPath(effectiveness, learningProgress) {
  // Generate recommended learning path
  return [];
}

function calculateLearningROI(learningProgress, careers) {
  // Calculate return on investment for learning
  return {
    timeInvested: learningProgress.length * 30, // minutes
    performanceGain: 25, // percentage
    roi: 'positive'
  };
}

function calculateAverageScore(completedProgress) {
  const scores = completedProgress.filter(lp => lp.quizScore !== null).map(lp => lp.quizScore);
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
}

function generateDailyProgress(learningProgress, startDate, endDate) {
  const days = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayProgress = learningProgress.filter(lp => {
      const lpDate = new Date(lp.createdAt);
      return lpDate.toDateString() === currentDate.toDateString();
    }).length;
    
    days.push({
      date: new Date(currentDate),
      modulesStarted: dayProgress,
      modulesCompleted: learningProgress.filter(lp => {
        if (!lp.completedAt) return false;
        const completedDate = new Date(lp.completedAt);
        return completedDate.toDateString() === currentDate.toDateString();
      }).length
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

function calculateDifficultyDistribution(careers) {
  const distribution = { beginner: 0, realistic: 0, hardcore: 0 };
  careers.forEach(career => {
    if (distribution[career.difficulty] !== undefined) {
      distribution[career.difficulty]++;
    }
  });
  return distribution;
}

function generatePerformanceTimeline(careers, startDate, endDate) {
  return careers.map(career => ({
    date: career.createdAt,
    weeksPlayed: career.weeksPlayed,
    difficulty: career.difficulty
  }));
}

function calculateEngagementScore(stats, learningProgress, careers) {
  const learningScore = (learningProgress.length * 5) + ((stats?.totalLessonsViewed || 0) * 2);
  const gameScore = careers.length * 10;
  const conceptScore = Object.keys(stats?.conceptsMastered || {}).length * 3;
  
  return Math.min(Math.round(learningScore + gameScore + conceptScore), 100);
}

function calculateStreaks(learningProgress, careers) {
  // Calculate learning and playing streaks
  return {
    learningStreak: 0, // Placeholder
    playingStreak: 0, // Placeholder
    longestLearningStreak: 0,
    longestPlayingStreak: 0
  };
}

function calculatePerformanceImprovement(careers) {
  if (careers.length < 2) return 0;
  
  const firstHalf = careers.slice(0, Math.floor(careers.length / 2));
  const secondHalf = careers.slice(Math.floor(careers.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, c) => sum + c.weeksPlayed, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, c) => sum + c.weeksPlayed, 0) / secondHalf.length;
  
  return ((secondAvg - firstAvg) / firstAvg) * 100;
}

module.exports = router;