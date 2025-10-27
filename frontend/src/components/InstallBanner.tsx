import React, { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'musicsim_install_banner_dismissed';

const isDismissedRecently = (): boolean => {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.t) return false;
    const ts = parsed.t as number;
    const now = Date.now();
    // hide for 7 days
    return now - ts < 7 * 24 * 60 * 60 * 1000;
  } catch (e) {
    return false;
  }
};

const markDismissed = (permanent = false) => {
  try {
    const value = { t: Date.now(), p: !!permanent };
    localStorage.setItem(DISMISS_KEY, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
};

const InstallBanner: React.FC = () => {
  console.log('[InstallBanner] Component rendering...');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isDismissedRecently()) return; // do not show if dismissed

    const onBeforeInstallPrompt = (e: Event) => {
      console.log('[InstallBanner] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onAppInstalled = () => {
      console.log('[InstallBanner] appinstalled event fired');
      // permanently remove banner after install
      markDismissed(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);

    console.log('[InstallBanner] Event listeners registered, waiting for beforeinstallprompt...');

    // Development mode: Check for forced display via localStorage or URL parameter
    const checkForceDisplay = () => {
      const localStorage_forced = localStorage.getItem('musicsim_force_install_banner') === 'true';
      const url_forced = new URLSearchParams(window.location.search).get('showInstall') === '1';
      const dismissed = isDismissedRecently();

      console.log('[InstallBanner] Debug status:', {
        localStorage_forced,
        url_forced,
        dismissed,
        visible,
        deferredPrompt: !!deferredPrompt
      });

      const forced = localStorage_forced || url_forced;
      if (forced) {
        console.log('[InstallBanner] Forced display enabled for testing');
        setVisible(true);
      }
    };

    // Check immediately and then periodically (for localStorage changes)
    checkForceDisplay();
    const forceCheckInterval = setInterval(checkForceDisplay, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
      clearInterval(forceCheckInterval);
    };
  }, []);

  useEffect(() => {
    // If previously dismissed permanently (installed) or within 7 days, keep hidden
    // But allow forced display for development testing
    const forced = localStorage.getItem('musicsim_force_install_banner') === 'true' ||
                  new URLSearchParams(window.location.search).get('showInstall') === '1';

    if (isDismissedRecently() && !forced) {
      setVisible(false);
    }
  }, []);

  const handleClose = () => {
    markDismissed(false);
    setVisible(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        // user clicks Install -> show native prompt
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === 'accepted') {
          // mark as permanently dismissed (installed) and hide
          markDismissed(true);
          setVisible(false);
          setDeferredPrompt(null);
        } else {
          // user dismissed native prompt — keep the banner visible so they can try again or close
          setDeferredPrompt(null);
        }
      } catch (e) {
        setDeferredPrompt(null);
      }
      return;
    }

    // No native beforeinstallprompt available — in dev we support a forced mode for UI testing
    try {
      const forced = localStorage.getItem('musicsim_force_install_banner') === 'true' || new URLSearchParams(window.location.search).get('showInstall') === '1';
      if (forced) {
        const accepted = window.confirm('Simulate PWA install: OK = accepted, Cancel = dismissed');
        if (accepted) {
          markDismissed(true);
          setVisible(false);
        }
        // if dismissed, keep banner visible so dev can try again or close
      }
    } catch (e) {
      // ignore
    }
  };

  console.log('[InstallBanner] Render check - visible:', visible);

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed left-4 right-4 md:left-8 md:right-8 bottom-4 z-50"
      style={{ pointerEvents: 'auto' }}
    >
      <style>{`
        .musicsim-install-slide { animation: slideUp 360ms cubic-bezier(.2,.8,.2,1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>

      <div className="musicsim-install-slide flex items-center justify-between bg-[#1f2937] border border-gray-700 shadow-lg rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-violet-600 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>

          <div className="hidden sm:block">
            <div className="text-white font-semibold text-sm md:text-base">Install MusicSim</div>
            <div className="text-gray-300 text-xs md:text-sm">Take Your Music Journey With You. Play Anytime, Anywhere.</div>
          </div>

          <div className="block sm:hidden">
            <div className="text-white font-semibold text-sm">Install MusicSim</div>
          </div>
        </div>

        <div className="ml-4 flex items-center gap-3">
          <button
            onClick={handleInstall}
            className="flex items-center gap-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:scale-105 transform transition-transform"
            aria-label="Install MusicSim"
          >
            <span className="hidden sm:inline">Install</span>
            <span className="sm:hidden text-sm">Install</span>
          </button>

          <button
            onClick={handleClose}
            className="ml-2 p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700"
            aria-label="Close install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
