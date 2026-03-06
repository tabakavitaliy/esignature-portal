# WEP-7: Invalid Credential Handling (Screen: 03-A.55)

**Status**: in-progress  
**Progress**: 100%  
**Jira**: https://jdc.eleks.com/browse/WEP-7  
**Related Feature**: [error-handling](../features/error-handling.md)

---

## Story

_As a signatory_ who enters an invalid, expired, or already-used credential, _I want to_ receive clear feedback about the issue, _so that_ I understand what went wrong and can take corrective action.

---

## Error Scenarios Handled

| Scenario                   | API Status |
| -------------------------- | ---------- |
| Credential not found       | 401        |
| Agreement already signed   | 403        |
| Agreement already rejected | 403        |
| Agreement expired          | 403        |

---

## Acceptance Criteria

- [x] Error message: "Looks like this eSignature credential is invalid, or the agreement has already been responded to by someone. If you think this is a mistake, check the code and try again."
- [x] **Back** button returns user to credential entry screen (`/`)
- [x] **Close** button clears session and returns to initial login (`/`)

---

## Implementation

### New Route

`/invalid-credential` — rendered by `src/app/invalid-credential/page.tsx`

### UI Component

`src/components/pages/invalid-credential-page.tsx`

- Shares the gradient + `BackgroundPattern` + `Header` layout with other info pages
- Displays `AlertCircle` icon (lucide-react) inside a rounded card
- Two-paragraph message from `i18n/en.json` (`invalidCredentialPage`)
- **Back** (`kind="secondary"`) — `router.push(ROUTES.HOME)`, keeps token in sessionStorage
- **Close** (primary) — `sessionStorage.clear()` then `router.push(ROUTES.HOME)`

### Error Classification

`isInvalidCredentialError(error)` added to `src/lib/api/client.ts`:

```typescript
export function isInvalidCredentialError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) return false;
  return error.status === 401 || error.status === 403;
}
```

### Global Redirect

`handleGlobalRequestError` in `src/providers/query-provider.tsx` updated with a 4-argument signature:

```typescript
handleGlobalRequestError(error, pathname, redirectToInvalidCredential, redirectToOutage);
```

- 401/403 → redirect to `INVALID_CREDENTIAL` (no sessionStorage write)
- 5xx/network → redirect to `ERROR_PAGE` (writes `errorReturnPath` to sessionStorage)
- Loop guard: skips if `pathname` is already `INVALID_CREDENTIAL` or `ERROR_PAGE`

---

## Files Changed

### New

- `src/app/invalid-credential/page.tsx`
- `src/app/invalid-credential/page.spec.tsx`
- `src/components/pages/invalid-credential-page.tsx`
- `src/components/pages/invalid-credential-page.spec.tsx`
- `docs/tickets/WEP-7.md`

### Modified

- `src/constants/routes.ts` — `INVALID_CREDENTIAL` constant
- `src/lib/api/client.ts` — `isInvalidCredentialError` helper
- `src/lib/api/index.ts` — re-export `isInvalidCredentialError`
- `src/providers/query-provider.tsx` — 4-argument `handleGlobalRequestError`
- `src/i18n/en.json` — `invalidCredentialPage` section
- `src/components/pages/index.ts` — export `InvalidCredentialPage`
- `src/providers/query-provider.spec.tsx` — updated for new signature + new test cases
- `src/lib/api/client.spec.ts` — `isInvalidCredentialError` tests
- `docs/features/error-handling.md`
- `docs/features/features-index.json`
- `docs/tickets/tickets-index.json`
