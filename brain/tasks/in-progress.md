# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Template Registry M3 — Runtime Wiring
- **Branch:** `claude/plan-template-registry-M2pDj`
- **Status:** ✅ Complete — all M3 wiring done
- **Scope:** Registry runtime integration: page inventory bridge, `resolvePage()`, builder wiring, ClickGuard + InlineOverview.
- **Reference:** `brain/modules/template-register-plan.md` (canonical spec)
- **Decision:** `brain/decisions/ADR-007-template-register-standards.md`, `brain/decisions/ADR-008-template-family-ui-design-system.md`

**M3 deliverables (all ✅ done):**
- [x] `register/index.ts` — `getPlaceholderContent()` + `getFamilyPlaceholderData()` helpers (template mode content/data)
- [x] `page-inventory.ts` — `registerPageInventoryMap` + `registerPagesToInventory()` bridge so all 18 register templates route correctly through `getTemplatePageInventory` + `buildPageSections`
- [x] `src/index.ts` — `TenantSnapshot` type, `ResolvedPageConfig` type, `resolvePage()` function with template-mode placeholder support
- [x] `builder-preview-panel.tsx` — `templateKey` prop, `resolveFamilySectionComponents()` merged into section component lookup (family-branded UI now renders in builder)
- [x] `builder-workspace.tsx` — `templateKey` passed to `BuilderPreviewPanel`
- [x] `runtime/click-guard.tsx` — `ClickGuardProvider` context + `useClickGuard` hook; intercepts anchors + form submits in non-live modes
- [x] `runtime/inline-overview.tsx` — `InlineOverview` slide-up panel; listing/agent/project overview in template vs draft/preview modes
- [x] All new components exported from `@plotkeys/section-registry`

**Still deferred (separate tracks):**
- [ ] Wire `ClickGuard` + `InlineOverview` into actual tenant-site page renders
- [ ] `EditableText` AI icon + action bar upgrade
- [ ] WebsiteVersion Phase 4 (writes)
