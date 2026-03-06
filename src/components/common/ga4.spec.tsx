import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import * as useAnalyticsConsentModule from '@/hooks/common/use-analytics-consent';

vi.mock('@/hooks/common/use-analytics-consent');
vi.mock('next/script', () => ({
  default: ({ children, id }: { children?: ReactNode; id?: string }) => (
    <script data-testid={id ?? 'next-script'}>{children}</script>
  ),
}));

describe('GA4', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders nothing when consent is not granted', async () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);

    const { container } = render(<GA4 />);

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when GA_ID is not set', async () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    const { container } = render(<GA4 />);

    expect(container.firstChild).toBeNull();
  });

  it('renders GA4 scripts when consent is granted and GA_ID is set', async () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    const { container } = render(<GA4 />);

    expect(container.querySelector('script')).toBeInTheDocument();
  });

  it('renders without crashing with consent and GA_ID', async () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    expect(() => render(<GA4 />)).not.toThrow();
  });

  it('renders without crashing without consent', async () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(false);

    expect(() => render(<GA4 />)).not.toThrow();
  });

  it('renders without crashing without GA_ID', async () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    const { GA4 } = await import('./ga4');
    vi.spyOn(useAnalyticsConsentModule, 'useAnalyticsConsent').mockReturnValue(true);

    expect(() => render(<GA4 />)).not.toThrow();
  });
});
