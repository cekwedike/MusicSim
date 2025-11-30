import { useCallback, useRef, useState } from 'react';
import { autoSave, isStorageAvailable } from '../services/storageService';
import { useDebounce } from './useDebounce';
import type { GameState } from '../types';

export interface AutoSaveStatus {
  isInProgress: boolean;
  lastSaveTime: number | null;
  error: string | null;
}

/**
 * Custom hook for managing autosave functionality with debouncing and status tracking
 * @param delay - Debounce delay in milliseconds (default: 5000 = 5 seconds)
 * @param isGuestMode - Whether user is in guest mode (affects backend syncing)
 * @returns Object containing autosave function, status, and manual save trigger
 */
export function useAutoSave(delay: number = 5000, isGuestMode: boolean = false) {
  const [status, setStatus] = useState<AutoSaveStatus>({
    isInProgress: false,
    lastSaveTime: null,
    error: null
  });

  const saveInProgressRef = useRef(false);

  // Core autosave function
  const performAutoSave = useCallback(async (gameState: GameState) => {
    // Prevent overlapping saves
    if (saveInProgressRef.current) {
      console.log('Autosave already in progress, skipping...');
      return;
    }

    // Check if storage is available
    if (!isStorageAvailable()) {
      console.warn('Storage not available, skipping autosave');
      return;
    }

    try {
      saveInProgressRef.current = true;
      setStatus(prev => ({ ...prev, isInProgress: true, error: null }));

      await autoSave(gameState, isGuestMode);

      setStatus(prev => ({
        ...prev,
        isInProgress: false,
        lastSaveTime: Date.now()
      }));

      console.log('Autosave completed successfully');
    } catch (error) {
      console.error('Autosave failed:', error);
      setStatus(prev => ({
        ...prev,
        isInProgress: false,
        error: error instanceof Error ? error.message : 'Unknown autosave error'
      }));
    } finally {
      saveInProgressRef.current = false;
    }
  }, [isGuestMode]);

  // Debounced autosave function
  const debouncedAutoSave = useDebounce(performAutoSave, delay);

  // Manual save trigger (immediate, no debounce)
  const saveNow = useCallback(async (gameState: GameState) => {
    await performAutoSave(gameState);
  }, [performAutoSave]);

  // Clear error status
  const clearError = useCallback(() => {
    setStatus(prev => ({ ...prev, error: null }));
  }, []);

  return {
    autoSave: debouncedAutoSave,
    saveNow,
    status,
    clearError
  };
}