import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme, generateCSSVariables, type ThemeMode, type Theme } from '../constants/colors';

interface ThemeContextType {
  theme: ThemeMode;
  themeColors: Theme;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  // Apply CSS variables to document root
  const applyCSSVariables = (themeColors: Theme) => {
    const cssVariables = generateCSSVariables(themeColors);
    
    // Create or update style element
    let styleElement = document.getElementById('theme-variables');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-variables';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `:root {\n${cssVariables}\n}`;
  };

  // Load theme from localStorage and apply on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('musicsim_theme') as ThemeMode | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setThemeState(initialTheme);
    document.documentElement.classList.toggle('light', initialTheme === 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    
    // Apply CSS variables
    const themeColors = initialTheme === 'dark' ? darkTheme : lightTheme;
    applyCSSVariables(themeColors);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('musicsim_theme', newTheme);
    
    // Update document classes
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Apply new CSS variables
    const themeColors = newTheme === 'dark' ? darkTheme : lightTheme;
    applyCSSVariables(themeColors);
  };

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    themeColors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
