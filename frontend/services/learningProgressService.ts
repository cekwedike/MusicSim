import api from './api';
import { logger } from '../utils/logger';

/**
 * Start a learning module - creates a progress record in the database
 */
export const startModule = async (moduleId: string, moduleName: string): Promise<void> => {
  try {
    await api.post('/learning/module/start', {
      moduleId,
      moduleName
    });
    logger.log(`Module started: ${moduleName}`);
  } catch (error: any) {
    // API errors are handled by the api interceptor (offline queue, etc.)
    logger.warn('Failed to sync module start to database:', error?.message || error);
    // Don't throw - the localStorage save should still work
  }
};

/**
 * Complete a learning module - marks it as completed in the database
 */
export const completeModule = async (moduleId: string, quizScore: number): Promise<void> => {
  try {
    await api.post('/learning/module/complete', {
      moduleId,
      quizScore
    });
    logger.log(`Module completed: ${moduleId} with score ${quizScore}%`);
  } catch (error: any) {
    // If module not started yet, try to start it first then complete
    if (error?.response?.status === 404) {
      logger.warn('Module not started yet, attempting to start and complete...');
      // This will be handled by the offline queue if offline
    }
    logger.warn('Failed to sync module completion to database:', error?.message || error);
    // Don't throw - the localStorage save should still work
  }
};
