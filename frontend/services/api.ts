import axios from 'axios';

// Type-safe environment variable access
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('musicsim_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Network error - user is offline
    if (!error.response && error.message === 'Network Error') {
      console.log('Offline mode - request queued');
      // Queue request for later sync
      queueOfflineRequest(error.config);
      return Promise.reject({
        offline: true,
        message: 'You are offline. Request will be synced when online.'
      });
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error - please check your connection');
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('musicsim_token');
      localStorage.removeItem('musicsim_user');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/'; // Redirect to login
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      throw new Error('Server error - please try again later');
    }

    // Return the error for handling by the calling code
    return Promise.reject(error);
  }
);

// Queue offline requests for background sync
function queueOfflineRequest(config: any) {
  const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
  queue.push({
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
    timestamp: Date.now()
  });
  localStorage.setItem('offline_queue', JSON.stringify(queue));
}

// Process offline queue when connection is restored
export function processOfflineQueue() {
  const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
  if (queue.length === 0) return Promise.resolve();

  console.log(`Processing ${queue.length} offline requests...`);
  
  const promises = queue.map((request: any) => {
    return api({
      method: request.method,
      url: request.url,
      data: request.data,
      headers: request.headers
    }).catch((error) => {
      console.error('Failed to sync offline request:', error);
      return null; // Don't fail the entire batch
    });
  });

  return Promise.all(promises).then(() => {
    // Clear the queue after processing
    localStorage.removeItem('offline_queue');
    console.log('Offline queue processed successfully');
  });
}

export default api;