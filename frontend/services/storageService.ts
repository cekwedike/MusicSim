import type { GameState, SaveSlot } from '../types';
import { gameService } from './gameService';
import { authService } from './authService';

const STORAGE_PREFIX = 'musicsim_save_';
const AUTO_SAVE_KEY = 'musicsim_save_auto';

/**
 * Checks if user is authenticated
 */
function isAuthenticated(): boolean {
  return authService.isAuthenticated();
}

/**
 * Saves a game state to backend if authenticated, otherwise localStorage
 */
export async function saveGame(state: GameState, slotId: string): Promise<void> {
  try {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      state
    };
    
    // Try to save to backend if authenticated
    if (isAuthenticated()) {
      try {
        const response = await gameService.saveGame(slotId, state);

        if (response.success) {
          // Also save to localStorage as backup
          const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${STORAGE_PREFIX}${slotId}`;
          localStorage.setItem(key, JSON.stringify(saveData));
          return;
        }
      } catch (error) {
        console.warn('Backend save failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${STORAGE_PREFIX}${slotId}`;
    localStorage.setItem(key, JSON.stringify(saveData));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some save files.');
    }
    throw new Error('Failed to save game. Please try again.');
  }
}

/**
 * Loads a game state from backend if authenticated, otherwise localStorage
 */
export async function loadGame(slotId: string): Promise<GameState | null> {
  try {
    // Try to load from backend if authenticated
    if (isAuthenticated()) {
      try {
        const response = await gameService.loadGame(slotId);
        if (response.success && response.data) {
          return response.data.gameState;
        }
      } catch (error) {
        console.warn('Backend load failed, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${STORAGE_PREFIX}${slotId}`;
    const saveData = localStorage.getItem(key);
    
    if (!saveData) {
      return null;
    }
    
    const parsed = JSON.parse(saveData);
    
    // Validate save data structure
    if (!parsed.state || !parsed.timestamp) {
      console.warn('Invalid save data format');
      return null;
    }
    
    return parsed.state;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Gets all saved game slots
 */
export function getAllSaveSlots(): SaveSlot[] {
  const saveSlots: SaveSlot[] = [];
  
  try {
    // Check auto-save
    const autoSave = localStorage.getItem(AUTO_SAVE_KEY);
    if (autoSave) {
      const parsed = JSON.parse(autoSave);
      if (parsed.state && parsed.timestamp) {
        const state = parsed.state as GameState;
        saveSlots.push({
          id: 'auto',
          artistName: state.artistName,
          genre: state.artistGenre,
          date: state.date,
          stats: state.playerStats,
          timestamp: parsed.timestamp,
          careerProgress: calculateCareerProgress(state)
        });
      }
    }
    
    // Check manual saves
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const saveData = localStorage.getItem(key);
          if (saveData) {
            const parsed = JSON.parse(saveData);
            if (parsed.state && parsed.timestamp) {
              const state = parsed.state as GameState;
              const slotId = key.replace(STORAGE_PREFIX, '');
              saveSlots.push({
                id: slotId,
                artistName: state.artistName,
                genre: state.artistGenre,
                date: state.date,
                stats: state.playerStats,
                timestamp: parsed.timestamp,
                careerProgress: calculateCareerProgress(state)
              });
            }
          }
        } catch (error) {
          console.warn(`Corrupted save data in slot ${key}:`, error);
        }
      }
    }
    
    // Sort by timestamp (newest first)
    return saveSlots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get save slots:', error);
    return [];
  }
}

/**
 * Deletes a save slot
 */
export function deleteSave(slotId: string): void {
  try {
    const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${STORAGE_PREFIX}${slotId}`;
    localStorage.removeItem(key);
  } catch (error) {
    throw new Error('Failed to delete save. Please try again.');
  }
}

/**
 * Auto-saves the current game state
 */
export function autoSave(state: GameState): void {
  try {
    saveGame(state, 'auto');
  } catch (error) {
    console.warn('Auto-save failed:', error);
    // Don't throw error for auto-save failures to avoid disrupting gameplay
  }
}

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
  const currentWeeks = (state.date.year - 1) * 52 + state.date.week;
  return Math.min(Math.round((currentWeeks / maxWeeks) * 100), 100);
}

/**
 * Formats timestamp to human-readable date
 */
export function formatSaveDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}