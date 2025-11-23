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
    // Register service worker and show update prompt only when there's a real update
    registerServiceWorker(() => {
      console.log('[App] Update callback triggered');
      setUpdateAvailable(true);
    });
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
