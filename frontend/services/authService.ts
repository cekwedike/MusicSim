import api from './api';

// Local fallback utilities for when backend is unreachable (development convenience)
const LOCAL_USERS_KEY = 'musicsim_local_users';
const makeLocalToken = (username: string) => `local-token-${username}-${Date.now()}`;

function readLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function writeLocalUsers(users: any[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

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
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.success) {
        localStorage.setItem('musicsim_token', response.data.data.token);
        localStorage.setItem('musicsim_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      // If backend is unreachable, fallback to localStorage-based users for dev
      if (error?.message && error.message.includes('Network')) {
        const users = readLocalUsers();
        const exists = users.find((u: any) => u.email === data.email || u.username === data.username);
        if (exists) {
          return {
            success: false,
            message: 'Email or username already registered',
            data: null as any
          } as any;
        }

        const newUser = {
          id: `local-${Date.now()}`,
          email: data.email,
          username: data.username,
          createdAt: new Date().toISOString()
        };
        users.push({ ...newUser, password: data.password });
        writeLocalUsers(users);

        const token = makeLocalToken(data.username);
        localStorage.setItem('musicsim_token', token);
        localStorage.setItem('musicsim_user', JSON.stringify(newUser));

        return {
          success: true,
          message: 'Registered locally (offline mode)',
          data: { token, user: newUser } as any
        } as any;
      }

      throw error;
    }
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      if (response.data.success) {
        localStorage.setItem('musicsim_token', response.data.data.token);
        localStorage.setItem('musicsim_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      // Network error -> try local fallback
      if (error?.message && error.message.includes('Network')) {
        const users = readLocalUsers();
        const found = users.find((u: any) => (u.email === data.emailOrUsername || u.username === data.emailOrUsername) && u.password === data.password);
        if (!found) {
          return { success: false, message: 'Invalid credentials', data: null as any } as any;
        }

        const user = { id: found.id, email: found.email, username: found.username };
        const token = makeLocalToken(found.username);
        localStorage.setItem('musicsim_token', token);
        localStorage.setItem('musicsim_user', JSON.stringify(user));

        return { success: true, message: 'Logged in locally (offline mode)', data: { token, user } as any } as any;
      }

      throw error;
    }
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