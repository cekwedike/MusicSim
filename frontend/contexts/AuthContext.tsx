import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
          // Validate token is still valid by making a test request
          try {
            setToken(storedToken);
            setUser(storedUser);
            
            // Test token validity - if this fails, we'll catch and clear auth
            const isValid = await authService.verifyToken();
            if (isValid) {
              // Optionally get fresh user data from server
              try {
                const currentUserResponse = await authService.getCurrentUser();
                if (currentUserResponse.success && currentUserResponse.data) {
                  setUser(currentUserResponse.data.user);
                }
              } catch (error) {
                // If getting current user fails, keep the stored user data
                console.warn('Could not fetch current user data:', error);
              }
            } else {
              // Token is invalid or expired
              console.log('Stored token invalid, clearing auth state');
              authService.clearAuth();
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            // Token is invalid or expired
            console.log('Stored token invalid, clearing auth state');
            authService.clearAuth();
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function - throws on failure so calling components can handle/display errors
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authService.login({
        emailOrUsername: email,
        password
      });

      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;

        // Store in state
        setUser(userData);
        setToken(authToken);

        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function - throws on failure so calling components can handle/display errors
  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await authService.register({
        username,
        email,
        password
      });

      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;

        // Store in state
        setUser(userData);
        setToken(authToken);

        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Call server logout
      await authService.logout();
    } catch (error) {
      // Don't prevent logout on server error
      console.warn('Server logout failed:', error);
    }

    // Clear local state
    setUser(null);
    setToken(null);
    setError(null);

    setIsLoading(false);
  }, []);

  // Delete account function
  const deleteAccount = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // Call delete account service (also clears localStorage)
      const result = await authService.deleteAccount();

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

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const response = await authService.refreshToken();
      
      if (response && response.success && response.data) {
        const { user: userData, token: newToken } = response.data;
        
        // Update state
        setUser(userData);
        setToken(newToken);
        
        return true;
      } else {
        // Refresh failed, set context error and logout user
        setError((response && response.message) || 'Token refresh failed');
        logout();
        return false;
      }
    } catch (error) {
      const msg = (error as any)?.message || 'Token refresh failed';
      console.error('Token refresh failed:', error);
      setError(msg);
      logout();
      return false;
    }
  }, [token, logout]);

  // Listen for token expiration and handle automatic refresh
  useEffect(() => {
    if (!token) return;

    // Set up periodic token refresh (every 45 minutes if token expires in 1 hour)
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [token, refreshToken]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    deleteAccount,
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