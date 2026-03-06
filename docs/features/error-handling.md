# Feature: Error Handling

**Status**: in-progress  
**Related Tickets**: [WEP-43](https://jdc.eleks.com/browse/WEP-43), [WEP-7](https://jdc.eleks.com/browse/WEP-7)  
**Progress**: 100%

---

## Overview

This feature provides a complete error experience for the Signature Portal, covering two distinct failure classes:

1. **Service outage** (`/error-page`) — network errors and HTTP 5xx responses.
2. **Invalid credential** (`/invalid-credential`) — HTTP 401 (credential not found) and 403 (expired or already responded to).

Both classes are detected globally via TanStack Query's `QueryCache` / `MutationCache` and redirect the user to the appropriate page.

---

## UX Behavior

### Outage (`/error-page`)

When the backend is temporarily unavailable, users are redirected to the error page with:

- warning icon and `We're on it` messaging;
- `Refresh` action to retry (returns to the previous path stored in sessionStorage);
- `Back to login` action to return to `/`.

### Invalid Credential (`/invalid-credential`)

When the API rejects the credential (401 / 403), users are redirected to a dedicated page with:

- alert icon and a clear, non-security-leaking message;
- `Back` action to return to the credential entry screen (token retained in sessionStorage);
- `Close` action to wipe the session (`sessionStorage.clear()`) and return to `/`.

For other 4xx failures (e.g. 400, 404, 409), no redirect occurs — existing inline feedback via `ButtonErrorLabel` remains in place.

---

## Technical Design

### Error Classification

`src/lib/api/client.ts` provides:

- `ApiClientError` with `status` and `isNetworkError`;
- `isServiceOutageError(error)` — true for network errors or `status >= 500`;
- `isInvalidCredentialError(error)` — true for `status === 401` or `status === 403`.

### Global Handling

`src/providers/query-provider.tsx` configures `QueryCache.onError` and `MutationCache.onError`, both calling:

```typescript
handleGlobalRequestError(error, pathname, redirectToInvalidCredential, redirectToOutage);
```

Decision order:

1. Already on `/error-page` or `/invalid-credential` — no-op (loop guard)
2. `isInvalidCredentialError` — `redirectToInvalidCredential()`
3. `isServiceOutageError` — store return path in sessionStorage, then `redirectToOutage()`
4. Otherwise — no redirect

---

## Files

### Outage error page (WEP-43)

- `src/app/error-page/page.tsx`
- `src/components/pages/error-page.tsx`
- `src/app/error.tsx`

### Invalid credential page (WEP-7)

- `src/app/invalid-credential/page.tsx`
- `src/components/pages/invalid-credential-page.tsx`

### Shared infrastructure

- `src/providers/query-provider.tsx`
- `src/lib/api/client.ts`
- `src/lib/api/index.ts`
- `src/constants/routes.ts`
- `src/i18n/en.json`

---

## Testing Coverage

- Component and route tests for both error pages.
- Redirect decision tests covering outage, invalid credential, 4xx pass-through, and loop guards.
- API client tests for `isServiceOutageError` and `isInvalidCredentialError`.
