import React, { useState, useEffect, useRef } from 'react';
import { Music, ChevronDown, ArrowRight } from 'lucide-react';
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80"
              alt="Music Studio"
              className="w-full h-full object-cover opacity-40"
              loading="eager"
            />
          </div>
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
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8"
          style={{
            transform: `translateY(${parallaxHero}px)`,
            opacity: fadeOpacity,
            willChange: 'transform, opacity'
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-red-500/30 rounded-md bg-red-500/10">
                <Music className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium text-red-300 uppercase tracking-wider">Music Industry Simulation</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-red-200 to-rose-200 bg-clip-text text-transparent">
                  MusicSim
                </span>
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-6 leading-tight">
                Navigate the Music Industry
                <span className="block text-red-400 mt-2">From Bedroom to Billboard</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                An immersive business simulation where every decision shapes your career.
                Learn contracts, revenue streams, and industry dynamics through realistic gameplay.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleShowRegister}
                  className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleShowLogin}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/40 text-white font-bold rounded-lg transition-all duration-300"
                >
                  Sign In
                </button>
              </div>

              {/* Guest Play & Theme */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <button
                  onClick={onPlayAsGuest}
                  className="text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Continue as Guest
                </button>
                <span className="text-gray-700">|</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Right Column - Stats/Features */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl font-black text-red-400 mb-2">Real-World</div>
                <div className="text-sm text-gray-300">Authentic industry scenarios based on actual business dynamics</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl font-black text-rose-400 mb-2">Strategic</div>
                <div className="text-sm text-gray-300">Every choice impacts your fame, finances, and career trajectory</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl font-black text-red-400 mb-2">Educational</div>
                <div className="text-sm text-gray-300">Learn contract negotiation and revenue stream management</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="text-3xl font-black text-rose-400 mb-2">Progressive</div>
                <div className="text-sm text-gray-300">Track achievements and build your legacy over time</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:translate-x-0">
            <button
              onClick={scrollToContent}
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors animate-bounce"
              aria-label="Scroll to content"
            >
              <span className="text-sm font-medium">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="relative bg-gradient-to-b from-black via-slate-900 to-black py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              Why MusicSim?
            </h2>
            <p className="text-lg sm:text-xl text-gray-400">
              Experience the music business from an artist's perspective.
              Make strategic decisions that matter and build a sustainable career in the industry.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-12 mb-20">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Realistic Scenarios</h3>
                <p className="text-gray-400 leading-relaxed">
                  Face authentic industry challenges based on real-world market dynamics and business decisions.
                  Navigate contract negotiations, label deals, and financial management just like actual artists.
                </p>
              </div>
              <div className="lg:pl-12">
                <div className="h-1 w-24 bg-red-600 mb-4"></div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Built on industry research and real artist experiences to provide the most accurate simulation possible.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Strategic Gameplay</h3>
                <p className="text-gray-400 leading-relaxed">
                  Balance creativity with commerce as you make decisions that impact your fame, finances, and long-term sustainability.
                  Each choice has consequences that compound over time.
                </p>
              </div>
              <div className="lg:pl-12">
                <div className="h-1 w-24 bg-rose-600 mb-4"></div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Multiple difficulty modes adapt the challenge to your skill level and create unique experiences.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Track Your Progress</h3>
                <p className="text-gray-400 leading-relaxed">
                  Monitor detailed statistics, unlock achievements, and see how your strategic decisions compound over weeks and months.
                  Build a legacy that reflects your unique approach to the industry.
                </p>
              </div>
              <div className="lg:pl-12">
                <div className="h-1 w-24 bg-red-600 mb-4"></div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Career history tracking lets you review past decisions and learn from both successes and failures.
                </p>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-gradient-to-br from-red-950/40 to-slate-950/40 border border-red-900/20 rounded-2xl p-8 sm:p-12 lg:p-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-12 text-center">
              Master the Business of Music
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-red-400 font-bold text-lg mb-3">Contract Negotiation</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Learn to evaluate deals, understand royalty structures, and protect your creative rights.
                </p>
              </div>

              <div>
                <div className="text-rose-400 font-bold text-lg mb-3">Revenue Streams</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Discover how artists earn money beyond streaming through touring, merchandise, and licensing.
                </p>
              </div>

              <div>
                <div className="text-red-400 font-bold text-lg mb-3">Career Building</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Build sustainable momentum from local performances to international recognition.
                </p>
              </div>

              <div>
                <div className="text-rose-400 font-bold text-lg mb-3">Industry Insights</div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Gain knowledge from real-world examples and case studies of successful artists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative bg-black py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join MusicSim today and discover what it takes to succeed in the modern music industry.
          </p>

          <button
            onClick={handleShowRegister}
            className="group relative px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] inline-flex items-center gap-3"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer */}
          <div className="mt-20 pt-8 border-t border-slate-800">
            <p className="text-gray-500 text-sm mb-4">
              An interactive educational platform for music business learning
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
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
