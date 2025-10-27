import React, { useState } from 'react';
import { Music, BookOpen, Trophy, Play, Users, TrendingUp, Award, Headphones, Mic } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        {/* Main content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-20 pb-16 text-center lg:pt-32">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8">
              <Headphones className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 text-sm font-medium">Interactive Music Business Learning</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-lg">
                MusicSim
              </span>
            </h1>

            <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 font-bold mb-4 tracking-wide">
              Master the Music Business
            </p>

            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
              Navigate the complex world of music industry through immersive scenarios. Build your career,
              make strategic decisions, and learn what it takes to succeed in today's music landscape.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-16">
              <button
                onClick={handleShowRegister}
                className="group w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Your Journey
              </button>

              <button
                onClick={handleShowLogin}
                className="group w-full sm:w-auto bg-gray-800/80 backdrop-blur-sm border-2 border-violet-400/50 hover:border-violet-400 text-violet-200 hover:text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Login
              </button>
            </div>

            {/* Guest play option */}
            <div className="mb-20">
              <button
                onClick={onPlayAsGuest}
                className="text-gray-400 hover:text-violet-300 font-medium underline-offset-4 hover:underline transition-colors"
              >
                Try as Guest →
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                <Music className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Realistic Industry Simulation</h3>
              <p className="text-gray-300 leading-relaxed">
                Experience authentic music industry challenges with scenarios based on real-world situations, market dynamics, and industry relationships.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-fuchsia-500/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-fuchsia-500/25 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Strategic Decision Making</h3>
              <p className="text-gray-300 leading-relaxed">
                Learn to balance artistry with business acumen. Every choice impacts your career trajectory, finances, and industry relationships.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <Award className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Your Legacy</h3>
              <p className="text-gray-300 leading-relaxed">
                From bedroom producer to global superstar. Track your progress, unlock achievements, and see how long you can sustain success.
              </p>
            </div>
          </div>

          {/* Stats or testimonials section */}
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-12 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Learn What It Really Takes
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Gain insights into contract negotiations, revenue streams, marketing strategies, and the business decisions that make or break careers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-500/20 rounded-xl mb-4">
                  <BookOpen className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Industry Education</h3>
                <p className="text-gray-400">Learn real business concepts through gameplay</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-500/20 rounded-xl mb-4">
                  <Mic className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Career Building</h3>
                <p className="text-gray-400">Start from zero and build your empire</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-xl mb-4">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Achievement System</h3>
                <p className="text-gray-400">Track progress and unlock milestones</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-12">
            <p className="text-gray-400 text-lg mb-4">
              An educational simulation of the modern music industry
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>Interactive Learning</span>
              <span>•</span>
              <span>Real Industry Scenarios</span>
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