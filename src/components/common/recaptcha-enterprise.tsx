import type { ReactNode } from 'react';
import Script from 'next/script';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/**
 * Loads the Google reCAPTCHA Enterprise script globally once at app root.
 * Exposes window.grecaptcha.enterprise for use in the useRecaptcha hook.
 * Renders nothing when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured.
 *
 * Place inside <body> in the root layout.
 */
export function RecaptchaEnterprise(): ReactNode {
  if (!SITE_KEY) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}
