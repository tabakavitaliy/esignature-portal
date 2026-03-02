import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInactivityTimer, INACTIVITY_TIMEOUT_MS, COUNTDOWN_SECONDS } from './use-inactivity-timer';
import { useRouter, usePathname } from 'next/navigation';
import { useToken } from '@/hooks/queries/use-token';
import { ROUTES } from '@/constants/routes';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/queries/use-token', () => ({
  useToken: vi.fn(),
}));

describe('useInactivityTimer', () => {
  const mockPush = vi.fn();
  const mockClearToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/confirm-name');
    (useToken as ReturnType<typeof vi.fn>).mockReturnValue({
      token: 'test-token',
      clearToken: mockClearToken,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with warning hidden', () => {
    const { result } = renderHook(() => useInactivityTimer());

    expect(result.current.isWarningVisible).toBe(false);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);
  });

  it('should show warning after 10 minutes of inactivity', () => {
    const { result } = renderHook(() => useInactivityTimer());

    expect(result.current.isWarningVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);
  });

  it('should countdown from 120 seconds when warning is shown', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);
  });

  it('should call logOff function which clears token and navigates', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      result.current.logOff();
    });

    expect(mockClearToken).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(ROUTES.EXPIRED_SESSION);
  });

  it('should reset timer when resetTimer is called', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isWarningVisible).toBe(false);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);
  });

  it('should log off when logOff is called', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      result.current.logOff();
    });

    expect(mockClearToken).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(ROUTES.EXPIRED_SESSION);
  });

  it('should reset timer on click activity', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS / 2);
    });

    act(() => {
      window.dispatchEvent(new Event('click'));
    });

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS / 2);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should reset timer on scroll activity', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS / 2);
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS / 2);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should not monitor when no token exists', () => {
    (useToken as ReturnType<typeof vi.fn>).mockReturnValue({
      token: null,
      clearToken: mockClearToken,
    });

    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should not monitor on login page', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(ROUTES.HOME);

    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should not monitor on expired session page', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(ROUTES.EXPIRED_SESSION);

    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should not restart inactivity timer while warning is visible', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);
    const initialSeconds = result.current.remainingSeconds;

    act(() => {
      window.dispatchEvent(new Event('click'));
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(result.current.remainingSeconds).toBe(initialSeconds);
  });

  it('should cleanup timers on unmount', () => {
    const { unmount } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS / 2);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(mockClearToken).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should start timer immediately when hook is mounted with token', () => {
    const { result } = renderHook(() => useInactivityTimer());

    expect(result.current.isWarningVisible).toBe(false);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS * 0.9);
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should provide resetTimer and logOff functions', () => {
    const { result } = renderHook(() => useInactivityTimer());

    expect(typeof result.current.resetTimer).toBe('function');
    expect(typeof result.current.logOff).toBe('function');
  });

  it('should clear countdown interval when logging off during countdown', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);

    act(() => {
      result.current.logOff();
    });

    expect(mockClearToken).toHaveBeenCalled();
    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should handle multiple reset calls correctly', () => {
    const { result } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isWarningVisible).toBe(false);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isWarningVisible).toBe(false);
  });

  it('should reset timer and hide warning when route changes', () => {
    const { result, rerender } = renderHook(() => useInactivityTimer());

    act(() => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS);
    });

    expect(result.current.isWarningVisible).toBe(true);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);

    act(() => {
      (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/different-route');
      rerender();
    });

    expect(result.current.isWarningVisible).toBe(false);
    expect(result.current.remainingSeconds).toBe(COUNTDOWN_SECONDS);
  });
});
