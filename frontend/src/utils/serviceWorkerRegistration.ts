type UpdateCallback = () => void;

let updateAvailableCallback: UpdateCallback | null = null;

// Browser detection utilities
function detectBrowser() {
  const ua = navigator.userAgent;
  
  return {
    isIOS: /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream,
    isSafari: /^((?!chrome|android).)*safari/i.test(ua),
    isFirefox: /Firefox/.test(ua),
    isOpera: /OPR|Opera/.test(ua),
    isEdge: /Edg/.test(ua),
    isChrome: /Chrome/.test(ua) && !/Edg/.test(ua),
    isSamsung: /SamsungBrowser/.test(ua),
    isAndroid: /Android/.test(ua)
  };
}

export function registerServiceWorker(onUpdateAvailable?: UpdateCallback) {
  if (onUpdateAvailable) {
    updateAvailableCallback = onUpdateAvailable;
  }

  // Check for service worker support (including Opera)
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported in this browser');
    return;
  }

  const browser = detectBrowser();
  
  // Log browser detection for debugging
  console.log('[SW] Browser detection:', browser);

  // iOS Safari has limited service worker support
  // It was added in iOS 11.3 but with restrictions
  if (browser.isIOS) {
    console.log('[SW] iOS detected - Service Worker support may be limited');
    // iOS requires HTTPS even in development (except localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('[SW] iOS requires HTTPS for service workers');
      return;
    }
  }

  // Special handling for specific browsers
  if (browser.isOpera) {
    console.log('[SW] Opera browser detected - using compatible registration');
  }
  if (browser.isSafari && !browser.isIOS) {
    console.log('[SW] Desktop Safari detected');
  }
  if (browser.isFirefox) {
    console.log('[SW] Firefox detected');
  }
  if (browser.isSamsung) {
    console.log('[SW] Samsung Internet detected');
  }

  window.addEventListener('load', () => {
    const swOptions: RegistrationOptions = {
      scope: '/',
      updateViaCache: 'none'
    };

    // Firefox and Safari work better with 'imports' updateViaCache
    if (browser.isFirefox || browser.isSafari) {
      swOptions.updateViaCache = 'imports';
    }

    navigator.serviceWorker
      .register('/sw.js', swOptions)
      .then((registration) => {
        console.log('SW registered:', registration);

        // Function to check for updates
        const checkForUpdates = () => {
          console.log('[SW] Manually checking for updates...');
          registration.update().catch((err) => {
            console.warn('[SW] Update check failed:', err);
          });
        };

        // More aggressive update checking for mobile devices
        const isMobile = browser.isIOS || browser.isAndroid || 
                        window.matchMedia('(max-width: 768px)').matches;
        
        // Check for updates more frequently on mobile (every 5 minutes)
        // Desktop checks every 30 minutes
        const updateInterval = isMobile ? 5 * 60 * 1000 : 30 * 60 * 1000;
        
        console.log(`[SW] Update check interval: ${updateInterval / 1000 / 60} minutes (${isMobile ? 'mobile' : 'desktop'})`);
        
        // Initial check after 5 seconds (in case user just updated)
        setTimeout(checkForUpdates, 5000);
        
        // Regular interval checks
        setInterval(checkForUpdates, updateInterval);

        // Check for updates when page becomes visible again
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            console.log('[SW] Page visible - checking for updates');
            checkForUpdates();
          }
        });

        // Check for updates when app gains focus (especially important for PWAs)
        window.addEventListener('focus', () => {
          console.log('[SW] Window focused - checking for updates');
          checkForUpdates();
        });

        // For PWAs in standalone mode, also check on app resume (iOS/Android)
        if (window.matchMedia('(display-mode: standalone)').matches) {
          console.log('[SW] Running in standalone mode - enabling app resume detection');
          
          // iOS Safari doesn't fire visibilitychange reliably in standalone mode
          // Use pageshow event as backup
          window.addEventListener('pageshow', (event) => {
            // event.persisted means page was loaded from bfcache (back-forward cache)
            if (event.persisted || performance.navigation.type === 2) {
              console.log('[SW] Page restored from cache - checking for updates');
              checkForUpdates();
            }
          });

          // Additional check when online status changes (mobile networks)
          window.addEventListener('online', () => {
            console.log('[SW] Connection restored - checking for updates');
            checkForUpdates();
          });
        }

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SW_ACTIVATED') {
            console.log('[SW] Service worker activated:', event.data.version);
          }
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('[SW] Update found - new worker installing...');
            
            newWorker.addEventListener('statechange', () => {
              console.log('[SW] New worker state:', newWorker.state);
              
              // CRITICAL: Only show update prompt if:
              // 1. New worker is installed
              // 2. There's ALREADY an active controller (not first install)
              // 3. The new worker is different from the active one
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller &&
                registration.active &&
                registration.active !== newWorker
              ) {
                // New service worker available - notify app
                console.log('[SW] ✅ New version available!');
                if (updateAvailableCallback) {
                  updateAvailableCallback();
                } else {
                  // Fallback to confirm if no callback provided
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}

export function skipWaiting() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}