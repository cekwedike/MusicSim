import React, { useState, useEffect } from 'react';
import type { SaveSlot, GameState } from '../types';
import { getAllSaveSlots, saveGame, deleteSave, loadGame, formatSaveDate } from '../services/storageService';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (gameState: GameState) => void;
  currentGameState: GameState;
}

const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ isOpen, onClose, onLoadGame, currentGameState }) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newSaveName, setNewSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSaveSlots();
    }
  }, [isOpen]);

  const loadSaveSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const slots = await getAllSaveSlots();
      setSaveSlots(slots);
    } catch (err) {
      setError('Failed to load save slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGame = async () => {
    if (!newSaveName.trim()) {
      setError('Please enter a save name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const timestamp = Date.now().toString();
      const slotId = `${timestamp}_${newSaveName.trim().replace(/\s+/g, '_')}`;
      await saveGame(currentGameState, slotId);
      setNewSaveName('');
      setShowSaveInput(false);
      await loadSaveSlots();
    } catch (err) {
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
        onClose();
      } else {
        setError('Failed to load game');
      }
    } catch (err) {
      setError('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSave = async (slotId: string) => {
    if (!window.confirm('Are you sure you want to delete this save?')) {
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

  const formatStatValue = (value: number, suffix: string = '') => {
    return `${Math.round(value)}${suffix}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Save & Load Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Save Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Save Current Game</h3>
            <button
              onClick={() => setShowSaveInput(!showSaveInput)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded transition-colors"
              disabled={loading}
            >
              {showSaveInput ? 'Cancel' : 'New Save'}
            </button>
          </div>

          {showSaveInput && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                placeholder="Enter save name..."
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded focus:outline-none focus:border-violet-500"
                maxLength={50}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveGame()}
              />
              <button
                onClick={handleSaveGame}
                disabled={loading || !newSaveName.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Load Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Load Game</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          ) : saveSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No saved games found</p>
              <p className="text-gray-500 text-sm mt-1">Start playing to create auto-saves, or use "New Save" above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {saveSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">
                          {slot.artistName} ({slot.genre})
                        </h4>
                        {slot.id === 'auto' && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            AUTO-SAVE
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-gray-300 mb-2">
                        <div>
                          <span className="text-gray-400">Date:</span> Year {slot.date.year}, Week {slot.date.week}
                        </div>
                        <div>
                          <span className="text-gray-400">Progress:</span> {slot.careerProgress}%
                        </div>
                        <div>
                          <span className="text-gray-400">Cash:</span> ${formatStatValue(slot.stats.cash)}
                        </div>
                        <div>
                          <span className="text-gray-400">Fame:</span> {formatStatValue(slot.stats.fame)}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Saved: {formatSaveDate(slot.timestamp)}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleLoadGame(slot.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        disabled={loading}
                      >
                        Load
                      </button>
                      {slot.id !== 'auto' && (
                        <button
                          onClick={() => handleDeleteSave(slot.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          disabled={loading}
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

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveLoadModal;