import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authServiceSupabase from './authService.supabase';

// We mock both supabase client and api module
vi.mock('./supabase', () => {
  const auth = {
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    updateUser: vi.fn()
  };
  const storage = {
    from: vi.fn().mockReturnValue({
      upload: vi.fn(),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example/profile.png' } })
    })
  };
  return { supabase: { auth, storage } };
});

vi.mock('./api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    }
  };
});

import { supabase } from './supabase';
import api from './api';

const setAuthLocal = (token: string) => {
  localStorage.setItem('musicsim_auth', JSON.stringify({ access_token: token }));
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

describe('authServiceSupabase behavior', () => {
  it('signInWithGoogle succeeds on allowed localhost origin', async () => {
    Object.defineProperty(window, 'location', { value: { origin: 'http://localhost:5173', hostname: 'localhost' } as any, writable: true });
    (supabase.auth.signInWithOAuth as any).mockResolvedValueOnce({ data: {}, error: null });
    const res = await authServiceSupabase.signInWithGoogle();
    expect(res.success).toBe(true);
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
  });

  it('signInWithGoogle rejects on invalid redirect origin', async () => {
    Object.defineProperty(window, 'location', { value: { origin: 'http://evil.com', hostname: 'evil.com' } as any, writable: true });
    await expect(authServiceSupabase.signInWithGoogle()).rejects.toThrow(/Invalid redirect URL/);
  });

  it('logout clears local storage even if signOut errors', async () => {
    setAuthLocal('token123');
    (supabase.auth.signOut as any).mockRejectedValueOnce(new Error('network fail'));
    try { await authServiceSupabase.logout(); } catch {/* ignore */}
    expect(localStorage.getItem('musicsim_auth')).toBeNull();
  });

  it('getStoredToken returns parsed token and handles malformed JSON', () => {
    setAuthLocal('abc');
    expect(authServiceSupabase.getStoredToken()).toBe('abc');
    localStorage.setItem('musicsim_auth', '{bad json');
    expect(authServiceSupabase.getStoredToken()).toBeNull();
  });

  it('isAuthenticated reflects session presence', async () => {
    (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });
    expect(await authServiceSupabase.isAuthenticated()).toBe(false);
    (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: { access_token: 'x' } } });
    expect(await authServiceSupabase.isAuthenticated()).toBe(true);
  });

  it('getCurrentUser throws when not authenticated', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null } });
    await expect(authServiceSupabase.getCurrentUser()).rejects.toThrow('Not authenticated');
  });

  it('getCurrentUser merges backend profile when authenticated', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u1', email: 'e@x.com' } } });
    (api.get as any).mockResolvedValueOnce({ data: { success: true, data: { user: { id: 'u1', email: 'e@x.com', username: 'tester' } } } });
    const res = await authServiceSupabase.getCurrentUser();
    expect(res.success).toBe(true);
    expect(res.data?.user.username).toBe('tester');
  });

  it('updateUsername validates and updates user metadata', async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });
    const ok = await authServiceSupabase.updateUsername('valid_name');
    expect(ok.success).toBe(true);
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ data: { username: 'valid_name' } });
  });

  it('updateUsername rejects invalid values', async () => {
    const short = await authServiceSupabase.updateUsername('ab');
    expect(short.success).toBe(false);
    const badChars = await authServiceSupabase.updateUsername('bad name');
    expect(badChars.success).toBe(false);
  });

  it('deleteAccount handles success path and clears storage', async () => {
    (api.delete as any).mockResolvedValueOnce({ data: { message: 'Deleted' } });
    (supabase.auth.signOut as any).mockResolvedValueOnce({});
    setAuthLocal('tok');
    const res = await authServiceSupabase.deleteAccount();
    expect(res.success).toBe(true);
    expect(localStorage.getItem('musicsim_auth')).toBeNull();
  });

  it('deleteAccount reports failure but still returns structured response', async () => {
    (api.delete as any).mockRejectedValueOnce({ response: { data: { message: 'Server fail' } } });
    const res = await authServiceSupabase.deleteAccount();
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/Server fail/);
  });

  it('uploadProfileImage fails when unauthenticated', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null } });
    const blob = new Blob(['x'], { type: 'image/png' }) as any as File;
    (blob as any).name = 'pic.png';
    const res = await authServiceSupabase.uploadProfileImage(blob);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Not authenticated/);
  });

  it('uploadProfileImage validates file type and size', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u1' } } });
    const badType = new Blob(['x'], { type: 'text/plain' }) as any as File;
    (badType as any).name = 'file.txt';
    let res = await authServiceSupabase.uploadProfileImage(badType);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/must be an image/);

    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u1' } } });
    const bigBuffer = new Uint8Array(2 * 1024 * 1024 + 10);
    const big = new Blob([bigBuffer], { type: 'image/jpeg' }) as any as File;
    (big as any).name = 'big.jpg';
    res = await authServiceSupabase.uploadProfileImage(big);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/less than 2MB/);
  });

  it('uploadProfileImage uploads and updates profile on success', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u42' } } });
    (api.patch as any).mockResolvedValueOnce({ data: { success: true, data: { user: { id: 'u42' } } } });
    const bucket = {
      upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://cdn.example/u42/profile.png' } })
    };
    (supabase.storage.from as any).mockReturnValueOnce(bucket);
    const file = new Blob(['img'], { type: 'image/png' }) as any as File;
    (file as any).name = 'photo.png';
    const res = await authServiceSupabase.uploadProfileImage(file);
    expect(res.success).toBe(true);
    expect(res.url).toMatch(/profile\.png/);
    expect(bucket.upload).toHaveBeenCalled();
  });

  it('uploadProfileImage returns error when storage upload fails', async () => {
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: { id: 'u9' } } });
    const bucket = {
      upload: vi.fn().mockResolvedValue({ data: null, error: new Error('fail') }),
      getPublicUrl: vi.fn()
    };
    (supabase.storage.from as any).mockReturnValueOnce(bucket);
    const file = new Blob(['img'], { type: 'image/png' }) as any as File;
    (file as any).name = 'photo.png';
    const res = await authServiceSupabase.uploadProfileImage(file);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/fail|Failed to upload/);
  });

  it('updateProfile updates supabase metadata and backend', async () => {
    (supabase.auth.updateUser as any).mockResolvedValueOnce({});
    (api.patch as any).mockResolvedValueOnce({ data: { success: true, data: { user: { id: 'u1', username: 'u' } } } });
    const res = await authServiceSupabase.updateProfile({ username: 'u', displayName: 'User', profileImage: 'url' });
    expect(supabase.auth.updateUser).toHaveBeenCalled();
    expect(res.success).toBe(true);
  });

  it('syncProfile posts to backend and returns data', async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true, data: { user: { id: 'u1' } } } });
    const res = await authServiceSupabase.syncProfile({ userId: 'u1', email: 'e@x.com', username: 'u' });
    expect(res.success).toBe(true);
    expect(api.post).toHaveBeenCalledWith('/auth/sync-profile', expect.any(Object));
  });
});
