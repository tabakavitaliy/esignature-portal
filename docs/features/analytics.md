# Feature: GA4 Analytics (Consent-Gated)

**Status**: planned
**Ticket**: [WEP-16](https://jdc.eleks.com/browse/WEP-16)
**Depends on**: [WEP-6](https://jdc.eleks.com/browse/WEP-6) (OneTrust SDK already embedded)

---

## Overview

Internal Google Analytics 4 (GA4) analytics for Liberty Blume. GA4 loads **only** when the user has granted Performance consent (`C0003`) via OneTrust. No analytics scripts are loaded by default or for users who deny consent.

This is strictly **internal analytics** -- not customer-facing. The portal uses the existing Liberty Blume OneTrust license.

## Architecture

```
OneTrust SDK (WEP-6, already in layout.tsx)
    └── window.OnetrustActiveGroups = "C0001,C0003,..."
    └── fires: OneTrustGroupsUpdated event

useAnalyticsConsent hook
    └── returns: hasPerformanceConsent (boolean)
    └── reactive: updates on OneTrustGroupsUpdated

GA4 component
    └── if no consent → null (no network requests)
    └── if consent → loads gtag.js + init

PageTracker component
    └── fires page_view on route change (guarded by window.gtag)

analytics.ts utility
    └── trackEvent(name, params) → safe wrapper around window.gtag
```

## Application Code

| File | Type | Description |
|------|------|-------------|
| `src/components/common/consent-mode.tsx` | Component | Sets Google Consent Mode v2 defaults to 'denied' before any Google scripts run |
| `src/types/analytics.d.ts` | Types | Window globals: `OnetrustActiveGroups`, `gtag`, `dataLayer` |
| `src/hooks/common/use-analytics-consent.ts` | Hook | Reads C0003 from OneTrust, reactive to changes |
| `src/hooks/common/use-analytics-consent.spec.ts` | Tests | Unit tests for consent hook |
| `src/components/common/ga4.tsx` | Component | Conditionally loads GA4 when Performance consent granted |
| `src/components/common/page-tracker.tsx` | Component | Fires `page_view` on Next.js route change |
| `src/lib/analytics.ts` | Utility | `trackEvent()` with window.gtag guard |
| `src/lib/analytics.spec.ts` | Tests | Unit tests for trackEvent utility |

## Consent Gating

| OneTrust Category | Group ID | Required for GA4 |
|-------------------|----------|-----------------|
| Strictly Necessary | C0001 | No |
| Functional | C0002 | No |
| Performance | C0003 | **Yes -- GA4 loads only when present** |
| Targeted Advertising | C0004 | No |

## Configuration

| Environment Variable | Description |
|---------------------|-------------|
| `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) from Liberty Blume |
| `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` | Already configured in WEP-6 |

## Dependencies
- WEP-6 complete (OneTrust SDK in `layout.tsx`)
- GA4 Measurement ID from Liberty Blume
- OneTrust Performance category confirmed as `C0003` by Liberty Blume
