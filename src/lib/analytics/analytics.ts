/**
 * Fires a GA4 custom event via window.gtag.
 * No-ops when gtag is not loaded (e.g. consent not yet granted, SSR context).
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
