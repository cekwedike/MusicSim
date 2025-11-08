import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import authServiceSupabase, { type User } from '../services/authService.supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, profileImage?: string) => Promise<boolean>;
  registerFromGuest: (username: string, email: string, password: string, guestData?: any, profileImage?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { username?: string; profileImage?: string }) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync user profile with backend
  const syncUserProfile = useCallback(async (supabaseUser: any) => {
    // Extract profile data from Supabase user first (always available)
    const username = supabaseUser.user_metadata.username || supabaseUser.user_metadata.name || supabaseUser.email!.split('@')[0];
    const profileImage = supabaseUser.user_metadata.profile_image ||
                        supabaseUser.user_metadata.avatar_url ||
                        supabaseUser.user_metadata.picture;
    const emailVerified = !!supabaseUser.email_confirmed_at;

    // Set user immediately with Supabase data (don't wait for backend)
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email!,
      username,
      profileImage,
      emailVerified,
    });

    // Try to sync with backend in background (non-blocking)
    try {
      // Get user profile from backend (with timeout)
      const profileResponse = await Promise.race([
        authServiceSupabase.getCurrentUser(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Backend sync timeout')), 5000)
        )
      ]) as any;

      if (profileResponse.success && profileResponse.data) {
        const backendUser = profileResponse.data.user;

        // Update user with backend data (keep emailVerified from Supabase)
        setUser(prev => ({
          ...backendUser,
          emailVerified
        }));

        // Check if user signed in with OAuth and should get Google profile image
        const authProvider = supabaseUser.app_metadata.provider;
        const googleImageUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture;

        // If user signed in with Google and doesn't have a profile image yet, use Google image
        if (authProvider === 'google' && googleImageUrl && !backendUser.profileImage) {
          console.log('[AuthContext] Setting Google profile image for OAuth user');
          try {
            // Update profile with Google image (background, don't wait)
            authServiceSupabase.updateProfile({ profileImage: googleImageUrl }).then(() => {
              setUser(prev => prev ? { ...prev, profileImage: googleImageUrl } : prev);
            }).catch(console.error);
          } catch (error) {
            console.error('[AuthContext] Failed to set Google profile image:', error);
          }
        }
      } else {
        // If no backend profile exists, create it with Supabase data (background)
        const authProvider = supabaseUser.app_metadata.provider || 'google';

        // Sync this new user to backend (don't block UI)
        authServiceSupabase.syncProfile({
          userId: supabaseUser.id,
          email: supabaseUser.email!,
          username,
          profileImage,
          authProvider
        }).catch(err => {
          console.warn('[AuthContext] Background profile sync failed:', err);
        });
      }
    } catch (error) {
      // Backend is slow/unavailable, but user is already set with Supabase data
      console.warn('[AuthContext] Backend sync failed (using Supabase data):', error);
    }
  }, []);

  // Initialize auth state and listen to Supabase auth changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for OAuth errors in URL (from Supabase OAuth callback)
        // Check both query params (?error=...) and hash fragment (#error=...)
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const errorParam = params.get('error') || hashParams.get('error');
        const errorCode = params.get('error_code') || hashParams.get('error_code');
        const errorDescription = params.get('error_description') || hashParams.get('error_description');

        if (errorParam) {
          console.error('[AuthContext] Auth error:', errorParam, errorCode, errorDescription);

          // Clean up the URL by removing error parameters
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          // Set user-friendly error message based on error code
          let friendlyMessage = 'Authentication failed. Please try again.';

          if (errorCode === 'otp_expired') {
            friendlyMessage = 'Email verification link has expired. Please request a new one by signing up again.';
          } else if (errorCode === 'access_denied') {
            friendlyMessage = 'Email verification failed. The link may have expired or already been used.';
          } else if (errorDescription) {
            const desc = decodeURIComponent(errorDescription);
            if (desc.includes('Email link is invalid') || desc.includes('expired')) {
              friendlyMessage = 'Email verification link has expired. Please sign up again to receive a new verification email.';
            } else if (desc.includes('exchange') || desc.includes('code')) {
              friendlyMessage = 'Google sign-in failed. Please check your internet connection and try again.';
            }
          }
          setError(friendlyMessage);

          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user && mounted) {
          setToken(session.access_token);
          await syncUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event);

      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setToken(session.access_token);
        await syncUserProfile(session.user);
        setError(null);

        // Clean up URL hash after successful sign in (email verification, OAuth callback, etc.)
        if (window.location.hash) {
          const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        setError(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setToken(session.access_token);
      } else if (event === 'USER_UPDATED' && session) {
        await syncUserProfile(session.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('[AuthContext] Password recovery initiated');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncUserProfile]);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServiceSupabase.login({
        emailOrUsername: email,
        password
      });

      if (response.success && response.data) {
        // State will be updated by onAuthStateChange listener
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      const message = err?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (username: string, email: string, password: string, profileImage?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServiceSupabase.register({
        username,
        email,
        password,
        profileImage
      });

      if (response.success) {
        if (response.data) {
          // User is logged in immediately - state will be updated by onAuthStateChange listener
          return true;
        } else {
          // Email confirmation required - user not logged in yet
          setError(null); // Clear any errors
          return false;
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      const message = err?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register from guest function
  const registerFromGuest = useCallback(async (username: string, email: string, password: string, guestData?: any, profileImage?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServiceSupabase.registerFromGuest({
        username,
        email,
        password,
        profileImage,
        guestData
      });

      if (response.success && response.data) {
        // State will be updated by onAuthStateChange listener
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      const message = err?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authServiceSupabase.signInWithGoogle();
      // Supabase will redirect to Google OAuth
      // When they come back, onAuthStateChange will handle it
    } catch (err: any) {
      const message = err?.message || 'Google sign-in failed';
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    // Clear state immediately for instant logout UX
    setUser(null);
    setToken(null);
    setError(null);
    setIsLoading(false);

    // Logout from Supabase in background (don't block UI)
    authServiceSupabase.logout().catch(error => {
      console.warn('Background logout error:', error);
    });
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: { username?: string; profileImage?: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authServiceSupabase.updateProfile(data);

      if (response.success && response.data) {
        // Update user state with new data
        setUser(response.data.user);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('[AuthContext] Update profile failed:', error);
      const message = (error as any)?.message || 'Failed to update profile';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete account function
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const result = await authServiceSupabase.deleteAccount();

      // Clear local state
      setUser(null);
      setToken(null);
      setError(null);

      console.log('[AuthContext] Account deleted, state cleared');

      return result;
    } catch (error) {
      console.error('[AuthContext] Delete account failed:', error);
      const message = (error as any)?.message || 'Failed to delete account';
      setError(message);

      return {
        success: false,
        message
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh token function (Supabase handles this automatically)
  const refreshToken = useCallback(async (): Promise<boolean> => {
    // Supabase automatically refreshes tokens
    // This function is kept for compatibility but does nothing
    return true;
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    registerFromGuest,
    signInWithGoogle,
    logout,
    deleteAccount,
    updateProfile,
    refreshToken,
    clearError,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
