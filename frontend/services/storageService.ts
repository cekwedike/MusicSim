import type { GameState, SaveSlot, LogEntry } from '../types';
import { toGameDate } from '../src/utils/dateUtils';
import { gameService } from './gameService';
import authServiceSupabase from './authService.supabase';

const AUTOSAVE_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes (only for 'auto' slot)
const MAX_SAVE_SLOTS = 5; // Maximum number of manual save slots allowed per user

/**
 * Serialize GameState for storage (convert Dates to ISO strings)
 */
const serializeGameState = (state: GameState): any => {
  return {
    ...state,
    currentDate: state.currentDate ? state.currentDate.toISOString() : undefined,
    startDate: state.startDate ? state.startDate.toISOString() : undefined,
    logs: state.logs ? state.logs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString()
    })) : []
  };
};

/**
 * Deserialize GameState from storage (convert ISO strings back to Dates)
 */
const deserializeGameState = (data: any): GameState => {
  return {
    ...data,
    currentDate: data.currentDate ? new Date(data.currentDate) : new Date(),
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
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
  const saves = loadLocalSaves();
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
export const getManualSaveCount = (): number => {
  const saves = loadLocalSaves();
  return Object.keys(saves).filter(key => key !== 'auto').length;
};

/**
 * Save game with timestamp
 */
export const saveGame = async (state: GameState, slotId: string): Promise<void> => {
  console.log('[storageService] saveGame called with slotId:', slotId);

  // Check slot limit for manual saves (not for autosave or overwriting existing saves)
  if (slotId !== 'auto') {
    const saves = loadLocalSaves();
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

  try {
    // Only save to backend if authenticated (not guest mode)
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (isAuthenticated) {
      await gameService.saveGame(slotId, state);
      console.log(`[storageService] Saved to backend: ${slotId}`);
    } else {
      console.log('[storageService] Guest mode - saving to localStorage only');
    }

    // Always save to localStorage
    const saves = loadLocalSaves();
    console.log('[storageService] Current saves before adding new one:', Object.keys(saves));

    saves[slotId] = saveData;
    console.log('[storageService] Saves after adding new one:', Object.keys(saves));

    try {
      // Ensure we can stringify before writing — helps surface circular/reference errors
      const payload = JSON.stringify(saves);
  localStorage.setItem('musicsim_saves', payload);
  console.log(`[storageService] Saved to localStorage: ${slotId} at ${new Date(saveData.timestamp).toLocaleTimeString()}`);

      // Verify the save was written
      const verification = localStorage.getItem('musicsim_saves');
      if (verification) {
        const verified = JSON.parse(verification);
        console.log('[storageService] Verification - saved slots:', Object.keys(verified));
        if (verified[slotId]) {
          console.log('[storageService] Verification successful - save exists in localStorage');
        } else {
          console.error('[storageService] Verification failed - save not found in localStorage after writing!');
        }
      }
    } catch (err) {
      console.error('[storageService] Failed to write saves to localStorage (stringify error):', err);
      throw err;
    }
  } catch (error) {
    console.error('[storageService] Save error:', error);

    // Fallback to localStorage only
    const saves = loadLocalSaves();
    saves[slotId] = saveData;
    try {
      const payload = JSON.stringify(saves);
  localStorage.setItem('musicsim_saves', payload);
  console.log(`[storageService] Saved to localStorage (fallback): ${slotId} at ${new Date(saveData.timestamp).toLocaleTimeString()}`);
    } catch (err) {
      console.error('[storageService] Fallback: failed to write saves to localStorage (stringify error):', err);
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
  console.log(`[loadGame] Starting load for slot: ${slotId}`);
  
  // OPTIMIZATION: Try localStorage first for faster loading
  // This prevents the blank screen issue by loading local data immediately
  const saves = loadLocalSaves();
  const localSaveData = saves[slotId];
  
  // Check if we have local data and it's valid
  if (localSaveData) {
    // IMPORTANT: Only autosave ('auto' slot) expires. Manual saves NEVER expire!
    if (slotId === 'auto' && isAutosaveExpired(localSaveData.timestamp)) {
      console.log(`[loadGame] Local autosave expired (${Math.round((Date.now() - localSaveData.timestamp) / 60000)} minutes old). Deleting...`);
      await deleteSave(slotId);
      return null;
    }
    
    const localAge = Math.round((Date.now() - localSaveData.timestamp) / 60000);
    console.log(`[loadGame] Found local save: ${slotId} (${localAge} minutes old)`);
    
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
      console.log(`[loadGame] No local save found, trying backend for: ${slotId}`);
      const response = await gameService.loadGame(slotId);
      if (response.success) {
        console.log(`[loadGame] Loaded from backend: ${slotId}`);
        const gameState = deserializeGameState(response.data.gameState);
        
        // Cache to localStorage for future fast access
        const saveData: SaveData = {
          state: response.data.gameState,
          timestamp: new Date(response.data.lastPlayedAt).getTime(),
          version: '1.0'
        };
        saves[slotId] = saveData;
        localStorage.setItem('musicsim_saves', JSON.stringify(saves));
        console.log(`[loadGame] Cached backend save to localStorage: ${slotId}`);
        
        return gameState;
      }
    }
  } catch (error) {
    console.error(`[loadGame] Backend load failed for ${slotId}:`, error);
  }
  
  console.log(`[loadGame] No save found: ${slotId}`);
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
        console.log(`[syncWithBackendAsync] Backend has newer save for ${slotId}, updating local cache`);
        const saves = loadLocalSaves();
        saves[slotId] = {
          state: response.data.gameState,
          timestamp: backendTimestamp,
          version: '1.0'
        };
        localStorage.setItem('musicsim_saves', JSON.stringify(saves));
      }
    }
  } catch (error) {
    console.log(`[syncWithBackendAsync] Background sync failed for ${slotId}:`, error);
    // Fail silently - this is just background optimization
  }
};

/**
 * Delete game from both backend and localStorage
 */
export const deleteSave = async (slotId: string): Promise<void> => {
  try {
    // Delete from backend if authenticated
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (isAuthenticated) {
      const saves = await gameService.getAllSaves();
      if (saves.success) {
        const save = saves.data.saves.find((s: any) => s.slotName === slotId);
        if (save) {
          await gameService.deleteSave(save.id);
          console.log(`Deleted from backend: ${slotId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting from backend:', error);
  }

  // Delete from localStorage
  const saves = loadLocalSaves();
  delete saves[slotId];
  localStorage.setItem('musicsim_saves', JSON.stringify(saves));
  console.log(`Deleted from localStorage: ${slotId}`);
};

/**
 * Get all saves
 */
export const getAllSaves = (): { [key: string]: SaveData } => {
  return loadLocalSaves();
};

/**
 * Clean up expired autosaves
 */
export const cleanupExpiredAutosaves = async (): Promise<void> => {
  const saves = loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (autoSave && isAutosaveExpired(autoSave.timestamp)) {
    console.log('Cleaning up expired autosave...');
    await deleteSave('auto');
  }
};

/**
 * Check if autosave exists and is valid
 */
export const hasValidAutosave = (): boolean => {
  const saves = loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (!autoSave) return false;
  
  return !isAutosaveExpired(autoSave.timestamp);
};

/**
 * Get autosave age in minutes
 */
export const getAutosaveAge = (): number | null => {
  const saves = loadLocalSaves();
  const autoSave = saves['auto'];
  
  if (!autoSave) return null;
  
  return Math.round((Date.now() - autoSave.timestamp) / 60000);
};

/**
 * Helper: Load saves from localStorage
 */
const loadLocalSaves = (): { [key: string]: SaveData } => {
  const saved = localStorage.getItem('musicsim_saves');
  if (!saved) return {};
  
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error parsing saves:', error);
    return {};
  }
};

/**
 * Gets all saved game slots (for SaveLoadModal compatibility)
 */
export async function getAllSaveSlots(): Promise<SaveSlot[]> {
  console.log('[storageService] getAllSaveSlots called');
  const saveSlots: SaveSlot[] = [];

  try {
    // Try to get saves from backend if authenticated (with 5s timeout - faster!)
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    console.log('[storageService] Authentication status:', isAuthenticated);
    if (isAuthenticated) {
      console.log('[storageService] User authenticated, loading from backend...');
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
                artistName: save.artistName,
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
                careerProgress: Math.min(Math.round((save.weeksPlayed / 240) * 100), 100) // 240 weeks = 5 years * 48 weeks/year
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
      console.log('[storageService] Guest mode - loading from localStorage only');
    }

    // Always check localStorage as well
    const localSaves = loadLocalSaves();
    console.log('[storageService] LocalStorage has', Object.keys(localSaves).length, 'saves:', Object.keys(localSaves));

    for (const [slotId, saveData] of Object.entries(localSaves)) {
      // Skip if already added from backend
      if (saveSlots.find(slot => slot.id === slotId)) {
        console.log('[storageService] Skipping', slotId, '- already loaded from backend');
        continue;
      }

      // Check if autosave is expired
      if (slotId === 'auto' && isAutosaveExpired(saveData.timestamp)) {
        console.log('[storageService] Autosave expired, cleaning up');
        // Clean up expired autosave
        await deleteSave(slotId);
        continue;
      }

      console.log('[storageService] Processing localStorage save:', slotId);
      // Deserialize the state to convert ISO strings back to Date objects
      const state = deserializeGameState(saveData.state);
      const gdLocal = toGameDate(state.currentDate, state.startDate);
      saveSlots.push({
        id: slotId,
        artistName: state.artistName,
        genre: state.artistGenre,
        date: gdLocal,
        currentDate: state.currentDate,
        stats: state.playerStats,
        timestamp: saveData.timestamp,
        careerProgress: calculateCareerProgress(state)
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
 * Auto-saves the current game state
 */
export const autoSave = async (state: GameState): Promise<void> => {
  try {
    await saveGame(state, 'auto');
  } catch (error) {
    console.warn('Auto-save failed:', error);
  }
};

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculates career progress as a percentage
 * Game uses 48 weeks/year (12 months × 4 weeks/month)
 */
function calculateCareerProgress(state: GameState): number {
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
  autoSave,
  isStorageAvailable,
  formatSaveDate,
  canCreateNewSave,
  getManualSaveCount
};