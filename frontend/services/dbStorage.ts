/**
 * IndexedDB Storage Wrapper
 * Provides a localStorage-like API using IndexedDB for better storage capacity and performance
 */

import { logger } from '../utils/logger';

const DB_NAME = 'MusicSimDB';
const DB_VERSION = 1;
const STORE_NAME = 'keyValueStore';

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize and open the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      logger.error('[dbStorage] Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
        logger.log('[dbStorage] Created object store:', STORE_NAME);
      }
    };
  });

  return dbPromise;
}

/**
 * Get an item from IndexedDB
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };

      request.onerror = () => {
        logger.error('[dbStorage] Error getting item:', key, request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    logger.error('[dbStorage] Failed to get item:', key, error);
    return null;
  }
}

/**
 * Set an item in IndexedDB
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        logger.error('[dbStorage] Error setting item:', key, request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    logger.error('[dbStorage] Failed to set item:', key, error);
    throw error;
  }
}

/**
 * Remove an item from IndexedDB
 */
export async function removeItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        logger.error('[dbStorage] Error removing item:', key, request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    logger.error('[dbStorage] Failed to remove item:', key, error);
    throw error;
  }
}

/**
 * Clear all items from IndexedDB
 */
export async function clear(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        logger.error('[dbStorage] Error clearing store:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    logger.error('[dbStorage] Failed to clear store:', error);
    throw error;
  }
}

/**
 * Get all keys from IndexedDB
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve(request.result as string[]);
      };

      request.onerror = () => {
        logger.error('[dbStorage] Error getting all keys:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    logger.error('[dbStorage] Failed to get all keys:', error);
    return [];
  }
}

/**
 * Check if IndexedDB is available
 */
export function isAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Migrate data from localStorage to IndexedDB
 */
export async function migrateFromLocalStorage(): Promise<void> {
  if (!isAvailable()) {
    logger.warn('[dbStorage] IndexedDB not available, skipping migration');
    return;
  }

  try {
    const keysToMigrate = [
      'musicsim_saves',
      'musicsim_statistics',
      'musicsim_careers',
      'musicsim_theme',
      'musicsim_audio',
      'musicsim_tutorial_seen',
      'audioPromptShown',
      'guestPlayerName'
    ];

    let migratedCount = 0;

    for (const key of keysToMigrate) {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          await setItem(key, value);
          migratedCount++;
        }
      } catch (error) {
        logger.warn(`[dbStorage] Failed to migrate key: ${key}`, error);
      }
    }

    if (migratedCount > 0) {
      logger.log(`[dbStorage] Successfully migrated ${migratedCount} items from localStorage to IndexedDB`);
      
      // Mark migration as complete
      await setItem('_migration_complete', 'true');
      
      // Optional: Clean up localStorage after successful migration
      // Uncomment if you want to remove data from localStorage after migration
      // keysToMigrate.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    logger.error('[dbStorage] Migration failed:', error);
    throw error;
  }
}

/**
 * Check if migration has been completed
 */
export async function hasMigrated(): Promise<boolean> {
  try {
    const migrated = await getItem('_migration_complete');
    return migrated === 'true';
  } catch {
    return false;
  }
}

/**
 * Fallback to localStorage if IndexedDB fails
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (!isAvailable()) {
      return localStorage.getItem(key);
    }
    try {
      return getItem(key);
    } catch (error) {
      logger.warn('[dbStorage] Falling back to localStorage for getItem');
      return localStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isAvailable()) {
      localStorage.setItem(key, value);
      return;
    }
    try {
      return setItem(key, value);
    } catch (error) {
      logger.warn('[dbStorage] Falling back to localStorage for setItem');
      localStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (!isAvailable()) {
      localStorage.removeItem(key);
      return;
    }
    try {
      await removeItem(key);
    } catch (error) {
      logger.warn('[dbStorage] Falling back to localStorage for removeItem');
      localStorage.removeItem(key);
    }
  },

  async clear(): Promise<void> {
    if (!isAvailable()) {
      localStorage.clear();
      return;
    }
    try {
      await clear();
    } catch (error) {
      logger.warn('[dbStorage] Falling back to localStorage for clear');
      localStorage.clear();
    }
  },

  isAvailable
};

export default storage;
