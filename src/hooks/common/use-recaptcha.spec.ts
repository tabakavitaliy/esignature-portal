import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRecaptcha } from './use-recaptcha';

describe('useRecaptcha', () => {
  const originalEnv = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const originalGrecaptcha = window.grecaptcha;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key';
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    }
    Object.defineProperty(window, 'grecaptcha', { value: originalGrecaptcha, writable: true });
    vi.restoreAllMocks();
  });

  it('returns a getToken function', () => {
    const { result } = renderHook(() => useRecaptcha());

    expect(result.current.getToken).toBeDefined();
    expect(typeof result.current.getToken).toBe('function');
  });

  it('rejects when site key is not configured', async () => {
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const { result } = renderHook(() => useRecaptcha());

    await expect(result.current.getToken('testAction')).rejects.toThrow(
      'reCAPTCHA site key is not configured. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.'
    );
  });

  it('rejects when grecaptcha.enterprise is not available', async () => {
    Object.defineProperty(window, 'grecaptcha', { value: undefined, writable: true });

    const { result } = renderHook(() => useRecaptcha());

    await expect(result.current.getToken('testAction')).rejects.toThrow(
      'reCAPTCHA Enterprise script has not loaded yet.'
    );
  });

  it('calls enterprise.ready and enterprise.execute with correct arguments', async () => {
    const mockToken = 'recaptcha-token-abc123';
    const mockExecute = vi.fn().mockResolvedValue(mockToken);
    const mockReady = vi.fn((cb: () => void) => cb());

    window.grecaptcha = {
      enterprise: {
        ready: mockReady,
        execute: mockExecute,
      },
    };

    const { result } = renderHook(() => useRecaptcha());
    const token = await result.current.getToken('submitForm');

    expect(mockReady).toHaveBeenCalledTimes(1);
    expect(mockExecute).toHaveBeenCalledWith('test-site-key', { action: 'submitForm' });
    expect(token).toBe(mockToken);
  });

  it('rejects when enterprise.execute fails', async () => {
    const mockError = new Error('execute failed');
    const mockExecute = vi.fn().mockRejectedValue(mockError);
    const mockReady = vi.fn((cb: () => void) => cb());

    window.grecaptcha = {
      enterprise: {
        ready: mockReady,
        execute: mockExecute,
      },
    };

    const { result } = renderHook(() => useRecaptcha());

    await expect(result.current.getToken('testAction')).rejects.toThrow('execute failed');
  });

  it('passes the action string through to execute', async () => {
    const mockExecute = vi.fn().mockResolvedValue('token');
    const mockReady = vi.fn((cb: () => void) => cb());

    window.grecaptcha = {
      enterprise: {
        ready: mockReady,
        execute: mockExecute,
      },
    };

    const { result } = renderHook(() => useRecaptcha());
    await result.current.getToken('addSignatory');

    expect(mockExecute).toHaveBeenCalledWith('test-site-key', { action: 'addSignatory' });
  });
});
