import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAnalyticsConsent } from './use-analytics-consent';

function setActiveGroups(groups: string | undefined): void {
  if (groups === undefined) {
    delete window.OnetrustActiveGroups;
  } else {
    window.OnetrustActiveGroups = groups;
  }
}

function fireConsentUpdated(): void {
  window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
}

describe('useAnalyticsConsent', () => {
  beforeEach(() => {
    delete window.OnetrustActiveGroups;
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete window.OnetrustActiveGroups;
  });

  it('returns false by default when no OneTrust globals are present', () => {
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(false);
  });

  it('returns true when OnetrustActiveGroups contains C0003 on mount', () => {
    setActiveGroups('C0001,C0003');
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(true);
  });

  it('returns false when OnetrustActiveGroups contains only strictly necessary (C0001)', () => {
    setActiveGroups('C0001');
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(false);
  });

  it('returns false when OnetrustActiveGroups is an empty string', () => {
    setActiveGroups('');
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(false);
  });

  it('updates to true when OneTrustGroupsUpdated fires and adds C0003', () => {
    setActiveGroups('C0001');
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(false);

    act(() => {
      setActiveGroups('C0001,C0003');
      fireConsentUpdated();
    });

    expect(result.current).toBe(true);
  });

  it('updates to false when OneTrustGroupsUpdated fires and removes C0003', () => {
    setActiveGroups('C0001,C0003');
    const { result } = renderHook(() => useAnalyticsConsent());
    expect(result.current).toBe(true);

    act(() => {
      setActiveGroups('C0001');
      fireConsentUpdated();
    });

    expect(result.current).toBe(false);
  });

  it('removes event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useAnalyticsConsent());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('OneTrustGroupsUpdated', expect.any(Function));
  });
});
