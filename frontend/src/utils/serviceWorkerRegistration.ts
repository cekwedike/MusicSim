type UpdateCallback = () => void;

let updateAvailableCallback: UpdateCallback | null = null;

export function registerServiceWorker(onUpdateAvailable?: UpdateCallback) {
  if (onUpdateAvailable) {
    updateAvailableCallback = onUpdateAvailable;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
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