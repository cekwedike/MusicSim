# MusicSim Audio Assets Directory

This directory contains all background music files and audio assets for the MusicSim application. The audio system provides dynamic background music that enhances the gameplay experience while maintaining focus on the educational and strategic elements of the simulation.

Official website: https://www.musicsim.net

## Audio System Overview

The MusicSim audio system features:
- Dynamic background music rotation during gameplay
- Context-sensitive audio for different game states
- User-controlled volume and playback settings
- High-quality audio files optimized for web delivery
- Comprehensive licensing compliance for all audio assets

## Required Background Music Files

The following music files must be placed in this directory with exact naming conventions for proper audio system functionality:

### Primary Background Tracks

1. **bg1-smooth-chill.mp3**
   - Track: Smooth Chill Ambient
   - Purpose: Default background music for gameplay
   - Style: Ambient, non-intrusive
   - Duration: Extended loop suitable for long gameplay sessions

2. **bg2-groovy-vibe.mp3**
   - Track: Groovy Vibe
   - Pixabay ID: 427121
   - Purpose: Upbeat background for successful scenarios
   - Style: Groovy, energetic

3. **bg3-eclipse-valor.mp3**
   - Track: Eclipse of Valor
   - Pixabay ID: 427664
   - Purpose: Dramatic background for challenging decisions
   - Style: Cinematic, epic

4. **bg4-african-background.mp3**
   - Track: African Background Music
   - Pixabay ID: 348249
   - Purpose: Cultural context for African music industry scenarios
   - Style: Traditional African instruments and rhythms

5. **bg5-jabali-breakbeat.mp3**
   - Track: Jabali Breakbeat
   - Pixabay ID: 253188
   - Purpose: Modern African music inspiration
   - Style: Contemporary breakbeat with African influences

6. **bg6-african-inspiring.mp3**
   - Track: African Inspiring
   - Pixabay ID: 347205
   - Purpose: Motivational background for career progression
   - Style: Uplifting African-inspired melodies

7. **bg7-afro-beat-pop.mp3**
   - Track: Afro Beat Pop
   - Pixabay ID: 390207
   - Purpose: Contemporary African pop context
   - Style: Modern Afrobeat production

8. **bg8-african-tribal.mp3**
   - Track: African Tribal
   - Pixabay ID: 342635
   - Purpose: Traditional music industry heritage
   - Style: Tribal drums and traditional instruments

9. **bg9-kora.mp3**
   - Track: Kora
   - Pixabay ID: 336239
   - Purpose: West African musical tradition representation
   - Style: Traditional Kora harp melodies

10. **bg10-amapiano.mp3**
    - Track: Amapiano
    - Pixabay ID: 244452
    - Purpose: South African house music genre representation
    - Style: Contemporary Amapiano production

11. **bg11-lofi-song.mp3**
    - Track: Lofi Song
    - Pixabay ID: 424604
    - Purpose: Relaxed background for learning modules
    - Style: Lo-fi hip hop, study-friendly

### Optional Audio Files

These files provide additional audio context for specific game states:

- **menu-music.mp3**
  - Purpose: Main menu and landing page background music
  - Style: Welcoming, introductory
  - Usage: Plays during initial game setup and navigation

- **gameplay-music.mp3**
  - Purpose: General gameplay background when specific tracks are not required
  - Style: Neutral, non-distracting
  - Usage: Fallback track for standard gameplay sessions

- **gameover-music.mp3**
  - Purpose: Career conclusion and game over scenarios
  - Style: Reflective, conclusive
  - Usage: Plays during career summary and game completion

## Audio File Specifications

### Technical Requirements

- **Format**: MP3 (MPEG-1 Audio Layer III)
- **Bitrate**: 128-320 kbps (recommended: 256 kbps)
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo (2-channel)
- **File Size**: Optimized for web delivery (typically 3-8 MB per track)
- **Duration**: 3-8 minutes per track with seamless loop capability

### Quality Standards

- Audio files must be high quality without artifacts or distortion
- Consistent volume levels across all tracks (normalized to -14 LUFS)
- Clean starts and ends for seamless looping
- No silence padding at beginning or end of tracks
- Appropriate dynamic range for background music usage

## Licensing and Legal Compliance

### License File Requirements

All audio files must be accompanied by corresponding license documentation stored in the `licenses/` subdirectory:

```
licenses/
├── bg1-smooth-chill-LICENSE.txt
├── bg2-groovy-vibe-LICENSE.txt
├── bg3-eclipse-valor-LICENSE.txt
├── bg4-african-background-LICENSE.txt
├── bg5-jabali-breakbeat-LICENSE.txt
├── bg6-african-inspiring-LICENSE.txt
├── bg7-afro-beat-pop-LICENSE.txt
├── bg8-african-tribal-LICENSE.txt
├── bg9-kora-LICENSE.txt
├── bg10-amapiano-LICENSE.txt
├── bg11-lofi-song-LICENSE.txt
├── menu-music-LICENSE.txt
├── gameplay-music-LICENSE.txt
└── gameover-music-LICENSE.txt
```

### License Information Required

Each license file must contain:
- Track title and artist information
- Source platform (e.g., Pixabay, Freesound)
- License type and terms
- Attribution requirements (if any)
- Commercial use permissions
- Date of download and license agreement
- Original file URL and ID number

### Pixabay License Compliance

For Pixabay-sourced tracks:
- Pixabay License allows free use for commercial and non-commercial purposes
- No attribution required but appreciated
- Cannot resell or redistribute as standalone audio products
- Can be used in software applications and websites
- Must download both audio file and license documentation

## Audio Download and Installation Process

### Step-by-Step Download Instructions

1. **Access Source Platform**
   - Navigate to Pixabay.com or specified audio source
   - Use provided track ID numbers to locate specific tracks

2. **Download Audio Files**
   - Click "Free Download" button on track page
   - Select highest available quality (typically 320 kbps MP3)
   - Save file to temporary download location

3. **Download License Documentation**
   - Download license information from track page
   - Save license as text file with track-specific naming

4. **File Preparation**
   - Rename audio files according to specified naming convention
   - Verify file format and quality specifications
   - Test audio playback to ensure file integrity

5. **Installation in Project**
   - Place renamed audio files in this directory
   - Place license files in `licenses/` subdirectory
   - Update audio system configuration if necessary

### Quality Verification Checklist

- [ ] All required audio files are present with correct naming
- [ ] Audio files meet technical specifications
- [ ] License files are complete and properly stored
- [ ] Audio playback functions correctly in development environment
- [ ] Volume levels are consistent across all tracks
- [ ] No audio artifacts or quality issues detected

## Audio System Integration

### Developer Implementation Notes

- Audio files are loaded dynamically by the React audio system
- File names are referenced in `AudioContext.tsx` configuration
- Volume controls are managed through user settings persistence
- Audio playback respects user preferences and device capabilities
- Fallback handling ensures graceful degradation if files are missing

### Configuration Settings

Audio system settings in the application:
- **Default Volume**: 50% for non-intrusive gameplay
- **Auto-play**: Disabled by default for user control
- **Loop Mode**: Enabled for continuous background ambiance
- **Fade Transitions**: Smooth transitions between tracks
- **Context Switching**: Dynamic track selection based on game state

## Troubleshooting Common Issues

### Audio Files Not Playing

1. **Verify File Presence**: Ensure all required files are in correct directory
2. **Check File Naming**: Confirm exact naming matches requirements
3. **Validate File Format**: Ensure files are valid MP3 format
4. **Test File Integrity**: Play files independently to verify quality
5. **Browser Compatibility**: Check browser audio codec support

### Poor Audio Quality

1. **Check Source Quality**: Verify original download quality settings
2. **Validate Bitrate**: Ensure files meet minimum bitrate requirements
3. **Audio Compression**: Check for over-compression artifacts
4. **Volume Normalization**: Verify consistent volume levels

### License Compliance Issues

1. **Verify License Terms**: Review all license documentation
2. **Check Attribution**: Ensure proper attribution if required
3. **Commercial Use Rights**: Confirm commercial use permissions
4. **Update Documentation**: Maintain current license records

## Performance Optimization

### Web Delivery Optimization

- Files are served with appropriate HTTP headers for caching
- Progressive loading prevents blocking of initial page load
- Audio preloading is managed based on user interaction
- Compression balances quality with download speed

### Browser Compatibility

- MP3 format ensures broad browser support
- Fallback mechanisms handle unsupported audio contexts
- Mobile device optimization for battery conservation
- Touch-based interaction compliance for mobile browsers

## Maintenance and Updates

### Regular Maintenance Tasks

- Periodic review of license compliance and terms
- Audio quality assessment and optimization
- User feedback integration for audio preferences
- Performance monitoring for audio loading times

### Version Control Considerations

- Audio files are typically excluded from Git repositories due to size
- License files should be version controlled
- Audio configuration files require version tracking
- Documentation updates should reflect audio system changes

For technical support regarding audio integration:
- GitHub Issues: [MusicSim Repository](https://github.com/cekwedike/MusicSim/issues)
- Audio System Documentation: `/docs/audio/`
