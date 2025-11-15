import React, { useState } from 'react';
import { Music, BookOpen, Trophy, Play, Users, TrendingUp, Award, Headphones, Mic } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { ThemeToggle } from './ThemeToggle';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-red-500 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        {/* Main content container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-12 sm:pt-16 pb-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5 mb-4">
              <Headphones className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-300 text-xs font-medium">Interactive Music Business Learning</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-white via-red-200 to-rose-200 bg-clip-text text-transparent drop-shadow-lg">
                MusicSim
              </span>
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-bold mb-2 tracking-wide">
              Master the Music Business
            </p>

            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Navigate the complex world of music industry through immersive scenarios. Build your career,
              make strategic decisions, and learn what it takes to succeed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto mb-4">
              <button
                onClick={handleShowRegister}
                className="group w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Your Journey
              </button>

              <button
                onClick={handleShowLogin}
                className="group w-full sm:w-auto bg-gray-800/80 backdrop-blur-sm border-2 border-red-400/50 hover:border-red-400 text-red-200 hover:text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Login
              </button>
            </div>

            {/* Theme Toggle and Guest play combined */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <ThemeToggle />
              <button
                onClick={onPlayAsGuest}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 hover:bg-gray-700/60 flex items-center justify-center gap-2 text-sm"
              >
                <span>Try as Guest</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Feature 1 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-red-500/50 rounded-xl p-5 hover:bg-gray-800/50 transition-all duration-300">
              <div className="mb-3 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                <Music className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Realistic Simulation</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Experience authentic music industry challenges based on real-world situations and market dynamics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-rose-500/50 rounded-xl p-5 hover:bg-gray-800/50 transition-all duration-300">
              <div className="mb-3 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg group-hover:shadow-fuchsia-500/25 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Strategic Decisions</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Balance artistry with business. Every choice impacts your career, finances, and relationships.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 rounded-xl p-5 hover:bg-gray-800/50 transition-all duration-300">
              <div className="mb-3 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <Award className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Build Your Legacy</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Track your progress, unlock achievements, and see how long you can sustain success.
              </p>
            </div>
          </div>

          {/* Stats or testimonials section */}
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Learn What It Really Takes
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
                Gain insights into contract negotiations, revenue streams, and the business decisions that make or break careers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-lg mb-2">
                  <BookOpen className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Industry Education</h3>
                <p className="text-xs text-gray-400">Real business concepts through gameplay</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-fuchsia-500/20 rounded-lg mb-2">
                  <Mic className="w-5 h-5 text-fuchsia-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Career Building</h3>
                <p className="text-xs text-gray-400">Start from zero and build your empire</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-cyan-500/20 rounded-lg mb-2">
                  <Trophy className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Achievement System</h3>
                <p className="text-xs text-gray-400">Track progress and unlock milestones</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-8">
            <p className="text-gray-400 text-sm mb-2">
              An educational simulation of the modern music industry
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
              <span>Interactive Learning</span>
              <span>•</span>
              <span>Real Scenarios</span>
              <span>•</span>
              <span>Career Progression</span>
            </div>
          </div>
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
