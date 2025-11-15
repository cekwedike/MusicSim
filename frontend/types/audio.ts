export type SoundEffect =
  | 'buttonClick'
  | 'achievementUnlock'
  | 'cashGain'
  | 'gameOver'
  | 'contractSign'
  | 'lessonComplete';

export type BackgroundMusic =
  | 'menu'
  | 'gameplay'
  | 'gameOver'
  | 'bg1'
  | 'bg2'
  | 'bg3'
  | 'bg4'
  | 'bg5'
  | 'bg6'
  | 'bg7'
  | 'bg8'
  | 'bg9'
  | 'bg10'
  | 'bg11';

export interface AudioState {
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  currentTrack: BackgroundMusic | null;
  // Whether music is currently ducked because a voiceover is playing
  isMusicDucked?: boolean;
  // Whether audio has been muted externally (e.g., system controls, browser tab mute, OS restrictions)
  isBrowserMuted?: boolean;
}

export interface AudioManager {
  // Playback controls
  playSound: (sound: SoundEffect) => void;
  playMusic: (track: BackgroundMusic) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  nextTrack: () => void; // Skip to next track in playlist

  // Volume controls
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;

  // Mute controls
  toggleMusicMute: () => void;
  toggleSfxMute: () => void;
  setMusicMuted: (muted: boolean) => void;
  setSfxMuted: (muted: boolean) => void;

  // Ducking controls for voiceover — temporarily lower background music
  duckMusic: () => void;
  unduckMusic: () => void;

  // Audio unlock - enables audio playback after user consent
  unlockAudio: () => void;

  // State
  audioState: AudioState;
}

// Sound effects - local files from /public/audio/sounds/
export const SOUND_URLS: Record<SoundEffect, string> = {
  buttonClick: '/audio/sounds/button-click.mp3',
  achievementUnlock: '/audio/sounds/achievement-unlock.mp3',
  cashGain: '/audio/sounds/cash-gain.mp3',
  gameOver: '/audio/sounds/game-over.mp3',
  contractSign: '/audio/sounds/contract-sign.mp3',
  lessonComplete: '/audio/sounds/achievement-unlock.mp3', // Reuses achievement sound
};

export const MUSIC_URLS: Record<BackgroundMusic, string> = {
  // Legacy tracks disabled - external Pixabay CDN URLs return 403
  menu: '', // Disabled
  gameplay: '', // Disabled
  gameOver: '', // Disabled

  // Dynamic background tracks - LOCAL FILES (African & Afrobeat themed)
  // Place downloaded files in: frontend/public/audio/music/
  bg1: '/audio/music/bg1-smooth-chill.mp3', // Smooth Chill Ambient
  bg2: '/audio/music/bg2-groovy-vibe.mp3', // Groovy Vibe (Pixabay ID: 427121)
  bg3: '/audio/music/bg3-eclipse-valor.mp3', // Eclipse of Valor (Pixabay ID: 427664)
  bg4: '/audio/music/bg4-african-background.mp3', // African Background Music (Pixabay ID: 348249)
  bg5: '/audio/music/bg5-jabali-breakbeat.mp3', // Jabali Breakbeat (Pixabay ID: 253188)
  bg6: '/audio/music/bg6-african-inspiring.mp3', // African Inspiring (Pixabay ID: 347205)
  bg7: '/audio/music/bg7-afro-beat-pop.mp3', // Afro Beat Pop (Pixabay ID: 390207)
  bg8: '/audio/music/bg8-african-tribal.mp3', // African Tribal (Pixabay ID: 342635)
  bg9: '/audio/music/bg9-kora.mp3', // Kora (Pixabay ID: 336239)
  bg10: '/audio/music/bg10-amapiano.mp3', // Amapiano (Pixabay ID: 244452)
  bg11: '/audio/music/bg11-lofi-song.mp3', // Lofi Song (Pixabay ID: 424604)
};

// Local storage key for audio preferences
export const AUDIO_STORAGE_KEY = 'musicsim_audio_preferences';
