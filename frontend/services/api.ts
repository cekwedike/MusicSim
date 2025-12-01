import axios from 'axios';
import { supabase } from './supabase';
import { logger } from '../utils/logger';

// Type-safe environment variable access
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (increased for better reliability)
});

// Request interceptor to add auth token from Supabase
api.interceptors.request.use(
  async (config) => {
    // Get token from Supabase session
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with offline handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // IMPORTANT: Only treat as "offline" if it's truly a network connectivity issue
    // Check for specific offline indicators, not just absence of response
    const isActuallyOffline = !error.response && (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error' ||
      error.message.includes('Failed to fetch') ||
      !navigator.onLine
    );

    if (isActuallyOffline) {
      logger.log('Offline mode detected - request queued');
      // Queue request for later sync
      queueOfflineRequest(error.config);
      return Promise.reject({
        offline: true,
        message: 'You are offline. Request will be synced when online.'
      });
    }

    // Handle timeout errors (don't queue these)
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      logger.error('Request timeout:', error.message);
      return Promise.reject({
        timeout: true,
        message: 'Request timed out. Please try again.'
      });
    }

    // Handle CORS and other network errors (don't queue these)
    if (!error.response) {
      logger.error('Network error (not offline):', error.message, error.code);
      return Promise.reject({
        networkError: true,
        message: error.message || 'Network error - please check your connection'
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      logger.error('Authentication error (401):', error.config?.url, error.response?.data);

      // Don't auto-sign out if the error message indicates the token is valid but user profile is missing
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      if (errorMessage.includes('user not found') || errorMessage.includes('profile')) {
        logger.warn('User profile not found - may need to sync profile');
        // Let the calling code handle this specific case
        return Promise.reject(error);
      }

      // Token expired or invalid - sign out from Supabase
      logger.log('Token invalid - signing out');
      supabase.auth.signOut().catch(logger.error);

      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/'; // Redirect to login
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      logger.error('Server error:', error.response.data);
      return Promise.reject({
        serverError: true,
        message: 'Server error - please try again later'
      });
    }

    // Return the error for handling by the calling code
    return Promise.reject(error);
  }
);

// Queue offline requests for background sync
function queueOfflineRequest(config: any) {
  try {
    const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');

    // Limit queue size to prevent localStorage quota issues
    const MAX_QUEUE_SIZE = 50;
    if (queue.length >= MAX_QUEUE_SIZE) {
      logger.warn('Offline queue full, removing oldest request');
      queue.shift(); // Remove oldest request
    }

    queue.push({
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      timestamp: Date.now()
    });

    localStorage.setItem('offline_queue', JSON.stringify(queue));
  } catch (error: any) {
    // Handle quota exceeded or other localStorage errors
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      logger.error('LocalStorage quota exceeded. Clearing offline queue.');
      localStorage.removeItem('offline_queue'); // Clear the queue to free up space
    } else {
      logger.error('Error queuing offline request:', error);
    }
  }
}

// Process offline queue when connection is restored
export function processOfflineQueue() {
  const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
  if (queue.length === 0) return Promise.resolve();

  logger.log(`Processing ${queue.length} offline requests...`);
  
  const promises = queue.map((request: any) => {
    return api({
      method: request.method,
      url: request.url,
      data: request.data,
      headers: request.headers
    }).catch((error) => {
      logger.error('Failed to sync offline request:', error);
      return null; // Don't fail the entire batch
    });
  });

  return Promise.all(promises).then(() => {
    // Clear the queue after processing
    localStorage.removeItem('offline_queue');
    logger.log('Offline queue processed successfully');
  });
}

// Auto-sync when coming back online
let isOnlineEventAdded = false;
if (!isOnlineEventAdded && typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    logger.log('Connection restored - processing offline queue and syncing saves...');
    
    // Process queued API requests first
    await processOfflineQueue().catch(logger.error);
    
    // Then sync local saves to backend
    // Use dynamic import to avoid circular dependency
    try {
      const { syncLocalSavesToBackend } = await import('./storageService');
      await syncLocalSavesToBackend();
    } catch (error) {
      logger.error('Failed to sync local saves:', error);
    }
  });
  isOnlineEventAdded = true;
}

export default api;