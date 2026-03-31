# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### High Priority Batch — branch `claude/plan-high-priority-ghs3J`
- **Status:** ✅ All items complete — committed and pushed

**Completed deliverables:**
- [x] Wire `ClickGuard` + `InlineOverview` into tenant-site and builder preview
- [x] `EditableText` AI icon + action bar upgrade (SmartFillContext)
- [x] WebsiteVersion Phase 4 write-path fallback in mutations
- [x] Template usage analytics — `TemplatePicker` shows live `usageCount` per template card

### Template Registry M4 — Tenant-Site Integration
- **Branch:** `claude/plan-template-registry-M2pDj`
- **Status:** ✅ Complete — all M4 wiring done
- **Scope:** Wire register templates into the live tenant-site: nav/footer shell, CSS var injection, inner-page routing, home-page simplification.

**M4 deliverables (all ✅ done):**
- [x] `register/index.ts` — `getFamilyNavConfig()`, `getFamilyFooterConfig()` + lookup maps
- [x] `src/index.ts` — exports `NavConfig`, `FooterConfig`, `NavLink`, `FooterLinkGroup`, `getFamilyNavConfig`, `getFamilyFooterConfig`
- [x] `lib/resolve-tenant.ts` — `TenantContext`, `resolveTenantContext()` (full, with live data), `TenantShell`, `resolveTenantShell()` (layout-only, no live data)
- [x] `components/register-nav.tsx` — `RegisterNav` server component; desktop inline links + CTA; mobile native `<details>/<summary>` hamburger (no JS)
- [x] `components/register-footer.tsx` — `RegisterFooter` server component; link groups grid + tagline + copyright
- [x] `app/[...slug]/page.tsx` — catch-all inner page route; `resolvePageKeyForPath()` with exact + dynamic pattern match; renders via `resolvePage()`
- [x] `app/layout.tsx` — `WebsiteRuntimeProvider` wraps all content (injects `--pk-*` CSS vars); `resolveTenantShell()` used for layout; conditional `RegisterNav` + `RegisterFooter`
- [x] `app/page.tsx` — simplified to use `resolveTenantContext()` + `resolvePage("home")`; removed ~80 lines of inline DB resolution

**Still deferred (separate tracks):**

### Multi-page Website Support
- **Branch:** `copilot/next-high-priority-task-again`
- **Status:** ✅ Complete — builder now supports selecting and editing template-based public pages beyond Home
- **Scope:** URL-backed builder page selection, page-aware preview resolution, page-aware live-site links for public tenant pages.

### Listing Overview Standardization
- **Branch:** `copilot/next-high-priority-task-again`
- **Status:** ✅ Complete — public listing overview pages now share centralized route and query behavior while staying template-based
- **Scope:** Shared overview/detail route contract from template inventories plus shared tenant-site query parsing for location / priceRange / sort / page before template sections render.

### Customer Portal Foundation Planning
- **Branch:** `copilot/next-high-priority-task-again`
- **Status:** ✅ Complete — central branded `/portal/*` routes now exist in tenant-site and no longer render inside the template-family shell
- **Scope:** Portal route group, branded shared shell, foundational login/signup/dashboard/saved/offers/payments/account pages, legacy redirect entry points, and public saved-listing links updated to `/portal/saved`.

### AI-Powered Page Content Generation
- **Branch:** `copilot/next-high-priority-task-another-one`
- **Status:** ✅ Complete — builder now has per-page AI content generation beyond field-level smart-fill
- **Scope:** `generatePageContent()` AI function, `generatePageContent` tRPC mutation (10 credits), `GeneratePageContentButton` in builder sidebar, page-prefixed content key support for non-home pages.

### Template Family Differentiation
- **Branch:** `copilot/next-high-priority-task-another-one`
- **Status:** ✅ Complete — register families now have clearer home-page conversion spines across Starter / Plus / Pro tiers
- **Scope:** differentiated family home compositions in `packages/section-registry/src/register/*/*/pages.ts`, aligning agency / developer / manager / solo-agent / luxury / rental families with their existing nav/CTA patterns.
