# WEP-31: Refactor `AddAuthorizedSign` to Use Reusable Form

**Status**: done  
**Progress**: 100%  
**Jira**: https://jdc.eleks.com/browse/WEP-31  
**Related Feature**: [signatory-flow](../features/signatory-flow.md)

---

## Summary

Refactor `src/components/pages/add-authorized-sign.tsx` to follow the same patterns established by `not-authorized-signatory.tsx`. The original implementation was a prototype with 12 individual `useState` calls, no API integration, basic validation without regex, hardcoded routes, and duplicated translation keys.

---

## Changes Made

### `src/hooks/queries/use-add-new-signatory.ts` _(new file)_

New TanStack Query mutation hook that calls `POST /api/lb/matter/{matterId}/addSignatory` to create a brand-new signatory record. Distinct from `useAddSignatory` which performs `PUT updateSignatory` on an existing record.

- Exports `useAddNewSignatory()` returning `{ addNewSignatory, isPending, isError, error, isSuccess }`
- Exports `AddNewSignatoryBody` type (`{ signatory: Signatory }`)
- Validates `matterId` presence; throws `'Matter ID is not available'` if missing
- Sends `Authorization: Bearer <token>` header via `useToken`
- Invalidates `['matterDetails']` query on success

### `src/hooks/queries/use-add-new-signatory.spec.tsx` _(new file)_

Full test suite mirroring `use-add-signatory.spec.tsx` pattern: correct POST request, error on failed request, missing matterId guard, auth header, query invalidation, mutation state, network errors, missing token.

### `src/components/pages/add-authorized-sign.tsx`

- Replaced 12 individual `useState` calls with a single `formValue` state object (`RequiredFormValue` type)
- Added `useCallback`-wrapped `handleFormChange` for performant field updates
- Added `useEffect` to read `selectedSignatoryId` from `sessionStorage`
- Integrated `useAddNewSignatory` hook for API submission via `POST /addSignatory` (replaces `console.warn` TODO)
- Integrated `useMatterDetails` for signatory lookup by `selectedSignatoryId`
- Replaced inline `<Select>` / `<Input>` fields with `<SignatoryDetailsForm>` using `SIGNATORY_FORM_CONFIG.addAuthorizedSign`
- Added `TITLE_OPTIONS` and `ADDRESS_ASSOCIATION_OPTIONS` from constants
- Added `EMAIL_REGEX` and `PHONE_REGEX` validation (mobile required for this flow)
- Used `ROUTES.CONFIRM_NAME` for back navigation (was hardcoded `'/confirm-name'`)
- Used `ROUTES.PREVIEW_AGREEMENT` for post-submit navigation (placeholder — confirm with PO)
- Made `handleSubmitClick` async with proper error handling
- Added `disabled={isPending}` to Submit button

### `src/i18n/en.json`

Removed from `addAuthorizedSignPage` all field-level keys now provided by `signatoryDetailsForm`:
- `titleLabel`, `titlePlaceholder`, `firstNameLabel`, `firstNamePlaceholder`, `lastNameLabel`, `lastNamePlaceholder`
- `addressAssociationLabel`, `addressAssociationPlaceholder`
- `emailLabel`, `emailPlaceholder`, `confirmEmailLabel`, `confirmEmailPlaceholder`
- `mobileLabel`, `mobilePlaceholder`
- `correspondenceAddressLabel`
- `addressLine1Placeholder`, `addressLine2Placeholder`, `addressLine3Placeholder`, `cityPlaceholder`, `countyPlaceholder`, `postcodePlaceholder`
- `emailMismatchError`, `requiredFieldsError`

Retained page-level keys: `headerText`, `formHeading`, `formDescription`, `signatoryDetailsHeading`, `legalBasisText`, `submitButton`, `backButtonLabel`, `dataHandlingText`.

### `src/components/pages/add-authorized-sign.spec.tsx`

- Added `useAddSignatory` mock
- Added `sessionStorage` setup in `beforeEach`
- Added mock signatory to `mockMatterDetails.signatories`
- Updated all field-level translation refs from `t.*` (addAuthorizedSignPage) to `tForm.*` (signatoryDetailsForm)
- Updated `t.cityPlaceholder` → `tForm.townPlaceholder`
- Removed `consoleSpy` tests (replaced by API call assertions)
- Added tests: API submission payload, navigate on success, error on API failure, `isPending` disables button
- Added tests: `invalidEmailError`, `invalidMobileError`, mobile required validation
- Replaced "allows submission without mobile" with "shows requiredFieldsError when mobile is missing" (mobile is required in `addAuthorizedSign` config)

---

## Validation Rules (addAuthorizedSign)

| Field | Required | Validation |
|-------|----------|------------|
| title | yes | non-empty |
| firstName | yes | non-empty |
| lastName | yes | non-empty |
| addressAssociation | yes | non-empty |
| email | yes | `EMAIL_REGEX` |
| confirmEmail | yes | must match email |
| mobile | yes | `PHONE_REGEX` |
| addressLine1 | yes | non-empty |
| town | yes | non-empty |
| postcode | yes | non-empty |
| addressLine2 | no | — |
| addressLine3 | no | — |
| county | no | — |

---

## Open Items

- [ ] Confirm post-submit navigation route with PO (currently `ROUTES.PREVIEW_AGREEMENT` as placeholder)
