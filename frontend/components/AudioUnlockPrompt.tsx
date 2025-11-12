import React from 'react';
import { Volume2 } from 'lucide-react';

interface AudioUnlockPromptProps {
  onUnlock: () => void;
  onSkip: () => void;
}

const AudioUnlockPrompt: React.FC<AudioUnlockPromptProps> = ({ onUnlock, onSkip }) => {
  return (
    <div className="modal-overlay">
      <div className="card max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-brand-primary/20 rounded-full">
            <Volume2 className="w-8 h-8 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Enable Audio?</h2>
            <p className="text-sm text-secondary">Enhance your experience with music & sound effects</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2 text-sm text-secondary">
            <span className="text-brand-primary">•</span>
            <p>Background music to set the mood</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-secondary">
            <span className="text-brand-primary">•</span>
            <p>Sound effects for actions and achievements</p>
          </div>
          <div className="flex items-start gap-2 text-sm text-secondary">
            <span className="text-brand-primary">•</span>
            <p>You can adjust or mute audio anytime in settings</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onUnlock}
            className="btn-primary flex-1 py-3 font-semibold shadow-theme-lg hover:shadow-brand-primary/50"
          >
            Enable Audio
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-3 bg-overlay hover:bg-overlay/80 text-secondary rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>

        <p className="text-xs text-disabled text-center mt-4">
          You can change these settings anytime from the audio menu
        </p>
      </div>
    </div>
  );
};

export default AudioUnlockPrompt;
