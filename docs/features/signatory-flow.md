# Feature: Signatory Flow

**Status**: in-progress  
**Related Tickets**: [WEP-33](https://jdc.eleks.com/browse/WEP-33), [WEP-31](https://jdc.eleks.com/browse/WEP-31)  
**Progress**: 100% (all pages implemented; post-submit route for add-authorized-sign pending PO confirmation)

---

## Overview

The signatory flow guides a portal user through identity confirmation and authority verification before they can sign (or delegate signing of) a wayleave agreement. The flow is a 4-step wizard:

```
Step 1: Confirm Name           /confirm-name
Step 2: Confirm Details        /confirm-details
Step 3: Confirm Authority      /confirm-signatory
Step 4: Sign Agreement         /preview-agreement  (placeholder)
```

Two alternative branches exist within the wizard:
- **"My name is not listed"** (from Step 1) → `/add-new-name` → re-enters at Step 2
- **"No, I do not have authority"** (from Step 3) → `/not-authorized-signatory` → `/thank-you`

---

## Full Routing Map

```
/ (login)
  └── /confirm-name                    (Step 1)
        ├── [name selected]  → /confirm-details        (Step 2)
        └── [not listed]     → /add-new-name           (Alt Step 2)

/confirm-details                       (Step 2)
  └── [next] → /confirm-signatory      (Step 3)

/confirm-signatory                     (Step 3)
  ├── Yes → /preview-agreement         (Step 4 – placeholder)
  └── No  → /not-authorized-signatory  (Alt Step 3)

/not-authorized-signatory              (Alt Step 3 – WEP-33)
  └── Submit → /thank-you
```

---

## Pages & Components

### Implemented

| Route | Component | File |
|-------|-----------|------|
| `/confirm-name` | `ConfirmName` | `src/components/pages/confirm-name.tsx` |
| `/confirm-details` | `ConfirmDetails` | `src/components/pages/confirm-details.tsx` |
| `/confirm-signatory` | `ConfirmSignatory` | `src/components/pages/confirm-signatory.tsx` |
| `/add-new-name` | `AddAuthorizedSign` | `src/components/pages/add-authorized-sign.tsx` |
| `/not-authorized-signatory` | `NotAuthorizedSignatory` | `src/components/pages/not-authorized-signatory.tsx` |
| `/thank-you` | `ThankYou` | `src/components/pages/thank-you.tsx` |
| `/preview-agreement` | `PreviewAgreement` | `src/app/preview-agreement/page.tsx` (placeholder) |

---

## Shared Component: `SignatoryDetailsForm`

**Location:** `src/components/common/signatory-details-form.tsx`  
**Status:** done (WEP-33, WEP-31)

A reusable form component that renders signatory detail fields. Used in three locations with different configurations:

| Usage | disabled | showAddressAssociation | showConfirmEmail | showExtendedAddress |
|-------|----------|------------------------|-----------------|---------------------|
| `confirm-details.tsx` (view) | `true` | `false` | `false` | `false` |
| `confirm-details.tsx` (edit) | `false` | `false` | `false` | `false` |
| `add-authorized-sign.tsx` | `false` | `true` (Owner only) | `true` | `true` |
| `not-authorized-signatory.tsx` | `false` | `true` (7 options) | `true` | `true` |

**Props:**
```typescript
interface SignatoryDetailsFormProps {
  value: SignatoryDetailsFormValue;
  onChange: (field: keyof SignatoryDetailsFormValue, value: string) => void;
  disabled?: boolean;
  config: SignatoryDetailsFormConfig;
  titleOptions: Array<{ value: string; label: string }>;
  addressAssociationOptions?: Array<{ value: AddressAssociation; label: string }>;
}
```

---

## Data

### TanStack Query Hooks

| Hook | File | Used by |
|------|------|---------|
| `useMatterDetails` | `src/hooks/queries/use-matter-details.ts` | confirm-name, confirm-details, confirm-signatory, add-authorized-sign, not-authorized-signatory |
| `useUpdateSignatory` | `src/hooks/queries/use-update-signatory.ts` | confirm-details (edit mode) |
| `useAddSignatory` | `src/hooks/queries/use-add-signatory.ts` | not-authorized-signatory |
| `useAddNewSignatory` | `src/hooks/queries/use-add-new-signatory.ts` | add-authorized-sign (`POST /addSignatory`) |

### Key Types (`use-matter-details.ts`)

```typescript
export type AddressAssociation =
  | 'Owner'
  | 'Landlord'
  | 'Property Manager'
  | 'Solicitor'
  | 'Executor'
  | 'Director'
  | 'Other';

export interface Signatory { ... }
export interface MatterDetails { ... }
```

---

## i18n Structure (`src/i18n/en.json`)

| Section | Purpose |
|---------|---------|
| `confirmNamePage` | Step 1 strings |
| `confirmDetailsPage` | Step 2 strings |
| `confirmSignatoryPage` | Step 3 strings |
| `addAuthorizedSignPage` | Alt Step 2 strings |
| `signatoryDetailsForm` | Shared field labels/placeholders/errors |
| `notAuthorizedSignatoryPage` | Alt Step 3 strings |
| `thankYouPage` | Thank-you screen strings |

---

## Layout Pattern

All pages share the same full-screen layout shell:

```tsx
<div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]">
  <BackgroundPattern />
  <Header text={...} />
  <main className="flex flex-1 flex-col px-6 py-12">
    <ContentWrapper className="flex flex-1 flex-col gap-8">
      <ProgressStepper stepCount={4} currentStep={N} className="self-center" />
      {/* page content card */}
      {errorMessage && <ButtonErrorLabel message={errorMessage} />}
      {/* nav buttons */}
    </ContentWrapper>
  </main>
  <CustomerPrivacy />
</div>
```

---

## Session Storage

`selectedSignatoryId` — written in `confirm-name.tsx` when a signatory is chosen, read in `confirm-details.tsx` to pre-fill form fields.

---

## Open Items

- [ ] Confirm post-submit navigation route for `add-authorized-sign.tsx` with PO (currently `ROUTES.PREVIEW_AGREEMENT` as placeholder — WEP-31)
- [ ] Future: Implement actual preview/signing logic for Step 4 (`/preview-agreement`)
