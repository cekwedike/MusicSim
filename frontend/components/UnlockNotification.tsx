import React, { useEffect, useState } from 'react';

interface UnlockNotificationProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
  duration?: number; // in milliseconds, default 5000
}

const UnlockNotification: React.FC<UnlockNotificationProps> = ({
  title,
  description,
  icon,
  onClose,
  duration = 5000
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      onClick={handleClose}
    >
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl shadow-2xl shadow-purple-500/50 border-2 border-white/20 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {icon || (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  <path d="M10 12a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                {description}
              </p>

              {/* Progress bar */}
              <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full animate-shrink"
                  style={{ animationDuration: `${duration}ms` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-particle-1"></div>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full animate-particle-2"></div>
          <div className="absolute top-0 left-3/4 w-1 h-1 bg-blue-300 rounded-full animate-particle-3"></div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes particle1 {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(50px) translateX(-20px) scale(0); opacity: 0; }
        }

        @keyframes particle2 {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(60px) translateX(0) scale(0); opacity: 0; }
        }

        @keyframes particle3 {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(50px) translateX(20px) scale(0); opacity: 0; }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shrink {
          animation: shrink linear forwards;
        }

        .animate-particle-1 {
          animation: particle1 1.5s ease-out infinite;
        }

        .animate-particle-2 {
          animation: particle2 1.8s ease-out infinite;
          animation-delay: 0.2s;
        }

        .animate-particle-3 {
          animation: particle3 1.6s ease-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default UnlockNotification;
