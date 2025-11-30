import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';

/**
 * Reports web vitals to analytics
 * Only runs in production to avoid polluting dev metrics
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (!onPerfEntry || !(onPerfEntry instanceof Function)) {
    return;
  }

  // Only report in production
  if (import.meta.env.PROD) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}

/**
 * Simple logger for web vitals
 * Can be replaced with analytics service (Google Analytics, etc.)
 */
export function logWebVitals(metric: Metric) {
  const { name, value, rating } = metric;
  
  logger.log(`[Web Vitals] ${name}:`, {
    value: Math.round(value),
    rating,
    unit: name === 'CLS' ? '' : 'ms'
  });

  // TODO: Send to analytics service
  // Example: gtag('event', name, { value, rating });
}
