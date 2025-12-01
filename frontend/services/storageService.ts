import type { GameState, SaveSlot, LogEntry } from '../types';
import { toGameDate } from '../src/utils/dateUtils';
import { gameService } from './gameService';
import authServiceSupabase from './authService.supabase';
import storage from './dbStorage';
import { logger } from '../utils/logger';

const AUTOSAVE_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes (only for 'auto' slot)
const MAX_SAVE_SLOTS = 5; // Maximum number of manual save slots allowed per user

/**
 * Serialize GameState for storage (convert Dates to ISO strings)
 */
export const serializeGameState = (state: GameState): any => {
  return {
    ...state,
    currentDate: state.currentDate ? state.currentDate.toISOString() : undefined,
    startDate: state.startDate ? state.startDate.toISOString() : undefined,
    lastStaffPaymentDate: state.lastStaffPaymentDate ? state.lastStaffPaymentDate.toISOString() : undefined,
    logs: state.logs ? state.logs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString()
    })) : []
  };
};

/**
 * Migrate old label names to new names
 */
const migrateLabel = (label: any): any => {
  if (!label) return label;
  
  // Migrate "Vinyl Heart Records" to "SIRYUS A.M Collective"
  if (label.name === 'Vinyl Heart Records') {
    return {
      ...label,
      name: 'SIRYUS A.M Collective'
    };
  }
  
  return label;
};

/**
 * Deserialize GameState from storage (convert ISO strings back to Dates)
 */
export const deserializeGameState = (data: any): GameState => {
  // Migrate old label names in currentLabel and currentLabelOffer
  const migratedCurrentLabel = migrateLabel(data.currentLabel);
  const migratedCurrentLabelOffer = migrateLabel(data.currentLabelOffer);
  
  // Migrate pendingContractOffer (singular) to pendingContractOffers (array)
  let migratedPendingOffers: any[] = [];
  if (data.pendingContractOffers) {
    // Already array format, just migrate label names
    migratedPendingOffers = data.pendingContractOffers.map((offer: any) => ({
      ...offer,
      label: migrateLabel(offer.label)
    }));
  } else if (data.pendingContractOffer) {
    // Old singular format, convert to array
    migratedPendingOffers = [{
      ...data.pendingContractOffer,
      label: migrateLabel(data.pendingContractOffer.label)
    }];
  }
  
  return {
    ...data,
    currentDate: data.currentDate ? new Date(data.currentDate) : new Date(),
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
    lastStaffPaymentDate: data.lastStaffPaymentDate ? new Date(data.lastStaffPaymentDate) : new Date(),
    contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : null,
    currentLabel: migratedCurrentLabel,
    currentLabelOffer: migratedCurrentLabelOffer,
    pendingContractOffers: migratedPendingOffers,
    staff: data.staff ? data.staff.map((s: any) => ({
      ...s,
      contractExpiresDate: s.contractExpiresDate ? new Date(s.contractExpiresDate) : new Date()
    })) : [],
    logs: data.logs ? data.logs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    })) : []
  };
};

interface SaveData {
  state: GameState;
  timestamp: number;
  version?: string;
}

/**
 * Check if autosave is expired
 */
const isAutosaveExpired = (timestamp: number): boolean => {
  const now = Date.now();
  const age = now - timestamp;
  return age > AUTOSAVE_EXPIRATION_MS;
};

/**
 * Check if user can create a new save slot
 */
export const canCreateNewSave = async (): Promise<{ canSave: boolean; reason?: string }> => {
  const saves = await loadLocalSaves();
  const manualSaves = Object.keys(saves).filter(key => key !== 'auto');

  if (manualSaves.length >= MAX_SAVE_SLOTS) {
    return {
      canSave: false,
      reason: `Maximum of ${MAX_SAVE_SLOTS} save slots reached. Please delete an existing save to create a new one.`
    };
  }

  return { canSave: true };
};

/**
 * Get count of manual save slots
 */
export const getManualSaveCount = async (): Promise<number> => {
  const saves = await loadLocalSaves();
  return Object.keys(saves).filter(key => key !== 'auto').length;
};

/**
 * Sync local saves to backend (for offline saves when connection is restored)
 * This ensures saves made while offline are uploaded to the cloud
 */
export const syncLocalSavesToBackend = async (): Promise<void> => {
  try {
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (!isAuthenticated) {
      logger.log('[storageService] Not authenticated, skipping local save sync');
      return;
    }

    const localSaves = await loadLocalSaves();
    const localSaveIds = Object.keys(localSaves);

    if (localSaveIds.length === 0) {
      logger.log('[storageService] No local saves to sync');
      return;
    }

    logger.log('[storageService] Syncing', localSaveIds.length, 'local saves to backend:', localSaveIds);

    // Get backend saves to check which ones need syncing
    let backendSaveIds: string[] = [];
    try {
      const response = await gameService.getAllSaves();
      if (response.success && response.data) {
        backendSaveIds = response.data.saves.map((s: any) => s.slotName);
      }
    } catch (error) {
      logger.error('[storageService] Failed to fetch backend saves for sync comparison:', error);
      // Continue anyway - we'll try to sync all local saves
    }

    let syncedCount = 0;
    let failedCount = 0;

    for (const slotId of localSaveIds) {
      const saveData = localSaves[slotId];
      const state = deserializeGameState(saveData.state);

      // Check if this save needs syncing:
      // 1. If it doesn't exist on backend, sync it
      // 2. If local version is newer than backend, sync it
      const needsSync = !backendSaveIds.includes(slotId);

      if (needsSync) {
        try {
          logger.log(`[storageService] Syncing ${slotId} to backend...`);
          await gameService.saveGame(slotId, state);
          syncedCount++;
          logger.log(`[storageService] ✅ Synced ${slotId} to backend`);
        } catch (error) {
          failedCount++;
          logger.error(`[storageService] ❌ Failed to sync ${slotId}:`, error);
        }
      } else {
        logger.log(`[storageService] ${slotId} already exists on backend, skipping`);
      }
    }

    logger.log(`[storageService] Sync complete: ${syncedCount} synced, ${failedCount} failed`);
  } catch (error) {
    logger.error('[storageService] Failed to sync local saves to backend:', error);
  }
};

/**
 * Save game with timestamp
 */
export const saveGame = async (state: GameState, slotId: string, isGuestMode: boolean = false): Promise<void> => {
  logger.log('[storageService] saveGame called with slotId:', slotId, 'isGuestMode:', isGuestMode);

  // Check slot limit for manual saves (not for autosave or overwriting existing saves)
  if (slotId !== 'auto') {
    const saves = await loadLocalSaves();
    const isNewSave = !saves[slotId];

    if (isNewSave) {
      const { canSave, reason } = await canCreateNewSave();
      if (!canSave) {
        throw new Error(reason);
      }
    }
  }

  const serializedState = serializeGameState(state);
  const saveData: SaveData = {
    state: serializedState,
    timestamp: Date.now(),
    version: '1.0.0'
  };

  let backendSaveSuccess = false;

  try {
    // Only save to backend if authenticated (not guest mode)
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    
    // CRITICAL: Guest saves should NEVER go to backend
    if (isAuthenticated && !isGuestMode) {
      logger.log('[storageService] Authenticated user, saving to backend...');
      try {
        await gameService.saveGame(slotId, state);
        logger.log(`[storageService] ✅ Backend save successful: ${slotId}`);
        backendSaveSuccess = true;
      } catch (backendError) {
        logger.error(`[storageService] ❌ Backend save failed for ${slotId}:`, backendError);
        // Don't throw here - we'll still try IndexedDB
      }
    } else if (isGuestMode) {
      logger.log('[storageService] Guest mode - saving to IndexedDB only (no backend sync)');
    } else {
      logger.log('[storageService] Not authenticated - saving to IndexedDB only');
    }

    // Always save to IndexedDB as backup
    const saves = await loadLocalSaves();
    logger.log('[storageService] Current saves before adding new one:', Object.keys(saves));

    saves[slotId] = saveData;
    logger.log('[storageService] Saves after adding new one:', Object.keys(saves));

    try {
      // Ensure we can stringify before writing — helps surface circular/reference errors
      const payload = JSON.stringify(saves);
      await storage.setItem('musicsim_saves', payload);
      logger.log(`[storageService] ✅ IndexedDB save successful: ${slotId} at ${new Date(saveData.timestamp).toLocaleTimeString()}`);

      // Verify the save was written
      const verification = await storage.getItem('musicsim_saves');
      if (verification) {
        const verified = JSON.parse(verification);
        logger.log('[storageService] Verification - saved slots:', Object.keys(verified));
        
        // Report save status
        if (backendSaveSuccess) {
          logger.log(`[storageService] ✅ Complete save success for ${slotId}: backend + IndexedDB`);
        } else {
          logger.log(`[storageService] ⚠️ Partial save success for ${slotId}: IndexedDB only (backend failed)`);
        }
      } else {
        throw new Error('Save verification failed - IndexedDB empty after write');
      }
    } catch (storageError) {
      logger.error('[storageService] ❌ IndexedDB save failed:', storageError);
      
      // If both backend and IndexedDB fail, this is critical
      if (!backendSaveSuccess) {
        throw new Error(`Save failed completely: ${storageError.message}`);
      } else {
        logger.warn('[storageService] Backend save succeeded but IndexedDB failed - continuing...');
      }
    }
  } catch (error) {
    logger.error('[storageService] Save error:', error);

    // Fallback to IndexedDB only
    const saves = await loadLocalSaves();
    saves[slotId] = saveData;
    try {
      const payload = JSON.stringify(saves);
      await storage.setItem('musicsim_saves', payload);
      logger.log(`[storageService] Saved to IndexedDB (fallback): ${slotId} at ${new Date(saveData.timestamp).toLocaleTimeString()}`);
    } catch (err) {
      logger.error('[storageService] Fallback: failed to write saves to IndexedDB (stringify error):', err);
      // Re-throw so callers can surface the error if needed
      throw err;
    }
  }
};

/**
 * Load game and check expiration for autosave
 * Optimized to try localStorage first for better performance
 */
export const loadGame = async (slotId: string): Promise<GameState | null> => {
  logger.log(`[loadGame] Starting load for slot: ${slotId}`);
  
  // OPTIMIZATION: Try IndexedDB first for faster loading
  // This prevents the blank screen issue by loading local data immediately
  const saves = await loadLocalSaves();
  const localSaveData = saves[slotId];
  
  // Check if we have local data and it's valid
  if (localSaveData) {
    // IMPORTANT: Only autosave ('auto' slot) expires. Manual saves NEVER expire!
    if (slotId === 'auto' && isAutosaveExpired(localSaveData.timestamp)) {
      logger.log(`[loadGame] Local autosave expired (${Math.round((Date.now() - localSaveData.timestamp) / 60000)} minutes old). Deleting...`);
      await deleteSave(slotId);
      return null;
    }
    
    const localAge = Math.round((Date.now() - localSaveData.timestamp) / 60000);
    logger.log(`[loadGame] Found local save: ${slotId} (${localAge} minutes old)`);
    
    // Return local data immediately for better UX
    const localGameState = deserializeGameState(localSaveData.state);
    
    // ASYNC: Try to sync with backend in background (don't block UI)
    if (slotId !== 'auto') { // Skip backend sync for autosave to keep it fast
      syncWithBackendAsync(slotId, localSaveData);
    }
    
    return localGameState;
  }
  
  // If no local data, try backend as fallback
  try {
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (isAuthenticated) {
      logger.log(`[loadGame] No local save found, trying backend for: ${slotId}`);
      const response = await gameService.loadGame(slotId);
      if (response.success) {
        logger.log(`[loadGame] Loaded from backend: ${slotId}`);
        const gameState = deserializeGameState(response.data.gameState);
        
        // Cache to IndexedDB for future fast access
        const saveData: SaveData = {
          state: response.data.gameState,
          timestamp: new Date(response.data.lastPlayedAt).getTime(),
          version: '1.0'
        };
        saves[slotId] = saveData;
        await storage.setItem('musicsim_saves', JSON.stringify(saves));
        logger.log(`[loadGame] Cached backend save to IndexedDB: ${slotId}`);
        
        return gameState;
      }
    }
  } catch (error) {
    logger.error(`[loadGame] Backend load failed for ${slotId}:`, error);
  }
  
  logger.log(`[loadGame] No save found: ${slotId}`);
  return null;
};

/**
 * Background sync with backend (non-blocking)
 */
const syncWithBackendAsync = async (slotId: string, localSaveData: SaveData) => {
  try {
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (!isAuthenticated) return;
    
    const response = await gameService.loadGame(slotId);
    if (response.success) {
      const backendTimestamp = new Date(response.data.lastPlayedAt).getTime();
      const localTimestamp = localSaveData.timestamp;
      
      // If backend has newer data, update local storage
      if (backendTimestamp > localTimestamp) {
        logger.log(`[syncWithBackendAsync] Backend has newer save for ${slotId}, updating local cache`);
        const saves = await loadLocalSaves();
        saves[slotId] = {
          state: response.data.gameState,
          timestamp: backendTimestamp,
          version: '1.0'
        };
        await storage.setItem('musicsim_saves', JSON.stringify(saves));
      }
    }
  } catch (error) {
    logger.log(`[syncWithBackendAsync] Background sync failed for ${slotId}:`, error);
    // Fail silently - this is just background optimization
  }
};

/**
 * Delete game from both backend and localStorage
 */
export const deleteSave = async (slotId: string): Promise<void> => {
  logger.log(`[storageService] deleteSave called for: ${slotId}`);
  
  try {
    // Delete from backend if authenticated
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (isAuthenticated) {
      logger.log(`[storageService] User authenticated, deleting from backend...`);
      
      try {
        // Use the direct slotName-based delete (more reliable, no need to fetch all saves first)
        const deleteResponse = await gameService.deleteSaveBySlotName(slotId);
        logger.log(`[storageService] Backend delete response:`, deleteResponse);
        
        if (deleteResponse.success) {
          logger.log(`[storageService] ✅ Deleted from backend: ${slotId}`);
        } else {
          logger.error(`[storageService] ❌ Backend delete failed:`, deleteResponse);
        }
      } catch (error: any) {
        // If save not found in backend (404), that's okay - it might have been deleted already
        if (error.response?.status === 404) {
          logger.log(`[storageService] ℹ️ Save ${slotId} not found in backend (might be already deleted)`);
        } else {
          logger.error('[storageService] ❌ Error deleting from backend:', error);
        }
      }
    } else {
      logger.log(`[storageService] Not authenticated, skipping backend delete`);
    }
  } catch (error) {
    logger.error('[storageService] ❌ Error in deleteSave:', error);
    // Don't throw - still delete from IndexedDB
  }

  // Delete from IndexedDB
  const saves = await loadLocalSaves();
  delete saves[slotId];
  await storage.setItem('musicsim_saves', JSON.stringify(saves));
  logger.log(`[storageService] ✅ Deleted from IndexedDB: ${slotId}`);
};

/**
 * Get all saves
 */
export const getAllSaves = async (): Promise<{ [key: string]: SaveData }> => {
  return await loadLocalSaves();
};

/**
 * Clean up expired autosaves
 */
export const cleanupExpiredAutosaves = async (): Promise<void> => {
  const saves = await loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (autoSave && isAutosaveExpired(autoSave.timestamp)) {
    logger.log('Cleaning up expired autosave...');
    await deleteSave('auto');
  }
};

/**
 * Check if autosave exists and is valid
 */
export const hasValidAutosave = async (): Promise<boolean> => {
  const saves = await loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (!autoSave) return false;
  
  return !isAutosaveExpired(autoSave.timestamp);
};

/**
 * Get autosave age in minutes
 */
export const getAutosaveAge = async (): Promise<number | null> => {
  const saves = await loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (!autoSave) return null;
  
  return Math.round((Date.now() - autoSave.timestamp) / 60000);
};

/**
 * Helper: Load saves from IndexedDB
 */
const loadLocalSaves = async (): Promise<{ [key: string]: SaveData }> => {
  const saved = await storage.getItem('musicsim_saves');
  if (!saved) return {};
  
  try {
    return JSON.parse(saved);
  } catch (error) {
    logger.error('Error parsing saves:', error);
    return {};
  }
};

/**
 * Gets all saved game slots (for SaveLoadModal compatibility)
 */
/**
 * Clean up local saves that don't exist in backend (remove orphaned local saves)
 * Backend is the source of truth for authenticated users
 */
async function cleanOrphanedLocalSaves(backendSaveIds: string[]): Promise<void> {
  const localSaves = await loadLocalSaves();
  const localSaveIds = Object.keys(localSaves);
  
  // Find saves that exist locally but not in backend
  const orphanedSaves = localSaveIds.filter(id => 
    id !== 'auto' && !backendSaveIds.includes(id)
  );
  
  if (orphanedSaves.length > 0) {
    logger.log('[storageService] Found', orphanedSaves.length, 'orphaned local saves (deleted on another device):', orphanedSaves);
    
    for (const slotId of orphanedSaves) {
      try {
        logger.log(`[storageService] Removing orphaned local save: ${slotId}`);
        delete localSaves[slotId];
      } catch (error) {
        logger.error(`[storageService] Failed to remove orphaned save ${slotId}:`, error);
      }
    }
    
    // Save cleaned up saves back to IndexedDB
    try {
      await storage.setItem('musicsim_saves', JSON.stringify(localSaves));
      logger.log('[storageService] ✅ Cleaned up', orphanedSaves.length, 'orphaned local saves');
    } catch (error) {
      logger.error('[storageService] Failed to save cleaned IndexedDB:', error);
    }
  }
}

export async function getAllSaveSlots(): Promise<SaveSlot[]> {
  logger.log('[storageService] getAllSaveSlots called');
  const saveSlots: SaveSlot[] = [];

  try {
    // Try to get saves from backend if authenticated (with 5s timeout - faster!)
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    logger.log('[storageService] Authentication status:', isAuthenticated);
    if (isAuthenticated) {
      logger.log('[storageService] User authenticated, loading from backend...');
      try {
        // Race against a 5 second timeout (reduced from 10s)
        const response = await Promise.race([
          gameService.getAllSaves(),
          new Promise<any>((_, reject) =>
            setTimeout(() => reject(new Error('Backend save load timeout')), 5000)
          )
        ]);

        if (response.success && response.data) {
          console.log('[storageService] Backend returned', response.data.saves.length, 'saves');
          
          // Clean up any orphaned local saves (deleted on another device) - non-blocking
          const backendSaveIds = response.data.saves.map((s: any) => s.slotName);
          cleanOrphanedLocalSaves(backendSaveIds).catch(err => 
            console.error('[storageService] Failed to clean orphaned saves:', err)
          );

          // OPTIMIZATION: Use metadata from getAllSaves (now includes stats and date)
          // No need to load full gameState for each save - much faster!
          const backendSlots = response.data.saves.map((save: any) => {
            try {
              // Backend now returns metadata including playerStats and currentDate
              const currentDate = save.currentDate ? new Date(save.currentDate) : new Date();
              const startDate = save.startDate ? new Date(save.startDate) : new Date();
              const gd = toGameDate(currentDate, startDate);

              console.log(`[storageService] Processing backend save ${save.slotName}:`, {
                weeksPlayed: save.weeksPlayed,
                currentDate: save.currentDate,
                startDate: save.startDate,
                gameDate: gd
              });

              return {
                id: save.slotName,
                slotName: save.slotName,
                artistName: save.artistName, // Use current artistName from save
                genre: save.genre,
                date: gd,
                currentDate: currentDate,
                stats: save.playerStats || {
                  cash: 0,
                  fame: 0,
                  wellBeing: 50,
                  careerProgress: 0,
                  hype: 0
                },
                timestamp: new Date(save.lastPlayedAt).getTime(),
                careerProgress: save.playerStats?.careerProgress || 0 // Use actual career progress from playerStats
              };
            } catch (error) {
              console.warn(`[storageService] Failed to process save ${save.slotName}:`, error);
              return null;
            }
          }).filter((slot: any) => slot !== null);

          saveSlots.push(...backendSlots as SaveSlot[]);
          console.log('[storageService] Added', saveSlots.length, 'backend saves (with metadata)');
        }
      } catch (error) {
        console.warn('[storageService] Backend save load timed out, using localStorage:', error);
      }
    } else {
      console.log('[storageService] Guest mode - loading from IndexedDB only');
    }

    // Always check IndexedDB as well
    const localSaves = await loadLocalSaves();
    console.log('[storageService] IndexedDB has', Object.keys(localSaves).length, 'saves:', Object.keys(localSaves));

    for (const [slotId, saveData] of Object.entries(localSaves)) {
      // Skip if already added from backend
      if (saveSlots.find(slot => slot.id === slotId)) {
        console.log('[storageService] Skipping', slotId, '- already loaded from backend');
        continue;
      }

      // Check if autosave is expired (only for LOCAL autosave, not backend ones)
      if (slotId === 'auto' && isAutosaveExpired(saveData.timestamp)) {
        console.log('[storageService] Local autosave expired, cleaning up');
        // Clean up expired LOCAL autosave
        await deleteSave(slotId);
        continue;
      }

      console.log('[storageService] Processing IndexedDB save:', slotId);
      // Deserialize the state to convert ISO strings back to Date objects
      const state = deserializeGameState(saveData.state);
      const gdLocal = toGameDate(state.currentDate, state.startDate);
      saveSlots.push({
        id: slotId,
        slotName: slotId,
        artistName: state.artistName, // Use current artistName from state
        genre: state.artistGenre,
        date: gdLocal,
        currentDate: state.currentDate,
        stats: state.playerStats,
        timestamp: saveData.timestamp,
        careerProgress: state.playerStats.careerProgress // Use actual career progress stat, not time-based calculation
      });
    }

    console.log('[storageService] Total saves to return:', saveSlots.length);
    console.log('[storageService] Save IDs:', saveSlots.map(s => s.id));

    // Sort by timestamp (newest first)
    return saveSlots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('[storageService] Failed to get save slots:', error);
    return [];
  }
}

/**
 * Get save slots for start screen with smart filtering:
 * Shows only the NEWER of autosave/quicksave (not both)
 * This gives users 1 system save slot + 4 manual save slots
 */
export async function getStartScreenSaves(): Promise<SaveSlot[]> {
  const allSlots = await getAllSaveSlots();
  
  const autoSave = allSlots.find(s => s.id === 'auto');
  const quickSave = allSlots.find(s => s.id === 'quicksave');
  
  if (autoSave && quickSave) {
    // Both exist - keep only the newer one
    if (autoSave.timestamp > quickSave.timestamp) {
      console.log('[getStartScreenSaves] Showing autosave (newer than quicksave)');
      return allSlots.filter(s => s.id !== 'quicksave');
    } else {
      console.log('[getStartScreenSaves] Showing quicksave (newer than autosave)');
      return allSlots.filter(s => s.id !== 'auto');
    }
  }
  
  return allSlots;
}

/**
 * Auto-saves the current game state
 */
export const autoSave = async (state: GameState, isGuestMode: boolean = false): Promise<void> => {
  try {
    await saveGame(state, 'auto', isGuestMode);
  } catch (error) {
    console.warn('Auto-save failed:', error);
  }
};

/**
 * Checks if storage is available (IndexedDB or localStorage fallback)
 */
export function isStorageAvailable(): boolean {
  return storage.isAvailable();
}

/**
 * Calculates time-based progress as a percentage (how far through the 5-year simulation)
 * Game uses 48 weeks/year (12 months × 4 weeks/month)
 * NOTE: This is different from career progress stat - this shows time elapsed
 */
function calculateTimeProgress(state: GameState): number {
  const maxWeeks = 240; // 5 years * 48 weeks/year
  const gd = toGameDate(state.currentDate, state.startDate);
  // Calculate total weeks: (years - 1) * 48 + (months - 1) * 4 + week
  const currentWeeks = (gd.year - 1) * 48 + (gd.month - 1) * 4 + gd.week;
  return Math.min(Math.round((currentWeeks / maxWeeks) * 100), 100);
}

/**
 * Formats timestamp to human-readable date
 */
export function formatSaveDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export default {
  saveGame,
  loadGame,
  deleteSave,
  getAllSaves,
  cleanupExpiredAutosaves,
  hasValidAutosave,
  getAutosaveAge,
  getAllSaveSlots,
  getStartScreenSaves,
  autoSave,
  isStorageAvailable,
  formatSaveDate,
  canCreateNewSave,
  getManualSaveCount,
  getGuestData,
  clearGuestData
};

/**
 * Retrieve all guest data (saves and statistics) from IndexedDB
 */
export async function getGuestData(): Promise<{ saves: any[]; statistics: any } | null> {
  try {
    if (!isStorageAvailable()) {
      return null;
    }

    // Get all saves from IndexedDB
    const localSaves = await loadLocalSaves();
    const saves = Object.entries(localSaves)
      .filter(([slotId]) => slotId !== 'auto') // Exclude autosave
      .map(([slotId, saveData]) => ({
        slotId,
        name: saveData.state?.artistName || 'Unnamed Save',
        state: saveData.state,
        timestamp: saveData.timestamp
      }));

    // Get statistics from IndexedDB
    const statisticsStr = await storage.getItem('musicsim_statistics');
    const statistics = statisticsStr ? JSON.parse(statisticsStr) : null;

    if (saves.length === 0 && !statistics) {
      return null;
    }

    return {
      saves,
      statistics
    };
  } catch (error) {
    console.error('[storageService] Error getting guest data:', error);
    return null;
  }
}

/**
 * Clear guest data from IndexedDB
 * @param clearSaves - Whether to clear save data
 * @param clearStatistics - Whether to clear statistics
 */
export async function clearGuestData(clearSaves: boolean = true, clearStatistics: boolean = false): Promise<void> {
  try {
    if (!isStorageAvailable()) {
      return;
    }

    if (clearSaves) {
      await storage.removeItem('musicsim_saves');
      console.log('[storageService] Guest saves cleared from IndexedDB');
    }

    if (clearStatistics) {
      await storage.removeItem('musicsim_statistics');
      console.log('[storageService] Guest statistics cleared from IndexedDB');
    }
  } catch (error) {
    console.error('[storageService] Error clearing guest data:', error);
  }
}