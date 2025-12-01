import { supabase } from './supabase';
import api from './api';
import storage from './dbStorage';
import { logger } from '../utils/logger';

// Allowed redirect URLs for OAuth (security measure)
const ALLOWED_REDIRECT_URLS = [
  'http://localhost:4173',
  'http://localhost:3000', 
  'http://localhost:5173',
  // Add your production domains here - UPDATE THESE WITH YOUR ACTUAL DOMAINS
  'https://musicsim.vercel.app',
  'https://musicsim-frontend.vercel.app',
  'https://musicsim-git-main.vercel.app',
  // Add more production URLs as needed
];

// Validate redirect URL for security
const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const normalizedUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    
    // Allow localhost for development
    if (parsedUrl.hostname === 'localhost') {
      return true;
    }
    
    const allowedDomains = [
      'musicsim.net',
      'www.musicsim.net',
      'music-sim.vercel.app',
      'https://www.music-sim.vercel.app',
    ];
    
    if (allowedDomains.includes(parsedUrl.hostname)) {
      return true;
    }
    
    // Allow vercel.app domains (for deployments)
    if (parsedUrl.hostname.endsWith('.vercel.app')) {
      return true;
    }
    
    return ALLOWED_REDIRECT_URLS.includes(normalizedUrl);
  } catch {
    return false;
  }
};

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

// Auth Service using Supabase
export const authServiceSupabase = {
  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      // Validate redirect URL for security
      const redirectUrl = window.location.origin;
      if (!validateRedirectUrl(redirectUrl)) {
        throw new Error('Invalid redirect URL. Please contact support.');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account', // Force Google account selection screen
            access_type: 'offline',
          },
          skipBrowserRedirect: false
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      logger.error('[authService] Google sign-in error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      // Only clear Supabase auth data, not guest data
      localStorage.removeItem('musicsim_auth');
    } catch (error) {
      logger.error('[authService] Logout error:', error);
      // Even if signOut fails, try to clear local auth data
      localStorage.removeItem('musicsim_auth');
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
      logger.error('[authService] Get current user error:', error);
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

  // Get token (access token) from Supabase session or fallback to stored token
  getToken: async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // session may be null if not authenticated; return access_token if present
      if (session && (session as any).access_token) {
        return (session as any).access_token;
      }
      // fallback to local storage parsed token
      const sessionRaw = localStorage.getItem('musicsim_auth');
      if (sessionRaw) {
        try {
          const parsed = JSON.parse(sessionRaw);
          return parsed.access_token || null;
        } catch {
          return null;
        }
      }
      return null;
    } catch {
      const sessionRaw = localStorage.getItem('musicsim_auth');
      if (sessionRaw) {
        try {
          const parsed = JSON.parse(sessionRaw);
          return parsed.access_token || null;
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Sync profile with backend (used for OAuth and profile creation)
  syncProfile: async (data: { userId: string; email: string; username: string; displayName?: string; profileImage?: string; authProvider?: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.post<ApiResponse<{ user: User }>>('/auth/sync-profile', data);
      return response.data;
    } catch (error: any) {
      logger.error('[authService] Sync profile error:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: { username?: string; displayName?: string; profileImage?: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      // Update Supabase user metadata
      if (data.username || data.displayName || data.profileImage) {
        await supabase.auth.updateUser({
          data: {
            username: data.username,
            display_name: data.displayName,
            profile_image: data.profileImage,
          }
        });
      }

      // Update backend profile
      const response = await api.patch<ApiResponse<{ user: User }>>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      logger.error('[authService] Update profile error:', error);
      throw error;
    }
  },

  // Delete account (deletes both database and Supabase auth user)
  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Backend will delete both database user AND Supabase auth user
      const response = await api.delete('/auth/account');

      // Sign out locally after backend confirms deletion
      await supabase.auth.signOut();

      // Clear all storage (localStorage for auth + IndexedDB for game data)
      localStorage.clear();
      await storage.clear();

      return {
        success: true,
        message: response.data?.message || 'Account deleted successfully'
      };
    } catch (error: any) {
      logger.error('[authService] Delete account error:', error);

      // If backend fails but we want to clear local data anyway
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to delete account';

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Clear auth data
  clearAuth: async (): Promise<void> => {
    localStorage.clear();
    await storage.clear();
  },

  // Upload profile image to Supabase Storage
  uploadProfileImage: async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        throw new Error('Image must be less than 2MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true, // Replace existing file
          contentType: file.type,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update user profile with new image URL
      await authServiceSupabase.updateProfile({ profileImage: publicUrl });

      return {
        success: true,
        url: publicUrl
      };
    } catch (error: any) {
      logger.error('[authService] Upload profile image error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  },

  // Update username
  updateUsername: async (username: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Validate username
      if (!username || username.length < 3 || username.length > 20) {
        throw new Error('Username must be 3-20 characters');
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }

      // Update backend
      const response = await api.post('/auth/update-username', { username });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update username');
      }

      // Update Supabase metadata
      await supabase.auth.updateUser({
        data: { username }
      });

      return {
        success: true,
        message: 'Username updated successfully'
      };
    } catch (error: any) {
      logger.error('[authService] Update username error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update username'
      };
    }
  },

  /**
   * Sync guest data (statistics and saves) to the authenticated user's account
   */
  syncGuestData: async (guestData: { statistics?: any; saves?: any[] }): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await authServiceSupabase.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await api.post('/auth/sync-guest-data', {
        guestData
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        success: response.data.success,
        message: response.data.message || 'Guest data synced successfully'
      };
    } catch (error: any) {
      logger.error('[authService] Sync guest data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to sync guest data'
      };
    }
  },
};

export default authServiceSupabase;
