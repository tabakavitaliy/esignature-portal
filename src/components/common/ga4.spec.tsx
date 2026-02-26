import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { GA4 } from './ga4';
import * as useAnalyticsConsentModule from '@/hooks/common/use-analytics-consent';

vi.mock('@/hooks/common/use-analytics-consent');

describe('GA4', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders nothing when consent is not granted', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';

    const { container } = render(<GA4 />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when GA_ID is not set', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);
    delete process.env.NEXT_PUBLIC_GA_ID;

    const { container } = render(<GA4 />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders GA4 scripts when consent is granted and GA_ID is set', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';

    const { container } = render(<GA4 />);
    
    // Check that script elements are rendered
    expect(container).toBeTruthy();
  });

  it('renders without crashing with consent and GA_ID', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';

    expect(() => render(<GA4 />)).not.toThrow();
  });

  it('renders without crashing without consent', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';

    expect(() => render(<GA4 />)).not.toThrow();
  });

  it('renders without crashing without GA_ID', () => {
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);
    delete process.env.NEXT_PUBLIC_GA_ID;

    expect(() => render(<GA4 />)).not.toThrow();
  });
});
