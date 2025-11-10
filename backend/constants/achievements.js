/**
 * Achievement Definitions
 *
 * Defines all available achievements in the game.
 * Achievements are checked and unlocked by game logic, not stored in database.
 */

const ACHIEVEMENTS = {
  // Career Achievements
  FIRST_CAREER: {
    code: 'first_career',
    name: 'First Steps',
    description: 'Complete your first career',
    category: 'career',
    rarity: 'common',
    pointsValue: 10,
    checkUnlock: (userStats, careerData) => {
      return userStats.totalGamesPlayed >= 1;
    }
  },

  FAME_100: {
    code: 'fame_100',
    name: 'Rising Star',
    description: 'Reach 100 fame points',
    category: 'career',
    rarity: 'common',
    pointsValue: 25,
    checkUnlock: (userStats, careerData) => {
      return careerData?.peakFame >= 100;
    }
  },

  FAME_500: {
    code: 'fame_500',
    name: 'Superstar',
    description: 'Reach 500 fame points',
    category: 'career',
    rarity: 'epic',
    pointsValue: 100,
    checkUnlock: (userStats, careerData) => {
      return careerData?.peakFame >= 500;
    }
  },

  WEEK_52: {
    code: 'week_52',
    name: 'Year One',
    description: 'Survive 52 weeks in a career',
    category: 'career',
    rarity: 'rare',
    pointsValue: 50,
    checkUnlock: (userStats, careerData) => {
      return careerData?.weeksPlayed >= 52;
    }
  },

  WEEK_104: {
    code: 'week_104',
    name: 'Two Year Legend',
    description: 'Survive 104 weeks in a career',
    category: 'career',
    rarity: 'epic',
    pointsValue: 150,
    checkUnlock: (userStats, careerData) => {
      return careerData?.weeksPlayed >= 104;
    }
  },

  CAREER_HARD: {
    code: 'career_hard',
    name: 'Hard Mode Victor',
    description: 'Complete a career on Hard difficulty',
    category: 'career',
    rarity: 'epic',
    pointsValue: 100,
    checkUnlock: (userStats, careerData) => {
      return careerData?.difficulty === 'hardcore' && careerData?.outcome === 'completed';
    }
  },

  CAREER_EXPERT: {
    code: 'career_expert',
    name: 'Expert Champion',
    description: 'Complete a career on Expert difficulty',
    category: 'career',
    rarity: 'legendary',
    pointsValue: 250,
    checkUnlock: (userStats, careerData) => {
      return careerData?.difficulty === 'expert' && careerData?.outcome === 'completed';
    }
  },

  // Financial Achievements
  FIRST_MILLION: {
    code: 'first_million',
    name: 'Millionaire',
    description: 'Earn $1,000,000 in a single career',
    category: 'financial',
    rarity: 'rare',
    pointsValue: 50,
    checkUnlock: (userStats, careerData) => {
      return careerData?.peakCash >= 1000000;
    }
  },

  // Learning Achievements
  FIRST_MODULE: {
    code: 'first_module',
    name: 'Student',
    description: 'Complete your first learning module',
    category: 'learning',
    rarity: 'common',
    pointsValue: 15,
    checkUnlock: (userStats) => {
      return userStats.totalModulesCompleted >= 1;
    }
  },

  ALL_MODULES: {
    code: 'all_modules',
    name: 'Scholar',
    description: 'Complete all learning modules',
    category: 'learning',
    rarity: 'legendary',
    pointsValue: 200,
    checkUnlock: (userStats, careerData, learningProgress) => {
      // Assuming there are 10 total modules - adjust as needed
      const TOTAL_MODULES = 10;
      return userStats.totalModulesCompleted >= TOTAL_MODULES;
    }
  },

  QUIZ_PERFECT: {
    code: 'quiz_perfect',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    category: 'learning',
    rarity: 'rare',
    pointsValue: 30,
    checkUnlock: (userStats, careerData, learningProgress) => {
      return learningProgress?.quizScore === 100;
    }
  }
};

// Helper functions
const getAllAchievements = () => Object.values(ACHIEVEMENTS);

const getAchievementByCode = (code) => {
  return Object.values(ACHIEVEMENTS).find(ach => ach.code === code);
};

const getAchievementsByCategory = (category) => {
  return Object.values(ACHIEVEMENTS).filter(ach => ach.category === category);
};

const getAchievementsByRarity = (rarity) => {
  return Object.values(ACHIEVEMENTS).filter(ach => ach.rarity === rarity);
};

/**
 * Check which achievements a user should unlock based on their current data
 * @param {Object} userStats - User's PlayerStatistics record
 * @param {Object} careerData - Recent CareerHistory record (optional)
 * @param {Object} learningProgress - Recent LearningProgress record (optional)
 * @returns {Array} Array of achievement codes that should be unlocked
 */
const checkAchievements = (userStats, careerData = null, learningProgress = null) => {
  const unlockedAchievements = [];

  for (const achievement of Object.values(ACHIEVEMENTS)) {
    try {
      if (achievement.checkUnlock(userStats, careerData, learningProgress)) {
        unlockedAchievements.push(achievement.code);
      }
    } catch (error) {
      console.error(`Error checking achievement ${achievement.code}:`, error);
    }
  }

  return unlockedAchievements;
};

module.exports = {
  ACHIEVEMENTS,
  getAllAchievements,
  getAchievementByCode,
  getAchievementsByCategory,
  getAchievementsByRarity,
  checkAchievements
};
