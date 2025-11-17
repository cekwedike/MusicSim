import { renderHook } from '@testing-library/react';
import { useAudioManager } from './useAudioManager';

describe('useAudioManager', () => {
  it('should initialize audio manager', () => {
    const { result } = renderHook(() => useAudioManager());
    expect(result.current).toBeDefined();
  });
});
