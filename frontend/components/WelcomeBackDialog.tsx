import React from 'react';

interface WelcomeBackDialogProps {
  artistName: string;
  onClose: () => void;
}

const WelcomeBackDialog: React.FC<WelcomeBackDialogProps> = ({ artistName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border-2 border-red-500 rounded-xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-red-300 mb-2">
            Welcome Back!
          </h2>
          <p className="text-xl text-gray-200 mb-1">
            {artistName}
          </p>
          <p className="text-gray-400">
            Resuming your career...
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform shadow-lg"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default WelcomeBackDialog;