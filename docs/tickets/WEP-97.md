# WEP-97 – Loading Modal for Form Submissions and API Calls

**Status:** completed  
**Progress:** 100%  
**Jira:** https://jdc.eleks.com/browse/WEP-97  
**Related Feature:** loading-modal

---

## Summary

Implement a reusable `LoadingModal` component that is displayed whenever a form is being submitted or an API mutation is in-flight. The modal uses a full-screen overlay with a circular spinner and a context-specific message to give users clear feedback that the system is processing their request.

The visual design follows the Figma loading screen (V6-A.103, node `1529:7072`): a blurred overlay with a centred white card containing a spinner and text.

---

## Acceptance Criteria

- [x] A `LoadingModal` component exists in `src/components/common/`
- [x] The modal renders a full-screen overlay with a backdrop blur
- [x] The modal renders a circular indeterminate spinner
- [x] The modal accepts an `isOpen` boolean and a `message` string prop
- [x] The modal is hidden (`isOpen = false`) and renders nothing when not loading
- [x] The message is different for each mutation context
- [x] The modal is shown during `useUpdateSignatory` (`isPending`) on the Confirm Details page
- [x] The modal is shown during `useAddNewSignatory` (`isPending`) on the Add Authorised Sign page
- [x] The modal is shown during `useChangeSignatory` (`isPending`) on the Not Authorised Signatory page
- [x] Loading messages are stored in `src/i18n/en.json` under `loadingModal`
- [x] Unit tests cover open/closed states, message rendering, and accessibility attributes

---

## Implementation Plan

### Files Created

| File                                           | Description              |
| ---------------------------------------------- | ------------------------ |
| `src/components/common/loading-modal.tsx`      | Reusable modal component |
| `src/components/common/loading-modal.spec.tsx` | Unit tests (11 cases)    |

### Files Modified

| File                                                | Change                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| `src/i18n/en.json`                                  | Added `loadingModal` section with 3 context-specific messages         |
| `src/components/pages/confirm-details.tsx`          | Added `<LoadingModal>` bound to `isPending` from `useUpdateSignatory` |
| `src/components/pages/add-authorized-sign.tsx`      | Added `<LoadingModal>` bound to `isPending` from `useAddNewSignatory` |
| `src/components/pages/not-authorized-signatory.tsx` | Added `<LoadingModal>` bound to `isPending` from `useChangeSignatory` |

---

## Loading Messages (i18n)

| Key                              | Message                                                   |
| -------------------------------- | --------------------------------------------------------- |
| `loadingModal.updatingSignatory` | Saving your details, please wait…                         |
| `loadingModal.addingSignatory`   | Submitting your information, please wait…                 |
| `loadingModal.changingSignatory` | Submitting the authorised signatory details, please wait… |

---

## Design Reference

- Figma: [V6-A.103](https://www.figma.com/design/RYyaj5N6qnsJTO3aGJmec5/Signature-Portal---Dev-Team?node-id=1529-7072)
- Pattern: circular indeterminate spinner + descriptive text, centred in a blurred overlay card
