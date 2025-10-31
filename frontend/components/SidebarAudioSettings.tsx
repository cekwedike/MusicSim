import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { MusicNoteIcon } from './icons/Icons';

const SidebarAudioSettings: React.FC = () => {
  const { audioState, setMusicVolume, setSfxVolume, toggleMusicMute, toggleSfxMute, playSound, nextTrack } = useAudio();

  return (
    <div className="text-gray-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-violet-600/20 rounded-md text-violet-300">
          <MusicNoteIcon />
        </div>
        <div>
          <h3 className="text-lg font-bold">Audio</h3>
          <p className="text-xs text-gray-400">Music & sound effects controls</p>
        </div>
      </div>

      <section className="mb-6 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white">Background Music</h4>
            <p className="text-xs text-gray-400">Volume and mute for background tracks</p>
          </div>
          <button onClick={toggleMusicMute} className={`px-3 py-1 rounded ${audioState.isMusicMuted ? 'bg-red-600 text-white' : 'bg-violet-600 text-white'}`}>
            {audioState.isMusicMuted ? 'Muted' : 'On'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-violet"
          />
          <div className="w-12 text-right text-sm text-gray-300">{Math.round(audioState.musicVolume * 100)}%</div>
        </div>
      </section>

      <section className="mb-6 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white">Sound Effects</h4>
            <p className="text-xs text-gray-400">Button clicks & game sounds</p>
          </div>
          <button onClick={toggleSfxMute} className={`px-3 py-1 rounded ${audioState.isSfxMuted ? 'bg-red-600 text-white' : 'bg-violet-600 text-white'}`}>
            {audioState.isSfxMuted ? 'Muted' : 'On'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-violet"
          />
          <div className="w-12 text-right text-sm text-gray-300">{Math.round(audioState.sfxVolume * 100)}%</div>
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={() => playSound('buttonClick')} className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">Test SFX</button>
        <button onClick={() => nextTrack()} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Next Track</button>
      </div>

      <style>{`
        .slider-violet::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: rgb(139,92,246); cursor: pointer; }
        .slider-violet::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: rgb(139,92,246); cursor: pointer; border: none; }
      `}</style>
    </div>
  );
};

export default SidebarAudioSettings;
