import type { GameState, SaveSlot, LogEntry } from '../types';
import { toGameDate } from '../src/utils/dateUtils';
import { gameService } from './gameService';
import { authService } from './authService';

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
    currentDate: data.currentDate ? new Date(data.currentDate) : new Date(2025, 9, 14),
    startDate: data.startDate ? new Date(data.startDate) : new Date(2025, 9, 14),
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
  const serializedState = serializeGameState(state);
  const saveData: SaveData = {
    state: serializedState,
    timestamp: Date.now(),
    version: '1.0.0'
  };

  try {
    // Only save to backend if authenticated (not guest mode)
    if (authService.isAuthenticated()) {
      await gameService.saveGame(slotId, state);
      console.log(`Saved to backend: ${slotId}`);
    } else {
      console.log('Guest mode - saving to localStorage only');
    }
    
    // Always save to localStorage
    const saves = loadLocalSaves();
    saves[slotId] = saveData;
    localStorage.setItem('musicsim_saves', JSON.stringify(saves));
    console.log(`Saved to localStorage: ${slotId} at ${new Date(saveData.timestamp).toLocaleTimeString()}`);
  } catch (error) {
    console.error('Save error:', error);
    
    // Fallback to localStorage only
    const saves = loadLocalSaves();
    saves[slotId] = saveData;
    localStorage.setItem('musicsim_saves', JSON.stringify(saves));
  }
};

/**
 * Load game and check expiration for autosave
 */
export const loadGame = async (slotId: string): Promise<GameState | null> => {
  try {
    // If authenticated, try loading from backend first
    if (authService.isAuthenticated()) {
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
    if (authService.isAuthenticated()) {
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
  const saveSlots: SaveSlot[] = [];
  
  try {
    // Try to get saves from backend if authenticated
    if (authService.isAuthenticated()) {
      try {
        const response = await gameService.getAllSaves();
        if (response.success && response.data) {
          // Convert backend saves to SaveSlot format
          const backendSlots = await Promise.all(
            response.data.saves.map(async (save: any) => {
              try {
                const fullSaveResponse = await gameService.loadGame(save.slotName);
                if (fullSaveResponse.success && fullSaveResponse.data) {
                  const gameState = fullSaveResponse.data.gameState;
                  const gd = toGameDate(new Date(gameState.currentDate), new Date(gameState.startDate));
                  return {
                    id: save.slotName,
                    artistName: save.artistName,
                    genre: save.genre,
                    date: gd,
                    stats: gameState.playerStats,
                    timestamp: new Date(save.lastPlayedAt).getTime(),
                    careerProgress: calculateCareerProgress(gameState)
                  };
                }
                return null;
              } catch (error) {
                console.warn(`Failed to load save ${save.slotName}:`, error);
                return null;
              }
            })
          );
          saveSlots.push(...backendSlots.filter(slot => slot !== null) as SaveSlot[]);
        }
      } catch (error) {
        console.warn('Failed to get backend saves, falling back to localStorage:', error);
      }
    }
    
    // Always check localStorage as well
    const localSaves = loadLocalSaves();
    
    for (const [slotId, saveData] of Object.entries(localSaves)) {
      // Skip if already added from backend
      if (saveSlots.find(slot => slot.id === slotId)) continue;
      
      // Check if autosave is expired
      if (slotId === 'auto' && isAutosaveExpired(saveData.timestamp)) {
        // Clean up expired autosave
        await deleteSave(slotId);
        continue;
      }
      
      const state = saveData.state;
      const gdLocal = toGameDate(new Date(state.currentDate), new Date(state.startDate));
      saveSlots.push({
        id: slotId,
        artistName: state.artistName,
        genre: state.artistGenre,
        date: gdLocal,
        stats: state.playerStats,
        timestamp: saveData.timestamp,
        careerProgress: calculateCareerProgress(state)
      });
    }
    
    // Sort by timestamp (newest first)
    return saveSlots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get save slots:', error);
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