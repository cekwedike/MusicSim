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

      // Check if we have a session (user can login immediately)
      const session = authData.session;

      if (session) {
        // User has session - email confirmation is DISABLED or auto-login enabled
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
          message: 'Registration successful! Welcome to MusicSim.',
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
      } else {
        // No session - email confirmation is REQUIRED
        // User created in Supabase Auth but can't login until they verify
        // Profile will be created when they verify via /auth/me endpoint
        return {
          success: true,
          message: 'Registration successful! Please check your email to verify your account and login.',
          data: undefined
        };
      }
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

  // Request password reset
  resetPasswordRequest: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error: any) {
      console.error('[authService] Password reset request error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send password reset email'
      };
    }
  },

  // Confirm password reset (set new password)
  resetPasswordConfirm: async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!newPassword || newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password updated successfully! You can now log in with your new password.'
      };
    } catch (error: any) {
      console.error('[authService] Password reset confirm error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update password'
      };
    }
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.email) {
        throw new Error('No user found');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      };
    } catch (error: any) {
      console.error('[authService] Resend verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to resend verification email'
      };
    }
  },

  // Check if current user's email is verified
  isEmailVerified: async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      // Check if user signed in with OAuth (Google) - they're auto-verified
      const authProvider = user.app_metadata?.provider;
      if (authProvider === 'google') {
        return true;
      }

      // For email/password users, check email_confirmed_at
      return !!user.email_confirmed_at;
    } catch (error) {
      console.error('[authService] Check email verified error:', error);
      return false;
    }
  },

  // Get email verification status (more detailed)
  getEmailVerificationStatus: async (): Promise<{
    isVerified: boolean;
    isOAuthUser: boolean;
    email?: string;
  }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { isVerified: false, isOAuthUser: false };
      }

      const authProvider = user.app_metadata?.provider;
      const isOAuthUser = authProvider !== 'email';

      return {
        isVerified: isOAuthUser || !!user.email_confirmed_at,
        isOAuthUser,
        email: user.email,
      };
    } catch (error) {
      console.error('[authService] Get verification status error:', error);
      return { isVerified: false, isOAuthUser: false };
    }
  },
};

export default authServiceSupabase;
