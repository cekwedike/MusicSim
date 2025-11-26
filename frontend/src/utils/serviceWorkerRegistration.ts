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

        // Check for updates every 30 minutes (more frequent for better mobile experience)
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);

        // Also check for updates when page becomes visible again
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            console.log('[SW] Page visible - checking for updates');
            registration.update();
          }
        });

        // Check for updates when app gains focus (especially important for PWAs)
        window.addEventListener('focus', () => {
          console.log('[SW] Window focused - checking for updates');
          registration.update();
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
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
                console.log('[SW] New version available!');
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