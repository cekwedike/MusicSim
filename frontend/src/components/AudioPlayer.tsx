import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

interface AudioPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  autoPlay = false,
  onEnded,
  className = ''
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  // useAudio throws if the provider is missing; guard to avoid crashing when used outside provider
  let volume = 1;
  let isMuted = false;
  // Keep a reference to audio manager so we can duck/unduck background music when voiceovers play
  let audioManagerCtx: any = null;
  try {
    const ctx = useAudio();
    audioManagerCtx = ctx;
    // AudioManager exposes audioState with sfx/music volumes
    volume = ctx.audioState?.sfxVolume ?? 1;
    isMuted = ctx.audioState?.isSfxMuted ?? false;
  } catch (e) {
    // If context isn't available, fall back to defaults and log a warning
    // eslint-disable-next-line no-console
    console.warn('[AudioPlayer] useAudio hook not available, using defaults', e);
  }

  // Update audio volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle autoplay and cleanup
  useEffect(() => {
    const audio = audioRef.current;

    if (audio && autoPlay && !isMuted) {
      // Duck music IMMEDIATELY before any delay so it's ready when voiceover plays
      try { audioManagerCtx?.duckMusic?.(); } catch (err) { /* ignore */ }

      // Delay autoplay slightly for better UX
      const timer = setTimeout(() => {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('[AudioPlayer] Auto-playing:', audioSrc);
              setIsPlaying(true);
            })
            .catch(error => {
              console.warn('[AudioPlayer] Auto-play prevented:', error);
              // Auto-play was prevented (browser policy) - that's okay
              // Unduck if autoplay failed
              try { audioManagerCtx?.unduckMusic?.(); } catch (err) { /* ignore */ }
            });
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        // Ensure we unduck music on cleanup
        try { audioManagerCtx?.unduckMusic?.(); } catch (err) { /* ignore */ }
      };
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        // Ensure we unduck music on cleanup
        try { audioManagerCtx?.unduckMusic?.(); } catch (err) { /* ignore */ }
      }
    };
  }, [audioSrc, autoPlay, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // If audio has ended, reset to beginning
      if (hasEnded) {
        audio.currentTime = 0;
        setHasEnded(false);
      }

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            try { audioManagerCtx?.duckMusic?.(); } catch (err) { /* ignore */ }
          })
          .catch(error => {
            console.error('[AudioPlayer] Play error:', error);
            setHasError(true);
          });
      }
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setHasEnded(false);

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          try { audioManagerCtx?.duckMusic?.(); } catch (err) { /* ignore */ }
        })
        .catch(error => {
          console.error('[AudioPlayer] Replay error:', error);
          setHasError(true);
        });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    // Restore music volume when voiceover finishes
    try { audioManagerCtx?.unduckMusic?.(); } catch (err) { /* ignore */ }
    onEnded?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('[AudioPlayer] Error loading audio:', audioSrc, e);
    setHasError(true);
    setIsPlaying(false);
    try { audioManagerCtx?.unduckMusic?.(); } catch (err) { /* ignore */ }
  };

  // If error loading audio, don't render anything (graceful degradation)
  if (hasError) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleError}
      />

      <button
        onClick={togglePlay}
        disabled={isMuted}
        className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isPlaying ? 'Playing...' : hasEnded ? 'Replay' : 'Play Audio'}
        </span>
      </button>

      {/* Replay button (when audio has ended) */}
      {hasEnded && (
        <button
          onClick={handleReplay}
          disabled={isMuted}
          className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg transition-colors"
          aria-label="Replay audio"
          title="Replay"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}

      {/* Playing animation */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          <span className="w-1 h-3 bg-violet-500 rounded-full animate-pulse"></span>
          <span className="w-1 h-4 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-3 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          <span className="w-1 h-4 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></span>
        </div>
      )}

      {/* Muted indicator */}
      {isMuted && (
        <span className="text-xs text-gray-400 italic">
          (Audio muted)
        </span>
      )}
    </div>
  );
};
