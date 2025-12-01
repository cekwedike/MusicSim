import React, { useState, useEffect, useRef } from 'react';
import type { SaveSlot, GameState } from '../types';
import { getCurrentCareerSaves, saveGame, deleteSave, loadGame, formatSaveDate } from '../services/storageService';
import DeleteSaveModal from './DeleteSaveModal';
import LoadingSkeleton from './LoadingSkeleton';

interface SaveLoadPanelProps {
  onLoadGame: (gameState: GameState) => void;
  currentGameState: GameState;
  onClose?: () => void;
  onSaveComplete?: () => void;
  isGuestMode?: boolean;
}

const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({ onLoadGame, currentGameState, onClose, onSaveComplete, isGuestMode = false }) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [newSaveName, setNewSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('load');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saveToDelete, setSaveToDelete] = useState<{ slotId: string; artistName: string; slotName: string } | null>(null);
  
  // Request deduplication
  const loadingRef = useRef(false);
  const loadPromiseRef = useRef<Promise<SaveSlot[]> | null>(null);

  // Calculate manual save slots used and available (4 manual + 1 for auto/quicksave = 5 total)
  const getManualSaveStats = () => {
    // Filter to only count saves for current career
    const manualSaves = saveSlots.filter(s => {
      // Parse slot ID to check if it's system save
      const parts = s.id.split('_');
      const slotType = parts[parts.length - 1];
      return slotType !== 'auto' && slotType !== 'quicksave';
    });
    const used = manualSaves.length;
    const available = Math.max(0, 4 - used);
    return { used, available, total: 4 };
  };

  // Helper function to extract save name from career-specific slot ID
  // Format: {artistName}_{genre}_{slotType} -> extracts slotType and formats it
  const getSaveName = (slotId: string): string => {
    const parts = slotId.split('_');
    const slotType = parts[parts.length - 1];
    
    if (slotType === 'auto') return 'Auto Save';
    if (slotType === 'quicksave') return 'Quick Save';
    
    // For manual saves, return the slot name cleaned up
    return slotType.replace(/_/g, ' ');
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
    // Request deduplication - if already loading, return existing promise
    if (loadingRef.current && loadPromiseRef.current) {
      console.log('[SaveLoadPanel] Request deduplicated - reusing existing load');
      return loadPromiseRef.current;
    }

    console.log('[SaveLoadPanel] Loading save slots for current career...');
    setLoading(true);
    setError('');
    loadingRef.current = true;
    
    const promise = (async () => {
      try {
        // Only load saves for the current career being played
        const slots = await getCurrentCareerSaves(currentGameState);
        console.log('[SaveLoadPanel] Loaded', slots.length, 'save slots for current career:', slots);
        setSaveSlots(slots);
        return slots;
      } catch (err) {
        console.error('[SaveLoadPanel] Failed to load save slots:', err);
        setError('Failed to load save slots');
        throw err;
      } finally {
        setLoading(false);
        loadingRef.current = false;
        loadPromiseRef.current = null;
      }
    })();
    
    loadPromiseRef.current = promise;
    return promise;
  };

  const handleSaveGame = async () => {
    setLoading(true);
    setError('');
    try {
      const saveName = newSaveName.trim() || getDefaultSaveName();
      const slotId = saveName.replace(/\s+/g, '_');
      console.log('[SaveLoadPanel] Saving game with slotId:', slotId);

      // Optimistic update - add to UI immediately
      const optimisticSave: SaveSlot = {
        id: slotId,
        slotName: slotId,
        artistName: currentGameState.artistName,
        genre: currentGameState.artistGenre,
        date: currentGameState.date,
        currentDate: currentGameState.currentDate,
        stats: currentGameState.playerStats,
        timestamp: Date.now(),
        careerProgress: currentGameState.playerStats.careerProgress
      };
      setSaveSlots(prev => [optimisticSave, ...prev.filter(s => s.id !== slotId)]);

      // Actual save in background
      await saveGame(currentGameState, slotId, isGuestMode);
      console.log('[SaveLoadPanel] Save completed');

      setNewSaveName('');
      setShowSaveInput(false);
      setActiveTab('load');

      // Refresh to get backend data
      await loadSaveSlots();

      if (onSaveComplete) {
        console.log('[SaveLoadPanel] Calling onSaveComplete callback');
        onSaveComplete();
      }
    } catch (err) {
      console.error('[SaveLoadPanel] Save failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to save game');
      // Revert optimistic update on error
      await loadSaveSlots();
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

  const handleDeleteSave = (slotId: string, artistName: string) => {
    // Open custom delete modal instead of browser confirm
    const saveName = getSaveName(slotId);
    setSaveToDelete({ slotId, artistName, slotName: saveName });
    setDeleteModalOpen(true);
  };

  const confirmDeleteSave = async () => {
    if (!saveToDelete) return;

    setLoading(true);
    setError('');
    setDeleteModalOpen(false);

    try {
      await deleteSave(saveToDelete.slotId);
      await loadSaveSlots();
      setSaveToDelete(null);
    } catch (err) {
      setError('Failed to delete save');
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteSave = () => {
    setDeleteModalOpen(false);
    setSaveToDelete(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('load')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'load'
              ? 'bg-red-600 text-white'
              : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
          }`}
          aria-label="Switch to load game tab"
          aria-pressed={activeTab === 'load'}
        >
          Load Game
        </button>
        <button
          onClick={() => setActiveTab('save')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'save'
              ? 'bg-red-600 text-white'
              : 'bg-[#3D1820] text-gray-300 hover:bg-[#4D1F2A]'
          }`}
          aria-label="Switch to save game tab"
          aria-pressed={activeTab === 'save'}
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
          {/* Save Slot Counter */}
          <div className="bg-[#3D1820]/30 border border-[#4D1F2A] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Manual Save Slots</span>
              <span className="text-sm font-bold text-white">{getManualSaveStats().used} / {getManualSaveStats().total}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded ${
                    i < getManualSaveStats().used
                      ? 'bg-red-600'
                      : 'bg-[#2D1115]'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {getManualSaveStats().available > 0
                ? `${getManualSaveStats().available} slot${getManualSaveStats().available !== 1 ? 's' : ''} available`
                : 'All manual save slots full'}
            </p>
          </div>
\n          {!showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-[#4D1F2A] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Save
            </button>
          ) : (
            <div className="space-y-3 bg-[#3D1820]/50 p-4 rounded-lg">
              <div className="space-y-2">
                <input
                  type="text"
                  value={newSaveName}
                  onChange={(e) => setNewSaveName(e.target.value)}
                  placeholder={getDefaultSaveName()}
                  className="w-full bg-[#2D1115] border border-[#4D1F2A] text-white px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 text-sm"
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
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-[#4D1F2A] text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setNewSaveName('');
                  }}
                  className="flex-1 bg-[#4D1F2A] hover:bg-[#3D1820] text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-400 bg-[#3D1820]/30 p-3 rounded-lg">
            <p className="font-medium text-gray-300 mb-1">Save Tips</p>
            <p className="text-xs mb-1"><strong>Auto-save:</strong> Happens every 5 minutes</p>
            <p className="text-xs mb-1"><strong>Quick save (Ctrl+S):</strong> One-slot instant save</p>
            <p className="text-xs"><strong>Manual save:</strong> Create backups before risky decisions!</p>
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
              className="w-full bg-[#3D1820] hover:bg-[#4D1F2A] disabled:bg-[#2D1115] text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Saves'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto -mx-4 px-4">
          {loading && saveSlots.length === 0 ? (
            <div className="space-y-3">
              <LoadingSkeleton type="save-card" count={3} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 font-medium mb-2">Error loading saves</p>
              <p className="text-gray-400 text-sm">{error}</p>
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
                  className="bg-[#3D1820]/50 border border-[#4D1F2A] rounded-lg p-3 hover:bg-[#3D1820] transition-colors"
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
                        {slot.id === 'quicksave' && (
                          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded flex-shrink-0">
                            QUICK
                          </span>
                        )}
                        {slot.id !== 'auto' && slot.id !== 'quicksave' && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded flex-shrink-0">
                            MANUAL
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-0.5">{slot.artistName}</p>
                      <p className="text-xs text-gray-400">{slot.genre}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-3 bg-[#2D1115]/50 p-2 rounded">
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
                        className="bg-red-600 hover:bg-red-700 disabled:bg-[#4D1F2A] text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Load
                      </button>
                      {slot.id !== 'auto' && slot.id !== 'quicksave' && (
                        <button
                          onClick={() => handleDeleteSave(slot.id, slot.artistName)}
                          disabled={loading}
                          className="bg-red-600/80 hover:bg-red-600 disabled:bg-[#4D1F2A] text-white px-3 py-1 rounded text-xs font-medium transition-colors"
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

      {/* Delete Save Confirmation Modal */}
      <DeleteSaveModal
        isOpen={deleteModalOpen}
        artistName={saveToDelete?.artistName || ''}
        slotName={saveToDelete?.slotName || ''}
        onConfirm={confirmDeleteSave}
        onCancel={cancelDeleteSave}
      />
    </div>
  );
};

export default SaveLoadPanel;
