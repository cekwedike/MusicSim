import authServiceSupabase from './authService.supabase';
describe('authServiceSupabase', () => {
  it('should have signInWithGoogle', () => {
    expect(typeof authServiceSupabase.signInWithGoogle).toBe('function');
  });
  it('should have logout', () => {
    expect(typeof authServiceSupabase.logout).toBe('function');
  });
  it('should have getCurrentUser', () => {
    expect(typeof authServiceSupabase.getCurrentUser).toBe('function');
  });
  it('should have isAuthenticated', () => {
    expect(typeof authServiceSupabase.isAuthenticated).toBe('function');
  });
});
