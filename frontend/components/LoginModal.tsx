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

        await register(username, email, password);
        toast.show('Account created. Signing you in...', 'success');
        setLoading(false);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 700);
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>

        <h2 className="text-3xl font-bold text-violet-300 mb-2 text-center">{mode === 'login' ? 'Welcome Back!' : 'Join MusicSim'}</h2>
        <p className="text-gray-400 text-center mb-6">{mode === 'login' ? 'Login to continue your music career' : 'Create an account to start your journey'}</p>

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