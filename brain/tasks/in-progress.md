# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Plan-Based Template Register + Family UI Design System
- **Branch:** `claude/plan-based-templates-fVQOQ`
- **Status:** Register data ✅ done — Family UI design system ✅ done — wiring to builder/tenant-site pending
- **Scope:** 18 structured templates (6 families × 3 plans) with full page inventories, content schemas, and now family-branded section UI components.
- **Reference:** `brain/modules/template-register-plan.md` (canonical spec)
- **Decision:** `brain/decisions/ADR-007-template-register-standards.md`

**Register data (all ✅ done):**
- [x] Register folder structure (6 families, each with common/starter/plus/pro)
- [x] `common/content-schema.ts`, `common/placeholder-data.ts`, `common/nav.ts`, `common/footer.ts` per family
- [x] `starter/pages.ts`, `plus/pages.ts`, `pro/pages.ts` per family
- [x] Family `index.ts` + master `register/index.ts`

**Family UI design system (all ✅ done):**
- [x] `register/ui-types.ts` — `SectionComponentOverrides` type
- [x] `register/{family}/ui/{family}-sections.tsx` — family-branded section components (6 families)
- [x] `register/{family}/ui/index.ts` — component map exports (6 families)
- [x] `resolveFamilySectionComponents()` in `register/index.ts`
- [x] Component swapping in `resolveWebsitePresentation()` in `src/index.ts`

**Still pending:**
- [ ] Wire `resolveFamilySectionComponents` into builder client-side renderer (`sectionComponents` map)
- [ ] Wire into tenant-site renderer for pages beyond what `resolveWebsitePresentation` covers
- [ ] WebsiteVersion Phase 4 (writes) — separate track
