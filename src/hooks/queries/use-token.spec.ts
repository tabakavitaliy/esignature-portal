import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToken } from './use-token';

describe('useToken', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('returns null when no token is stored', () => {
    const { result } = renderHook(() => useToken());
    expect(result.current.token).toBeNull();
  });

  it('setToken saves the token to sessionStorage', () => {
    const { result } = renderHook(() => useToken());
    const testToken = 'test-token-123';

    act(() => {
      result.current.setToken(testToken);
    });

    expect(sessionStorage.getItem('token')).toBe(testToken);
  });

  it('returns the stored token after it has been set', () => {
    const testToken = 'stored-token-456';
    sessionStorage.setItem('token', testToken);

    const { result } = renderHook(() => useToken());
    expect(result.current.token).toBe(testToken);
  });

  it('calls sessionStorage.getItem with the correct key', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');

    renderHook(() => useToken());

    expect(getItemSpy).toHaveBeenCalledWith('token');
  });

  it('calls sessionStorage.setItem with the correct key and value', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useToken());
    const testToken = 'new-token-789';

    act(() => {
      result.current.setToken(testToken);
    });

    expect(setItemSpy).toHaveBeenCalledWith('token', testToken);
  });
});
