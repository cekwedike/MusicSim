import api from './api';
import type { GameState } from '../types';
import type { ApiResponse } from './authService';

export interface GameSave {
  id: string;
  slotName: string;
  artistName: string;
  genre: string;
  difficulty: string;
  weeksPlayed: number;
  createdAt: string;
  updatedAt: string;
  lastPlayedAt: string;
}

export interface GameSaveWithState extends GameSave {
  gameState: GameState;
}

export interface SaveResponse {
  saveId: string;
  slotName: string;
  artistName: string;
  genre: string;
  difficulty: string;
  weeksPlayed: number;
  savedAt: string;
}

export interface SavesListResponse {
  saves: GameSave[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface AutosaveResponse {
  exists: boolean;
  autosave?: {
    id: string;
    artistName: string;
    genre: string;
    difficulty: string;
    weeksPlayed: number;
    savedAt: string;
    lastPlayedAt: string;
  };
}

export const gameService = {
  // Save game state to backend
  saveGame: async (slotName: string, gameState: GameState): Promise<ApiResponse<SaveResponse>> => {
    const response = await api.post<ApiResponse<SaveResponse>>('/game/save', {
      slotName,
      gameState
    });
    return response.data;
  },

  // Load game by slot name
  loadGame: async (slotName: string): Promise<ApiResponse<GameSaveWithState>> => {
    const response = await api.get<ApiResponse<GameSaveWithState>>(`/game/load/${encodeURIComponent(slotName)}`);
    return response.data;
  },

  // Load game by ID
  loadGameById: async (saveId: string): Promise<ApiResponse<GameSaveWithState>> => {
    const response = await api.get<ApiResponse<GameSaveWithState>>(`/game/load/id/${saveId}`);
    return response.data;
  },

  // Get all saves with pagination
  getAllSaves: async (limit = 20, offset = 0): Promise<ApiResponse<SavesListResponse>> => {
    const response = await api.get<ApiResponse<SavesListResponse>>('/game/saves', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Check for autosave
  checkAutosave: async (): Promise<ApiResponse<AutosaveResponse>> => {
    const response = await api.get<ApiResponse<AutosaveResponse>>('/game/autosave');
    return response.data;
  },

  // Delete save by ID
  deleteSave: async (saveId: string): Promise<ApiResponse<{ saveId: string; slotName: string }>> => {
    const response = await api.delete<ApiResponse<{ saveId: string; slotName: string }>>(`/game/save/${saveId}`);
    return response.data;
  },

  // Rename save slot
  renameSave: async (saveId: string, newSlotName: string): Promise<ApiResponse<{ saveId: string; oldSlotName: string; newSlotName: string }>> => {
    const response = await api.post<ApiResponse<{ saveId: string; oldSlotName: string; newSlotName: string }>>('/game/save/rename', {
      saveId,
      newSlotName
    });
    return response.data;
  },

  // Delete all saves
  deleteAllSaves: async (): Promise<ApiResponse<{ deletedCount: number }>> => {
    const response = await api.delete<ApiResponse<{ deletedCount: number }>>('/game/saves/all');
    return response.data;
  },

  // Get save counts by difficulty
  getSaveCounts: async (): Promise<ApiResponse<{ total: number; byDifficulty: Array<{ difficulty: string; count: string }> }>> => {
    const response = await api.get<ApiResponse<{ total: number; byDifficulty: Array<{ difficulty: string; count: string }> }>>('/game/saves/count');
    return response.data;
  },

  // Auto-save game (uses 'auto' slot)
  autoSave: async (gameState: GameState): Promise<ApiResponse<SaveResponse>> => {
    return gameService.saveGame('auto', gameState);
  },

  // Load autosave
  loadAutoSave: async (): Promise<ApiResponse<GameSaveWithState>> => {
    return gameService.loadGame('auto');
  }
};