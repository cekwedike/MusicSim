import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'button' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md', 
  showLabel = false, 
  variant = 'switch',
  className = '' 
}) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'button') {
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    return (
      <button
        onClick={toggleTheme}
        className={`
          inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
          bg-secondary hover:bg-tertiary text-secondary
          border border-ui-border hover:border-ui-border-hover
          ${sizeClasses[size]}
          ${className}
        `}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
        {showLabel && (
          <span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </button>
    );
  }

  // Switch variant (default)
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14'
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const translateClasses = {
    sm: theme === 'dark' ? 'translate-x-0.5' : 'translate-x-4',
    md: theme === 'dark' ? 'translate-x-0.5' : 'translate-x-5',
    lg: theme === 'dark' ? 'translate-x-0.5' : 'translate-x-7'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-secondary">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
          ${theme === 'dark' 
            ? 'bg-brand-primary' 
            : 'bg-ui-border hover:bg-ui-border-hover'
          }
          ${sizeClasses[size]}
        `}
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <span
          className={`
            ${thumbSizeClasses[size]}
            inline-block transform rounded-full transition duration-200 ease-in-out
            ${translateClasses[size]}
            ${theme === 'dark' 
              ? 'bg-white shadow-lg' 
              : 'bg-white shadow-md'
            }
          `}
        >
          <span className="flex h-full w-full items-center justify-center">
            {theme === 'dark' ? (
              <svg className="h-3 w-3 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </span>
        </span>
      </button>
      
      {showLabel && !showLabel && (
        <span className="text-sm font-medium text-muted">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;