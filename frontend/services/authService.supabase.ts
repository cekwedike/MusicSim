import { supabase } from './supabase';
import api from './api';

// Allowed redirect URLs for OAuth (security measure)
const ALLOWED_REDIRECT_URLS = [
  'http://localhost:4173',
  'http://localhost:3000', 
  'http://localhost:5173',
  // Add your production domains here
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com'
];

// Validate redirect URL for security
const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const normalizedUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
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
      console.error('[authService] Google sign-in error:', error);
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
      console.error('[authService] Logout error:', error);
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
      console.error('[authService] Update profile error:', error);
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

      // Clear all local storage
      localStorage.clear();

      return {
        success: true,
        message: response.data?.message || 'Account deleted successfully'
      };
    } catch (error: any) {
      console.error('[authService] Delete account error:', error);

      // If backend fails but we want to clear local data anyway
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to delete account';

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Clear auth data
  clearAuth: (): void => {
    localStorage.clear();
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
      console.error('[authService] Upload profile image error:', error);
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
      console.error('[authService] Update username error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update username'
      };
    }
  },
};

export default authServiceSupabase;
