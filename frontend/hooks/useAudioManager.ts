import { useState, useEffect, useRef, useCallback } from 'react';
import type { SoundEffect, BackgroundMusic, AudioState, AudioManager } from '../types/audio';
import { SOUND_URLS, MUSIC_URLS, AUDIO_STORAGE_KEY } from '../types/audio';

const DEFAULT_AUDIO_STATE: AudioState = {
  isMusicMuted: false,
  isSfxMuted: false,
  musicVolume: 0.2, // Reduced from 0.5
  sfxVolume: 0.4, // Reduced from 0.7
  currentTrack: null,
};

export const useAudioManager = (): AudioManager => {
  // Load saved preferences from localStorage
  const loadSavedPreferences = (): AudioState => {
    try {
      const saved = localStorage.getItem(AUDIO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_AUDIO_STATE, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load audio preferences:', error);
    }
    return DEFAULT_AUDIO_STATE;
  };

  const [audioState, setAudioState] = useState<AudioState>(loadSavedPreferences);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Audio element refs
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundPoolRef = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const nextTrackRef = useRef<BackgroundMusic | null>(null);
  const isFadingRef = useRef(false);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audioState));
    } catch (error) {
      console.error('Failed to save audio preferences:', error);
    }
  }, [audioState]);

  // Initialize music audio element
  useEffect(() => {
    if (!musicAudioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = audioState.musicVolume;
      musicAudioRef.current = audio;

      // Handle audio loading errors
      audio.addEventListener('error', (e) => {
        console.error('Music loading error:', e);
      });

      // Handle successful load
      audio.addEventListener('canplaythrough', () => {
        console.log('Music loaded successfully');
      });
    }

    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.src = '';
      }
    };
  }, []);

  // Preload critical sound effects
  useEffect(() => {
    const criticalSounds: SoundEffect[] = ['buttonClick', 'buttonHover'];

    criticalSounds.forEach((soundKey) => {
      if (!soundPoolRef.current.has(soundKey)) {
        const audio = new Audio();
        audio.src = SOUND_URLS[soundKey];
        audio.volume = audioState.sfxVolume;
        audio.preload = 'auto';

        audio.addEventListener('error', (e) => {
          console.error(`Sound effect "${soundKey}" failed to load:`, e);
        });

        soundPoolRef.current.set(soundKey, audio);
      }
    });
  }, []);

  // Update music volume when it changes
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = audioState.isMusicMuted ? 0 : audioState.musicVolume;
    }
  }, [audioState.musicVolume, audioState.isMusicMuted]);

  // Update SFX volume for all cached sounds
  useEffect(() => {
    soundPoolRef.current.forEach((audio) => {
      audio.volume = audioState.isSfxMuted ? 0 : audioState.sfxVolume;
    });
  }, [audioState.sfxVolume, audioState.isSfxMuted]);

  // Page Visibility API - pause/resume music when tab is hidden/visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (musicAudioRef.current && !musicAudioRef.current.paused) {
          musicAudioRef.current.pause();
        }
      } else {
        if (musicAudioRef.current && audioState.currentTrack && isUserInteracted) {
          musicAudioRef.current.play().catch((error) => {
            console.log('Autoplay prevented:', error);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audioState.currentTrack, isUserInteracted]);

  // Detect user interaction for autoplay policy compliance
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Fade music volume
  const fadeMusic = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!musicAudioRef.current || isFadingRef.current) return Promise.resolve();

    isFadingRef.current = true;
    const audio = musicAudioRef.current;
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 50;
    const stepDuration = duration / steps;
    const stepSize = volumeDiff / steps;
    let currentStep = 0;

    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(interval);
          audio.volume = targetVolume;
          isFadingRef.current = false;
          resolve();
        } else {
          audio.volume = startVolume + (stepSize * currentStep);
        }
      }, stepDuration);
    });
  }, []);

  // Play sound effect
  const playSound = useCallback((sound: SoundEffect) => {
    if (audioState.isSfxMuted || !isUserInteracted) {
      console.log(`Sound "${sound}" not played (muted: ${audioState.isSfxMuted}, interaction: ${isUserInteracted})`);
      return;
    }

    try {
      let audio = soundPoolRef.current.get(sound);

      if (!audio) {
        // Lazy load sound if not in pool
        audio = new Audio(SOUND_URLS[sound]);
        audio.volume = audioState.sfxVolume;
        soundPoolRef.current.set(sound, audio);
      }

      // Reset and play (clone for overlapping sounds)
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = audioState.isSfxMuted ? 0 : audioState.sfxVolume;
      clone.play().catch((error) => {
        console.error(`Failed to play sound "${sound}":`, error);
      });
    } catch (error) {
      console.error(`Error playing sound "${sound}":`, error);
    }
  }, [audioState.isSfxMuted, audioState.sfxVolume, isUserInteracted]);

  // Play background music with fade-in
  const playMusic = useCallback(async (track: BackgroundMusic) => {
    if (!musicAudioRef.current || !isUserInteracted) {
      console.log(`Music "${track}" queued for later (user interaction required)`);
      nextTrackRef.current = track;
      return;
    }

    const audio = musicAudioRef.current;

    // If same track is already playing, do nothing
    if (audioState.currentTrack === track && !audio.paused) {
      return;
    }

    try {
      // Fade out current track if playing
      if (!audio.paused && audioState.currentTrack) {
        await fadeMusic(0, 500);
        audio.pause();
      }

      // Load new track
      audio.src = MUSIC_URLS[track];
      audio.load();

      setAudioState((prev) => ({ ...prev, currentTrack: track }));

      // Start at 0 volume and fade in
      audio.volume = 0;
      await audio.play();

      if (!audioState.isMusicMuted) {
        await fadeMusic(audioState.musicVolume, 1000);
      }
    } catch (error) {
      console.error(`Failed to play music "${track}":`, error);
    }
  }, [audioState.currentTrack, audioState.musicVolume, audioState.isMusicMuted, isUserInteracted, fadeMusic]);

  // Stop music with fade-out
  const stopMusic = useCallback(async () => {
    if (!musicAudioRef.current) return;

    const audio = musicAudioRef.current;

    if (!audio.paused) {
      await fadeMusic(0, 500);
      audio.pause();
      audio.currentTime = 0;
    }

    setAudioState((prev) => ({ ...prev, currentTrack: null }));
  }, [fadeMusic]);

  // Pause music
  const pauseMusic = useCallback(() => {
    if (musicAudioRef.current && !musicAudioRef.current.paused) {
      musicAudioRef.current.pause();
    }
  }, []);

  // Resume music
  const resumeMusic = useCallback(() => {
    if (musicAudioRef.current && musicAudioRef.current.paused && audioState.currentTrack && isUserInteracted) {
      musicAudioRef.current.play().catch((error) => {
        console.error('Failed to resume music:', error);
      });
    }
  }, [audioState.currentTrack, isUserInteracted]);

  // Set music volume
  const setMusicVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioState((prev) => ({ ...prev, musicVolume: clampedVolume }));
  }, []);

  // Set SFX volume
  const setSfxVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioState((prev) => ({ ...prev, sfxVolume: clampedVolume }));
  }, []);

  // Toggle music mute
  const toggleMusicMute = useCallback(() => {
    setAudioState((prev) => ({ ...prev, isMusicMuted: !prev.isMusicMuted }));
  }, []);

  // Toggle SFX mute
  const toggleSfxMute = useCallback(() => {
    setAudioState((prev) => ({ ...prev, isSfxMuted: !prev.isSfxMuted }));
  }, []);

  // Set music muted state
  const setMusicMuted = useCallback((muted: boolean) => {
    setAudioState((prev) => ({ ...prev, isMusicMuted: muted }));
  }, []);

  // Set SFX muted state
  const setSfxMuted = useCallback((muted: boolean) => {
    setAudioState((prev) => ({ ...prev, isSfxMuted: muted }));
  }, []);

  // Play queued track on first user interaction
  useEffect(() => {
    if (isUserInteracted && nextTrackRef.current) {
      const track = nextTrackRef.current;
      nextTrackRef.current = null;
      playMusic(track);
    }
  }, [isUserInteracted, playMusic]);

  return {
    playSound,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setMusicVolume,
    setSfxVolume,
    toggleMusicMute,
    toggleSfxMute,
    setMusicMuted,
    setSfxMuted,
    audioState,
  };
};
