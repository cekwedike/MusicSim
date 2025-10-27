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
  | 'gameOver';

export interface AudioState {
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  musicVolume: number; // 0-1
  sfxVolume: number; // 0-1
  currentTrack: BackgroundMusic | null;
}

export interface AudioManager {
  // Playback controls
  playSound: (sound: SoundEffect) => void;
  playMusic: (track: BackgroundMusic) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;

  // Volume controls
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;

  // Mute controls
  toggleMusicMute: () => void;
  toggleSfxMute: () => void;
  setMusicMuted: (muted: boolean) => void;
  setSfxMuted: (muted: boolean) => void;

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
  menu: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Chill ambient
  gameplay: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_3b7c1a5c9c.mp3', // Upbeat motivational
  gameOver: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_8d32d1f0e5.mp3', // Melancholic
};

// Local storage key for audio preferences
export const AUDIO_STORAGE_KEY = 'musicsim_audio_preferences';
