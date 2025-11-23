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
    // Register service worker with update callback
    registerServiceWorker(() => {
      setUpdateAvailable(true);
    });
  }, []);

  const handleUpdate = () => {
    setUpdateAvailable(false);
    window.location.reload();
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
