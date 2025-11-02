import React from 'react';
import { Volume2 } from 'lucide-react';

interface AudioUnlockPromptProps {
  onUnlock: () => void;
  onSkip: () => void;
}

const AudioUnlockPrompt: React.FC<AudioUnlockPromptProps> = ({ onUnlock, onSkip }) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 border border-gray-700 rounded-lg shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-violet-600/20 rounded-full">
            <Volume2 className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Enable Audio?</h2>
            <p className="text-sm text-gray-400">Enhance your experience with music & sound effects</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-violet-400">•</span>
            <p>Background music to set the mood</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-violet-400">•</span>
            <p>Sound effects for actions and achievements</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-violet-400">•</span>
            <p>You can adjust or mute audio anytime in settings</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onUnlock}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-violet-500/50"
          >
            Enable Audio
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can change these settings anytime from the audio menu
        </p>
      </div>
    </div>
  );
};

export default AudioUnlockPrompt;
