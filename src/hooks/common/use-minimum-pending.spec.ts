import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMinimumPending } from './use-minimum-pending';

describe('useMinimumPending', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should return false when isPending starts as false', () => {
      const { result } = renderHook(() => useMinimumPending(false));
      expect(result.current).toBe(false);
    });

    it('should return true immediately when isPending starts as true', () => {
      const { result } = renderHook(() => useMinimumPending(true));
      expect(result.current).toBe(true);
    });
  });

  describe('minimum duration enforcement', () => {
    it('should stay true until the minimum duration has elapsed when request is fast', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending, 600), {
        initialProps: { pending: true },
      });

      expect(result.current).toBe(true);

      // Response arrives instantly — still within minimum window
      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ pending: false });
      expect(result.current).toBe(true);

      // Only 500ms remaining — still showing
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(result.current).toBe(true);

      // Minimum duration reached — now hidden
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe(false);
    });

    it('should hide immediately when the request already exceeded the minimum duration', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending, 600), {
        initialProps: { pending: true },
      });

      // Request takes longer than minimum duration
      act(() => {
        vi.advanceTimersByTime(800);
      });
      rerender({ pending: false });

      expect(result.current).toBe(false);
    });

    it('should hide exactly at the minimum duration boundary', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending, 600), {
        initialProps: { pending: true },
      });

      // Advance exactly to the minimum — response arrives right on time
      act(() => {
        vi.advanceTimersByTime(600);
      });
      rerender({ pending: false });

      expect(result.current).toBe(false);
    });
  });

  describe('default duration', () => {
    it('should use 1000ms as the default minimum duration', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending), {
        initialProps: { pending: true },
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ pending: false });

      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(result.current).toBe(false);
    });
  });

  describe('timer cleanup', () => {
    it('should cancel the hide timer when isPending becomes true again before it fires', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending, 600), {
        initialProps: { pending: true },
      });

      // Request finishes quickly
      act(() => {
        vi.advanceTimersByTime(50);
      });
      rerender({ pending: false });
      expect(result.current).toBe(true);

      // New request starts before the hide timer fires
      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ pending: true });
      expect(result.current).toBe(true);

      // Advance past where the OLD timer would have fired
      act(() => {
        vi.advanceTimersByTime(600);
      });
      // Modal is still open because a new mutation is in progress
      expect(result.current).toBe(true);
    });

    it('should clear the timer when the component unmounts mid-delay', () => {
      const { result, rerender, unmount } = renderHook(
        ({ pending }) => useMinimumPending(pending, 600),
        { initialProps: { pending: true } }
      );

      act(() => {
        vi.advanceTimersByTime(100);
      });
      rerender({ pending: false });
      expect(result.current).toBe(true);

      // Unmount before the timer fires — should not throw or update state
      unmount();
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // After unmount the last captured value is still 'true' — the timer was cancelled
      expect(result.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should remain false when isPending never becomes true', () => {
      const { result } = renderHook(() => useMinimumPending(false, 600));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current).toBe(false);
    });

    it('should respect a custom minimumDurationMs', () => {
      const { result, rerender } = renderHook(({ pending }) => useMinimumPending(pending, 1500), {
        initialProps: { pending: true },
      });

      rerender({ pending: false });

      act(() => {
        vi.advanceTimersByTime(1499);
      });
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe(false);
    });
  });
});
