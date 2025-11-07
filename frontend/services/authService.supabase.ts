import { supabase } from './supabase';
import api from './api';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
  errors?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
}

// Auth Service using Supabase
export const authServiceSupabase = {
  // Register with email and password
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const { email, password, username, profileImage } = data;

      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            profile_image: profileImage || null,
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Registration failed');
      }

      // Check if email confirmation is required
      const session = authData.session;
      const needsEmailConfirmation = !session && authData.user && !authData.user.email_confirmed_at;

      if (needsEmailConfirmation) {
        // Email confirmation required - user can't sign in yet
        // But we don't throw an error, we return a success with a message
        return {
          success: true,
          message: 'Please check your email to verify your account before signing in.',
          data: undefined
        };
      }

      if (!session) {
        throw new Error('Registration failed - no session created');
      }

      // Sync user profile with backend
      await api.post('/auth/sync-profile', {
        userId: authData.user.id,
        email: authData.user.email,
        username,
        profileImage: profileImage || null,
        authProvider: 'local'
      });

      return {
        success: true,
        message: 'Registration successful! Please verify your email to unlock all features.',
        data: {
          token: session.access_token,
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            username,
            profileImage: profileImage || undefined,
            emailVerified: !!authData.user.email_confirmed_at,
          }
        }
      };
    } catch (error: any) {
      console.error('[authService] Registration error:', error);
      throw error;
    }
  },

  // Login with email and password
  login: async (credentials: { emailOrUsername: string; password: string }): Promise<AuthResponse> => {
    try {
      const { emailOrUsername, password } = credentials;

      // Supabase only accepts email, so we use email directly
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed');
      }

      // Get user profile from backend
      const profileResponse = await api.get<ApiResponse<{ user: User }>>('/auth/me');

      return {
        success: true,
        message: 'Login successful',
        data: {
          token: authData.session.access_token,
          user: profileResponse.data.data?.user || {
            id: authData.user.id,
            email: authData.user.email!,
            username: authData.user.user_metadata.username || authData.user.email!.split('@')[0],
            profileImage: authData.user.user_metadata.profile_image,
          }
        }
      };
    } catch (error: any) {
      console.error('[authService] Login error:', error);
      throw error;
    }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      console.error('[authService] Google sign-in error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
    } catch (error) {
      console.error('[authService] Logout error:', error);
      throw error;
    }
  },

  // Get current user from Supabase
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      if (!supabaseUser) {
        throw new Error('Not authenticated');
      }

      // Get additional profile data from backend
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data;
    } catch (error: any) {
      console.error('[authService] Get current user error:', error);
      throw error;
    }
  },

  // Get session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    // Supabase stores session in localStorage automatically
    const session = localStorage.getItem('musicsim_auth');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.access_token || null;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Check if authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Sync profile with backend (used for OAuth and profile creation)
  syncProfile: async (data: { userId: string; email: string; username: string; profileImage?: string; authProvider?: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/auth/sync-profile', data);
      return response.data;
    } catch (error: any) {
      console.error('[authService] Sync profile error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: { username?: string; profileImage?: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      // Update Supabase user metadata
      if (data.username || data.profileImage) {
        await supabase.auth.updateUser({
          data: {
            username: data.username,
            profile_image: data.profileImage,
          }
        });
      }

      // Update backend profile
      const response = await api.patch<ApiResponse<{ user: User }>>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('[authService] Update profile error:', error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Delete from backend first
      await api.delete('/auth/account');

      // Then sign out from Supabase
      await supabase.auth.signOut();

      return { success: true, message: 'Account deleted successfully' };
    } catch (error: any) {
      console.error('[authService] Delete account error:', error);
      return { success: false, message: error.message || 'Failed to delete account' };
    }
  },

  // Register from guest (with history transfer)
  registerFromGuest: async (data: RegisterData & { guestData?: any }): Promise<AuthResponse> => {
    try {
      // Register normally
      const response = await authServiceSupabase.register(data);

      // If guest data provided, send it to backend
      if (data.guestData && response.data) {
        await api.post('/auth/sync-guest-data', {
          userId: response.data.user.id,
          guestData: data.guestData
        });
      }

      return response;
    } catch (error: any) {
      console.error('[authService] Register from guest error:', error);
      throw error;
    }
  },

  // Clear auth data
  clearAuth: (): void => {
    localStorage.clear();
  },
};

export default authServiceSupabase;
