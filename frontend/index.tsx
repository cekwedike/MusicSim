import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { registerServiceWorker } from './src/utils/serviceWorkerRegistration';
import UpdatePrompt from './src/components/UpdatePrompt';
import { reportWebVitals } from './utils/webVitals';
import { logger } from './utils/logger';
import './src/index.css';

const Root = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);


  useEffect(() => {
    // Register service worker and show update prompt only when there's a real update
    registerServiceWorker(() => {
      logger.log('[App] Update callback triggered');
      setUpdateAvailable(true);
    });
    
    // Report web vitals for performance monitoring
    reportWebVitals();
  }, []);


  const handleUpdate = async () => {
    setUpdateAvailable(false);

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration && registration.waiting) {
          // Send skip waiting message to the waiting service worker
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          // Set a timeout fallback in case controllerchange doesn't fire
          const reloadTimeout = setTimeout(() => {
            logger.log('[App] Force reload after timeout');
            window.location.reload();
          }, 1000);

          // Wait for the new service worker to take control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            clearTimeout(reloadTimeout);
            logger.log('[App] Controller changed, reloading...');
            window.location.reload();
          }, { once: true });
        } else {
          // No waiting worker, just reload
          logger.log('[App] No waiting worker, force reload');
          window.location.reload();
        }
      } catch (error) {
        logger.error('[App] Error during update:', error);
        window.location.reload();
      }
    } else {
      // No service worker support, just reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  return (
    <React.StrictMode>
      <AuthProvider>
        <App />
        {updateAvailable && (
          <UpdatePrompt onUpdate={handleUpdate} onDismiss={handleDismiss} />
        )}
      </AuthProvider>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);
