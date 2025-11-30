import { useState, useEffect, useRef, useCallback } from 'react';
import type { SoundEffect, BackgroundMusic, AudioState, AudioManager } from '../types/audio';
import { SOUND_URLS, MUSIC_URLS, AUDIO_STORAGE_KEY } from '../types/audio';
import storage from '../services/dbStorage';
import { logger } from '../utils/logger';

const DEFAULT_AUDIO_STATE: AudioState = {
  isMusicMuted: false,
  isSfxMuted: false,
  musicVolume: 0.1, // Reduced from 0.2 (very quiet)
  sfxVolume: 0.25, // Reduced from 0.4 (quiet)
  currentTrack: null,
};

export const useAudioManager = (): AudioManager => {
  // Load saved preferences from IndexedDB
  const loadSavedPreferences = async (): Promise<AudioState> => {
    try {
      const saved = await storage.getItem(AUDIO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_AUDIO_STATE, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load audio preferences:', error);
    }
    return DEFAULT_AUDIO_STATE;
  };

  const [audioState, setAudioState] = useState<AudioState>(DEFAULT_AUDIO_STATE);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Playlist management for rotating background music - 11 tracks for variety
  const BACKGROUND_TRACK_KEYS: BackgroundMusic[] = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6', 'bg7', 'bg8', 'bg9', 'bg10', 'bg11'];
  const playlistIndexRef = useRef<number>(0);
  const previousMusicVolumeRef = useRef<number | null>(null);

  // Audio element refs
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundPoolRef = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());
  const nextTrackRef = useRef<BackgroundMusic | null>(null);
  const isFadingRef = useRef(false);
  const isProgrammaticMuteRef = useRef(false); // Track when WE change muted state

  // Load audio preferences from IndexedDB on mount
  useEffect(() => {
    const loadPreferences = async () => {
      const savedState = await loadSavedPreferences();
      setAudioState(savedState);
    };
    loadPreferences();
  }, []);

  // Save preferences to IndexedDB whenever they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await storage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audioState));
      } catch (error) {
        console.error('Failed to save audio preferences:', error);
      }
    };
    savePreferences();
  }, [audioState]);

  // Initialize music audio element
  useEffect(() => {
    if (!musicAudioRef.current) {
      const audio = new Audio();
      // Don't loop a single track — we manage playlist rotation ourselves.
      audio.loop = false;
      audio.volume = audioState.musicVolume;
      musicAudioRef.current = audio;

      // when a track naturally ends (we won't loop here since we manage rotation), rotate
      audio.addEventListener('ended', () => {
        // rotate to next playlist track
        try {
          const nextIdx = (playlistIndexRef.current + 1) % BACKGROUND_TRACK_KEYS.length;
          playlistIndexRef.current = nextIdx;
          const nextKey = BACKGROUND_TRACK_KEYS[nextIdx];
          const nextUrl = MUSIC_URLS[nextKey];
          audio.src = nextUrl;
          audio.load();
          audio.play().catch((e) => console.warn('Playlist autoplay prevented:', e));
          setAudioState((prev) => ({ ...prev, currentTrack: nextKey }));
        } catch (e) {
          console.error('Error rotating background track:', e);
        }
      });

      // Handle audio loading errors
      audio.addEventListener('error', (e) => {
        console.error('Music loading error:', e);
      });

      // Handle successful load
      audio.addEventListener('canplaythrough', () => {
        logger.log('Music loaded successfully');
      });

      // Detect when audio is muted externally (e.g., system audio controls, browser tab mute)
      audio.addEventListener('volumechange', () => {
        // Only react if this wasn't caused by our own code
        if (isProgrammaticMuteRef.current) {
          isProgrammaticMuteRef.current = false;
          return;
        }

        // If audio has been muted externally (not by us)
        if (audio.muted && !audioState.isMusicMuted) {
          logger.log('[Audio Manager] Audio muted externally, syncing game state...');
          setAudioState((prev) => ({
            ...prev,
            isMusicMuted: true,
            isBrowserMuted: true
          }));
        }
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
    const criticalSounds: SoundEffect[] = ['buttonClick'];

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
      // Set flag to indicate we're programmatically changing muted state
      isProgrammaticMuteRef.current = true;

      // Set both volume and muted property for proper browser integration
      musicAudioRef.current.muted = audioState.isMusicMuted;
      musicAudioRef.current.volume = audioState.isMusicMuted ? 0 : audioState.musicVolume;
    }
  }, [audioState.musicVolume, audioState.isMusicMuted]);

  // Update SFX volume for all cached sounds
  useEffect(() => {
    soundPoolRef.current.forEach((audio) => {
      audio.muted = audioState.isSfxMuted;
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
        if (musicAudioRef.current && audioState.currentTrack && isUserInteracted && !audioState.isMusicMuted) {
          musicAudioRef.current.play().catch((error) => {
            logger.log('Autoplay prevented:', error);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audioState.currentTrack, audioState.isMusicMuted, isUserInteracted]);

  // Manual audio unlock function - called only when user explicitly enables audio
  const unlockAudio = useCallback(() => {
    logger.log('[Audio Manager] Audio unlocked by user');
    setIsUserInteracted(true);
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
      logger.log(`Sound "${sound}" not played (muted: ${audioState.isSfxMuted}, interaction: ${isUserInteracted})`);
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
      clone.muted = audioState.isSfxMuted;
      clone.volume = audioState.isSfxMuted ? 0 : audioState.sfxVolume;
      clone.play().catch((error) => {
        logger.error(`Failed to play sound "${sound}":`, error);
      });
    } catch (error) {
      logger.error(`Error playing sound "${sound}":`, error);
    }
  }, [audioState.isSfxMuted, audioState.sfxVolume, isUserInteracted]);

  // Play background music with fade-in
  const playMusic = useCallback(async (track: BackgroundMusic) => {
    logger.log(`[Audio Manager] playMusic called with track: "${track}", isUserInteracted: ${isUserInteracted}`);

    if (!musicAudioRef.current || !isUserInteracted) {
      logger.log(`[Audio Manager] Music "${track}" queued for later (user interaction required)`);
      nextTrackRef.current = track;
      return;
    }

    const audio = musicAudioRef.current;

    // If same track is already playing, do nothing
    if (audioState.currentTrack === track && !audio.paused) {
      logger.log(`[Audio Manager] Track "${track}" already playing, skipping`);
      return;
    }

    try {
      logger.log(`[Audio Manager] Starting playback of "${track}"`);

      // Fade out current track if playing
      if (!audio.paused && audioState.currentTrack) {
        logger.log(`[Audio Manager] Fading out current track: "${audioState.currentTrack}"`);
        await fadeMusic(0, 500);
        audio.pause();
      }

      // Load new track
      logger.log(`[Audio Manager] Loading track from URL: ${MUSIC_URLS[track]}`);
      audio.src = MUSIC_URLS[track];
      audio.load();

  // Remember where in the playlist we are so rotation continues correctly
  const idx = Math.max(0, BACKGROUND_TRACK_KEYS.indexOf(track));
  playlistIndexRef.current = idx;
  setAudioState((prev) => ({ ...prev, currentTrack: track }));

      // Start at 0 volume and fade in
      audio.volume = 0;
      logger.log(`[Audio Manager] Attempting to play "${track}"...`);
      await audio.play();
      logger.log(`[Audio Manager] Playback started for "${track}"`);

      if (!audioState.isMusicMuted) {
        logger.log(`[Audio Manager] Fading in to volume ${audioState.musicVolume}`);
        await fadeMusic(audioState.musicVolume, 1000);
      }
    } catch (error) {
      logger.error(`[Audio Manager] Failed to play music "${track}":`, error);
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
    setAudioState((prev) => {
      const willUnmute = prev.isMusicMuted;

      // If unmuting and audio hasn't been unlocked yet, unlock it
      if (willUnmute && !isUserInteracted) {
        setIsUserInteracted(true);
      }

      return {
        ...prev,
        isMusicMuted: !prev.isMusicMuted,
        // Clear browser muted flag when user manually toggles
        isBrowserMuted: false
      };
    });
  }, [isUserInteracted]);

  // Toggle SFX mute
  const toggleSfxMute = useCallback(() => {
    setAudioState((prev) => {
      const willUnmute = prev.isSfxMuted;

      // If unmuting and audio hasn't been unlocked yet, unlock it
      if (willUnmute && !isUserInteracted) {
        setIsUserInteracted(true);
      }

      return { ...prev, isSfxMuted: !prev.isSfxMuted };
    });
  }, [isUserInteracted]);

  // Set music muted state
  const setMusicMuted = useCallback((muted: boolean) => {
    // If unmuting and audio hasn't been unlocked yet, unlock it
    if (!muted && !isUserInteracted) {
      setIsUserInteracted(true);
    }

    setAudioState((prev) => ({
      ...prev,
      isMusicMuted: muted,
      // Clear browser muted flag when user manually sets mute state
      isBrowserMuted: false
    }));
  }, [isUserInteracted]);

  // Set SFX muted state
  const setSfxMuted = useCallback((muted: boolean) => {
    // If unmuting and audio hasn't been unlocked yet, unlock it
    if (!muted && !isUserInteracted) {
      setIsUserInteracted(true);
    }

    setAudioState((prev) => ({ ...prev, isSfxMuted: muted }));
  }, [isUserInteracted]);

  // Skip to next track in the playlist
  const nextTrack = useCallback(async () => {
    if (!musicAudioRef.current) return;

    const audio = musicAudioRef.current;
    const nextIdx = (playlistIndexRef.current + 1) % BACKGROUND_TRACK_KEYS.length;
    playlistIndexRef.current = nextIdx;
    const nextKey = BACKGROUND_TRACK_KEYS[nextIdx];

    try {
      // Fade out current track
      if (!audio.paused) {
        await fadeMusic(0, 300);
        audio.pause();
      }

      // Load and play next track
      audio.src = MUSIC_URLS[nextKey];
      audio.load();
      setAudioState((prev) => ({ ...prev, currentTrack: nextKey }));

      // Start at 0 volume and fade in
      audio.volume = 0;
      await audio.play();

      if (!audioState.isMusicMuted) {
        await fadeMusic(audioState.musicVolume, 1000);
      }
    } catch (error) {
      console.error(`[Audio Manager] Failed to skip to next track "${nextKey}":`, error);
    }
  }, [audioState.musicVolume, audioState.isMusicMuted, fadeMusic]);

  // Play queued track on first user interaction
  useEffect(() => {
    if (isUserInteracted && nextTrackRef.current) {
      const track = nextTrackRef.current;
      nextTrackRef.current = null;
      playMusic(track);
    }
  }, [isUserInteracted, playMusic]);

  // Start playlist randomly on mount (but obey user interaction rules)
  useEffect(() => {
    // Choose a random starting index
    const idx = Math.floor(Math.random() * BACKGROUND_TRACK_KEYS.length);
    playlistIndexRef.current = idx;
    const startKey = BACKGROUND_TRACK_KEYS[idx];
    // Queue the randomly selected starting track. It will be played after
    // the first user interaction (autoplay policies) by the effect that
    // listens for `isUserInteracted`.
    nextTrackRef.current = startKey as BackgroundMusic;
  }, []);

  // Ducking: lower music volume while voiceovers play
  const duckMusic = useCallback(async () => {
    if (!musicAudioRef.current) return;
    try {
      // If music is muted, don't duck (it's already at 0)
      if (audioState.isMusicMuted) {
        setAudioState((prev) => ({ ...prev, isMusicDucked: true }));
        return;
      }

      if (previousMusicVolumeRef.current == null) previousMusicVolumeRef.current = musicAudioRef.current.volume;
      const baseVol = previousMusicVolumeRef.current ?? audioState.musicVolume;
      const target = Math.max(0, baseVol * 0.12);
      // Smoothly fade down to the ducked level
      await fadeMusic(target, 200);
      setAudioState((prev) => ({ ...prev, isMusicDucked: true }));
    } catch (e) {
      console.error('Error while ducking music:', e);
    }
  }, [audioState.musicVolume, audioState.isMusicMuted, fadeMusic]);

  const unduckMusic = useCallback(async () => {
    if (!musicAudioRef.current) return;
    try {
      const prev = previousMusicVolumeRef.current ?? audioState.musicVolume;
      // Only restore volume if music is not muted
      const targetVolume = audioState.isMusicMuted ? 0 : prev;
      await fadeMusic(targetVolume, 300);
      previousMusicVolumeRef.current = null;
      setAudioState((prev) => ({ ...prev, isMusicDucked: false }));
    } catch (e) {
      console.error('Error while unducking music:', e);
    }
  }, [audioState.musicVolume, audioState.isMusicMuted, fadeMusic]);

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
    duckMusic,
    unduckMusic,
    nextTrack,
    unlockAudio,
    audioState,
  };
};
