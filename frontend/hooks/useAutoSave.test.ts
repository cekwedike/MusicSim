import { renderHook } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';

describe('useAutoSave', () => {
  it('should initialize auto save hook', () => {
    const { result } = renderHook(() => useAutoSave());
    expect(result.current).toBeDefined();
  });
});
