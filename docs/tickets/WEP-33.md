# WEP-33: "Not Authorized to Sign" Flow

**Status:** done  
**Progress:** 100%  
**Priority:** Major  
**Assignee:** Roman Kuriy  
**Jira:** https://jdc.eleks.com/browse/WEP-33  
**Related Features:** signatory-flow

---

## User Story

**As a signatory** who does not have the legal authority to consent to the wayleave agreement,  
**I want to** provide the details of an authorised person who can sign on behalf of the property,  
**so that** the agreement can proceed with the correct authorised signatory instead of myself.

**Screen References:** 03-A.39, 03-A.40, 03-A.41, 03-A.42

---

## Context

When a user reaches "Confirm your authority" and selects **No**, they should be redirected to a dedicated form to provide authorized signatory details, then see a Thank You confirmation screen.

Current code context:
- `confirm-signatory.tsx` does not navigate on Yes/No yet.
- `/preview-agreement` route does not exist in `src/app`.
- `add-authorized-sign.tsx` currently supports only `Owner` association and is used by `/add-new-name`.
- `AddressAssociation` type currently only allows `'Owner'`.

---

## Preconditions

- User authenticated with valid eSignature credential
- User completed signatory identification flow
- User reached "Confirm your authority"
- User selected either Yes/No
- Matter is in valid state for signatory flow progression

---

## Refined Decisions

### 1) i18n structure

Use a shared `signatoryDetailsForm` section for reusable field labels/placeholders/options/error strings.  
Keep page-specific copy in page namespaces (`confirmDetailsPage`, `addAuthorizedSignPage`, `notAuthorizedSignatoryPage`, `thankYouPage`).

### 2) Validation behavior and placement

Use **global error only** via existing `ButtonErrorLabel` (no per-field inline errors in this ticket), consistent with existing pages.

Validation precedence on submit:
1. required fields missing -> `requiredFieldsError`
2. invalid email format -> `invalidEmailError`
3. email mismatch -> `emailMismatchError`

### 3) ProgressStepper for `/not-authorized-signatory`

Use step **3 of 4** (matches AC2).

### 4) `/preview-agreement` route

The route does not currently exist.  
Do not leave Yes-path as a no-op. Add a minimal `/preview-agreement` placeholder route so navigation is deterministic.

### 5) Address association options for `/add-new-name`

Keep `/add-new-name` (`add-authorized-sign.tsx`) **Owner-only** in WEP-33 to avoid changing semantics of existing flow.  
Use full 7 options only in `/not-authorized-signatory`.

### 6) `SignatoryDetailsForm` API completeness

Current API needs additional structure to support all three usages:
- per-usage required field rules
- per-usage visibility toggles (association / confirm email / extended address)
- configurable options (title, association)
- compatibility with disabled/edit mode (`confirm-details`)
- consistent `town` naming while allowing page-level label text

### 7) Missing tests and edge cases

Add tests for route branching, validation precedence, stepper position, thank-you page rendering, and option-scoping differences between flows.

---

## Acceptance Criteria

### AC1 — Authority Declined -> Redirect to Add Authorized Signatory (03-A.39)

- User on "Confirm your authority" selects "No, I do not have the authority"
- "Next" is active when option selected
- Clicking Next navigates to `/not-authorized-signatory`
- Selecting Yes navigates to `/preview-agreement`
- No selection shows `selectAuthorityError`

### AC2 — Add Authorised Signatory Screen (03-A.40 / 03-A.41)

**Screen title:** "Confirm signatory details"  
**Section title:** "Add authorised signatory information"  
**Description text:** "Share the details of the authorised signatory so that they can progress the wayleave agreement."  
**Progress indicator:** Step 3 of 4

**Form fields:**

| # | Field | Type | Required | Notes |
|---|-------|------|----------|-------|
| 1 | Title | Select | Yes | Options: Mr, Mrs, Ms, Miss |
| 2 | First name | Text | Yes | |
| 3 | Last name | Text | Yes | |
| 4 | What is this person's association with the addresses? | Select | Yes | Options: Owner, Landlord, Property Manager, Solicitor, Executor, Director, Other |
| 5 | Email | Email | Yes | Format validation |
| 6 | Confirm email | Email | Yes | Must match Email field |
| 7 | Mobile number (optional) | Tel | No | |
| 8 | Correspondence address (optional) | Address group | No | Line 1, Line 2, Line 3, Town/City, County, Postcode |

**Legal notice:** "By clicking Submit, I confirm I have a legal basis to provide the details of the authorised signatory/party"  
**Help text:** "Your data will be handled in accordance with our customer's privacy notice"

**Validation on Submit:**
- Required fields missing -> global required error
- Invalid email format -> global invalid email error
- Email mismatch -> global mismatch error

**Buttons:**
- Back -> `/confirm-signatory`
- Submit (valid) -> `/thank-you`

### AC4 — Form Completed State (03-A.41)

Valid sample data path is supported and covered by tests:
- Title: Mr, First: Nate, Last: Giraffe, Relationship: Owner
- Email: nategiraffe@gmail.com (confirmed)
- Mobile: 07733751875

### AC6 — Thank You Confirmation Screen (03-A.42)

**Screen title:** "Signature Portal" / "Powered by Liberty Blume"  
**Heading:** "Thank you!"  
**Body:** "An email has been sent to the authorised party. You may close this window"  
No navigation buttons.

---

## Routing Flow

```text
/confirm-signatory
  Yes -> /preview-agreement
  No  -> /not-authorized-signatory

/not-authorized-signatory
  Back   -> /confirm-signatory
  Submit -> /thank-you
```

---

## Design Decision: Shared `SignatoryDetailsForm` Component

Shared across:
1. `confirm-details.tsx` (edit-mode capable, disabled state support, no association/confirm email)
2. `add-authorized-sign.tsx` (always editable, Owner-only association)
3. `not-authorized-signatory.tsx` (always editable, full 7 association options)

### Component API (refined)

```typescript
// src/components/common/signatory-details-form.tsx

export interface SignatoryDetailsFormValue {
  title: string;
  firstName: string;
  lastName: string;
  addressAssociation?: AddressAssociation | '';
  email: string;
  confirmEmail?: string;
  mobile?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  town?: string;
  county?: string;
  postcode?: string;
}

export interface SignatoryDetailsFormConfig {
  showAddressAssociation: boolean;
  showConfirmEmail: boolean;
  showExtendedAddress: boolean;
  required: {
    title: boolean;
    firstName: boolean;
    lastName: boolean;
    addressAssociation: boolean;
    email: boolean;
    confirmEmail: boolean;
    addressLine1: boolean;
    town: boolean;
    postcode: boolean;
  };
}

export interface SignatoryDetailsFormProps {
  value: SignatoryDetailsFormValue;
  onChange: (field: keyof SignatoryDetailsFormValue, value: string) => void;
  disabled?: boolean;
  config: SignatoryDetailsFormConfig;
  titleOptions: Array<{ value: string; label: string }>;
  addressAssociationOptions?: Array<{ value: AddressAssociation; label: string }>;
  i18nKeyPrefix: 'signatoryDetailsForm';
}
```

---

## Translation Strategy (`src/i18n/en.json`)

### Add shared section: `signatoryDetailsForm`
Reusable keys:
- field labels and placeholders
- association option labels
- `requiredFieldsError`, `invalidEmailError`, `emailMismatchError`

### Add page sections
- `notAuthorizedSignatoryPage`
- `thankYouPage`

### Keep existing page sections
- `confirmDetailsPage`, `addAuthorizedSignPage`, `confirmSignatoryPage`

---

## Updated `AddressAssociation` Type

```typescript
// src/hooks/queries/use-matter-details.ts
export type AddressAssociation =
  | 'Owner'
  | 'Landlord'
  | 'Property Manager'
  | 'Solicitor'
  | 'Executor'
  | 'Director'
  | 'Other';
```

---

## Files to Create

| File | Description |
|------|-------------|
| `src/components/common/signatory-details-form.tsx` | Reusable form component |
| `src/components/pages/not-authorized-signatory.tsx` | WEP-33 page |
| `src/app/not-authorized-signatory/page.tsx` | Route wrapper |
| `src/components/pages/thank-you.tsx` | Thank-you page component |
| `src/app/thank-you/page.tsx` | Route wrapper |
| `src/app/preview-agreement/page.tsx` | Minimal placeholder route for Yes-path |
| `src/components/pages/not-authorized-signatory.spec.tsx` | Unit tests |
| `src/app/not-authorized-signatory/page.spec.tsx` | Route tests |
| `src/components/pages/thank-you.spec.tsx` | Unit tests |
| `src/app/thank-you/page.spec.tsx` | Route tests |
| `src/app/preview-agreement/page.spec.tsx` | Placeholder route render test |

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/queries/use-matter-details.ts` | Expand `AddressAssociation` type |
| `src/i18n/en.json` | Add shared + new page translation keys |
| `src/components/pages/confirm-signatory.tsx` | Wire Yes/No navigation |
| `src/components/pages/confirm-signatory.spec.tsx` | Add navigation branch tests |
| `src/components/pages/confirm-details.tsx` | Refactor to `<SignatoryDetailsForm>` |
| `src/components/pages/confirm-details.spec.tsx` | Preserve behavior via shared form |
| `src/components/pages/add-authorized-sign.tsx` | Refactor to `<SignatoryDetailsForm>` and keep Owner-only |
| `src/components/pages/add-authorized-sign.spec.tsx` | Update tests for shared form + Owner-only |
| `src/components/pages/index.ts` | Export new components |

---

## Test Scope

- AC1: Yes/No branching and required selection error
- AC2: new page copy, stepper (3/4), required/optional field behavior, back/submit navigation
- AC4: valid completed form path
- AC6: thank-you static rendering (no action buttons)
- Regression: `/add-new-name` remains Owner-only
- Edge cases:
  - switching Yes/No before submit
  - optional fields empty on `/not-authorized-signatory`
  - validation precedence order
  - association options scoped by flow
  - prevent double-submit while pending (if async submit added)

---

## Implementation Order

1. Expand `AddressAssociation` type
2. Add i18n shared/page keys
3. Implement `SignatoryDetailsForm`
4. Refactor `confirm-details.tsx`
5. Refactor `add-authorized-sign.tsx` (Owner-only preserved)
6. Wire `confirm-signatory.tsx` routing
7. Add `/preview-agreement` placeholder route
8. Create `not-authorized-signatory` page + tests
9. Create `thank-you` page + tests
10. Update exports and run quality checks

---

## Quality Checklist (pre-PR)

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] Unit tests for new/refactored files pass
- [ ] AC1, AC2, AC4, AC6 covered by tests
- [ ] No unintended behavior change in `/add-new-name` flow
- [ ] No no-op path remains on `confirm-signatory`
