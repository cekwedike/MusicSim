/**
 * Migration Service
 * Handles one-time migration of data from localStorage to IndexedDB
 */

import storage, { migrateFromLocalStorage, hasMigrated } from './dbStorage';
import { logger } from '../utils/logger';

let migrationPromise: Promise<void> | null = null;

/**
 * Initialize migration from localStorage to IndexedDB if needed
 * This should be called once when the app starts
 */
export async function initializeMigration(): Promise<void> {
  // Return existing promise if migration is already in progress
  if (migrationPromise) {
    return migrationPromise;
  }

  migrationPromise = (async () => {
    try {
      const alreadyMigrated = await hasMigrated();
      
      if (!alreadyMigrated) {
        logger.log('[Migration] Starting data migration from localStorage to IndexedDB...');
        await migrateFromLocalStorage();
        logger.log('[Migration] Migration completed successfully');
      } else {
        logger.log('[Migration] Data already migrated, skipping');
      }
    } catch (error) {
      logger.error('[Migration] Failed to migrate data:', error);
      // Don't throw - app should still work with localStorage fallback
    }
  })();

  return migrationPromise;
}

export default { initializeMigration };
