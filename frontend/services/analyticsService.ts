import api from './api';
import type { ApiResponse } from './authService';

export interface CareerData {
  artistName: string;
  genre: string;
  difficulty: string;
  finalStats: any;
  gameEndReason: string;
  weeksPlayed: number;
  achievements?: string[];
  finalScore?: number;
}

export interface Career {
  id: string;
  artistName: string;
  genre: string;
  difficulty: string;
  gameEndReason: string;
  weeksPlayed: number;
  yearsSurvived: number;
  finalScore: number;
  achievements: string[];
  completedAt: string;
  createdAt: string;
}

export interface CareerStats {
  overview: {
    totalCareers: number;
    totalAchievements: number;
    uniqueAchievements: number;
  };
  bestCareer?: Career;
  statistics: {
    byDifficulty: Array<{
      difficulty: string;
      averageWeeks: number;
      totalCareers: number;
      bestWeeks: number;
    }>;
    byGenre: Array<{
      genre: string;
      count: number;
      averageWeeks: number;
    }>;
    endReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
  achievements: {
    topAchievements: Array<{
      name: string;
      count: number;
    }>;
    totalEarned: number;
    uniqueCount: number;
  };
  recentCareers: Career[];
}

export interface AnalyticsOverview {
  user: {
    username: string;
    email: string;
    joinedAt: string;
    lastActive?: string;
  };
  learning: {
    modulesStarted: number;
    modulesCompleted: number;
    completionRate: number;
    averageQuizScore: number;
    totalLessonsViewed: number;
    totalLearningTime: number;
    conceptsMastered: number;
  };
  gaming: {
    totalCareers: number;
    averageCareerLength: number;
    longestCareerWeeks: number;
    activeSaves: number;
    totalGamesPlayed: number;
    gamesLostToDebt: number;
    gamesLostToBurnout: number;
  };
  achievements: {
    totalUnlocked: number;
  };
  insights: {
    learningToPerformanceCorrelation: string;
    recommendedFocus: string;
    overallEngagement: string;
  };
}

export const careerService = {
  // Record completed career
  completeCareer: async (careerData: CareerData): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/career/complete', careerData);
    return response.data;
  },

  // Get career history with pagination and filters
  getHistory: async (limit = 20, offset = 0, difficulty?: string, genre?: string, sortBy = 'completedAt', sortOrder = 'desc'): Promise<ApiResponse<{ careers: Career[]; pagination: any; filters: any }>> => {
    const params: any = { limit, offset, sortBy, sortOrder };
    if (difficulty) params.difficulty = difficulty;
    if (genre) params.genre = genre;

    const response = await api.get<ApiResponse<{ careers: Career[]; pagination: any; filters: any }>>('/career/history', { params });
    return response.data;
  },

  // Get comprehensive career statistics
  getStats: async (): Promise<ApiResponse<CareerStats>> => {
    const response = await api.get<ApiResponse<CareerStats>>('/career/stats');
    return response.data;
  },

  // Get leaderboard data
  getLeaderboard: async (difficulty = 'all', metric = 'weeksPlayed', limit = 10): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/career/leaderboard', {
      params: { difficulty, metric, limit }
    });
    return response.data;
  },

  // Get specific career details
  getCareerDetails: async (careerHistoryId: string): Promise<ApiResponse<Career>> => {
    const response = await api.get<ApiResponse<Career>>(`/career/${careerHistoryId}`);
    return response.data;
  },

  // Delete career record
  deleteCareer: async (careerHistoryId: string): Promise<ApiResponse<{ careerHistoryId: string; artistName: string }>> => {
    const response = await api.delete<ApiResponse<{ careerHistoryId: string; artistName: string }>>(`/career/${careerHistoryId}`);
    return response.data;
  },

  // Get achievement summary
  getAchievementSummary: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/career/achievements/summary');
    return response.data;
  }
};

export const lessonsService = {
  // Track lesson view from scenario
  trackLessonView: async (lessonTitle: string, scenarioTitle?: string, conceptTaught?: string, timeSpent?: number, difficulty?: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/lessons/view', {
      lessonTitle,
      scenarioTitle,
      conceptTaught,
      timeSpent,
      difficulty
    });
    return response.data;
  },

  // Mark concept as mastered
  masterConcept: async (conceptId: string, conceptName: string, masteryLevel = 'basic'): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/lessons/concept/master', {
      conceptId,
      conceptName,
      masteryLevel
    });
    return response.data;
  },

  // Track lesson engagement
  trackEngagement: async (lessonId: string, scenarioId?: string, engagementType = 'complete', timeSpent?: number, userRating?: number, difficulty?: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/lessons/engagement', {
      lessonId,
      scenarioId,
      engagementType,
      timeSpent,
      userRating,
      difficulty
    });
    return response.data;
  },

  // Get lesson statistics
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/lessons/stats');
    return response.data;
  },

  // Get concept mastery details
  getConcepts: async (masteryLevel?: string): Promise<ApiResponse<any>> => {
    const params = masteryLevel ? { masteryLevel } : {};
    const response = await api.get<ApiResponse<any>>('/lessons/concepts', { params });
    return response.data;
  },

  // Get lesson engagement details
  getLessonEngagement: async (lessonId: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/lessons/engagement/${encodeURIComponent(lessonId)}`);
    return response.data;
  }
};

export const analyticsService = {
  // Get comprehensive analytics overview
  getOverview: async (): Promise<ApiResponse<AnalyticsOverview>> => {
    const response = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
    return response.data;
  },

  // Get detailed learning journey
  getLearningJourney: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/analytics/learning-journey');
    return response.data;
  },

  // Get performance trends over time
  getPerformanceTrends: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/analytics/performance-trends');
    return response.data;
  },

  // Get educational effectiveness analysis
  getEducationalEffectiveness: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/analytics/educational-effectiveness');
    return response.data;
  },

  // Get progress dashboard data
  getProgressDashboard: async (timeframe = '30d'): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/analytics/progress-dashboard', {
      params: { timeframe }
    });
    return response.data;
  }
};