export type SoundEffect =
  | 'buttonClick'
  | 'buttonHover'
  | 'achievementUnlock'
  | 'cashGain'
  | 'cashLoss'
  | 'fameIncrease'
  | 'gameOver'
  | 'weekAdvance'
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
  // Whether the browser has externally muted the tab (e.g., user right-clicked tab → Mute)
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

  // State
  audioState: AudioState;
}

// Placeholder audio URLs from free sources
export const SOUND_URLS: Record<SoundEffect, string> = {
  buttonClick: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3', // Click sound
  buttonHover: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24d9e91124.mp3', // Subtle hover
  achievementUnlock: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3', // Success chime
  cashGain: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_5963ba2b42.mp3', // Coins
  cashLoss: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d1718ab41b.mp3', // Negative tone
  fameIncrease: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3', // Uplifting
  gameOver: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_2d789b73c1.mp3', // Sad/dramatic
  weekAdvance: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_fb9b90f6ff.mp3', // Subtle whoosh
  contractSign: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c24b472bc1.mp3', // Signature
  lessonComplete: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3', // Success ding
};

export const MUSIC_URLS: Record<BackgroundMusic, string> = {
  // Legacy tracks (can be replaced with local files later)
  menu: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Chill ambient (for reference)
  gameplay: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe5c20c.mp3', // Different upbeat track
  gameOver: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_8d32d1f0e5.mp3', // Melancholic

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
