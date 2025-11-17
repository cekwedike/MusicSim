import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces function calls', () => {
    vi.useFakeTimers();
    let count = 0;

    const { result } = renderHook(() => useDebounce(() => { count += 1; }, 50));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // Before advancing timers, callback shouldn't have fired
    expect(count).toBe(0);

    // Advance time past the debounce delay
    vi.advanceTimersByTime(60);

    expect(count).toBe(1);

    vi.useRealTimers();
  });
});
