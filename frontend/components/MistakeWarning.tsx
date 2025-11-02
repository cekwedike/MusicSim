import React from 'react';

interface MistakeWarningProps {
  scenarioTitle: string;
  choiceText: string;
  predictedOutcome: string;
  onProceed: () => void;
  onReconsider: () => void;
}

export const MistakeWarning: React.FC<MistakeWarningProps> = ({
  scenarioTitle,
  choiceText,
  predictedOutcome,
  onProceed,
  onReconsider
}) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-yellow-500 max-w-md w-full mx-4 p-6 shadow-2xl">
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">Are you sure?</h2>
        </div>

        {/* Warning Content */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <h3 className="text-sm font-bold text-gray-300 mb-1">Scenario:</h3>
            <p className="text-gray-400 text-sm">{scenarioTitle}</p>
          </div>

          <div className="bg-gray-700/50 p-3 rounded-lg">
            <h3 className="text-sm font-bold text-gray-300 mb-1">Your Choice:</h3>
            <p className="text-gray-400 text-sm">{choiceText}</p>
          </div>

          <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
            <h3 className="text-sm font-bold text-red-400 mb-1">Warning:</h3>
            <p className="text-red-300 text-sm">{predictedOutcome}</p>
          </div>

          <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
            <h3 className="text-sm font-bold text-green-400 mb-1">💡 Beginner Mode Tip:</h3>
            <p className="text-green-300 text-sm">
              This choice might significantly hurt your career. Beginner Mode lets you reconsider 
              choices that could cause major setbacks while you're learning the music business.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReconsider}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Reconsider
          </button>
          <button
            onClick={onProceed}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Proceed Anyway
          </button>
        </div>

        {/* Educational Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            This warning only appears in Beginner Mode. In Realistic and Hardcore modes, 
            all choices are final.
          </p>
        </div>
      </div>
    </div>
  );
};