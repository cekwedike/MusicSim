/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Using CSS custom properties for dynamic theming
        'bg-primary': 'var(--color-background-primary)',
        'bg-secondary': 'var(--color-background-secondary)',
        'bg-tertiary': 'var(--color-background-tertiary)',
        'bg-overlay': 'var(--color-background-overlay)',
        
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-inverse': 'var(--color-text-inverse)',
        
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
        'interactive-disabled': 'var(--color-interactive-disabled)',
        
        'status-cash': 'var(--color-status-cash)',
        'status-fame': 'var(--color-status-fame)',
        'status-wellbeing': 'var(--color-status-wellbeing)',
        'status-career': 'var(--color-status-career)',
        'status-hype': 'var(--color-status-hype)',
        
        'semantic-success': 'var(--color-semantic-success)',
        'semantic-warning': 'var(--color-semantic-warning)',
        'semantic-error': 'var(--color-semantic-error)',
        'semantic-info': 'var(--color-semantic-info)',
      },
      backgroundColor: {
        'primary': 'var(--color-background-primary)',
        'secondary': 'var(--color-background-secondary)',
        'tertiary': 'var(--color-background-tertiary)',
        'overlay': 'var(--color-background-overlay)',
      },
      textColor: {
        'primary': 'var(--color-text-primary)',
        'secondary': 'var(--color-text-secondary)',
        'muted': 'var(--color-text-muted)',
        'disabled': 'var(--color-text-disabled)',
        'inverse': 'var(--color-text-inverse)',
      },
      borderColor: {
        'default': 'var(--color-ui-border)',
        'hover': 'var(--color-ui-border-hover)',
        'focus': 'var(--color-ui-border-focus)',
      },
      boxShadow: {
        'theme': '0 4px 6px -1px var(--color-ui-shadow), 0 2px 4px -1px var(--color-ui-shadow)',
        'theme-lg': '0 10px 15px -3px var(--color-ui-shadow), 0 4px 6px -2px var(--color-ui-shadow)',
        'theme-xl': '0 20px 25px -5px var(--color-ui-shadow), 0 10px 10px -5px var(--color-ui-shadow)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}