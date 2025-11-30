import React, { createContext, useContext, useEffect } from 'react';
import { useAudioManager } from '../hooks/useAudioManager';
import type { AudioManager } from '../types/audio';
import { logger } from '../utils/logger';

const AudioContext = createContext<AudioManager | null>(null);

export const useAudio = (): AudioManager => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioManager = useAudioManager();

  // Random background music is automatically queued in useAudioManager
  // It will start playing after first user interaction
  useEffect(() => {
    return () => {
      logger.log('[AudioProvider] Unmounting, stopping music');
      audioManager.stopMusic();
    };
  }, []); // Only run once on mount

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};
