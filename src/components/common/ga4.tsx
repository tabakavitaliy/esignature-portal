'use client';

import type { ReactNode } from 'react';
import Script from 'next/script';
import { useAnalyticsConsent } from '@/hooks/common/use-analytics-consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Loads Google Analytics 4 only after the user has granted Performance
 * cookie consent (OneTrust group C0003). Renders nothing until consent
 * is given, ensuring no GA4 network requests are made without permission.
 *
 * Place inside <body> in the root layout.
 */
export function GA4(): ReactNode {
  const hasConsent = useAnalyticsConsent();

  if (!hasConsent || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
