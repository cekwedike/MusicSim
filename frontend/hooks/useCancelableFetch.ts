import { useEffect, useRef } from 'react';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface UseFetchResult<T> {
  fetch: (url: string, options?: FetchOptions) => Promise<T>;
  abort: () => void;
}

/**
 * Hook for cancelable fetch requests
 * Automatically cancels requests when component unmounts
 */
export function useCancelableFetch<T = any>(): UseFetchResult<T> {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWithCancel = async (url: string, options: FetchOptions = {}): Promise<T> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const { timeout = 30000, ...fetchOptions } = options;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, []);

  return { fetch: fetchWithCancel, abort };
}
