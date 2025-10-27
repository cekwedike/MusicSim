import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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

  // Password validation helper (used for real-time hints and pre-submit validation)
  const getPasswordChecks = (pw: string) => {
    const minLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return { minLength, hasUpper, hasLower, hasNumber, valid: minLength && hasUpper && hasLower && hasNumber };
  };

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setUsername('');
      setPassword('');
      setError('');
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pre-submit validation for registration mode
      if (mode === 'register') {
        const result = getPasswordChecks(password);
        if (!result.valid) {
          setError('Password must be at least 8 characters and include an uppercase letter, lowercase letter, and a number.');
          setLoading(false);
          return;
        }
      }

      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          onClose(); // Close modal on successful login
          // Reload to ensure AuthProvider picks up stored auth state and hides the landing page
          window.location.reload();
        } else {
          setLoading(false);
        }
      } else {
        // Validation for registration
        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          setLoading(false);
          return;
        }
        
        

        // register expects (username, email, password)
        const ok = await register(username, email, password);
        if (ok) {
          onClose(); // Close modal on successful registration
          // Reload to ensure AuthProvider picks up stored auth state and hides the landing page
          window.location.reload();
        } else {
          setLoading(false);
        }
      }
    } catch (err: any) {
      setLoading(false);
      
      // Parse error message
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // User-friendly error messages
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = mode === 'login' 
          ? '❌ Wrong email/username or password. Please try again.'
          : errorMessage;
      } else if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
        errorMessage = '❌ This email or username is already taken. Try logging in instead.';
      } else if (errorMessage.includes('not found')) {
        errorMessage = '❌ No account found with these credentials. Please register first.';
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        errorMessage = '🌐 Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
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
                  return (
                    <ul className="space-y-1 text-sm">
                      <li className={checks.minLength ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                        {checks.minLength ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                        <span>Minimum 8 characters</span>
                      </li>
                      <li className={checks.hasUpper ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                        {checks.hasUpper ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                        <span>At least one uppercase letter (A-Z)</span>
                      </li>
                      <li className={checks.hasLower ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                        {checks.hasLower ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                        <span>At least one lowercase letter (a-z)</span>
                      </li>
                      <li className={checks.hasNumber ? 'text-green-300 flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                        {checks.hasNumber ? <Check className="w-4 h-4 text-green-300" /> : <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />}
                        <span>At least one number (0-9)</span>
                      </li>
                    </ul>
                  );
                })()}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-red-300 text-sm font-medium animate-shake">
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