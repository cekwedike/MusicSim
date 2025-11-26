import React, { useEffect, useRef, useState } from 'react';
import { Download, X, Share2 } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'musicsim_install_banner_dismissed';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Detect browser types
const getBrowserType = (): 'safari' | 'firefox' | 'chromium' | 'opera-desktop' | 'arc' | 'unsupported' | 'unknown' => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isOperaDesktop = /OPR|Opera/i.test(ua) && !/Android|Mobile/i.test(ua);
  
  // Arc browser detection - Arc doesn't modify user agent but we can check for Arc-specific APIs
  // Arc is Chromium-based but doesn't support PWA installation
  const isArc = typeof (window as any).arc !== 'undefined' || 
                /Arc/i.test(ua) ||
                (navigator.vendor === 'Google Inc.' && 
                 /Chrome/i.test(ua) && 
                 !('getInstalledRelatedApps' in navigator)); // Arc strips some PWA APIs
  
  const isChromium = /Chrome|Chromium|Edg/i.test(ua) && !isOperaDesktop;

  if (isIOS || isSafari) return 'safari';
  if (isFirefox) return 'firefox';
  if (isOperaDesktop) return 'opera-desktop';
  if (isArc) return 'arc';
  if (isChromium) return 'chromium';
  return 'unknown';
};

// Check if browser supports PWA installation
const browserSupportsPWA = (): boolean => {
  const browserType = getBrowserType();
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  
  // Desktop browsers that DON'T support PWA
  if (browserType === 'opera-desktop') return false;
  if (browserType === 'arc') return false;
  if (browserType === 'firefox' && !isAndroid) return false; // Firefox desktop doesn't support PWA
  
  // Additional check: if browser doesn't support beforeinstallprompt API and isn't mobile, likely doesn't support PWA
  // This catches browsers like Arc that strip PWA APIs
  if (!isAndroid && !isIOS) {
    const hasBeforeInstallPrompt = 'onbeforeinstallprompt' in window;
    if (!hasBeforeInstallPrompt && browserType !== 'safari') {
      // Desktop Safari doesn't have beforeinstallprompt but still supports PWA
      return false;
    }
  }
  
  // Mobile browsers that DO support PWA
  if (isAndroid || isIOS) return true;
  
  // Desktop browsers that DO support PWA
  if (browserType === 'chromium') return true; // Chrome, Edge, Brave
  if (browserType === 'safari') return true; // Safari on macOS
  
  // Unknown browsers - assume no support to avoid showing banner incorrectly
  return false;
};

const isSafariOrIOS = (): boolean => {
  return getBrowserType() === 'safari';
};

const isFirefox = (): boolean => {
  return getBrowserType() === 'firefox';
};

const isAppInstalled = async (): Promise<boolean> => {
  // Check if running as PWA (installed app)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  // Check for iOS standalone mode
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // Check getInstalledRelatedApps API (Chrome/Edge)
  if ('getInstalledRelatedApps' in navigator) {
    try {
      const relatedApps = await (navigator as any).getInstalledRelatedApps();
      if (relatedApps && relatedApps.length > 0) {
        return true;
      }
    } catch (e) {
      // API not available or failed
    }
  }

  // Check if app was previously marked as installed in localStorage
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.p === true) {
        return true;
      }
    }
  } catch (e) {
    // ignore
  }

  return false;
};

const isBannerDismissed = async (): Promise<boolean> => {
  try {
    // First check if app is actually installed via browser detection
    const installed = await isAppInstalled();
    if (installed) {
      // Ensure localStorage is set to prevent showing banner again
      markAppInstalled();
      return true;
    }

    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);

    // Permanently dismissed (app installed)
    if (parsed && parsed.p === true) return true;

    // Temporarily dismissed - check if duration has passed
    if (parsed && parsed.t) {
      const elapsed = Date.now() - parsed.t;
      return elapsed < DISMISS_DURATION_MS;
    }

    return false;
  } catch (e) {
    return false;
  }
};

const markAppInstalled = () => {
  try {
    const value = { t: Date.now(), p: true };
    localStorage.setItem(DISMISS_KEY, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
};

const markBannerDismissed = () => {
  try {
    const value = { t: Date.now(), p: false };
    localStorage.setItem(DISMISS_KEY, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
};

const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const browserType = getBrowserType();

  useEffect(() => {
    let unmounted = false;
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if app is installed before showing
      isBannerDismissed().then(dismissed => {
        if (!dismissed && !unmounted) {
          setVisible(true);
        }
      });
    };

    const onAppInstalled = () => {
      // Mark app as installed and hide banner permanently
      markAppInstalled();
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);

    // Show banner on startup (unless dismissed)
    // or if forced for development testing
    const checkDisplayConditions = async () => {
      const localStorage_forced = localStorage.getItem('musicsim_force_install_banner') === 'true';
      const url_forced = new URLSearchParams(window.location.search).get('showInstall') === '1';
      const forced = localStorage_forced || url_forced;

      // Check if browser supports PWA installation
      if (!browserSupportsPWA() && !forced) {
        setVisible(false);
        return;
      }

      // Check if app is installed (robust check)
      const installed = await isAppInstalled();
      if (installed && !unmounted) {
        setVisible(false);
        return;
      }

      // Check if banner is dismissed
      const dismissed = await isBannerDismissed();

      // Show if forced (for testing) or if banner is not dismissed
      // For Safari/iOS and Firefox mobile, always show banner if not dismissed (they don't have beforeinstallprompt)
      const browserType = getBrowserType();
      const needsManualInstall = browserType === 'safari' || (browserType === 'firefox' && /Android/i.test(navigator.userAgent));
      if ((forced || !dismissed || needsManualInstall) && !unmounted) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    // Check on mount only
    checkDisplayConditions();

    return () => {
      unmounted = true;
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
    };
  }, []);

  const handleClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    // Mark as dismissed for 24 hours
    markBannerDismissed();
    setVisible(false);
  };

  const handleInstall = async (event?: React.MouseEvent) => {
    event?.stopPropagation();

    if (isInstalling) return; // Prevent double-clicks

    // For Safari/iOS and Firefox mobile, show instructions instead of trying to install
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (((browserType === 'safari' || (browserType === 'firefox' && isAndroid))) && !deferredPrompt) {
      setShowInstructions(!showInstructions);
      return;
    }

    setIsInstalling(true);

    if (deferredPrompt) {
      try {
        // user clicks Install -> show native prompt
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === 'accepted') {
          // Mark app as installed and hide permanently
          markAppInstalled();
          setVisible(false);
          setDeferredPrompt(null);
        } else {
          // user dismissed native prompt — keep the banner visible so they can try again or close
          setDeferredPrompt(null);
        }
      } catch (e) {
        console.error('Install prompt failed:', e);
        setDeferredPrompt(null);
        // Show user-friendly error
        if (typeof window !== 'undefined') {
          const message = e instanceof Error ? e.message : 'Installation failed';
          console.warn('PWA installation error:', message);
        }
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // No native beforeinstallprompt available — in dev we support a forced mode for UI testing
    try {
      const forced = localStorage.getItem('musicsim_force_install_banner') === 'true' || new URLSearchParams(window.location.search).get('showInstall') === '1';
      if (forced) {
        const accepted = window.confirm('Simulate PWA install: OK = accepted, Cancel = dismissed');
        if (accepted) {
          markAppInstalled();
          setVisible(false);
        }
        // if dismissed, keep banner visible so dev can try again or close
      } else {
        // No install prompt available, provide feedback
        console.warn('PWA install not available on this browser/device');
      }
    } catch (e) {
      console.warn('Install simulation failed:', e);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed left-4 right-4 md:left-8 md:right-8 bottom-2 sm:bottom-4 z-[100]"
      style={{ pointerEvents: 'auto' }}
    >
      <style>{`
        .musicsim-install-slide { animation: slideUp 360ms cubic-bezier(.2,.8,.2,1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        /* Mobile touch optimizations */
        @media (max-width: 640px) {
          .musicsim-install-banner-button {
            min-height: 44px; /* iOS recommended touch target size */
            min-width: 44px;
          }
        }
      `}</style>

      <div className="musicsim-install-slide flex flex-col bg-[#2D1115] dark:bg-[#2D1115] light:bg-white light:border-gray-300 border border-[#4D1F2A] shadow-lg rounded-xl p-2 sm:p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <div className="hidden sm:block">
              <div className="text-white dark:text-white light:text-gray-900 font-semibold text-sm md:text-base">Install MusicSim</div>
              <div className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-xs md:text-sm">Take Your Music Journey With You. Play Anytime, Anywhere.</div>
            </div>

            <div className="block sm:hidden">
              <div className="text-white dark:text-white light:text-gray-900 font-semibold text-sm">Install MusicSim</div>
            </div>
          </div>

          <div className="ml-2 sm:ml-4 flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className={`musicsim-install-banner-button flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:scale-105 transform transition-transform touch-manipulation ${isInstalling ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Install MusicSim"
            >
              {((browserType === 'safari' || (browserType === 'firefox' && /Android/i.test(navigator.userAgent)))) && !deferredPrompt ? (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">How to Install</span>
                  <span className="sm:hidden text-xs">Install</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{isInstalling ? 'Installing...' : 'Install'}</span>
                  <span className="sm:hidden text-xs">{isInstalling ? 'Installing...' : 'Install'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="musicsim-install-banner-button ml-1 sm:ml-2 p-1.5 sm:p-2 rounded-full text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-[#3D1820] dark:hover:bg-[#3D1820] light:hover:bg-gray-100 touch-manipulation"
              aria-label="Close install banner"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Browser-specific Installation Instructions */}
        {showInstructions && (
          <div className="mt-3 pt-3 border-t border-[#4D1F2A] text-gray-300 dark:text-gray-300 light:text-gray-600">
            {browserType === 'safari' && (
              <>
                <div className="text-sm font-semibold mb-2">To install on Safari:</div>
                <ol className="text-xs space-y-1.5 list-decimal list-inside">
                  <li>Tap the <Share2 className="inline w-3 h-3 mx-0.5" /> <strong>Share</strong> button below</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right corner</li>
                </ol>
              </>
            )}
            {browserType === 'firefox' && /Android/i.test(navigator.userAgent) && (
              <>
                <div className="text-sm font-semibold mb-2">To install on Firefox (Android):</div>
                <ol className="text-xs space-y-1.5 list-decimal list-inside">
                  <li>Tap the three dots menu (⋮) at the top</li>
                  <li>Tap <strong>"Install"</strong> or <strong>"Add to Home Screen"</strong></li>
                  <li>Confirm by tapping <strong>"Add"</strong></li>
                </ol>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallBanner;
