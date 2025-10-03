import api from './api';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('musicsim_token', response.data.data.token);
      localStorage.setItem('musicsim_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.success) {
      localStorage.setItem('musicsim_token', response.data.data.token);
      localStorage.setItem('musicsim_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('musicsim_token');
      localStorage.removeItem('musicsim_user');
    }
  },

  // Get current user from server
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },

  // Verify token validity
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.post('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  },

  // Refresh token (if endpoint exists)
  refreshToken: async (): Promise<AuthResponse | null> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      if (response.data.success) {
        localStorage.setItem('musicsim_token', response.data.data.token);
        localStorage.setItem('musicsim_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Check if user is logged in (local check)
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('musicsim_token');
    const user = localStorage.getItem('musicsim_user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('musicsim_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem('musicsim_token');
  },

  // Clear authentication data
  clearAuth: (): void => {
    localStorage.removeItem('musicsim_token');
    localStorage.removeItem('musicsim_user');
  }
};