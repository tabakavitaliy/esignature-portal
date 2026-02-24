# WEP-16: Consent and Analytics Scaffolding

**Jira**: [WEP-16](https://jdc.eleks.com/browse/WEP-16)
**Status**: planning
**Priority**: Major
**Assignee**: Roman Kuriy
**Reporter**: Bohdana Maslii
**Created**: 2026-02-02
**Plan Created**: 2026-02-20

---

## Summary

Implement the app-level consent detection and GA4 analytics scaffolding that was **deferred from WEP-6**. WEP-6 embedded the OneTrust SDK script. WEP-16 builds the consent-aware layer on top: TypeScript declarations for OneTrust globals, a consent hook, a GA4 conditional loader, an analytics event tracking utility, and a page view tracker.

GA4 is for **internal analytics only** (Liberty Blume, not the end customer). It must fire **only** when the user has granted Performance consent (`C0003`).

**Relationship to WEP-6**: WEP-6 already added the OneTrust SDK scripts to `layout.tsx` and `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` to `.env`. WEP-16 is the Phase 2 implementation that was explicitly deferred in WEP-6's plan.

---

## Scope

### In Scope
- TypeScript global declarations for OneTrust (`window.OnetrustActiveGroups`, `window.OneTrust`, `window.gtag`, `window.dataLayer`)
- `useAnalyticsConsent` hook: reads OneTrust consent state, reacts to `OneTrustGroupsUpdated` events
- `GA4` component: conditionally loads Google Analytics 4 script only when Performance consent (`C0003`) is given
- `analytics.ts` utility: `trackEvent()` helper that guards on `window.gtag` presence
- `PageTracker` component: fires `page_view` GA4 event on route change via `usePathname`
- Add `NEXT_PUBLIC_GA_ID` to `.env.local` and `.env.example`
- Add `GA4` and `PageTracker` components to `layout.tsx`
- Unit tests for `useAnalyticsConsent` hook and `trackEvent` utility
- Update E2E tests for GA4 conditional loading behavior

### Out of Scope
- OneTrust admin configuration (LB responsibility)
- Custom cookie banner/UI (OneTrust handles this, WEP-6 scope)
- Any customer-facing analytics (internal only per Jira description)
- Tag Manager (GTM) -- direct GA4 only
- ecommerce or custom GA4 dimensions beyond `page_view` and generic `trackEvent`

---

## Technical Approach

### Consent Category for GA4

Per `consent.example.md` and WEP-6 category mapping:

| Category | Group ID | Gating |
|----------|----------|--------|
| Performance | C0003 | GA4 loads only when `C0003` is in `OnetrustActiveGroups` |

> **Note**: The `consent.example.md` example checks `C0002` (Functional). For GA4/analytics, the correct category is **`C0003` (Performance)**. Functional (`C0002`) is for site-feature cookies, not analytics. This is confirmed by the Jira description: "gate GA4 events by consent categories".

### Architecture

```
OneTrust SDK (already in layout.tsx via WEP-6)
    └── sets window.OnetrustActiveGroups
    └── fires OneTrustGroupsUpdated event on consent change

useAnalyticsConsent hook
    └── reads window.OnetrustActiveGroups on mount
    └── listens for OneTrustGroupsUpdated to react to changes
    └── returns boolean: hasPerformanceConsent (C0003 present)

GA4 component (in layout <body>)
    └── consumes useAnalyticsConsent
    └── if no consent → renders null (no scripts loaded)
    └── if consent → loads gtag.js + initialises gtag config

PageTracker component (in layout <body>)
    └── consumes usePathname
    └── fires gtag page_view on route change
    └── guards on window.gtag presence (safe if GA4 not loaded)

analytics.ts utility
    └── trackEvent(name, params) → window.gtag guard + call
    └── used by any page/component for custom events
```

### Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| **Create** | `src/components/common/consent-mode.tsx` | Sets Google Consent Mode v2 defaults to 'denied' before any Google scripts run |
| **Create** | `src/types/analytics.d.ts` | Global type declarations: `OnetrustActiveGroups`, `OneTrust`, `gtag`, `dataLayer` |
| **Create** | `src/hooks/common/use-analytics-consent.ts` | Hook: reads C0003 from OneTrust, reactive to consent changes |
| **Create** | `src/hooks/common/use-analytics-consent.spec.ts` | Unit tests for the hook |
| **Create** | `src/components/common/ga4.tsx` | Conditionally loads GA4 script when Performance consent granted |
| **Create** | `src/components/common/page-tracker.tsx` | Fires `page_view` event on route change |
| **Create** | `src/lib/analytics.ts` | `trackEvent()` utility with `window.gtag` guard |
| **Create** | `src/lib/analytics.spec.ts` | Unit tests for `trackEvent` |
| **Modify** | `src/app/layout.tsx` | Add `<GA4 />` and `<PageTracker />` inside `<body>` |
| **Modify** | `.env.local` | Add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` placeholder |
| **Modify** | `.env.example` | Document `NEXT_PUBLIC_GA_ID` |
| **Modify** | `tests/e2e/cookie-consent.e2e-spec.ts` | Add E2E scenario: GA4 script absent when consent denied, present when granted |

### Implementation Details

#### `src/types/analytics.d.ts`

Declare all browser globals added by OneTrust and GA4 to avoid TypeScript errors:

```ts
interface Window {
  OnetrustActiveGroups?: string;
  OneTrust?: {
    ToggleInfoDisplay: () => void;
    GetDomainData: () => unknown;
  };
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
```

#### `src/hooks/common/use-analytics-consent.ts`

- `useState(false)` as safe default (no consent assumed before SDK loads)
- On mount: check `window.OnetrustActiveGroups?.includes('C0003')`
- Add `OneTrustGroupsUpdated` event listener, re-check on fire
- Return boolean `hasPerformanceConsent`
- Handles SSR-safe access (`typeof window !== 'undefined'` guard -- required for static export build)

#### `src/components/common/ga4.tsx`

- `"use client"` directive (uses hook)
- Consumes `useAnalyticsConsent`
- If `!hasPerformanceConsent` → return `null`
- If consent → render two `<Script>` tags with `strategy="afterInteractive"`:
  1. `gtag.js` CDN with `NEXT_PUBLIC_GA_ID`
  2. Init script: `window.dataLayer`, `gtag()`, `gtag('config', GA_ID, { anonymize_ip: true })`

#### `src/components/common/page-tracker.tsx`

- `"use client"` directive (uses `usePathname`)
- `useEffect` on `pathname` change: calls `window.gtag?.('event', 'page_view', { page_path: pathname })`
- Optional guard: only fires if `useAnalyticsConsent()` returns true (avoids no-op calls)

#### `src/lib/analytics.ts`

```ts
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
```

#### `src/app/layout.tsx` modification

Add inside `<body>` after `<QueryProvider>`:
```tsx
import GA4 from '@/components/common/ga4';
import PageTracker from '@/components/common/page-tracker';

// inside body:
<GA4 />
<PageTracker />
```

Note: `GA4` and `PageTracker` are client components. They are safe to render in the server-rendered root layout because Next.js will serialize them as client boundaries.

### Static Export Considerations

- `useAnalyticsConsent` must guard `typeof window !== 'undefined'` -- the hook itself runs only client-side but the module may be imported during static build
- `GA4` and `PageTracker` use `"use client"` so they never execute on the server
- `window.gtag` guard in `trackEvent` is SSR-safe
- `strategy="afterInteractive"` in `GA4` defers script loading until after hydration -- correct for static export

---

## Testing Strategy

### Unit Tests

#### `use-analytics-consent.spec.ts`
- Returns `false` by default (no window globals)
- Returns `true` when `window.OnetrustActiveGroups` contains `'C0003'`
- Returns `false` when `window.OnetrustActiveGroups` contains only `'C0001'`
- Updates state when `OneTrustGroupsUpdated` fires and adds `C0003`
- Updates state when `OneTrustGroupsUpdated` fires and removes `C0003`
- Cleans up event listener on unmount

#### `analytics.spec.ts`
- `trackEvent` does nothing when `window.gtag` is undefined
- `trackEvent` calls `window.gtag` with correct name and params when defined
- `trackEvent` is safe to call in SSR context (no `window`)

### E2E Tests (add to `cookie-consent.e2e-spec.ts`)
- GA4 script (`googletagmanager.com`) is **not** loaded when user rejects Performance cookies
- GA4 script **is** loaded when user accepts Performance cookies
- `page_view` event fires on navigation after consent granted

---

## Dependencies & Prerequisites

- [ ] WEP-6 complete (OneTrust SDK script already in `layout.tsx`) -- **DONE**
- [ ] `NEXT_PUBLIC_GA_ID` (GA4 Measurement ID `G-XXXXXXXXXX`) from Liberty Blume
- [ ] `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` from Liberty Blume (shared with WEP-6)
- [ ] Confirm with LB that Performance category is `C0003` for their OneTrust tenant

---

## Risks & Open Questions

1. **GA4 ID not yet provided**: Cannot test GA4 loading without a real or test Measurement ID.
2. **C0003 vs C0002 for analytics**: The `consent.example.md` uses C0002 (Functional). Confirm with LB which OneTrust category covers internal analytics. This plan uses C0003 (Performance) as the correct category.
3. **SSR safety**: `useAnalyticsConsent` and `GA4` must never access `window` during static export build. `"use client"` + `typeof window` guards cover this.
4. **No gtag no-op**: If consent is revoked after GA4 has loaded, GA4 script stays loaded (browser limitation). This is standard and acceptable -- consent gates initial loading, not unloading.
5. **`anonymize_ip`**: Included in GA4 config per GDPR best practice. Confirm LB requirements.

---

## Progress

- [x] Jira ticket fetched and analyzed
- [x] Related WEP-6 context reviewed (Phase 2 items now in scope)
- [x] Plan created (Step A - Claude Sonnet 4.5, Plan mode)
- [x] Implementation: `src/components/common/consent-mode.tsx` -- Google Consent Mode v2 defaults (placed first in `<head>`)
- [x] Implementation: `src/types/analytics.d.ts` -- Window globals for OneTrust + GA4
- [x] Implementation: `src/hooks/common/use-analytics-consent.ts` -- consent hook (C0003 gating)
- [x] Implementation: `src/hooks/common/use-analytics-consent.spec.ts` -- 7 unit tests
- [x] Implementation: `src/lib/analytics.ts` -- `trackEvent()` utility
- [x] Implementation: `src/lib/analytics.spec.ts` -- 4 unit tests
- [x] Implementation: `src/components/common/ga4.tsx` -- conditional GA4 loader
- [x] Implementation: `src/components/common/page-tracker.tsx` -- route-change page_view tracker
- [x] Implementation: `src/app/layout.tsx` -- GA4 and PageTracker added to body
- [x] Implementation: `.env.local` and `.env.example` -- NEXT_PUBLIC_GA_ID added
- [x] E2E tests extended: GA4 absent without consent, GA4 present after accept-all
- [ ] C0003 confirmed as correct consent category with LB
- [ ] GA4 Measurement ID (G-XXXXXXXXXX) received from LB and set in env
- [ ] Unit tests passing in CI
- [ ] Manual QA: GA4 absent when consent denied, present when granted
- [ ] E2E tests passing in CI (requires valid OneTrust domain ID + GA4 ID)
- [ ] PR created and reviewed
- [ ] Deployed to staging
- [ ] Ticket closed
