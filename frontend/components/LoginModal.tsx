import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const toast = useToast();

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
      setError('');
      setMode(initialMode);
      // focus email field when modal opens
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [isOpen, initialMode]);

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
    } catch (err: any) {
      setLoading(false);

      // Parse error message
      let errorMessage = 'An error occurred. Please try again.';

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      // User-friendly error messages and specific flows
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = mode === 'login'
          ? '❌ Wrong email/username or password. Please try again.'
          : errorMessage;
      }

      // Backend may return 'Email already registered' or 'Username already taken'
      const lower = errorMessage.toLowerCase();
      if (lower.includes('email') && lower.includes('already')) {
        // Switch to login mode and prefill email
        setMode('login');
        setEmail(email);
        errorMessage = '❌ This email is already registered. Please login.';
      } else if (lower.includes('username') && lower.includes('already')) {
        // Username taken - inform user to choose another username
        errorMessage = '❌ This username is already taken. Please choose another.';
      } else if (lower.includes('network') || lower.includes('ecconnrefused') || lower.includes('connect')) {
        errorMessage = '🌐 Network error. Please check your internet connection.';
      }

      // Show inline error and a global toast for visibility
      setError(errorMessage);
      try {
        toast.show(errorMessage, 'error');
      } catch (_) {
        // If toast isn't available for some reason, ignore
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-violet-300 mb-2 text-center">
          {mode === 'login' ? 'Welcome Back!' : 'Join MusicSim'}
        </h2>
        
        <p className="text-gray-400 text-center mb-6">
          {mode === 'login' 
            ? 'Login to continue your music career' 
            : 'Create an account to start your journey'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
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
              <p className="text-gray-400 text-xs mt-1">3-30 characters, letters, numbers, and underscores only</p>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              {mode === 'login' ? 'Email or Username' : 'Email'}
            </label>
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

              {/* Show/Hide toggle - touch target at least 44x44 (w-11 h-11) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-gray-300 hover:text-white z-20 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Short summary hint (registration only) */}
            {mode === 'register' && (
              <p className="text-gray-400 text-xs mt-1">Minimum 8 characters, include an uppercase letter, a lowercase letter and a number</p>
            )}

            {/* Real-time validation hints (registration only) */}
            {mode === 'register' && (
              <div id="password-hint" className="mt-2">
                {(() => {
                  const checks = getPasswordChecks(password);
                        setLoading(false);
                  return (
                        // Backend may return 'Email already registered' or 'Username already taken'
                        const lower = errorMessage.toLowerCase();

                        if (lower.includes('email') && lower.includes('already')) {
                          // Friendly message and switch to login mode so user can sign in
                          const friendly = 'Email already in use. Please log in.';
                          setMode('login');
                          setEmail(email);
                          setPassword('');
                          setError(friendly);
                          try {
                            toast.show(friendly, 'info');
                          } catch (_) {}

                          // Focus password input so the user can enter their password immediately
                          setTimeout(() => {
                            passwordRef.current?.focus();
                          }, 120);
                          return;
                        }

                        if (lower.includes('username') && lower.includes('already')) {
                          const friendly = 'That username is already taken. Please choose another.';
                          setError(friendly);
                          try { toast.show(friendly, 'error'); } catch (_) {}
                          return;
                        }

                        if (lower.includes('network') || lower.includes('ecconnrefused') || lower.includes('connect')) {
                          const friendly = 'Network error. Please check your internet connection and try again.';
                          setError(friendly);
                          try { toast.show(friendly, 'error'); } catch (_) {}
                          return;
                        }

                        // Default: show a simple, user-friendly message
                        const friendly = errorMessage || 'Something went wrong. Please try again.';
                        setError(friendly);
                        try { toast.show(friendly, 'error'); } catch (_) {}
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-red-300 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          {/* success handled via global toast */}

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
            {mode === 'login' 
              ? "Don't have an account? Register here" 
              : 'Already have an account? Login here'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            className="text-gray-400 hover:text-gray-300 text-sm underline" 
            onClick={onClose}
            disabled={loading}
          >
            Continue as Guest
          </button>
          <p className="text-gray-500 text-xs mt-1">
            Note: Guest progress won't be saved and some features may be limited.
          </p>
        </div>
      </div>
    </div>
  );
};