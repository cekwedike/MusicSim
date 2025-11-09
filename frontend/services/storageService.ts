import type { GameState, SaveSlot, LogEntry } from '../types';
import { toGameDate } from '../src/utils/dateUtils';
import { gameService } from './gameService';
import authServiceSupabase from './authService.supabase';

const AUTOSAVE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

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
 * Save game with timestamp
 */
export const saveGame = async (state: GameState, slotId: string): Promise<void> => {
  console.log('[storageService] saveGame called with slotId:', slotId);

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
 */
export const loadGame = async (slotId: string): Promise<GameState | null> => {
  try {
    // If authenticated, try loading from backend first
    const isAuthenticated = await authServiceSupabase.isAuthenticated();
    if (isAuthenticated) {
      try {
        const response = await gameService.loadGame(slotId);
        if (response.success) {
          console.log(`Loaded from backend: ${slotId}`);
          return deserializeGameState(response.data.gameState);
        }
      } catch (error) {
        console.error('Load from backend failed, trying localStorage:', error);
      }
    }
  } catch (error) {
    console.error('Backend load error:', error);
  }
  
  // Fallback to localStorage
  const saves = loadLocalSaves();
  const saveData = saves[slotId];
  
  if (!saveData) {
    console.log(`No save found: ${slotId}`);
    return null;
  }

  // Check if this is an autosave and if it's expired
  if (slotId === 'auto' && isAutosaveExpired(saveData.timestamp)) {
    console.log(`Autosave expired (${Math.round((Date.now() - saveData.timestamp) / 60000)} minutes old). Deleting...`);
    await deleteSave(slotId);
    return null;
  }

  const age = Math.round((Date.now() - saveData.timestamp) / 60000);
  console.log(`Loaded from localStorage: ${slotId} (${age} minutes old)`);
  return deserializeGameState(saveData.state);
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

              return {
                id: save.slotName,
                artistName: save.artistName,
                genre: save.genre,
                date: gd,
                currentDate: currentDate,
                stats: save.playerStats || {
                  cash: 0,
                  fame: 0,
                  health: 100,
                  stress: 0,
                  creativity: 50,
                  technique: 50
                },
                timestamp: new Date(save.lastPlayedAt).getTime(),
                careerProgress: Math.min(Math.round((save.weeksPlayed / 260) * 100), 100)
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
 */
function calculateCareerProgress(state: GameState): number {
  const maxWeeks = 260; // 5 years * 52 weeks
  const gd = toGameDate(state.currentDate, state.startDate);
  const currentWeeks = (gd.year - 1) * 52 + gd.week;
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
  formatSaveDate
};