# Pixabay Sound Effects Migration

## Overview
This document lists all sound effects currently loaded from Pixabay CDN URLs that need to be downloaded and migrated to local files. These URLs are returning 403 errors and causing issues with game functionality, particularly when loading saved games on new devices.

---

## Current Problem
- **Location**: `frontend/types/audio.ts:72-83` (SOUND_URLS object)
- **Issue**: All sound effects are loaded from `https://cdn.pixabay.com/download/audio/...` URLs
- **Impact**:
  - 403 Forbidden errors on CDN requests
  - Sounds don't load or play
  - Game load failures on new devices
  - Poor user experience due to missing audio feedback

---

## Sound Effects to Download

### 1. Button Click
- **Current URL**: `https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3`
- **Usage**: Button click sound
- **Variable**: `buttonClick`
- **Target Path**: `/audio/sounds/button-click.mp3`

### 2. Button Hover
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/15/audio_24d9e91124.mp3`
- **Usage**: Subtle hover sound
- **Variable**: `buttonHover`
- **Target Path**: `/audio/sounds/button-hover.mp3`

### 3. Achievement Unlock
- **Current URL**: `https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3`
- **Usage**: Success chime for achievements (also used for fameIncrease and lessonComplete)
- **Variable**: `achievementUnlock`, `fameIncrease`, `lessonComplete`
- **Target Path**: `/audio/sounds/achievement-unlock.mp3`
- **Note**: This sound is reused for 3 different sound effects

### 4. Cash Gain
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/10/audio_5963ba2b42.mp3`
- **Usage**: Coins/money gain sound
- **Variable**: `cashGain`
- **Target Path**: `/audio/sounds/cash-gain.mp3`

### 5. Cash Loss
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/15/audio_d1718ab41b.mp3`
- **Usage**: Negative tone for losing money
- **Variable**: `cashLoss`
- **Target Path**: `/audio/sounds/cash-loss.mp3`

### 6. Game Over
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/20/audio_2d789b73c1.mp3`
- **Usage**: Sad/dramatic game over sound
- **Variable**: `gameOver`
- **Target Path**: `/audio/sounds/game-over.mp3`

### 7. Week Advance
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/15/audio_fb9b90f6ff.mp3`
- **Usage**: Subtle whoosh for week transitions
- **Variable**: `weekAdvance`
- **Target Path**: `/audio/sounds/week-advance.mp3`

### 8. Contract Sign
- **Current URL**: `https://cdn.pixabay.com/download/audio/2022/03/10/audio_c24b472bc1.mp3`
- **Usage**: Signature/contract signing sound
- **Variable**: `contractSign`
- **Target Path**: `/audio/sounds/contract-sign.mp3`

---

## Download Instructions

1. **Create the sounds directory**:
   ```
   frontend/public/audio/sounds/
   ```

2. **Download each file**:
   - Visit each URL in your browser
   - Save the MP3 file with the name specified in "Target Path"
   - Place in `frontend/public/audio/sounds/`

3. **Update the code**:
   - Modify `frontend/types/audio.ts` to update the SOUND_URLS object
   - Change from CDN URLs to local paths (e.g., `/audio/sounds/button-click.mp3`)

---

## Files That Need Updates

### `frontend/types/audio.ts`
Update the `SOUND_URLS` object (lines 72-83) to use local paths instead of CDN URLs.

**Before**:
```typescript
export const SOUND_URLS: Record<SoundEffect, string> = {
  buttonClick: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
  buttonHover: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24d9e91124.mp3',
  // ... etc
};
```

**After**:
```typescript
export const SOUND_URLS: Record<SoundEffect, string> = {
  buttonClick: '/audio/sounds/button-click.mp3',
  buttonHover: '/audio/sounds/button-hover.mp3',
  achievementUnlock: '/audio/sounds/achievement-unlock.mp3',
  cashGain: '/audio/sounds/cash-gain.mp3',
  cashLoss: '/audio/sounds/cash-loss.mp3',
  fameIncrease: '/audio/sounds/achievement-unlock.mp3', // Reuses same file
  gameOver: '/audio/sounds/game-over.mp3',
  weekAdvance: '/audio/sounds/week-advance.mp3',
  contractSign: '/audio/sounds/contract-sign.mp3',
  lessonComplete: '/audio/sounds/achievement-unlock.mp3', // Reuses same file
};
```

---

## Summary

**Total unique URLs to download**: 8 unique sound files
- Note: `achievementUnlock`, `fameIncrease`, and `lessonComplete` all share the same audio file

**Total sound effects**: 10 (some reuse the same audio file)

---

## Current Status

### Already Migrated to Local Files ✅
- **Background Music**: All tracks (bg1-bg11) are now local files in `/audio/music/`
- **Scenario Voiceovers**: All `.m4a` files in `/audio/scenarios/` are local

### Needs Migration ❌
- **Sound Effects**: All 10 sound effects in SOUND_URLS are still using Pixabay CDN URLs

---

## Fallback Approach

### Option 1: Silent Fallback (Current Behavior)
If a sound fails to load, the game continues without audio feedback. This is the current implicit behavior but provides poor UX.

### Option 2: Default/Placeholder Sounds
Create simple, minimal sound effects as fallbacks:
- Use the Web Audio API to generate basic tones
- Store tiny embedded base64-encoded sounds as fallbacks
- Provides some feedback even if downloads fail

### Option 3: Error Detection with User Notification
Detect when sounds fail to load and:
- Show a one-time notification to the user
- Offer to retry loading sounds
- Allow users to continue without sounds
- Log errors for debugging

### Recommended Approach: Hybrid Strategy
1. **Primary**: Use local files (eliminates 403 errors)
2. **Fallback Level 1**: Retry loading the sound once if it fails
3. **Fallback Level 2**: Use Web Audio API to generate a simple beep/click
4. **Fallback Level 3**: Silent operation (no sound)
5. **User Notification**: Show a dismissible warning if sounds fail to load initially

### Implementation Example for Fallback

```typescript
// In useAudioManager.ts or a new utility file
const loadSoundWithFallback = async (url: string, soundName: string): Promise<HTMLAudioElement> => {
  const audio = new Audio();

  try {
    audio.src = url;
    await audio.load();
    return audio;
  } catch (error) {
    console.warn(`Failed to load sound: ${soundName} from ${url}`, error);

    // Fallback: Generate simple tone using Web Audio API
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure based on sound type
    oscillator.frequency.value = getSoundFrequency(soundName);
    gainNode.gain.value = 0.3;

    // Return a mock Audio element that plays the generated tone
    return createFallbackAudioElement(oscillator, gainNode, audioContext);
  }
};

const getSoundFrequency = (soundName: string): number => {
  // Map sound names to frequencies
  const frequencies: Record<string, number> = {
    buttonClick: 800,
    buttonHover: 600,
    achievementUnlock: 1000,
    cashGain: 1200,
    cashLoss: 400,
    fameIncrease: 900,
    gameOver: 300,
    weekAdvance: 500,
    contractSign: 700,
    lessonComplete: 1100,
  };
  return frequencies[soundName] || 440;
};
```

---

## License Information

All sounds are from Pixabay and licensed under the Pixabay License, which allows:
- Free use for commercial and non-commercial purposes
- No attribution required (but appreciated)
- Modification allowed

Ensure that downloaded files are properly stored and backed up as part of the project assets.
