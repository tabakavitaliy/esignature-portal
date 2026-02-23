/* eslint-disable @next/next/no-before-interactive-script-outside-document */
'use client';

import type { ReactNode } from 'react';
import Script from 'next/script';

/**
 * Loads the OneTrust cookie consent SDK.
 * Must render AFTER <ConsentMode /> and BEFORE <GA4 /> in the root layout.
 *
 * Requires NEXT_PUBLIC_ONETRUST_DOMAIN_ID to be set (provided by Liberty Blume).
 * Without it the SDK loads without a domain config and no banner is shown.
 */
export function OneTrust(): ReactNode {
  return (
    <>
      <Script
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        data-domain-script={process.env.NEXT_PUBLIC_ONETRUST_DOMAIN_ID}
        strategy="beforeInteractive"
      />
      <Script id="optanon-wrapper" strategy="beforeInteractive">
        {`function OptanonWrapper() {}`}
      </Script>
    </>
  );
}
