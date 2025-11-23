import React, { useState, useEffect } from 'react';

interface ParallaxBackgroundProps {
  speed?: number;
  opacity?: number;
  className?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  speed = 0.3,
  opacity = 0.4,
  className = ''
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * speed;

  return (
    <div
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        willChange: 'transform'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0A0F] via-[#3D0A15] to-[#1A0A0F]">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80"
          alt="Music Studio Background"
          className={`w-full h-full object-cover`}
          style={{ opacity }}
          loading="eager"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A0F]/70 via-[#1A0A0F]/50 to-[#1A0A0F]"></div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
    </div>
  );
};

export default ParallaxBackground;
