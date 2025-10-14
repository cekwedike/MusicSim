import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;
  if (localStorage.getItem('installPromptDismissed')) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-gray-800 border-2 border-violet-500 rounded-lg shadow-2xl p-4 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center">
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1">Install MusicSim</h3>
          <p className="text-gray-400 text-sm mb-3">
            Install the app for offline access and a better experience
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold py-2 px-4 rounded hover:scale-105 transition-transform"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-700 text-gray-300 text-sm font-medium py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;