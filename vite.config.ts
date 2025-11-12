import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: 'frontend',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'frontend'),
        }
      },
      build: {
        outDir: '../dist',
        emptyOutDir: true,
        manifest: true,
        chunkSizeWarningLimit: 600, // Increase threshold slightly to reduce warnings
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Vendor libraries
              if (id.includes('node_modules')) {
                // React ecosystem
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                // UI/Icon libraries
                if (id.includes('lucide-react')) {
                  return 'ui-vendor';
                }
                // Supabase and auth
                if (id.includes('@supabase') || id.includes('@react-oauth')) {
                  return 'auth-vendor';
                }
                // Workbox service worker libraries
                if (id.includes('workbox')) {
                  return 'workbox-vendor';
                }
                // Other utilities
                if (id.includes('axios') || id.includes('pureimage')) {
                  return 'utils-vendor';
                }
                // Everything else goes to vendor
                return 'vendor';
              }
              
              // Application code splitting
              // Components that are likely to be used together
              if (id.includes('/components/')) {
                if (id.includes('Modal') || id.includes('Dialog')) {
                  return 'modals';
                }
                if (id.includes('Learning') || id.includes('Tutorial')) {
                  return 'learning';
                }
                if (id.includes('Audio') || id.includes('Sound')) {
                  return 'audio';
                }
                if (id.includes('Game') || id.includes('Scenario') || id.includes('Career')) {
                  return 'game';
                }
                return 'components';
              }
              
              // Services and utilities
              if (id.includes('/services/') || id.includes('/utils/')) {
                return 'services';
              }
              
              // Data and constants
              if (id.includes('/data/') || id.includes('/constants/')) {
                return 'data';
              }
              
              // Contexts
              if (id.includes('/contexts/')) {
                return 'contexts';
              }
            }
          }
        }
      },
      server: {
        port: 5173
      },
      test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: [],
        include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', 'backend'],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: ['node_modules/', 'dist/', 'backend/']
        }
      }
    };
});
