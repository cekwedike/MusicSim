import React, { createContext, useContext, useEffect } from 'react';
import { useAudioManager } from '../hooks/useAudioManager';
import type { AudioManager } from '../types/audio';

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

  // Play menu music when the provider mounts (will wait for user interaction)
  useEffect(() => {
    console.log('[AudioProvider] Mounting, playing menu music');
    audioManager.playMusic('menu');

    return () => {
      console.log('[AudioProvider] Unmounting, stopping music');
      audioManager.stopMusic();
    };
  }, []); // Only run once on mount

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};
