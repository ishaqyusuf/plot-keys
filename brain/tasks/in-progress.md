# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Plan-Based Template Register
- **Branch:** `claude/plan-based-templates-fVQOQ`
- **Status:** Design approved — implementation pending
- **Scope:** Create `packages/section-registry/src/register/` with 18 structured templates (6 families × 3 plans), each in its own folder, with full page inventories, content schemas, injection contracts, and placeholder data.
- **Reference:** `brain/modules/template-register-plan.md` (canonical spec)
- **Decision:** `brain/decisions/ADR-007-template-register-standards.md`

**Subtasks:**
- [ ] Create register folder structure (6 families, each with common/starter/plus/pro)
- [ ] Write `common/content-schema.ts` per family (contentKeys + defaultValue + placeholderValue + aiEnabled)
- [ ] Write `common/data-map.ts` per family (TenantResource → section config shape)
- [ ] Write `common/placeholder-data.ts` per family (template browse mode data)
- [ ] Write `common/nav.ts` + `common/footer.ts` per family
- [ ] Write `starter/pages.ts`, `plus/pages.ts`, `pro/pages.ts` per family
- [ ] Write `index.ts` per family (exports all 3 variants + family metadata)
- [ ] Write master `register/index.ts` (familyRegistry, resolvePage, lookup helpers)
- [ ] Add `"template"` to `RenderMode` union in `packages/section-registry/src/types.ts`
- [ ] Add `dataSource` + `requiredResources` fields to `SectionSlot` type in `page-inventory.ts`
