import React, { useState, useEffect } from 'react';

interface RetryIndicatorProps {
  retryAfter: number; // Seconds until retry is available
  onRetry: () => void;
  error?: string;
}

/**
 * RetryIndicator - Shows countdown and retry button for rate-limited API calls
 * Provides visual feedback for exponential backoff scenarios
 */
const RetryIndicator: React.FC<RetryIndicatorProps> = ({ retryAfter, onRetry, error }) => {
  const [countdown, setCountdown] = useState(retryAfter);

  useEffect(() => {
    setCountdown(retryAfter);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  const canRetry = countdown === 0;

  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center" role="alert" aria-live="polite">
      <div className="text-red-400 mb-2">
        {error || 'Rate limit reached'}
      </div>
      
      {!canRetry ? (
        <div className="text-gray-300 text-sm mb-3">
          Retry available in <span className="font-bold text-red-400">{countdown}s</span>
        </div>
      ) : (
        <div className="text-green-400 text-sm mb-3">
          Ready to retry
        </div>
      )}
      
      <button
        onClick={onRetry}
        disabled={!canRetry}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          canRetry
            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
        }`}
        aria-label={canRetry ? 'Retry now' : `Retry in ${countdown} seconds`}
      >
        {canRetry ? '↻ Retry Now' : `⏳ Wait ${countdown}s`}
      </button>
    </div>
  );
};

export default RetryIndicator;
