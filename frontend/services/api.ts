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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;