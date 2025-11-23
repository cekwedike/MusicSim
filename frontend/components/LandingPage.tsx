import React, { useState, useEffect, useRef } from 'react';
import { Music, BookOpen, Trophy, Users, TrendingUp, Award, Mic, ChevronDown, Zap, Target, BarChart3 } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onPlayAsGuest: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlayAsGuest }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShowLogin = () => {
    setLoginMode('login');
    setShowLoginModal(true);
  };

  const handleShowRegister = () => {
    setLoginMode('register');
    setShowLoginModal(true);
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('features-section');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax transform calculations
  const parallaxHero = scrollY * 0.5;
  const parallaxImage = scrollY * 0.3;
  const fadeOpacity = Math.max(1 - scrollY / 500, 0);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${parallaxImage}px)`,
            willChange: 'transform'
          }}
        >
          {/* Stock Image - Replace with actual image later */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80"
              alt="Music Studio"
              className="w-full h-full object-cover opacity-40"
              loading="eager"
            />
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.015] pointer-events-none mix-blend-overlay">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>

        {/* Hero Content */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
          style={{
            transform: `translateY(${parallaxHero}px)`,
            opacity: fadeOpacity,
            willChange: 'transform, opacity'
          }}
        >
          <div className="mb-8">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                <Music className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-gray-300">Industry Simulation Platform</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="block mb-2 bg-gradient-to-r from-white via-red-200 to-rose-200 bg-clip-text text-transparent">
                MusicSim
              </span>
            </h1>

            <p className="text-2xl md:text-4xl font-bold text-gray-200 mb-6 leading-tight">
              Navigate the Music Industry
              <br />
              <span className="text-red-400">From Bedroom to Billboard</span>
            </p>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              An immersive business simulation where every decision shapes your career.
              Learn contracts, revenue streams, and industry dynamics through gameplay.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={handleShowRegister}
              className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] min-w-[200px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <Zap className="w-5 h-5" />
              </span>
            </button>

            <button
              onClick={handleShowLogin}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-bold rounded-lg transition-all duration-300 min-w-[200px]"
            >
              Sign In
            </button>
          </div>

          {/* Guest Play & Theme Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              onClick={onPlayAsGuest}
              className="text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Continue as Guest
            </button>
            <span className="text-gray-600">•</span>
            <ThemeToggle />
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToContent}
            className="inline-flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors animate-bounce"
            aria-label="Scroll to features"
          >
            <span className="text-sm font-medium">Explore Features</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="relative bg-gradient-to-b from-black via-slate-900 to-black py-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Why MusicSim?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the music business from an artist's perspective.
              Make decisions that matter. Build a sustainable career.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-red-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-colors">
                  <Target className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Realistic Scenarios</h3>
                <p className="text-gray-400 leading-relaxed">
                  Face authentic industry challenges based on real-world market dynamics and business decisions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-rose-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/0 to-rose-600/0 group-hover:from-rose-600/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-rose-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600/30 transition-colors">
                  <TrendingUp className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Strategic Gameplay</h3>
                <p className="text-gray-400 leading-relaxed">
                  Balance creativity with commerce. Your choices impact fame, finances, and long-term sustainability.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-red-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-colors">
                  <BarChart3 className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                <p className="text-gray-400 leading-relaxed">
                  Monitor statistics, unlock achievements, and see how your decisions compound over time.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Learn Section */}
          <div className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border border-red-500/20 rounded-3xl p-10 md:p-16">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-black mb-8 text-center">
                Master the Business of Music
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Contract Negotiation</h4>
                    <p className="text-gray-400">Learn to evaluate deals, understand royalties, and protect your rights.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-600/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Revenue Streams</h4>
                    <p className="text-gray-400">Discover how artists earn money beyond streaming and sales.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <Mic className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Career Building</h4>
                    <p className="text-gray-400">Build momentum from local shows to global recognition.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-600/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Industry Insights</h4>
                    <p className="text-gray-400">Gain knowledge from real-world examples and case studies.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-black py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join MusicSim today and discover what it takes to succeed in the modern music industry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleShowRegister}
              className="group relative px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-lg font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] min-w-[240px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Free Account
                <Users className="w-5 h-5" />
              </span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <p className="text-gray-500 text-sm mb-4">
              An interactive educational platform for music business learning
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <span>Scenario-Based Learning</span>
              <span>•</span>
              <span>Real Industry Dynamics</span>
              <span>•</span>
              <span>Career Progression</span>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <LoginModal
          {...({ isOpen: showLoginModal, onClose: () => setShowLoginModal(false), initialMode: loginMode } as any)}
        />
      )}
    </div>
  );
};

export default LandingPage;
