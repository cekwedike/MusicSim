import React, { useState, useEffect } from 'react';
import type { SaveSlot, GameState } from '../types';
import { getAllSaveSlots, saveGame, deleteSave, loadGame, formatSaveDate } from '../services/storageService';

interface SaveLoadPanelProps {
  onLoadGame: (gameState: GameState) => void;
  currentGameState: GameState;
  onClose?: () => void;
  onSaveComplete?: () => void;
}

const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({ onLoadGame, currentGameState, onClose, onSaveComplete }) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newSaveName, setNewSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('load');

  // Helper function to extract save name from slot ID
  const getSaveName = (slotId: string): string => {
    if (slotId === 'auto') return 'Autosave';
    // Format: {timestamp}_{saveName}
    const parts = slotId.split('_');
    if (parts.length > 1) {
      return parts.slice(1).join('_').replace(/_/g, ' ');
    }
    return 'Manual Save';
  };

  // Generate default save name placeholder
  const getDefaultSaveName = (): string => {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
    const artistName = currentGameState.artistName || 'Artist';
    return `${artistName}-${dateStr}`;
  };

  useEffect(() => {
    loadSaveSlots();
  }, []);

  const loadSaveSlots = async () => {
    console.log('[SaveLoadPanel] Loading save slots...');
    setLoading(true);
    setError('');
    try {
      const slots = await getAllSaveSlots();
      console.log('[SaveLoadPanel] Loaded', slots.length, 'save slots:', slots);
      setSaveSlots(slots);
    } catch (err) {
      console.error('[SaveLoadPanel] Failed to load save slots:', err);
      setError('Failed to load save slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async () => {
    setLoading(true);
    setError('');
    try {
      const timestamp = Date.now().toString();
      // Use default save name if input is empty
      const saveName = newSaveName.trim() || getDefaultSaveName();
      const slotId = `${timestamp}_${saveName.replace(/\s+/g, '_')}`;
      console.log('[SaveLoadPanel] Saving game with slotId:', slotId);

      await saveGame(currentGameState, slotId);
      console.log('[SaveLoadPanel] Save completed, reloading save slots...');

      setNewSaveName('');
      setShowSaveInput(false);

      await loadSaveSlots();
      console.log('[SaveLoadPanel] Save slots reloaded');

      setActiveTab('load'); // Switch to load tab to see the new save

      // Notify parent component to refresh the panel
      if (onSaveComplete) {
        console.log('[SaveLoadPanel] Calling onSaveComplete callback');
        onSaveComplete();
      }
    } catch (err) {
      console.error('[SaveLoadPanel] Save failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to save game');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadGame = async (slotId: string) => {
    setLoading(true);
    setError('');
    try {
      const gameState = await loadGame(slotId);
      if (gameState) {
        onLoadGame(gameState);
        if (onClose) onClose();
      } else {
        setError('Failed to load game');
      }
    } catch (err) {
      setError('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSave = async (slotId: string, artistName: string) => {
    if (!window.confirm(`Delete save for "${artistName}"?`)) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await deleteSave(slotId);
      await loadSaveSlots();
    } catch (err) {
      setError('Failed to delete save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('load')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'load'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
          }`}
        >
          Load Game
        </button>
        <button
          onClick={() => setActiveTab('save')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'save'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
          }`}
        >
          Save Game
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-3 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Save Tab */}
      {activeTab === 'save' && (
        <div className="space-y-4">
          {!showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Save
            </button>
          ) : (
            <div className="space-y-3 bg-gray-700/50 p-4 rounded-lg">
              <div className="space-y-2">
                <input
                  type="text"
                  value={newSaveName}
                  onChange={(e) => setNewSaveName(e.target.value)}
                  placeholder={getDefaultSaveName()}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-violet-500 text-sm"
                  maxLength={50}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveGame()}
                  autoFocus
                />
                <p className="text-xs text-gray-400">
                  Leave blank to use default: <span className="text-gray-300">{getDefaultSaveName()}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveGame}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setNewSaveName('');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400 bg-gray-700/30 p-3 rounded-lg">
            <p className="font-medium text-gray-300 mb-1">Quick Save Tip</p>
            <p>Your game auto-saves every 5 minutes. Manual saves are great for backing up before risky decisions!</p>
          </div>
        </div>
      )}

      {/* Load Tab */}
      {activeTab === 'load' && (
        <div className="flex-1 flex flex-col">
          {/* Refresh Button */}
          <div className="mb-3">
            <button
              onClick={() => loadSaveSlots()}
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Saves'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto -mx-4 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-3"></div>
              <p className="text-gray-400 text-sm">Loading saves...</p>
            </div>
          ) : saveSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 font-medium mb-2">No saved games found</p>
              <p className="text-gray-500 text-sm">Start playing to create auto-saves, or use "Save Game" tab</p>
            </div>
          ) : (
            <div className="space-y-3">
              {saveSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-base truncate">
                          {getSaveName(slot.id)}
                        </h4>
                        {slot.id === 'auto' && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded flex-shrink-0">
                            AUTO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{slot.artistName} • {slot.genre}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3 bg-gray-800/50 p-2 rounded">
                    <div>
                      <span className="text-gray-500">In-Game Date:</span> {new Date(slot.currentDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span> {slot.careerProgress}%
                    </div>
                    <div>
                      <span className="text-gray-500">Cash:</span> ${Math.round(slot.stats.cash).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Fame:</span> {Math.round(slot.stats.fame)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatSaveDate(slot.timestamp)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadGame(slot.id)}
                        disabled={loading}
                        className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Load
                      </button>
                      {slot.id !== 'auto' && (
                        <button
                          onClick={() => handleDeleteSave(slot.id, slot.artistName)}
                          disabled={loading}
                          className="bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveLoadPanel;
