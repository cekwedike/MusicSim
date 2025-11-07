import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, Check } from 'lucide-react';
import type { GameStatistics } from '../types';
import authServiceSupabase from '../services/authService.supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  isGuestMode?: boolean;
  guestStatistics?: GameStatistics;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  isGuestMode = false,
  guestStatistics
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  const { login, register, registerFromGuest, signInWithGoogle } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // Password validation helper
  const getPasswordChecks = (pw: string) => {
    const minLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return { minLength, hasUpper, hasLower, hasNumber, valid: minLength && hasUpper && hasLower && hasNumber };
  };

  // Reset form when modal opens or initial mode changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setUsername('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setProfileImage(undefined);
      setError('');

      // Check if URL has password reset hash
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        setMode('reset-password');
      } else {
        setMode(initialMode);
      }

      // focus email field when modal opens
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [isOpen, initialMode]);

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.show('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.show('Image size must be less than 2MB', 'error');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authServiceSupabase.resetPasswordRequest(email);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.show(result.message, 'success');
      setLoading(false);

      // Switch back to login mode after a delay
      setTimeout(() => {
        setMode('login');
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      toast.show(errorMessage, 'error');
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const checks = getPasswordChecks(newPassword);
      if (!checks.valid) {
        throw new Error('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number');
      }

      const result = await authServiceSupabase.resetPasswordConfirm(newPassword);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.show(result.message, 'success');
      setLoading(false);

      // Clear URL hash and switch to login
      window.location.hash = '';
      setTimeout(() => {
        setMode('login');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.show(errorMessage, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const checks = getPasswordChecks(password);
        if (!checks.valid) {
          const msg = 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.';
          setError(msg);
          toast.show(msg, 'error');
          setLoading(false);
          return;
        }
        if (username.length < 3) {
          const msg = 'Username must be at least 3 characters long.';
          setError(msg);
          toast.show(msg, 'error');
          setLoading(false);
          return;
        }

        // Use registerFromGuest if guest data is available, otherwise use regular register
        let registrationSuccess = false;
        if (isGuestMode && guestStatistics) {
          // Capture all guest data including game saves from localStorage
          const gameSaves = localStorage.getItem('musicsim_saves');
          const guestData = {
            statistics: guestStatistics,
            saves: gameSaves ? JSON.parse(gameSaves) : null
          };
          registrationSuccess = await registerFromGuest(username, email, password, guestData, profileImage);
        } else {
          registrationSuccess = await register(username, email, password, profileImage);
        }

        setLoading(false);

        if (registrationSuccess) {
          // User is logged in immediately (email confirmation disabled or OAuth)
          toast.show('Account created successfully!', 'success');
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 700);
        } else {
          // Email confirmation required - user needs to verify before logging in
          toast.show('Please check your email to verify your account before signing in.', 'info');
          setTimeout(() => {
            onClose();
          }, 3000);
        }
        return;
      }

      // login
      await login(email, password);
      toast.show('Logged in successfully. Redirecting...', 'success');
      setLoading(false);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 700);
    } catch (err: any) {
      setLoading(false);

      // Extract message from error object or default
      let serverMsg = 'Something went wrong. Please try again.';
      if (err?.response?.data?.message) serverMsg = String(err.response.data.message);
      else if (err?.message) serverMsg = String(err.message);

      const lower = serverMsg.toLowerCase();

      // Duplicate email on register -> switch to login and focus password
      if (lower.includes('email') && lower.includes('already')) {
        const friendly = 'Email already in use. Please log in.';
        setMode('login');
        setEmail(email);
        setPassword('');
        setError('');
        toast.show(friendly, 'info');
        setTimeout(() => passwordRef.current?.focus(), 120);
        return;
      }

      // Username taken
      if (lower.includes('username') && lower.includes('already')) {
        const friendly = 'That username is already taken. Please choose another.';
        setError(friendly);
        toast.show(friendly, 'error');
        return;
      }

      // Invalid credentials
      if (lower.includes('invalid') || lower.includes('credentials') || lower.includes('wrong')) {
        const friendly = 'Incorrect email/username or password. Please try again.';
        setError(friendly);
        toast.show(friendly, 'error');
        return;
      }

      // Network
      if (lower.includes('network') || lower.includes('ecconnrefused') || lower.includes('connect')) {
        const friendly = 'Network error. Please check your internet connection and try again.';
        setError(friendly);
        toast.show(friendly, 'error');
        return;
      }

      // Default
      setError(serverMsg);
      toast.show(serverMsg, 'error');
    }
  };

  if (!isOpen) return null;

  const checks = getPasswordChecks(password);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-8 relative">
  <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center">x</button>

        <h2 className="text-3xl font-bold text-violet-300 mb-2 text-center">
          {mode === 'login' ? 'Welcome Back!' :
           mode === 'register' ? 'Join MusicSim' :
           mode === 'forgot-password' ? 'Reset Password' :
           'Set New Password'}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {mode === 'login' ? 'Login to continue your music career' :
           mode === 'register' ? 'Create an account to start your journey' :
           mode === 'forgot-password' ? 'Enter your email to receive a password reset link' :
           'Enter your new password'}
        </p>

        {isGuestMode && mode === 'register' && guestStatistics && (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">[OK]</span>
              <div>
                <h4 className="text-sm font-semibold text-green-300 mb-1">Save Your Progress!</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Your current stats and achievements will be saved to your new account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="your@email.com"
                required
                autoFocus
              />
              <p className="text-gray-400 text-xs mt-1">We'll send you a link to reset your password</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-red-300 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-violet-300 hover:text-violet-200"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter new password"
                required
                minLength={8}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
                minLength={8}
              />
            </div>

            {/* Password requirements */}
            <div className="text-sm text-gray-300 space-y-1">
              <div className={getPasswordChecks(newPassword).minLength ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                {getPasswordChecks(newPassword).minLength ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                <span>Minimum 8 characters</span>
              </div>
              <div className={getPasswordChecks(newPassword).hasUpper ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                {getPasswordChecks(newPassword).hasUpper ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={getPasswordChecks(newPassword).hasLower ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                {getPasswordChecks(newPassword).hasLower ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div className={getPasswordChecks(newPassword).hasNumber ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                {getPasswordChecks(newPassword).hasNumber ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                <span>At least one number (0-9)</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-red-300 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}

        {/* Login/Register Forms */}
        {(mode === 'login' || mode === 'register') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
            <>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                  maxLength={30}
                />
                <p className="text-gray-400 text-xs mt-1">This will be your display name. 3-30 characters.</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Profile Image (Optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-2xl"></span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {profileImage ? 'Change Image' : 'Upload Image'}
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-1">Max 2MB, JPG, PNG, or GIF</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-300 mb-2 font-medium">{mode === 'login' ? 'Email or Username' : 'Email'}</label>
            <input
              ref={emailRef}
              type={mode === 'login' ? 'text' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder={mode === 'login' ? 'Enter email or username' : 'your@email.com'}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                minLength={8}
                aria-describedby={mode === 'register' ? 'password-hint' : undefined}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-gray-300 hover:text-white z-20 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-sm text-violet-300 hover:text-violet-200"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div id="password-hint" className="mt-2 text-sm text-gray-300 space-y-1">
                <div className={checks.minLength ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                  {checks.minLength ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                  <span>Minimum 8 characters</span>
                </div>
                <div className={checks.hasUpper ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                  {checks.hasUpper ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={checks.hasLower ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                  {checks.hasLower ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                  <span>At least one lowercase letter (a-z)</span>
                </div>
                <div className={checks.hasNumber ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                  {checks.hasNumber ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                  <span>At least one number (0-9)</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-red-300 text-sm font-medium animate-shake mt-3">
                {error}
              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Please wait...
              </span>
            ) : (
              mode === 'login' ? 'Login' : 'Create Account'
            )}
          </button>
        </form>
        )}

        {(mode === 'login' || mode === 'register') && (
          <>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    // Supabase will redirect to Google, then back to app
                  } catch (error) {
                    console.error('Google sign-in error:', error);
                    toast.show('Failed to sign in with Google', 'error');
                  }
                }}
                disabled={loading}
                className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign {mode === 'login' ? 'in' : 'up'} with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                  setEmail('');
                  setPassword('');
                  setUsername('');
                }}
                className="text-violet-400 hover:text-violet-300 text-sm font-medium underline"
              >
                {mode === 'login' ? "Don't have an account? Register here" : 'Already have an account? Login here'}
              </button>
            </div>
          </>
        )}

        <div className="mt-4 text-center">
          <button type="button" className="text-gray-400 hover:text-gray-300 text-sm underline" onClick={onClose} disabled={loading}>
            Continue as Guest
          </button>
          <p className="text-gray-500 text-xs mt-1">Note: Guest progress won't be saved and some features may be limited.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;