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

          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Also check for updates when page becomes visible again
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              registration.update();
            }
          });

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available - notify app
                  console.log('New version available!');
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