# WEP-6: Cookie Consent Management (OneTrust Integration)

**Jira**: [WEP-6](https://jdc.eleks.com/browse/WEP-6)
**Status**: planning
**Priority**: Major
**Assignee**: Roman Kuriy
**Reporter**: Bohdana Maslii
**Created**: 2026-01-30
**Plan Created**: 2026-02-20

---

## Summary

Integrate the OneTrust cookie consent plugin into the eSignature Portal to manage cookie usage compliance (GDPR). OneTrust provides a full multi-screen cookie consent flow (banner, policy modal, preferences modal, detailed management modal, customer privacy policy modal) covering screens 03-A.58 through 03-A.64.

**Key Decision**: Per Jira comment from Bohdana Maslii (2026-02-16): *"Discussed with Nic that the OneTrust Integration will be without customization from our side."* This means we embed OneTrust's standard SDK; the consent UI (banner, modals, toggles) is rendered and managed entirely by OneTrust -- no custom React components for the consent flow itself.

---

## Scope

### In Scope
- Embed OneTrust SDK script in the application
- Configure OneTrust domain ID via environment variable
- Ensure OneTrust banner/modals render correctly over the app
- Conditionally load analytics/advertising scripts based on OneTrust consent state
- Ensure OneTrust does not break static export (`output: 'export'`)
- Ensure the existing `CustomerPrivacy` component (privacy policy link from API) coexists with OneTrust's cookie policy
- Accessibility: OneTrust SDK handles its own ARIA/screen reader support natively

### Out of Scope
- Custom cookie consent UI components (OneTrust handles this)
- OneTrust admin panel configuration (handled by client/Liberty Blume)
- Cookie policy content authoring (loaded into OneTrust by content team)
- Customer-specific privacy policy content (already handled by `CustomerPrivacy` component + API)

---

## Technical Approach

### Architecture Decision: Script Injection (No npm Package)

OneTrust is integrated via external `<script>` tags, not an npm package. This is the standard OneTrust integration method and aligns with the static export constraint.

### Scope Refinement (to match "no customization")

To align with Jira direction ("without customization from our side"), this ticket should be split into:

- **Phase 1 (WEP-6)**: Embed OneTrust SDK and verify OneTrust-managed UI/consent persistence works correctly.
- **Phase 2 (follow-up ticket, if needed)**: Add app-level helpers/hook only if we have real consumers (for example, internal conditional loading for non-OneTrust-managed scripts).

This prevents over-engineering in WEP-6 while still leaving a path for future integration needs.

### Files to Create/Modify (Phase 1)

| Action | File | Purpose |
|--------|------|---------|
| **Modified** | `src/app/layout.tsx` | Added OneTrust script tags to `<head>` |
| **Modified** | `.env.local` | Added `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` placeholder |
| **Created** | `.env.example` | Documents all required env vars for the team |
| **Created** | `tests/e2e/cookie-consent.e2e-spec.ts` | Playwright E2E tests (4 scenarios) |
| **Modify (if needed)** | `src/app/globals.css` | Resolve z-index collisions only if observed during manual QA |

### Deferred to Follow-up (Only If Required)

| Action | File | Purpose |
|--------|------|---------|
| **Create** | `src/lib/onetrust.ts` | Utility helpers for consent state |
| **Create** | `src/hooks/common/use-cookie-consent.ts` | Hook for app-level consent state |
| **Create** | `src/hooks/common/use-cookie-consent.spec.ts` | Unit tests for custom hook |
| **Create** | `src/types/onetrust.d.ts` | Explicit typing for OneTrust globals |

### Static Export Validation (`output: 'export'`)

- `next/script` with `strategy="beforeInteractive"` is valid for App Router and static export.
- With static export, the script tags are emitted into generated HTML during build, so they execute on client load before React hydration.
- Place OneTrust scripts in the **root** `src/app/layout.tsx` so they are emitted exactly once for all routes/locales.
- `NEXT_PUBLIC_*` values are baked at build time; changing domain ID requires rebuild/redeploy (no runtime substitution in static export).

### OneTrust Script Tags (`layout.tsx`)

Add:
- OneTrust SDK script (with `data-domain-script`)
- `OptanonWrapper` global callback placeholder

Keep inline callback only if CSP allows inline scripts; otherwise move callback to an external static file or allow via CSP hash/nonce strategy.

### Conditional Script Loading

- Prefer OneTrust native auto-blocking for third-party scripts.
- **Important**: Confirm exact OneTrust script-tagging convention from tenant docs/config before implementation (attribute/class naming differs by setup). Do not hardcode an assumed attribute pattern in the plan.
- If no analytics/ads scripts are currently present in the portal, keep this as "prepared but not implemented" in WEP-6.

### OneTrust Cookie Categories (from Jira)

| Category | OneTrust Group | Always On? |
|----------|---------------|------------|
| Strictly Necessary | C0001 | Yes (cannot disable) |
| Functional | C0002 | No |
| Performance | C0003 | No |
| Targeted Advertising | C0004 | No |

---

## Testing Strategy

### Build/Static Export Verification (Required)
- Run production build/export and validate generated HTML includes OneTrust scripts.
- Verify `data-domain-script` is populated from `NEXT_PUBLIC_ONETRUST_DOMAIN_ID`.
- Verify script tags are included once (no duplication across locale routes/layout nesting).
- Verify no hydration/runtime errors are introduced by OneTrust injection.

### Unit Tests (Only if Phase 2 hook/utilities are implemented)
- `use-cookie-consent` hook: consent parsing, event updates, safe defaults before SDK load.
- Mock `window.OneTrust`, `window.OptanonActiveGroups`, and related events.

### E2E Tests (Playwright)
- Fresh browser context: banner appears on first visit.
- Accept-all path: banner closes, no re-prompt on reload.
- Reject-all/customize path: preferences persist across reload and navigation.
- Re-open preferences from footer/persistent entry point and update choices.
- Validate category behavior by asserting consent cookie/local storage changes and expected third-party request behavior (where applicable).
- Negative path: if domain ID missing, app remains functional and failure is observable/logged (no white-screen regression).

**Environment note**: E2E requires OneTrust domain ID configured for the tested host and OneTrust tenant published for that environment/domain.

### Manual Verification
- Banner positioning (bottom of screen, non-blocking)
- Modal overlay behavior (click outside to close)
- Toggle states in preferences modal
- Expandable sections in detailed management
- Keyboard-only navigation (Tab order, focus trap, Escape behavior where supported)
- Screen reader announcements and label clarity
- Mobile viewport behavior and safe-area overlap (iOS/Android)

---

## Dependencies & Prerequisites

- [ ] OneTrust domain ID / license from Liberty Blume (client)
- [ ] OneTrust admin configured with 4 cookie categories
- [ ] Test environment domain whitelisted in OneTrust
- [ ] Cookie policy content authored and loaded into OneTrust

---

## Risks & Open Questions

1. **Domain ID and publish readiness**: Domain ID must be provided and tenant config published before meaningful QA is possible.
2. **Build-time env behavior**: `NEXT_PUBLIC_ONETRUST_DOMAIN_ID` is static at build time; environment mismatches can silently deploy wrong configuration.
3. **Static export verification gap**: `beforeInteractive` is compatible, but must be validated in exported artifacts and runtime smoke tests.
4. **CSP compatibility**: Need to allow required OneTrust domains and decide how inline `OptanonWrapper` is permitted (hash/nonce/external file).
5. **Consent-tagging convention uncertainty**: OneTrust auto-blocking markup conventions vary; implementation must use tenant-approved pattern.
6. **Z-index/overlay conflicts**: Banner or modal may conflict with app overlays/fixed footer elements.
7. **Accessibility variance**: OneTrust provides accessibility support, but integration context can still create focus/order issues in the host app.
8. **basePath/subpath hosting**: Production subpath (`/esignature-portal/`) should not affect CDN script loading, but consent persistence and re-open entry points still need validation.

---

## Progress

- [x] Jira ticket fetched and analyzed
- [x] Plan created (Step A)
- [x] Plan reviewed and refined (Step B - GPT-5.2 Codex Extra High)
- [x] Plan finalized (Step C - Claude Sonnet 4.5)
- [x] Implementation: `src/app/layout.tsx` updated with OneTrust script tags
- [x] Implementation: `.env.local` and `.env.example` updated with `NEXT_PUBLIC_ONETRUST_DOMAIN_ID`
- [x] E2E tests written: `tests/e2e/cookie-consent.e2e-spec.ts` (4 scenarios)
- [ ] OneTrust domain ID obtained from Liberty Blume (client)
- [ ] Unit tests written (Phase 2, if hook implemented)
- [ ] Manual QA passed (requires valid domain ID)
- [ ] E2E tests passing in CI (requires valid domain ID and OneTrust tenant published)
- [ ] PR created and reviewed
- [ ] Deployed to staging
- [ ] Ticket closed
