import { render } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('next/script', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <script data-testid="recaptcha-script" {...props} />,
}));

describe('RecaptchaEnterprise', () => {
  const originalEnv = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    }
    vi.resetModules();
  });

  it('renders the script tag when site key is configured', async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key-123';
    const { RecaptchaEnterprise } = await import('./recaptcha-enterprise');

    const { container } = render(<RecaptchaEnterprise />);
    const script = container.querySelector('script');

    expect(script).toBeInTheDocument();
  });

  it('includes the site key in the script src URL', async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key-123';
    const { RecaptchaEnterprise } = await import('./recaptcha-enterprise');

    const { container } = render(<RecaptchaEnterprise />);
    const script = container.querySelector('script');

    expect(script).toHaveAttribute(
      'src',
      'https://www.google.com/recaptcha/enterprise.js?render=test-site-key-123'
    );
  });

  it('uses afterInteractive strategy', async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-site-key-123';
    const { RecaptchaEnterprise } = await import('./recaptcha-enterprise');

    const { container } = render(<RecaptchaEnterprise />);
    const script = container.querySelector('script');

    expect(script).toHaveAttribute('strategy', 'afterInteractive');
  });

  it('renders nothing when site key is not configured', async () => {
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const { RecaptchaEnterprise } = await import('./recaptcha-enterprise');

    const { container } = render(<RecaptchaEnterprise />);

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when site key is empty string', async () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = '';
    const { RecaptchaEnterprise } = await import('./recaptcha-enterprise');

    const { container } = render(<RecaptchaEnterprise />);

    expect(container.innerHTML).toBe('');
  });
});
