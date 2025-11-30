// Development-only logger to eliminate console.log in production
const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn(...args);
  },
  error: (...args: any[]) => {
    // Always log errors, but in production send to error tracking service
    console.error(...args);
    // TODO: Send to error tracking service in production
  },
  info: (...args: any[]) => {
    if (isDevelopment) console.info(...args);
  },
  debug: (...args: any[]) => {
    if (isDevelopment) console.debug(...args);
  }
};

// Export individual functions for convenience
export const { log, warn, error, info, debug } = logger;
