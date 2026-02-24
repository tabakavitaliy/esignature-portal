/* eslint-disable @next/next/no-before-interactive-script-outside-document */
'use client';

import type { ReactNode } from 'react';
import Script from 'next/script';

/**
 * Sets Google Consent Mode v2 defaults to 'denied' before any Google
 * scripts execute. This is required by Google's EU User Consent Policy
 * (mandatory since March 2024 for EEA users using GA4 / Google Ads).
 *
 * Must render BEFORE the OneTrust SDK and any GA4 scripts. Place this
 * first inside <head> in the root layout using strategy="beforeInteractive".
 *
 * OneTrust (when configured for Consent Mode in the admin portal) will call
 * gtag('consent', 'update', {...}) automatically when the user interacts with
 * the banner. Our GA4 component then loads conditionally based on C0003 state.
 *
 * Consent signal mapping for this project:
 *   analytics_storage → C0003 (Performance)
 *   ad_storage        → C0004 (Targeted Advertising)
 *   ad_user_data      → C0004 (Targeted Advertising)
 *   ad_personalization → C0004 (Targeted Advertising)
 */
export function ConsentMode(): ReactNode {
  return (
    <Script id="consent-mode-defaults" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 500
        });
      `}
    </Script>
  );
}
