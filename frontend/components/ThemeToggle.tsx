import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center w-20 h-8 bg-gray-700 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
        theme === 'light' ? 'focus:ring-offset-white' : 'focus:ring-offset-gray-900'
      } ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Track */}
      <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-400'
      }`}>
        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Moon className={`w-3 h-3 transition-opacity duration-300 ${
            theme === 'dark' ? 'text-blue-300 opacity-100' : 'text-gray-600 opacity-50'
          }`} />
          <Sun className={`w-3 h-3 transition-opacity duration-300 ${
            theme === 'light' ? 'text-white opacity-100' : 'text-gray-400 opacity-50'
          }`} />
        </div>
      </div>

      {/* Toggle Thumb */}
      <div className={`relative w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
        theme === 'dark' ? 'translate-x-1' : 'translate-x-[3.25rem]'
      }`}>
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-gray-700" />
        ) : (
          <Sun className="w-3 h-3 text-orange-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
