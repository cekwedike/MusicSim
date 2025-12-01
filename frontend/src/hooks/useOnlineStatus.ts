import { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      logger.log('Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      logger.log('Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Helper function to check if app is installed as PWA
export function isPWAInstalled(): boolean {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
}

// Helper function to check if running in PWA context
export function isPWAContext(): boolean {
  return isPWAInstalled() || (window.navigator as any).standalone === true;
}