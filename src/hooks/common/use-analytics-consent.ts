'use client';

import { useEffect, useState } from 'react';

const PERFORMANCE_CONSENT_GROUP = 'C0003';

function hasPerformanceGroup(): boolean {
  if (typeof window === 'undefined') return false;
  return window.OnetrustActiveGroups?.includes(PERFORMANCE_CONSENT_GROUP) ?? false;
}

/**
 * Returns whether the user has granted Performance cookie consent (C0003).
 * Reactive: updates whenever OneTrust fires the OneTrustGroupsUpdated event.
 * Safe to use in SSR/static-export builds -- defaults to false until client hydration.
 */
export function useAnalyticsConsent(): boolean {
  const [hasConsent, setHasConsent] = useState<boolean>(false);

  useEffect(() => {
    setHasConsent(hasPerformanceGroup());

    function handleConsentUpdate(): void {
      setHasConsent(hasPerformanceGroup());
    }

    window.addEventListener('OneTrustGroupsUpdated', handleConsentUpdate);

    return () => {
      window.removeEventListener('OneTrustGroupsUpdated', handleConsentUpdate);
    };
  }, []);

  return hasConsent;
}
