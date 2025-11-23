import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { registerServiceWorker } from './src/utils/serviceWorkerRegistration';
import UpdatePrompt from './src/components/UpdatePrompt';
import './src/index.css';

const Root = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);


  useEffect(() => {
    // Only show update modal if a new service worker is waiting (not on first load)
    let updatePrompted = false;
    registerServiceWorker(() => {
      if (!updatePrompted) {
        setUpdateAvailable(true);
        updatePrompted = true;
      }
    });

    // Listen for SW_ACTIVATED message from service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          if (!updatePrompted) {
            setUpdateAvailable(true);
            updatePrompted = true;
          }
        }
      });
    }
    // Cleanup: reset flag on unmount
    return () => { updatePrompted = false; };
  }, []);


  const handleUpdate = () => {
    setUpdateAvailable(false);
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      }, { once: true });
    } else {
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
