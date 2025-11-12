/**
 * MusicSim Professional Color System
 * 
 * A sophisticated color palette that avoids "vibe coding" aesthetics
 * and creates a unique, professional identity for the music simulation platform.
 */

// === DARK THEME (PRIMARY) ===
export const darkTheme = {
  // Background Layers
  background: {
    primary: '#0A0B0D',      // Deep charcoal - main background
    secondary: '#141518',     // Slightly lighter for panels
    tertiary: '#1C1E22',      // Cards and elevated surfaces
    overlay: '#242731',       // Modal overlays and dropdowns
  },

  // Text Hierarchy
  text: {
    primary: '#FFFFFF',       // High contrast for headers
    secondary: '#E4E6EA',     // Body text
    muted: '#9CA3AF',        // Secondary information
    disabled: '#6B7280',      // Disabled states
    inverse: '#0A0B0D',       // Text on light backgrounds
  },

  // Brand Colors (Music Industry Inspired)
  brand: {
    primary: '#FF6B35',       // Warm orange - energy, creativity
    secondary: '#F7931E',     // Golden yellow - success, achievement
    accent: '#1DB954',        // Spotify-inspired green - growth, progress
    highlight: '#E14ECA',     // Pink accent - for special moments
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',       // Green for positive actions
    warning: '#F59E0B',       // Amber for warnings
    error: '#EF4444',         // Red for errors/negative
    info: '#3B82F6',          // Blue for information
  },

  // UI Elements
  ui: {
    border: '#2D3036',        // Subtle borders
    borderHover: '#3F4449',   // Hover state borders
    borderFocus: '#FF6B35',   // Focus state (brand primary)
    shadow: 'rgba(0, 0, 0, 0.25)', // Drop shadows
    overlay: 'rgba(10, 11, 13, 0.8)', // Modal backgrounds
  },

  // Interactive States
  interactive: {
    primary: '#FF6B35',       // Primary buttons/links
    primaryHover: '#E55A2E',  // Primary hover
    primaryActive: '#CC4A24', // Primary active/pressed
    secondary: '#1C1E22',     // Secondary buttons
    secondaryHover: '#242731', // Secondary hover
    disabled: '#374151',      // Disabled state
  },

  // Status Colors (for game stats)
  status: {
    cash: '#10B981',          // Green for money
    fame: '#F59E0B',          // Golden for fame
    wellbeing: '#3B82F6',     // Blue for wellbeing
    career: '#E14ECA',        // Pink for career progress
    hype: '#8B5CF6',          // Purple for hype
  },
};

// === LIGHT THEME ===
export const lightTheme = {
  // Background Layers
  background: {
    primary: '#FFFFFF',       // Pure white main background
    secondary: '#F8FAFC',     // Very light gray for panels
    tertiary: '#F1F5F9',      // Cards and elevated surfaces
    overlay: '#E2E8F0',       // Modal overlays and dropdowns
  },

  // Text Hierarchy
  text: {
    primary: '#0F172A',       // Near black for headers
    secondary: '#334155',     // Dark gray for body text
    muted: '#64748B',         // Gray for secondary information
    disabled: '#94A3B8',      // Light gray for disabled
    inverse: '#FFFFFF',       // Text on dark backgrounds
  },

  // Brand Colors (Slightly adjusted for light backgrounds)
  brand: {
    primary: '#EA580C',       // Slightly darker orange for contrast
    secondary: '#D97706',     // Darker golden yellow
    accent: '#059669',        // Darker green for better contrast
    highlight: '#C026D3',     // Darker pink accent
  },

  // Semantic Colors (Darker for contrast)
  semantic: {
    success: '#059669',       // Darker green
    warning: '#D97706',       // Darker amber
    error: '#DC2626',         // Darker red
    info: '#2563EB',          // Darker blue
  },

  // UI Elements
  ui: {
    border: '#E2E8F0',        // Light gray borders
    borderHover: '#CBD5E1',   // Darker on hover
    borderFocus: '#EA580C',   // Focus state (brand primary)
    shadow: 'rgba(0, 0, 0, 0.1)', // Lighter shadows
    overlay: 'rgba(255, 255, 255, 0.9)', // Light modal backgrounds
  },

  // Interactive States
  interactive: {
    primary: '#EA580C',       // Primary buttons/links
    primaryHover: '#DC2626',  // Primary hover
    primaryActive: '#B91C1C', // Primary active/pressed
    secondary: '#F1F5F9',     // Secondary buttons
    secondaryHover: '#E2E8F0', // Secondary hover
    disabled: '#E5E7EB',      // Disabled state
  },

  // Status Colors (adjusted for light theme)
  status: {
    cash: '#059669',          // Darker green
    fame: '#D97706',          // Darker golden
    wellbeing: '#2563EB',     // Darker blue
    career: '#C026D3',        // Darker pink
    hype: '#7C3AED',          // Darker purple
  },
};

// === THEME UTILITIES ===
export type Theme = typeof darkTheme;
export type ThemeMode = 'dark' | 'light';

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// === CSS CUSTOM PROPERTIES GENERATOR ===
export const generateCSSVariables = (theme: Theme): string => {
  const flatten = (obj: any, prefix = ''): Record<string, string> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        return { ...acc, ...flatten(value, newKey) };
      }
      
      return { ...acc, [newKey]: value as string };
    }, {});
  };

  const flattened = flatten(theme);
  
  return Object.entries(flattened)
    .map(([key, value]) => `  --color-${key}: ${value};`)
    .join('\n');
};

// === TAILWIND CONFIG COLORS ===
export const tailwindColors = {
  // Map to CSS custom properties for dynamic theming
  'bg-primary': 'var(--color-background-primary)',
  'bg-secondary': 'var(--color-background-secondary)',
  'bg-tertiary': 'var(--color-background-tertiary)',
  'bg-overlay': 'var(--color-background-overlay)',
  
  'text-primary': 'var(--color-text-primary)',
  'text-secondary': 'var(--color-text-secondary)',
  'text-muted': 'var(--color-text-muted)',
  'text-disabled': 'var(--color-text-disabled)',
  
  'brand-primary': 'var(--color-brand-primary)',
  'brand-secondary': 'var(--color-brand-secondary)',
  'brand-accent': 'var(--color-brand-accent)',
  'brand-highlight': 'var(--color-brand-highlight)',
  
  'ui-border': 'var(--color-ui-border)',
  'ui-border-hover': 'var(--color-ui-border-hover)',
  'ui-border-focus': 'var(--color-ui-border-focus)',
  
  'interactive-primary': 'var(--color-interactive-primary)',
  'interactive-primary-hover': 'var(--color-interactive-primary-hover)',
  'interactive-secondary': 'var(--color-interactive-secondary)',
  'interactive-secondary-hover': 'var(--color-interactive-secondary-hover)',
  
  'status-cash': 'var(--color-status-cash)',
  'status-fame': 'var(--color-status-fame)',
  'status-wellbeing': 'var(--color-status-wellbeing)',
  'status-career': 'var(--color-status-career)',
  'status-hype': 'var(--color-status-hype)',
  
  'semantic-success': 'var(--color-semantic-success)',
  'semantic-warning': 'var(--color-semantic-warning)',
  'semantic-error': 'var(--color-semantic-error)',
  'semantic-info': 'var(--color-semantic-info)',
};