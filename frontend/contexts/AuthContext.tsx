import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import authServiceSupabase, { type User } from '../services/authService.supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, profileImage?: string, displayName?: string) => Promise<boolean>;
  registerFromGuest: (username: string, email: string, password: string, guestData?: any, profileImage?: string, displayName?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { username?: string; displayName?: string; profileImage?: string }) => Promise<boolean>;
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
    try {
      // Get user profile from backend
      const profileResponse = await authServiceSupabase.getCurrentUser();

      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data.user);
      } else {
        // If no backend profile exists, use Supabase user data
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          username: supabaseUser.user_metadata.username || supabaseUser.email!.split('@')[0],
          displayName: supabaseUser.user_metadata.display_name,
          profileImage: supabaseUser.user_metadata.profile_image,
        });
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
      // Fallback to Supabase user data
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        username: supabaseUser.user_metadata.username || supabaseUser.email!.split('@')[0],
        displayName: supabaseUser.user_metadata.display_name,
        profileImage: supabaseUser.user_metadata.profile_image,
      });
    }
  }, []);

  // Initialize auth state and listen to Supabase auth changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
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
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        setError(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setToken(session.access_token);
      } else if (event === 'USER_UPDATED' && session) {
        await syncUserProfile(session.user);
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
  const register = useCallback(async (username: string, email: string, password: string, profileImage?: string, displayName?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServiceSupabase.register({
        username,
        email,
        password,
        profileImage,
        displayName
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

  // Register from guest function
  const registerFromGuest = useCallback(async (username: string, email: string, password: string, guestData?: any, profileImage?: string, displayName?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServiceSupabase.registerFromGuest({
        username,
        email,
        password,
        profileImage,
        displayName,
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
    setIsLoading(true);

    try {
      await authServiceSupabase.logout();
      // State will be cleared by onAuthStateChange listener
    } catch (error) {
      console.warn('Logout error:', error);
      // Force clear state even on error
      setUser(null);
      setToken(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: { username?: string; displayName?: string; profileImage?: string }): Promise<boolean> => {
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
