import React, { useState } from 'react';
import { Music, BookOpen, Trophy } from 'lucide-react';
import { LoginModal } from './LoginModal';

interface LandingPageProps {
  onPlayAsGuest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlayAsGuest }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  const handleShowLogin = () => {
    setLoginMode('login');
    setShowLoginModal(true);
  };

  const handleShowRegister = () => {
    setLoginMode('register');
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black mb-4 text-white drop-shadow-lg">
            MusicSim
          </h1>
          <p className="text-2xl md:text-3xl text-white font-semibold tracking-wide">
            A Music Business Simulation
          </p>
        </div>

        {/* Tagline */}
        <div className="mb-12 space-y-4">
          <p className="text-xl md:text-2xl text-gray-100 font-medium">
            Build your music career from the ground up
          </p>
          <p className="text-lg md:text-xl text-gray-300">
            Learn the business. Make smart decisions. Become a legend.
          </p>
        </div>

        {/* Call-to-action buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* Sign Up Button */}
          <button
            onClick={handleShowRegister}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 px-8 rounded-lg hover:scale-105 transition-transform shadow-2xl text-lg"
          >
            Create Account
          </button>

          {/* Login Button */}
          <button
            onClick={handleShowLogin}
            className="w-full bg-gray-800 border-2 border-violet-400 text-violet-200 font-bold py-4 px-8 rounded-lg hover:scale-105 hover:bg-gray-700 transition-all shadow-xl text-lg"
          >
            Login
          </button>

          {/* Play as Guest Button */}
          <button
            onClick={onPlayAsGuest}
            className="w-full bg-transparent border-2 border-gray-500 text-gray-200 font-semibold py-3 px-8 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-400 transition-all text-base"
          >
            Play as Guest
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-800/70 backdrop-blur-sm border-2 border-gray-600 rounded-lg p-6 hover:border-violet-500 transition-colors">
            <div className="mb-4 flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-lg">
              <Music className="w-7 h-7 text-violet-400" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-violet-300 mb-3">Realistic Simulation</h3>
            <p className="text-gray-200 text-base leading-relaxed">
              Experience the real challenges of the music industry in Africa and beyond
            </p>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-sm border-2 border-gray-600 rounded-lg p-6 hover:border-violet-500 transition-colors">
            <div className="mb-4 flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-lg">
              <BookOpen className="w-7 h-7 text-violet-400" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-violet-300 mb-3">Learn the Business</h3>
            <p className="text-gray-200 text-base leading-relaxed">
              Master contracts, revenue streams, marketing, and industry dynamics
            </p>
          </div>

          <div className="bg-gray-800/70 backdrop-blur-sm border-2 border-gray-600 rounded-lg p-6 hover:border-violet-500 transition-colors">
            <div className="mb-4 flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-lg">
              <Trophy className="w-7 h-7 text-violet-400" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-violet-300 mb-3">Build Your Legacy</h3>
            <p className="text-gray-200 text-base leading-relaxed">
              Make decisions that shape your career. How long can you survive?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-300 text-base">
          <p>An educational game about the music business</p>
        </div>
      </div>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          initialMode={loginMode}
        />
      )}
    </div>
  );
};

export default LandingPage;