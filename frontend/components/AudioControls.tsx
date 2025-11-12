import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';

const MusicNoteIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const VolumeIcon: React.FC<{ muted: boolean; volume: number }> = ({ muted, volume }) => {
  if (muted || volume === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    );
  }

  if (volume < 0.5) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
};

const AudioControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioManager = useAudio();

  const { audioState, setMusicVolume, setSfxVolume, toggleMusicMute, toggleSfxMute, playSound } = audioManager;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    playSound('buttonClick');
    setIsOpen(!isOpen);
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMusicVolume(value);
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSfxVolume(value);
  };

  const handleMusicMuteToggle = () => {
    playSound('buttonClick');
    toggleMusicMute();
  };

  const handleSfxMuteToggle = () => {
    playSound('buttonClick');
    toggleSfxMute();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Floating Audio Button */}
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center
          ${isOpen
            ? 'bg-red-600 text-white'
            : 'bg-gray-700/50 text-gray-300 hover:bg-red-600 hover:text-white'
          }`}
        aria-label="Audio Controls"
        title="Audio Settings"
      >
        <MusicNoteIcon />
      </button>

      {/* Audio Controls Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-gray-800 border border-red-500/30 rounded-lg shadow-xl z-[60] p-4 animate-fade-in max-w-[calc(100vw-2rem)]">
          <h3 className="text-red-300 font-bold text-lg mb-4 flex items-center gap-2">
            <MusicNoteIcon />
            Audio Settings
          </h3>

          {/* Music Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm font-medium">Music</label>
              <button
                onClick={handleMusicMuteToggle}
                className={`p-1.5 rounded transition-colors ${
                  audioState.isMusicMuted
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-400 hover:text-red-300'
                }`}
                aria-label={audioState.isMusicMuted ? 'Unmute Music' : 'Mute Music'}
              >
                <VolumeIcon muted={audioState.isMusicMuted} volume={audioState.musicVolume} />
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.musicVolume}
              onChange={handleMusicVolumeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red"
              disabled={audioState.isMusicMuted}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-red-400 font-medium">
                {Math.round(audioState.musicVolume * 100)}%
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* SFX Controls */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 text-sm font-medium">Sound Effects</label>
              <button
                onClick={handleSfxMuteToggle}
                className={`p-1.5 rounded transition-colors ${
                  audioState.isSfxMuted
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-400 hover:text-red-300'
                }`}
                aria-label={audioState.isSfxMuted ? 'Unmute SFX' : 'Mute SFX'}
              >
                <VolumeIcon muted={audioState.isSfxMuted} volume={audioState.sfxVolume} />
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.sfxVolume}
              onChange={handleSfxVolumeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red"
              disabled={audioState.isSfxMuted}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-red-400 font-medium">
                {Math.round(audioState.sfxVolume * 100)}%
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Test Sound Button */}
          <button
            onClick={() => playSound('buttonClick')}
            className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            disabled={audioState.isSfxMuted}
          >
            Test Sound
          </button>

          {/* Current Track Info */}
          {audioState.currentTrack && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Now Playing: <span className="text-red-400 font-medium capitalize">{audioState.currentTrack}</span>
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(139, 92, 246);
          cursor: pointer;
        }

        .slider-red::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(139, 92, 246);
          cursor: pointer;
          border: none;
        }

        .slider-red:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slider-red::-webkit-slider-track {
          background: linear-gradient(to right,
            rgb(139, 92, 246) 0%,
            rgb(139, 92, 246) var(--value, 50)%,
            rgb(55, 65, 81) var(--value, 50)%,
            rgb(55, 65, 81) 100%
          );
        }
      `}</style>
    </div>
  );
};

export default AudioControls;
