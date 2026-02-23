'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalyticsConsent } from '@/hooks/common/use-analytics-consent';

/**
 * Fires a GA4 page_view event on every client-side route change.
 * Only fires when the user has granted Performance consent (C0003)
 * and window.gtag is available (i.e. GA4 has been loaded by <GA4 />).
 *
 * Renders nothing -- this is a side-effect-only component.
 * Place inside <body> in the root layout alongside <GA4 />.
 */
export function PageTracker(): ReactNode {
  const pathname = usePathname();
  const hasConsent = useAnalyticsConsent();

  useEffect(() => {
    if (!hasConsent || !window.gtag) return;
    window.gtag('event', 'page_view', { page_path: pathname });
  }, [pathname, hasConsent]);

  return null;
}
