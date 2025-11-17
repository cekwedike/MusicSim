import { describe, it, expect } from 'vitest';
import authServiceSupabase from '../services/authService.supabase';

describe('authService.supabase', () => {
  it('should have isAuthenticated function', () => {
    expect(typeof authServiceSupabase.isAuthenticated).toBe('function');
  });

  it('should have getCurrentUser function', () => {
    expect(typeof authServiceSupabase.getCurrentUser).toBe('function');
  });

  it('should have logout function', () => {
    expect(typeof authServiceSupabase.logout).toBe('function');
  });
});
