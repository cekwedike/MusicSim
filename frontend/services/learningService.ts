import api from './api';
import type { ApiResponse } from './authService';

export interface LearningProgress {
  id: string;
  moduleId: string;
  moduleName: string;
  completed: boolean;
  quizScore?: number;
  attemptsCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface LearningStats {
  totalModulesStarted: number;
  totalModulesCompleted: number;
  completionRate: number;
  averageQuizScore: number;
  highestQuizScore: number;
  lowestQuizScore: number;
  totalQuizAttempts: number;
  averageAttemptsPerModule: number;
  lastCompletedModule?: {
    moduleId: string;
    moduleName: string;
    completedAt: string;
    score?: number;
  };
}

export interface LearningRecommendation {
  type: 'incomplete' | 'retry' | 'review';
  priority: 'high' | 'medium' | 'low';
  message: string;
  modules: Array<{
    moduleId: string;
    moduleName: string;
    attemptsCount?: number;
    timeSpent?: number;
    score?: number;
    attempts?: number;
  }>;
}

export interface ModuleStartResponse {
  progressId: string;
  moduleId: string;
  moduleName: string;
  startedAt: string;
}

export interface ModuleCompleteResponse {
  progressId: string;
  moduleId: string;
  moduleName: string;
  quizScore?: number;
  attemptsCount: number;
  completedAt: string;
  timeSpent?: number;
}

export interface QuizAttemptResponse {
  attemptsCount: number;
  bestScore: number;
  currentScore: number;
  improved: boolean;
}

export const learningService = {
  // Start a learning module
  startModule: async (moduleId: string, moduleName: string): Promise<ApiResponse<ModuleStartResponse>> => {
    const response = await api.post<ApiResponse<ModuleStartResponse>>('/learning/module/start', {
      moduleId,
      moduleName
    });
    return response.data;
  },

  // Complete a learning module with optional quiz score
  completeModule: async (moduleId: string, quizScore?: number): Promise<ApiResponse<ModuleCompleteResponse>> => {
    const response = await api.post<ApiResponse<ModuleCompleteResponse>>('/learning/module/complete', {
      moduleId,
      quizScore
    });
    return response.data;
  },

  // Record a quiz attempt without completing the module
  recordQuizAttempt: async (moduleId: string, score: number): Promise<ApiResponse<QuizAttemptResponse>> => {
    const response = await api.post<ApiResponse<QuizAttemptResponse>>('/learning/quiz/attempt', {
      moduleId,
      score
    });
    return response.data;
  },

  // Get all learning progress
  getProgress: async (completed?: boolean): Promise<ApiResponse<{ progress: LearningProgress[]; summary: any }>> => {
    const params = completed !== undefined ? { completed: completed.toString() } : {};
    const response = await api.get<ApiResponse<{ progress: LearningProgress[]; summary: any }>>('/learning/progress', { params });
    return response.data;
  },

  // Get progress for specific module
  getModuleProgress: async (moduleId: string): Promise<ApiResponse<{ exists: boolean; progress?: LearningProgress & { timeSpent?: number } }>> => {
    const response = await api.get<ApiResponse<{ exists: boolean; progress?: LearningProgress & { timeSpent?: number } }>>(`/learning/progress/${encodeURIComponent(moduleId)}`);
    return response.data;
  },

  // Get comprehensive learning statistics
  getStats: async (): Promise<ApiResponse<{ stats: LearningStats; scoreDistribution: any; learningTrend: string; recentProgress: any[] }>> => {
    const response = await api.get<ApiResponse<{ stats: LearningStats; scoreDistribution: any; learningTrend: string; recentProgress: any[] }>>('/learning/stats');
    return response.data;
  },

  // Get personalized learning recommendations
  getRecommendations: async (): Promise<ApiResponse<{ completedCount: number; recommendationCount: number; recommendations: LearningRecommendation[] }>> => {
    const response = await api.get<ApiResponse<{ completedCount: number; recommendationCount: number; recommendations: LearningRecommendation[] }>>('/learning/recommendations');
    return response.data;
  },

  // Get learning leaderboard
  getLeaderboard: async (metric = 'completion', limit = 10): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/learning/leaderboard', {
      params: { metric, limit }
    });
    return response.data;
  },

  // Reset module progress
  resetModule: async (moduleId: string): Promise<ApiResponse<{ moduleId: string }>> => {
    const response = await api.delete<ApiResponse<{ moduleId: string }>>(`/learning/progress/${encodeURIComponent(moduleId)}`);
    return response.data;
  }
};