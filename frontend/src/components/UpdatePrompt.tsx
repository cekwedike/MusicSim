import React from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}


const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate, onDismiss }) => {
  // Ensure modal closes before triggering update
  const handleUpdateClick = () => {
    onDismiss();
    setTimeout(() => {
      onUpdate();
    }, 100); // allow modal to close visually before reload
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Update Available
            </h3>
            <p className="text-gray-200 text-sm mb-4">
              A new version of MusicSim is available. Please refresh to get the latest features and improvements.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateClick}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
              >
                Update Now
              </button>

              <button
                onClick={onDismiss}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                aria-label="Dismiss update"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              You can dismiss this and update later when prompted again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
