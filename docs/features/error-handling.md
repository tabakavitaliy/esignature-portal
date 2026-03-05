# Feature: Error Handling

**Status**: completed  
**Related Tickets**: [WEP-43](https://jdc.eleks.com/browse/WEP-43)  
**Progress**: 100%

---

## Overview

This feature introduces an outage-specific error experience for the Signature Portal:

- a dedicated `/error-page` UI based on the approved screenshot;
- global outage detection for TanStack Query v5 errors;
- deterministic redirect policy that distinguishes service outage failures from user-correctable errors.

---

## UX Behavior

When the backend is temporarily unavailable, users are redirected to the error page with:

- warning icon and `We’re on it` messaging;
- `Refresh` action to retry;
- `Back to login` action to return to `/`.

For non-outage 4xx failures, existing inline feedback remains in place via `ButtonErrorLabel`.

---

## Technical Design

### Error Classification

`src/lib/api/client.ts` now provides:

- `ApiClientError` with `status` and `isNetworkError`;
- `isServiceOutageError(error)` helper.

Outage class is:

- network errors;
- HTTP status >= 500.

### Global Handling

`src/providers/query-provider.tsx` now configures:

- `QueryCache.onError` for query failures;
- `MutationCache.onError` for catastrophic mutation failures.

Both invoke shared logic that:

- redirects to `ROUTES.ERROR_PAGE` for outage-class errors;
- skips redirect for 4xx and for current path `/error-page` (loop guard).

---

## Files

- `src/app/error-page/page.tsx`
- `src/components/pages/error-page.tsx`
- `src/app/error.tsx`
- `src/providers/query-provider.tsx`
- `src/lib/api/client.ts`
- `src/constants/routes.ts`
- `src/i18n/en.json`

---

## Testing Coverage

- Component and route tests for the error page.
- Redirect decision tests for outage vs non-outage errors.
- API client tests for normalized error classification.
