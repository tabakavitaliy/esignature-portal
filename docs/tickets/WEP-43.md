# WEP-43 – Error Screen: We’re on it

**Status:** completed  
**Progress:** 100%  
**Jira:** https://jdc.eleks.com/browse/WEP-43  
**Related Feature:** error-handling

---

## Summary

Implemented a dedicated outage error screen based on the provided screenshot and connected global TanStack Query v5 error handling so only outage-class failures redirect users to that page.

The redirect policy is now explicit:

- redirect for **network** and **5xx** failures;
- keep inline `ButtonErrorLabel` behavior for **4xx/user-correctable** mutation failures.

---

## Screenshot-Mapped UI Contract

- Header copy: `Signature Portal`
- Header subtitle: `Powered by Liberty Blume`
- Error heading: `We’re on it`
- Body line 1: `Looks like this service is temporarily unavailable. Please refresh and try again.`
- Body line 2: `If it still doesn’t work, wait a few minutes and try again.`
- Primary CTA: `Refresh`
- Secondary CTA: `Back to login`
- Warning triangle icon: yellow outlined warning symbol

---

## Error Handling Rules Implemented

- `QueryCache.onError`: redirects to `/error-page` only when error is outage-class.
- `MutationCache.onError`: same outage-class redirect behavior for catastrophic mutation failures.
- Redirect loop guard: if already on `/error-page`, no additional redirect.
- 4xx errors do not redirect; existing page-level inline handling remains available.

---

## Acceptance Criteria

- [x] Dedicated `/error-page` route exists and matches screenshot copy/content hierarchy
- [x] Query failures redirect only on network/5xx
- [x] Catastrophic mutation failures (network/5xx) redirect to `/error-page`
- [x] 4xx mutation/query errors do not globally redirect
- [x] Root `src/app/error.tsx` boundary exists as a React crash fallback
- [x] Tests cover outage classification and redirect decision logic

---

## Files Created

| File                                       | Description                                 |
| ------------------------------------------ | ------------------------------------------- |
| `src/components/pages/error-page.tsx`      | Screenshot-aligned error page component     |
| `src/components/pages/error-page.spec.tsx` | Component tests for copy/buttons/navigation |
| `src/app/error-page/page.tsx`              | Route entry for error page                  |
| `src/app/error-page/page.spec.tsx`         | Route-level render test                     |
| `src/app/error.tsx`                        | Root App Router error boundary              |
| `src/icons/warning-triangle-icon.tsx`      | Warning icon used on error page             |
| `docs/features/error-handling.md`          | Feature documentation                       |

## Files Modified

| File                                    | Description                                                        |
| --------------------------------------- | ------------------------------------------------------------------ |
| `src/constants/routes.ts`               | Added `ERROR_PAGE` route                                           |
| `src/i18n/en.json`                      | Added `errorPage` translation section                              |
| `src/providers/query-provider.tsx`      | Added `QueryCache` and `MutationCache` outage redirect logic       |
| `src/providers/query-provider.spec.tsx` | Added test matrix for redirect decisions                           |
| `src/lib/api/client.ts`                 | Added normalized `ApiClientError` and outage classification helper |
| `src/lib/api/index.ts`                  | Exported new API error utilities                                   |
| `src/lib/api/client.spec.ts`            | Added outage classification tests                                  |
| `src/icons/index.ts`                    | Exported `WarningTriangleIcon`                                     |
| `docs/tickets/tickets-index.json`       | Registered WEP-43 and related files                                |
| `docs/features/features-index.json`     | Registered `error-handling` feature                                |
