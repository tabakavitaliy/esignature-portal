import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as useAnalyticsConsentModule from '@/hooks/common/use-analytics-consent';

// Mock modules
vi.mock('next/navigation');
vi.mock('@/hooks/common/use-analytics-consent');

describe('PageTracker', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    
    // Reset window.gtag
    delete (window as { gtag?: unknown }).gtag;
  });

  it('renders nothing', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);

    const { PageTracker } = await import('./page-tracker');
    const { container } = render(<PageTracker />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not call gtag when consent is not granted', async () => {
    const mockGtag = vi.fn();
    (window as { gtag?: unknown }).gtag = mockGtag;

    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/test');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);

    const { PageTracker } = await import('./page-tracker');
    render(<PageTracker />);
    
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('does not call gtag when gtag is not available', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/test');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    const { PageTracker } = await import('./page-tracker');
    render(<PageTracker />);
    
    // No error should be thrown
    expect(true).toBe(true);
  });

  it('calls gtag when consent is granted and gtag is available', async () => {
    const mockGtag = vi.fn();
    (window as { gtag?: unknown }).gtag = mockGtag;

    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/test-path');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    const { PageTracker } = await import('./page-tracker');
    render(<PageTracker />);
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', { page_path: '/test-path' });
  });

  it('renders without crashing', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);

    const { PageTracker } = await import('./page-tracker');
    expect(() => render(<PageTracker />)).not.toThrow();
  });
});
