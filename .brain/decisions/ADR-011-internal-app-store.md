# ADR-011: Internal App Store — per-tenant feature toggles with per-app sidebar

- **Status:** Accepted
- **Date:** 2026-04-10

## Context

The tenant dashboard previously shipped one hardcoded sidebar with every feature visible to every tenant, using static "Pro"/"Plus" badges as the only signal of gating. This had three problems:

1. **Cluttered UX.** A starter tenant saw nav entries they couldn't use, and the sidebar grew with every new SaaS feature.
2. **No central feature concept.** Plan gating was scattered across individual pages (e.g. `company?.planTier !== "pro"` checks in settings). There was no single definition of "what is a feature" and "what routes does it own."
3. **Name collision.** `/app-store` was a third-party integrations marketplace (Google Analytics, WhatsApp, etc.), not an internal-feature store — which is a much more useful concept for multi-tenant SaaS.

We want tenants to pick which major features they use (Listings, HRM, Projects, CRM, Blog, Analytics, AI Assistant), and we want the UI to adapt — an Odoo/Dynamics 365 style switcher.

## Decision

We introduce an **internal app store** with these properties:

1. **Single source of truth** — `APP_REGISTRY` in `packages/app-store/src/registry/apps.ts` defines every internal app with id, label, icon, plan gate, home route, and the nav groups it owns. All UI (sidebar, rail, header, app-store page, route guards) reads from this registry.

2. **Per-app sidebar with global icon rail.** The far-left icon rail lists the tenant's enabled apps; clicking one navigates to its `homeRoute`. The main sidebar shows only the nav for the active app (resolved from the URL via longest-prefix match). A top group (Dashboard/Builder/Live Preview) and a platform group (Billing/Domains/Notifications/Settings/App Store/Integrations/Team) remain visible regardless of the active app.

3. **Plan tier decides availability; tenants toggle within allowed set.** `Company.planTier` controls which apps are *available*. Tenants toggle enabled/disabled via `Company.enabledApps` from `/app-store`. Locked apps show an upgrade CTA to `/billing`. This split lets upgrades grow the available set without auto-enabling anything the tenant hasn't opted into.

4. **Route guards via per-section layouts.** Each app's top-level route folder gets a `layout.tsx` that calls `assertAppEnabledById(appId)`. Disabled routes redirect to `/app-store?locked=<id>`. `/team` is intentionally **not** guarded — admins must always reach member management.

5. **Existing `/app-store` (third-party integrations) moves to `/integrations`.** The name is reclaimed for the internal app marketplace.

6. **Server-safe registry with a client-only icon map.** The registry stores icon names as strings so it's safely importable from any server component. `@plotkeys/app-store/registry/icon-map` is a separate `"use client"` subpath that maps strings to lucide components.

## Alternatives considered

**a. Single flat sidebar with feature flags.** Keep one sidebar and hide nav entries for disabled features. Rejected — it doesn't solve the clutter problem as the product grows and doesn't give a strong "you are now in HRM" context that scoped nav provides.

**b. Dynamic module loading (code-split per app).** Use Next.js route groups + dynamic imports so disabled apps don't ship JS. Considered desirable eventually, but orthogonal to the feature-toggle model; we can layer it on top later without schema changes. Rejected for v1 on complexity grounds.

**c. Plan-tier auto-enable (no per-tenant toggles).** Show whatever the plan allows; no toggles. Simpler, but removes the explicit "I am using this feature" opt-in, which is useful for telemetry and for keeping the rail focused. Rejected.

## Consequences

### Positive

- One registry → new apps slot in with a single data entry + a tiny layout guard.
- Rail + scoped sidebar keep the UI focused no matter how many apps exist.
- Plan gating is enforced in one place (`isAppAvailable`) instead of scattered planTier checks.
- The `/app-store` page becomes a discoverability surface for features tenants aren't using yet.

### Negative / trade-offs

- Sidebar logic is a bit more complex (active-app resolution, two-column layout with the rail).
- When a tenant disables an app that holds data (e.g. turn off CRM while having customers), nothing is deleted — data persists but becomes unreachable from the UI until re-enabled. Acceptable for v1; may want a warning later.
- Disabled-app routes still ship their JS bundles. Code-splitting can be added later without schema changes.
- Adding a new icon requires touching both `apps.ts` (string name) and `icon-map.tsx` (lucide import). Small cost; explicit on purpose to keep the registry server-safe.

## References

- Feature plan: `brain/features/internal-app-store.md`
- Related: `brain/features/dashboard-feature-plan.md` (plan-tier matrix this mirrors)
- Schema: `packages/db/prisma/models/company.prisma`, migration `20260410120000_company_enabled_apps`
