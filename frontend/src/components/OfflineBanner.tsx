import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-gray-900 py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff className="w-4 h-4" />
      <span>You are offline. Game progress will be saved locally.</span>
    </div>
  );
};

export default OfflineBanner;