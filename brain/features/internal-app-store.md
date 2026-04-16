# Internal App Store / Feature Toggles

## Overview

Major SaaS capabilities (Listings, HRM, Projects, CRM, Blog, Analytics, AI
Assistant) are modeled as **apps** that each tenant enables or disables from
`/app-store`. The dashboard UI adapts to the active app: a narrow icon rail
switches between enabled apps, the main sidebar is scoped to the currently
active app's nav, and the header shows the active app's name and icon.

This replaces the previous hardcoded-sidebar + scattered plan-badge approach
with a single registry that drives plan gating, nav, header, and route
guards.

## Moving parts

### Registry — `packages/app-store/src/registry/`

Server-safe (strings only; no React/lucide imports at the top level):

- `types.ts` — `AppDefinition`, `AppNavGroup`, `AppNavItem`, `GlobalNavSection`, `CompanyPlanTier`.
- `apps.ts` — `APP_REGISTRY` with each app's id, label, icon name, category, plan gate, home route, and scoped nav groups. `findAppById(id)` helper.
- `global-nav.ts` — `GLOBAL_TOP_ITEMS` (Dashboard `/`, Builder, Live Preview), `GLOBAL_PLATFORM_GROUP` (Billing, Domains, Notifications, Settings, App Store, Integrations, Team), `GLOBAL_ROUTE_PREFIXES` (used by the resolver).
- `plan.ts` — `PLAN_RANK`, `isAppAvailable`, `getAvailableApps(tier)`, `getEnabledApps(tier, enabledIds)`, `isAppEnabled`.
- `active-app.ts` — `resolveActiveApp(pathname, apps)` returns the app owning a route via longest-prefix match, or `null` for global routes.
- `icon-map.tsx` — **client-only** (`"use client"`) map from icon name strings to lucide-react components + `<RegistryIcon />` renderer.

Subpath exports in `packages/app-store/package.json`:
- `@plotkeys/app-store/registry` — server-safe surface
- `@plotkeys/app-store/registry/icon-map` — client-only icon renderer

### Schema — `Company.enabledApps`

Added `enabledApps String[]` with default `["listings","blog","analytics","ai-assistant"]` (the starter-tier apps). Hand-written SQL migration at `packages/db/prisma/migrations/20260410120000_company_enabled_apps/migration.sql`.

Prisma `generate`/`migrate` must be run manually by the user.

### Per-request context — `apps/dashboard/src/lib/company-apps.ts`

`getCompanyAppsContext()` (wrapped in React `cache()`) loads `planTier` + `enabledApps` for the active tenant and resolves them against the registry:

```ts
{ planTier, availableApps, enabledApps }
```

Shared by the layout, sidebar, rail, header indicator, and the `/app-store` page in a single RSC tree.

### Layout + nav components

- `apps/dashboard/src/app/(app)/layout.tsx` — fetches apps context, wraps `AppRail` + `SidebarProvider` + `DashboardSidebar` + `SidebarInset`. Header includes `CurrentAppIndicator`.
- `apps/dashboard/src/components/nav/app-rail.tsx` — client, vertical 56px icon rail; each enabled app linked to its `homeRoute`; bottom button to `/app-store`.
- `apps/dashboard/src/components/nav/dashboard-sidebar.tsx` — client, resolves active app from pathname, renders `GLOBAL_TOP_ITEMS` → `activeApp.navGroups` → `GLOBAL_PLATFORM_GROUP`.
- `apps/dashboard/src/components/nav/current-app-indicator.tsx` — client header chip showing active app icon + label (falls back to "Dashboard").

The rail lives **outside** `SidebarProvider` as a flex sibling so shadcn's `SidebarInset` peer-data spacing math stays intact.

### `/app-store` page — internal marketplace

`apps/dashboard/src/app/(app)/app-store/page.tsx` — server component; groups `APP_REGISTRY` by category; renders cards with one of three states:

- **enabled** — Switch toggle (on) → calls `setAppEnabled(id, false)`.
- **available** — Switch toggle (off) → calls `setAppEnabled(id, true)`.
- **locked** — "Upgrade to {planGate}" CTA link to `/billing`.

Reads `?locked=<id>` from query string to show an amber banner when a user was redirected from a disabled app.

`_components/app-toggle.tsx` — client Switch wrapper using `useTransition`.

### Server action — `setAppEnabled`

`apps/dashboard/src/app/(app)/app-store/actions.ts` (`"use server"`):

1. `requireOnboardedSession()` + assert role is `owner` or `admin`.
2. Resolve app from registry; reject unknown ids.
3. If enabling, assert `isAppAvailable(app, planTier)`.
4. Update `Company.enabledApps` (dedup'd).
5. `revalidatePath("/app-store")` + `revalidatePath("/", "layout")` so the sidebar/rail rebuild with the new state.

### Route guards

`apps/dashboard/src/lib/assert-app-enabled.ts` — `assertAppEnabledById(appId)` redirects to `/app-store?locked=<id>` when the app is not in the resolved enabled set.

Per-section `layout.tsx` files added (all ~9 lines each):

| Route | App id |
|---|---|
| `/properties` | `listings` |
| `/agents` | `listings` |
| `/leads` | `listings` |
| `/appointments` | `listings` |
| `/hr` | `hrm` |
| `/projects` | `projects` |
| `/customers` | `crm` |
| `/blog` | `blog` |
| `/analytics` | `analytics` |
| `/reports` | `analytics` |
| `/ai-credits` | `ai-assistant` |

`/team` deliberately stays global — admins must always reach member management regardless of HRM state. The HRM app still links `/team` from its sidebar for convenience.

### Existing integrations page

The former `/app-store` (third-party integrations for Google Analytics, Facebook Pixel, WhatsApp, Calendly) moved to `/integrations`. Content unchanged except H1/description copy. It now lives in `GLOBAL_PLATFORM_GROUP` alongside `/app-store`.

## Tests

`packages/app-store/src/registry/active-app.test.ts` — 9 cases covering `/`, global routes, direct app matches, nested routes, longest-prefix preference, unknown paths.

`packages/app-store/src/registry/plan.test.ts` — 11 cases covering `isAppAvailable`, `getAvailableApps`, `getEnabledApps` (including the case where a stale id is saved but gated above the current tier), `isAppEnabled`.

Run with `cd packages/app-store && bun test`.

## Interaction with existing plan tiers

Plan tiers still govern *availability*:

- **starter** — listings, blog, analytics, ai-assistant
- **plus** — adds crm, hrm, projects
- **pro** — same as plus for now (no pro-exclusive apps yet)

This mirrors the tier matrix in `brain/features/dashboard-feature-plan.md`. When a tenant upgrades, previously-locked apps become available but remain disabled until they toggle them on.

## Adding a new app

1. Append an entry to `APP_REGISTRY` in `packages/app-store/src/registry/apps.ts` with id, label, icon name (must exist in `icon-map.tsx`), planGate, homeRoute, and navGroups.
2. If using a new icon, add it to `icon-map.tsx`.
3. Add a `layout.tsx` under the owning route folder that calls `assertAppEnabledById("<id>")`.
4. If the app should be enabled by default for new tenants, add its id to the default array in `Company.prisma` and update the SQL default.

Cross-links: `brain/features/dashboard-feature-plan.md`, `brain/decisions/ADR-011-internal-app-store.md`.
