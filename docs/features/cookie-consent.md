# Feature: Cookie Consent Management

**Status**: in-progress
**Ticket**: [WEP-6](https://jdc.eleks.com/browse/WEP-6)
**Screens**: 03-A.58, 03-A.59, 03-A.60, 03-A.61, 03-A.62, 03-A.63, 03-A.64

---

## Overview

Cookie consent management for the eSignature Portal using the OneTrust cookie consent SDK. OneTrust provides the complete consent UI (banner, modals, cookie preferences, detailed management) -- no custom React components for the consent flow.

The portal embeds OneTrust via script tags. OneTrust renders its own banner and modals as overlays on the page. A React hook (`useCookieConsent`) exposes the consent state so other parts of the app can conditionally enable analytics/advertising scripts.

## User Flow

1. First visit → OneTrust banner appears at bottom of screen
2. User clicks "Accept all" → all cookies enabled, banner dismissed permanently
3. User clicks "Cookie preferences" → OneTrust preferences modal opens
4. User toggles categories → saves preferences → banner dismissed
5. Subsequent visits → no banner (preferences stored by OneTrust in localStorage)
6. User can re-access preferences via footer link at any time

## Components

### OneTrust SDK (External)
- **Banner** (03-A.58, 03-A.59): Bottom-of-screen cookie consent bar
- **Cookie Policy Modal** (03-A.60, 03-A.63): Full cookie policy text
- **Preferences Modal** (03-A.61): Category toggles (4 categories)
- **Detailed Management Modal** (03-A.62): Expandable sections with individual cookies
- **Customer Privacy Policy Modal** (03-A.64): Handled by existing `CustomerPrivacy` component + API

### Application Code (Phase 1 -- Implemented)
| File | Type | Description |
|------|------|-------------|
| `src/app/layout.tsx` | Layout | OneTrust SDK script tags injected into `<head>` |
| `.env.example` | Config | Documents `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` for the team |
| `tests/e2e/cookie-consent.e2e-spec.ts` | Tests | Playwright E2E tests (4 scenarios) |

### Application Code (Phase 2 -- WEP-16)
Implemented in [WEP-16](https://jdc.eleks.com/browse/WEP-16) -- GA4 gating is the first real consumer of consent state.

| File | Type | Description |
|------|------|-------------|
| `src/types/analytics.d.ts` | Types | Global declarations: OneTrust + GA4 window globals |
| `src/hooks/common/use-analytics-consent.ts` | Hook | Reads C0003 consent, reactive to `OneTrustGroupsUpdated` |
| `src/lib/analytics.ts` | Utility | `trackEvent()` with `window.gtag` guard |
| `src/components/common/ga4.tsx` | Component | Loads GA4 only when Performance consent granted |
| `src/components/common/page-tracker.tsx` | Component | Fires `page_view` on route change |

## Cookie Categories

| Category | Group ID | User-Controllable |
|----------|----------|-------------------|
| Strictly Necessary | C0001 | No (always on) |
| Functional | C0002 | Yes |
| Performance | C0003 | Yes |
| Targeted Advertising | C0004 | Yes |

## Configuration

| Environment Variable | Description |
|---------------------|-------------|
| `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` | OneTrust domain script ID (from Liberty Blume) |

## Dependencies
- OneTrust SDK (external CDN script, no npm package)
- Existing: `CustomerPrivacy` component for customer-specific privacy policy link
