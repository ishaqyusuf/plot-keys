# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Template Registry M3 — Runtime Wiring
- **Branch:** `claude/plan-template-registry-M2pDj`
- **Status:** ✅ Complete — committed and pushed
- **Scope:** Registry runtime integration: page inventory bridge, `resolvePage()`, builder wiring, ClickGuard + InlineOverview.
- **Reference:** `brain/modules/template-register-plan.md` (canonical spec)
- **Decision:** `brain/decisions/ADR-007-template-register-standards.md`, `brain/decisions/ADR-008-template-family-ui-design-system.md`

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
- [ ] Wire `ClickGuard` + `InlineOverview` into actual tenant-site page renders
- [ ] `EditableText` AI icon + action bar upgrade
- [ ] WebsiteVersion Phase 4 (writes)
