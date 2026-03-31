# Progress

## Current State (as of 2026-03-23)

### What's Built & Working
| Area | Status |
|------|--------|
| Onboarding (6 steps, resumable) | ✅ Done |
| Template catalog (45 templates) | ✅ Done |
| Billing/pricing (Paystack, 3 tiers) | ✅ Done |
| Auth (Better Auth, signup/signin) | ✅ Done |
| Builder (inline edit, publish, preview) | ✅ Done |
| Dark mode (ThemeProvider) | ✅ Done |
| Lead capture + dashboard | ✅ Done |
| Appointment scheduling + dashboard | ✅ Done |
| AI credits (ledger, smart-fill wired) | ✅ Done |
| Analytics (events, tracking, dashboard) | ✅ Done |
| Analytics expansion (top pages, traffic sources, property views, lead sources) | ✅ Done |
| Stock image marketplace | ✅ Done |
| Website/WebsiteVersion Phase 1-4 (reads) | ✅ Done |
| Section visibility toggles | ✅ Done |
| Domain auto-sync on onboarding | ✅ Done |
| **Dashboard sidebar navigation** | ✅ Done |
| Tenant domain management UI (`/domains`) | ✅ Done |
| Logo upload (`/settings`) | ✅ Done |
| Property/agent data binding | ✅ Done |
| Domain status surfaces (dashboard home) | ✅ Done |
| Email (Welcome + Verification + New Lead + Site Published) | ✅ Done |
| Notifications (event system, 10 types) | ✅ Done |
| Notification bell in header + preferences page | ✅ Done |
| SubmitButton adoption (6 forms) | ✅ Done |
| Jobs (custom queue, 4 handlers) | ✅ Done (Trigger.dev) |
| Listing categories & types | ✅ Done |
| Settings expansion | ✅ Done |
| Customer model + lead promotion | ✅ Done |
| Team invite accept flow | ✅ Done |
| HR module (Employee + Department models, pages) | ✅ Done |
| Invite-driven agent/employee onboarding | ✅ Done |
| CSV export actions + UI download buttons | ✅ Done |
| Leave management (submission + approval flow) | ✅ Done |
| Payroll page (monthly records + mark paid) | ✅ Done |
| Listing analytics card (property detail) | ✅ Done |
| Agent performance analytics | ✅ Done |
| Chat-bot | ✅ Done (LLM + Widget) |
| App Store (GA, FB Pixel, WhatsApp, Calendly) | ✅ Done |
| Custom domain purchase | ❌ Not started |
| WebsiteVersion Phase 4 (writes) | ✅ Done |
| Template usage analytics (TemplatePicker) | ✅ Done |
| SEO & Meta Tags (per-page title/description/OG) | ✅ Done |
| **Plan-based template register (18 templates)** | ✅ Done — register data + family UI components |
| **Template family UI design system** | ✅ Done — 6 × `{family}-sections.tsx` wired via `resolveFamilySectionComponents` |
| **Template Registry M3 — Runtime Wiring** | ✅ Done — page inventory bridge, `resolvePage()`, builder wiring, ClickGuard + InlineOverview |
| **Template Registry M4 — Tenant-Site Integration** | ✅ Done — nav/footer shell, CSS var injection, inner-page routing, home-page simplification |
| Multi-page Website Support | ✅ Done — builder page selector + URL-backed page state |
| Customer Portal Foundation Planning | ✅ Done — central branded `/portal/*` route group implemented in tenant-site |
| Listing Overview Standardization | ✅ Done — shared route + query contract for public overview pages |
| Customer portal page-boundary planning | ✅ Done |
| Construction Phase 2 (Budget, Workers, Payroll) | ✅ Done |
| Construction Phase 3 (Customer Visibility) | ✅ Done |
| Construction Phase 4 (AI & Integrations) | ✅ Done |
| Tenant Onboarding Improvements | ✅ Done |
| Trigger.dev Job Integration | ✅ Done |
| Builder locked-template upgrade flow | ✅ Done |
| Pricing strategy refresh | ✅ Done |

## 2026-03-31 — Path-Aware Builder Preview

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Added `path` to `searchParams`; passed as `previewPath` to `BuilderWorkspace`.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — Imports `getTemplatePageInventory`. Resolves `activePageKey` from `previewPath` by matching against the template's page inventory slugs (defaults to `"home"`). Builds `availablePages: PageNavItem[]` list. Passes `pageKey` to `resolveWebsitePresentation` so the correct page's sections are fetched. Threads `availablePages` + `activePageKey` into `BuilderPreviewPanel`, `BuilderSidebarControls`, and `BuilderSidebarDrawer`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Accepts `availablePages` and `activePageKey`. When the template has more than one page, renders a tab strip in the preview chrome bar replacing the URL label. Clicking a tab calls `router.push('?path=...')` preserving all other query params (configId, etc.). Home tab clears the `path` param.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Accepts `activePageKey` (default `"home"`). `SeoSection` now uses `activePageKey` instead of the hardcoded `"home"` — SEO fields update per-page as you navigate.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Accepts and threads `activePageKey` to `BuilderSidebarControls`.

### Design
- URL-based navigation: `?path=/about` triggers server re-render of `BuilderWorkspace` with the correct page. Full re-render is acceptable since the builder already re-renders on template/theme changes.
- No new DB queries: `getTemplatePageInventory` is a pure in-memory lookup against the registry.
- SEO section is now page-aware: switching to `/about` and entering a title writes `seo.about.title` to themeJson.

## 2026-03-31 — SEO & Meta Tags

### What was built
- **`packages/section-registry/src/template-config.ts`** — Added `seo?: Record<string, { title?, description?, ogImage? }>` to `TemplateConfig`. Updated `deserializeTemplateConfig` to parse `seo.{pageKey}.{field}` dot-notation keys from `themeJson` into the nested structure.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — New `SeoSection` component with title input, description textarea (3 rows, debounced), and OG image URL input. Saves via `onUpdateTheme` with key `seo.home.{field}`. Wired into `BuilderSidebarControls` below section visibility toggles.
- **`apps/tenant-site/src/lib/resolve-tenant.ts`** — Added `market` to `TenantShell` company select so the description fallback can reference the market.
- **`apps/tenant-site/src/app/page.tsx`** — Exported `generateMetadata()` that calls `resolveTenantShell()` (lightweight), reads `templateConfig.seo?.home`, and returns `title` + `description` + `openGraph` + `twitter` metadata. Falls back to company name and market when no SEO override is set.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Exported `generateMetadata({ params })` that resolves `pageKey` from path segments via the existing `resolvePageKeyForPath()` helper, then reads `templateConfig.seo?.[pageKey]` for overrides. Same fallback pattern.

### Design
- Storage: `themeJson` dot-notation keys (`seo.home.title`, `seo.listings.description`, etc.) — follows the existing `sectionVisible.*` and `namedImage.*` patterns; no schema changes
- Per-page `generateMetadata()` in route files takes priority over the root layout's company-level metadata in Next.js
- Builder scoped to `pageKey="home"` for now; inner pages can be added later via path-aware builder preview

## 2026-03-31 — Template Usage Analytics

### What was built
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — `TemplatePicker` now fetches `getTemplateCatalog` via tRPC (`useQuery`). Builds a `usageMap` (key → usageCount) from the API response. Each template card shows `"{N} using"` in muted text below the tagline when count > 0. Falls back to 0 silently while the query loads.

### Design
- Read-only analytics display only — no new mutations or schema changes
- `getTemplateCatalog` already returned `usageCount` per template (backed by `countCompaniesByTemplateKey`); this surfaces it in the picker UI

## 2026-03-30 — WebsiteVersion Phase 4 — Write Path

### What was built
- **`packages/db/src/queries/website.ts`** — Added `findDraftVersionById(db, { companyId, versionId })` helper. Returns a draft WebsiteVersion with its parent Website (`id`, `templateKey`), validating company ownership. Used by mutation fallbacks when `configId` is a WebsiteVersion ID.
- **`apps/api/src/routers/workspace.route.ts`** — Five mutations upgraded with a silent WebsiteVersion fallback:
  - **`updateSiteField`**: If SiteConfiguration not found, merges `contentKey` into `version.contentJson` and calls `updateDraftVersion`.
  - **`updateSiteThemeField`**: If SiteConfiguration not found, merges `themeKey` into `version.themeJson` and calls `updateDraftVersion`.
  - **`publishSiteConfiguration`**: If SiteConfiguration not found, calls `publishWebsiteVersion` directly (archives old published, promotes draft, updates `website.publishedVersionId`).
  - **`smartFillField`**: Resolves either SiteConfiguration or WebsiteVersion; derives `templateKey` from whichever is found; AI generation logic shared; writes through `updateSiteConfigurationContentField` (legacy) or `updateDraftVersion` (Phase 4).
  - **`ensureBuilderConfigurationExists`**: Now checks `resolveActiveDraftForCompany` first; returns `legacyConfigId ?? version.id`; falls back to SiteConfiguration for existing companies; for new companies creates Website + draft via `upsertWebsite` + `getOrCreateDraftVersion` (no SiteConfiguration created).
- **Imports added**: `findDraftVersionById`, `getOrCreateDraftVersion`, `publishWebsiteVersion`, `upsertWebsite` added to router import block.

### Design
- No API surface changes — `configId` remains a plain string across all mutations
- Auto-detection: try SiteConfiguration lookup first; silence NOT_FOUND and try WebsiteVersion on miss
- Legacy dual-write path preserved for all existing companies
- New companies get a clean WebsiteVersion-only write path

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`packages/section-registry/src/runtime/smart-fill-context.tsx`** (new) — `SmartFillContext` following the same pattern as ClickGuardContext. `SmartFillProvider` accepts an `onSmartFill(contentKey)` async function and injects it via context. `useSmartFill()` hook returns the function or null when no provider is present.
- **`packages/section-registry/src/sections/editing-primitives.tsx`** — `EditableText` upgraded with hover action bar. In draft mode, hovering text reveals a small floating pill (`absolute -top-7 right-0`) with ✏ Edit and ✦ AI buttons. The AI button only renders when `useSmartFill()` is non-null. Clicking AI calls `triggerSmartFill(contentKey)` and shows a `animate-pulse ring-primary/40` loading state while the mutation runs. Clicking Edit enters contentEditable as before.
- **`packages/section-registry/src/index.ts`** — Exports `SmartFillProvider`, `useSmartFill`, `SmartFillFn`.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Added `handleInlineSmartFill` adapter (derives `shortDetail` from `contentKey` dot-notation). Wraps sections with `SmartFillProvider` when `readOnly={false}`; locked-template preview skips the provider so the AI button is not shown.

### What's still deferred
- WebsiteVersion Phase 4 writes

## 2026-03-30 — ClickGuard + InlineOverview Wiring (M3 Deferred)

### What was built
- **`runtime/click-guard.tsx`** — Enhanced `handleClick` to auto-detect item data from `data-click-guard-type` + `data-click-guard-data` attributes on intercepted anchors. Parses JSON payload and calls `openItem()` automatically, so section components need no direct dependency on `useClickGuard`.
- **`sections/extended-sections.tsx`** — Added `data-click-guard-type` and `data-click-guard-data` attributes to `PropertyGridSection` listing card anchors (type: `"listing"`, data: id/title/location/price/specs/slug) and `AgentShowcaseSection` agent card anchors (type: `"agent"`, data: id/name/role/bio/slug).
- **`apps/tenant-site/src/components/website-shell.tsx`** — New `"use client"` wrapper component. Provides `ClickGuardProvider` + `InlineOverview` boundary inside `WebsiteRuntimeProvider`'s client tree. In `renderMode="live"`, ClickGuard is transparent and InlineOverview returns null — zero behaviour change for live visitors.
- **`apps/tenant-site/src/app/layout.tsx`** — `<main>{children}</main>` wrapped with `<WebsiteShell>` to enable ClickGuard + InlineOverview for all tenant-site pages.
- **`apps/dashboard/.../builder-preview-panel.tsx`** — `ClickGuardProvider` + `InlineOverview` nested inside `WebsiteRuntimeProvider renderMode="draft"`. Clicking a listing/agent card in the builder preview now slides up the InlineOverview panel instead of triggering broken navigation.

### What's still deferred
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-30 — Template Registry M4 — Tenant-Site Integration

### What was built
- **`register/index.ts` nav/footer helpers** — `getFamilyNavConfig(familyKey, tier)` returns `NavConfig` with links filtered by `minTier` vs active tier. `getFamilyFooterConfig(familyKey)` returns `FooterConfig`. Both backed by `familyNavConfigMap` and `familyFooterConfigMap` lookup tables across all 6 families.
- **`lib/resolve-tenant.ts`** — Two-tier resolver. `resolveTenantContext(searchParams?)` resolves full tenant context including live listings and agents — used by page routes. `resolveTenantShell()` is lightweight (company + published theme only, no live data) — used by the root layout so the shell never waits on DB-heavy data fetches.
- **`components/register-nav.tsx`** — `RegisterNav` server component. Desktop: inline links filtered by plan tier + CTA button. Mobile: native `<details>/<summary>` hamburger (zero JS). Uses `var(--pk-*)` CSS vars throughout for theme consistency.
- **`components/register-footer.tsx`** — `RegisterFooter` server component. Renders link groups in a responsive grid + tagline + `© {year} {company}` copyright line.
- **`app/[...slug]/page.tsx`** — Catch-all inner page route. `resolvePageKeyForPath(templateKey, path)` supports exact slug match then dynamic `[slug]` wildcard pattern match. Calls `resolveTenantContext()` → `resolvePage()` → renders sections with `visibleSections` filter. Empty section list → "coming soon" placeholder; unknown path → `notFound()`.
- **`app/layout.tsx`** — `WebsiteRuntimeProvider` now wraps all body content, injecting `--pk-*` CSS custom properties for the active template's color system, font, and style preset. `resolveTenantShell()` called in parallel with subdomain + integrations. `RegisterNav` and `RegisterFooter` rendered conditionally when `familyKey` + `tier` are defined.
- **`app/page.tsx` simplification** — Removed ~80 lines of inline tenant resolution. Now calls `resolveTenantContext(sp)` and `resolvePage(templateKey, "home", tenant, "live")`. Fallback (no published site) still shows sample home in dashed border card.

### What's still deferred

## 2026-03-30 — Multi-page Website Support

### What was built
- **`apps/dashboard/src/app/(app)/builder/page.tsx`** — Builder now accepts a `?page=` query param and passes it into the workspace.
- **`apps/dashboard/src/components/builder/builder-workspace.tsx`** — The workspace now validates the selected page against `getTemplatePageInventory(templateKey)`, falls back to the first available page, resolves the draft preview with `pageKey`, and builds a page-aware live-site URL.
- **`apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`** — Added a new Page picker sourced from the active template inventory. Selection updates the main builder URL via `router.replace('/builder?page=...')`, so page state is shareable and survives refreshes.
- **`apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`** — Mobile builder drawer now receives the current page key so page selection is available outside desktop as well.
- **`apps/dashboard/src/components/builder/builder-preview-panel.tsx`** — Preview chrome now shows the selected public page path and label instead of only a generic builder-preview label.

### Validation notes
- Focused Biome checks passed on the touched builder files after adding the new page-selection wiring.
- `apps/dashboard` workspace typecheck remains blocked in this sandbox by a pre-existing environment issue: `@plotkeys/tsconfig/nextjs.json` is not resolvable from the package.
- Attempted live manual verification by starting the dashboard app, but the sandbox currently lacks the required `turbo`, `portless`, and `next` binaries in the runtime path, preventing a full app boot here.

## 2026-03-30 — Listing Overview Standardization

### What was built
- **`apps/tenant-site/src/lib/listing-overview.ts`** — Added a shared public listing overview query contract: `location`, `priceRange`, `sort`, and `page`. The helper normalizes those search params, applies filtering/sorting/pagination to tenant listing snapshots, and identifies which page keys count as listing overview pages.
- **`apps/tenant-site/src/app/[...slug]/page.tsx`** — Catch-all tenant pages now detect listing overview pages (`listings`, `rentals`, `projects`, etc.) and apply the shared listing query contract before passing listings into `resolvePage()`. Templates still control the section tree; the runtime now standardizes the data behavior.
- **`packages/section-registry/src/index.ts`** — Added a shared route contract resolver that derives the canonical overview/detail base path from the active template inventory. Shared section builders now use that contract so CTA links and detail links follow `/rentals/*`, `/projects/*`, `/portfolio/*`, etc. instead of assuming `/listings/*`.
- **`packages/section-registry/src/sections/extended-sections.tsx`** and **`packages/section-registry/src/sections/home-page.tsx`** — Shared property-grid and listing-spotlight configs now accept `detailHrefBase`, so shared listing cards can build template-correct detail URLs.

### Validation notes
- Focused Biome checks passed on the touched tenant-site and section-registry files; only pre-existing `<img>` performance warnings remain in shared section files.
- Verified the tenant-site listing query helper with `npx -y tsx` by filtering/sorting a small in-memory listing set; confirmed the helper returns the expected ordered subset.
- Verified template inventories with `npx -y tsx` to confirm `sakan-starter` resolves `/rentals` + `/rentals/[slug]` and `bana-starter` resolves `/projects` + `/projects/[slug]`, matching the new route contract.
- Full `apps/tenant-site` and `packages/section-registry` typechecks remain blocked in this sandbox by pre-existing workspace environment issues (`@plotkeys/tsconfig/nextjs.json` missing in app packages, JSX/react resolution missing in section-registry standalone runs).
- Manual UI verification used a local mock because the sandbox still cannot boot the full Next/Turbo runtime here. Screenshot: https://github.com/user-attachments/assets/de73bc0f-290f-4909-9e30-c58294103d47

## 2026-03-30 — Customer Portal Foundation Planning

### What was built
- **Central `/portal/*` route group in tenant-site** — Added `apps/tenant-site/src/app/portal/` pages for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, `/portal/payments`, and `/portal/account`, plus `/portal` redirecting to `/portal/login`.
- **Branded shared portal shell** — Added `apps/tenant-site/src/components/portal-shell.tsx` and `portal-page.tsx` so customer-facing account pages now render in a central application shell that uses tenant branding tokens from the existing `WebsiteRuntimeProvider`, rather than template section trees.
- **Template shell suppression on portal routes** — Updated `apps/tenant-site/src/proxy.ts` to inject `x-tenant-pathname`, and updated `apps/tenant-site/src/app/layout.tsx` so register-family nav/footer and chat widget do not render on `/portal/*` routes.
- **Legacy entry-point redirects** — Added explicit `/login`, `/signup`, and `/saved` tenant-site routes that redirect into `/portal/login`, `/portal/signup`, and `/portal/saved`, so older inventory-driven entry points land in the new central portal.
- **Public saved-listing links repointed** — Updated register-family nav/footer configs that exposed “Saved Listings” so they now link to `/portal/saved`.

### Validation notes
- Focused Biome checks passed on all touched tenant-site and section-registry files for this task.
- `apps/tenant-site` standalone typecheck remains blocked in this sandbox by the pre-existing workspace issue where `@plotkeys/tsconfig/nextjs.json` cannot be resolved from the package.
- Manual UI verification used a local mock because the sandbox still cannot reliably boot the full tenant-site runtime here. Screenshot: https://github.com/user-attachments/assets/8acea668-c66c-40ef-82eb-71e55671a80b

## 2026-03-30 — Customer Portal + Listing Page Boundary Planning

### Planning decisions
- **Central customer account pages** — Customer login, signup, dashboard, saved listings, offers, payments, and account settings should live under a central tenant-site route group such as `/portal/*`. These pages should inherit tenant branding but should not be template-composed pages.
- **Template-based public discovery pages** — Public listing overview pages (`/listings`, `/properties`, `/rentals`, `/portfolio`, `/projects`) remain template-driven because they are part of the tenant's branded marketing surface.
- **Shared functional contract for listing pages** — Even though listing overview pages remain template-based, filtering, sorting, pagination, and auth-aware actions should be implemented through shared central code so behavior stays consistent across families.

### Brain updates
- Updated `brain/features/customer-portal.md` with explicit page-boundary decisions and a route plan for `/portal/login`, `/portal/signup`, `/portal/dashboard`, `/portal/saved`, `/portal/offers`, and `/portal/account`.
- Updated `brain/modules/template-register-plan.md` so customer auth/account pages are no longer treated as template inventory pages.
- Updated `brain/modules/pages-inventory.md` to separate template pages from central customer portal pages.
- Updated `brain/system/architecture.md` and `brain/tasks/backlog.md` so future implementation follows the new central-vs-template boundary.

## 2026-03-30 — Tenant-Site ClickGuard + InlineOverview Wiring

### What was built
- **`apps/tenant-site/src/components/tenant-interaction-shell.tsx`** — Added a client-side interaction shell that reads `?renderMode=` from the URL, wraps tenant-site content in `WebsiteRuntimeProvider`, mounts `ClickGuardProvider`, and places a single `InlineOverview` panel around the real nav/footer/page render tree.
- **Tenant-site render mode parsing** — Added `parseTenantRenderMode()` and updated both `app/page.tsx` and `app/[...slug]/page.tsx` to pass the selected render mode into `resolvePage()`, so `"template"` mode now resolves placeholder content/data while `"preview"` / `"draft"` keep real tenant data.
- **Overview trigger wiring for cards** — Added `useItemOverviewTrigger()` in `packages/section-registry/src/sections/interaction-utils.tsx` and used it across shared section components plus the Noor/Bana/Wafi/Faris/Sakan/Thuraya family overrides so listing and agent cards open `InlineOverview` in non-live modes while remaining inert or navigable in live mode.
- **Item slug propagation** — Extended live/placeholder listing + agent shapes with optional `slug` support so `InlineOverview` action links can resolve detail URLs correctly in preview/template contexts.

### Validation notes
- Manual UI verification completed with a temporary local preview-mode demo that exercised `ClickGuardProvider` + `InlineOverview` around real section components. Verified that clicking a property card opens the slide-up overview panel. Screenshot: https://github.com/user-attachments/assets/f526c025-ceed-44c4-85f4-c607d6bbbfe2
- `apps/tenant-site` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/nextjs.json` is not resolvable from the app package here, and `packages/section-registry` standalone typecheck is also blocked by the environment not loading the expected React/JSX tsconfig setup.
- Focused Biome checks on touched files still surface pre-existing section-registry issues in files touched for this task, especially existing `<img>` warnings and historical `noArrayIndexKey` findings in family section files. No new security findings were identified during manual review.

## 2026-03-30 — EditableText AI Icon + Action Bar Upgrade

### What was built
- **`sections/editing-primitives.tsx`** — Draft-mode `EditableText` now keeps the existing amber hover affordance but upgrades into an explicit editing surface: hover can reveal a `✦ AI` trigger, click enters edit mode, and an action bar with `✓ Save` / `✕ Discard` replaces the previous implicit blur-save behavior.
- **Inline AI suggestion panel** — When AI is enabled for the current `contentKey`, the inline editor can open an in-place suggestion panel with generated copy plus `Use this` / `Try again` actions, so the builder preview now matches the planned upgrade path instead of only exposing AI from the sidebar field editor.
- **`register/content-field-lookup.ts`** — Added a shared content-field metadata lookup compiled from the register family content schemas plus the legacy shared builder keys. `EditableText` can now infer whether a field should expose AI affordances without requiring every section call site to pass a new prop.

### Validation notes
- Manual UI verification completed with a temporary local demo page rendering `EditableText` in draft mode. Verified hover AI affordance, edit-state action bar, and suggestion panel interaction.
- Repository tooling required `npx bun@1.3.9 ...` because the sandbox lacked a global `bun` binary.
- Full package typecheck remains blocked by pre-existing `packages/section-registry/src/register/index.ts` errors around unresolved `NavConfig` / `FooterConfig` types, unrelated to this task.
- Focused Biome checks on touched files only surfaced pre-existing warnings/errors elsewhere in `editing-primitives.tsx` (`<img>`, `aria-label` on placeholder `<div>`, `autoFocus`, and array-index key), none introduced by this change.

## 2026-03-29 — Template Registry M3 Runtime Wiring

### What was built
- **`page-inventory.ts` bridge** — `registerPagesToInventory()` converts `RegisterPageDefinition[]` to `TemplatePageInventory`. `getTemplatePageInventory()` now checks register templates first, so `buildPageSections` and `getEnabledSections` route correctly for all 18 `noor-starter` / `bana-plus` / etc. keys instead of falling back to template-1.
- **`register/index.ts` placeholder helpers** — `getPlaceholderContent(familyKey)` returns a flat `TenantContentRecord` populated from `placeholderValue` fields in each family's content-schema. `getFamilyPlaceholderData(familyKey)` returns placeholder listings/agents/projects.
- **`src/index.ts` — `resolvePage()`** — New public API. Takes `templateKey`, `pageKey`, `TenantSnapshot`, and `RenderMode`. In `"template"` mode, automatically substitutes family placeholder content and data. Applies family component overrides. Returns `ResolvedPageConfig` (sections + theme + renderMode).
- **Builder wiring** — `BuilderPreviewPanel` now accepts `templateKey` prop. `resolveFamilySectionComponents()` is resolved at the panel level and merged into the section component lookup per section, so family-branded components (Noor, Bana, Wafi, Faris, Thuraya, Sakan) render correctly in the builder instead of generic fallbacks.
- **`runtime/click-guard.tsx`** — `ClickGuardProvider` context wraps page content in non-live modes. Intercepts anchor clicks (no navigation) and form/submit clicks (no real submission). `useClickGuard()` hook exposes `openItem()` / `closeItem()` / `activeItem` for section components to trigger the overview panel.
- **`runtime/inline-overview.tsx`** — `InlineOverview` slide-up panel. Shows placeholder item data + "Install template" CTA in `"template"` mode; shows real item data + action links in `"draft"`/`"preview"` mode. Handles listing, agent, project, and generic item types.

### What's still deferred
- Tenant-site page routing for inner pages (Phase 4 — multi-page website support)
- ClickGuard integration into actual tenant-site page renders
- EditableText AI icon + action bar upgrade
- WebsiteVersion Phase 4 writes

## 2026-03-25 — Pricing Strategy Refresh

### Commercial Model
- PlotKeys no longer positions the entry tier as free forever.
- Current commercial positioning is:
  - Launch (`starter`) — ₦20,000/mo or ₦192,000/yr
  - Growth (`plus`) — ₦45,000/mo or ₦432,000/yr
  - Scale (`pro`) — ₦90,000/mo or ₦864,000/yr
- All plans now advertise a 14-day free trial.
- Annual billing is positioned with a 20% discount.

### Implementation Notes
- Internal entitlement keys remain `starter`, `plus`, and `pro` so template gating and existing plan logic do not break.
- User-facing labels now present those tiers as Launch, Growth, and Scale.
- Dashboard billing and the marketing-site pricing section now both read prices from the shared pricing config to avoid drift.

## 2026-03-25 — Builder Locked Template Guard

### Builder Access UX
- Builder now detects when the active template requires a higher subscription tier than the tenant currently holds and the company does not have a separate template license.
- In that state, the builder stays viewable but becomes read-only: publish, sidebar theme controls, inline field editing, and AI content bootstrap are disabled.
- Upgrade CTAs now point tenants to `/billing` instead of letting them hit a `FORBIDDEN` error at publish time.

### Server Enforcement
- Added shared license-aware template access checks before publish, inline content updates, theme updates, smart fill, and AI bootstrap mutations.
- This keeps the UI lock state and API enforcement aligned so direct mutation attempts are blocked consistently.

---

## 2026-03-22 — App Store Expansion

## 2026-03-24 — Invite-Driven Agent and Employee Onboarding

### Admin Flows
- Replaced direct-create agent and employee entry points with invite forms that only require an email address.
- Agents page and Employees page now show pending role-specific invites and let admins revoke them.
- Team/member invites now send real invitation emails through the shared notifications + email pipeline.

### Invite Acceptance + Profile Completion
- Updated `/join/[token]` so invitees can sign in or create an account with redirect preservation back to the invite link.
- Accepting an `agent` invite now routes into a profile-completion form that creates or updates the agent record.
- Accepting a `staff` invite now routes into a profile-completion form that creates or updates the employee record.
- Invite acceptance now validates that the signed-in account email matches the invited email before membership is created.

### Notifications + Email
- Added `workspace_invitation_sent` notification type for invite delivery.
- Added a dedicated workspace invitation email template and subject/default copy helpers.
- Added dashboard-side invite notification orchestration to send invitation emails after the team invite record is created.

### Dashboard App Store Page (`/app-store`)
- Integration cards for Google Analytics, Facebook Pixel, WhatsApp Business, Calendly
- Each card shows connection status (Connected/Not connected badge)
- Links to `/settings/integrations` for credential configuration
- External docs links for each integration

### Tenant-Site Integration Script Injection
- `IntegrationScripts` client component at `apps/tenant-site/src/components/integration-scripts.tsx`
- Injects GA4 `<Script>` tag (gtag.js + config) when `googleAnalyticsId` is configured
- Injects Facebook Pixel `<Script>` tag (fbevents.js + PageView tracking) when `facebookPixelId` is configured
- Uses Next.js `<Script>` with `strategy="afterInteractive"` for non-blocking load
- Integration data fetched in tenant-site `layout.tsx` via `resolveIntegrations()` helper

### Sidebar Navigation
- App Store sidebar item changed from disabled `#` link to active `/app-store` route
- Removed "Coming" badge

---

## 2026-03-22 — Chat-bot LLM Integration

### Chat-bot Package (`packages/chat-bot`)
- Expanded with Anthropic Claude Haiku 4.5 integration
- `getChatCompletion()` — sends conversation with company-context system prompt, returns AI reply
- `buildChatBotSystemPrompt()` — builds context from company name, market, properties (up to 10), agents (up to 10), business summary
- Types: `ChatBotMessage`, `ChatBotContext`, `ChatBotResponse`
- Added `@anthropic-ai/sdk` dependency

### API Chat Router (`apps/api/src/routers/chat.route.ts`)
- `chat.sendMessage` public mutation — resolves company from subdomain, builds context from properties/agents/onboarding, calls `getChatCompletion()`
- Validates messages (min 1, max 50, 2000 chars per message)
- Returns `{ reply: string }`

### Tenant-Site Chat (`apps/tenant-site`)
- `/api/chat` route — standalone API endpoint for chat (follows existing contact/track pattern)
- `ChatWidget` client component — floating button (bottom-right), slide-up chat panel, message thread, typing indicator, auto-scroll
- Widget added to root layout — only renders when subdomain is resolved via server-side header check

---

## 2026-03-22 — Trigger.dev Job Integration

### Task Definitions
- Created 4 Trigger.dev task definitions in `packages/jobs/src/tasks/`:
  - `domainSyncTask` (id: `domains.connection.sync`) — 4 retries, 2s base delay
  - `planSyncTask` (id: `plans.sync`) — 4 retries, 2s base delay
  - `notificationDispatchTask` (id: `notifications.dispatch`) — 3 retries, 1s base delay
  - `siteContentGenerationTask` (id: `website.content.generate`) — 3 retries, 3s base delay

### Dispatch Utility
- Added `triggerJob()` in `packages/jobs/src/trigger.ts` — dual-mode dispatch
- Uses Trigger.dev `tasks.trigger()` when `TRIGGER_SECRET_KEY` is set
- Falls back to in-memory `runInBackground()` for local dev / environments without Trigger.dev
- Added `isTriggerConfigured()` helper

### Configuration
- Created `trigger.config.ts` at monorepo root with project config and default retry settings
- Added `@trigger.dev/sdk` dependency to `packages/jobs`
- Added `./tasks` subpath export in `packages/jobs/package.json`

### Workspace Route Updates
- Replaced `runInBackground(domainSyncHandler, ...)` with `triggerJob(domainSyncTask, domainSyncHandler, ...)`
- Both call sites (onboarding completion + manual domain sync) now use `triggerJob()`

### Form Notification Wiring
- `submitContact` now dispatches `contact_form` notification job
- `submitInquiry` now dispatches `property_inquiry` notification job
- `submitNewsletterSignup` now dispatches `newsletter_signup` notification job
- All use `triggerJob()` with fire-and-forget pattern (non-blocking)

---

## 2026-03-22 — Tenant Onboarding Improvements

### Re-run Template Recommendations
- Added `updateOnboardingInputs` tRPC mutation in workspace.route.ts
- Accepts optional businessType, primaryGoal, stylePreference, tone updates
- Re-derives profile (segment, designIntent, conversionFocus, complexity) and returns updated recommendations
- `RecommendTemplatePanel` dialog component on builder sidebar with dropdowns for all 4 inputs

### AI Content Bootstrap
- Added `generateOnboardingContent()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 8 content fields: hero.eyebrow, hero.title, hero.subtitle, cta.headline, cta.description, cta.buttonLabel, story.title, story.description
- Returns JSON object, merged into active draft WebsiteVersion + dual-write to legacy SiteConfiguration
- Added `bootstrapAiContent` tRPC mutation (15 credits, deduction + usage logging)
- `AiContentBootstrapButton` component on builder sidebar
- Added `onboarding_content: 15` to AI_CREDIT_COSTS

### Builder Page Updates
- Added "Onboarding tools" section to builder sidebar with both buttons
- Fetches onboarding record server-side to pre-populate the RecommendTemplatePanel dropdowns

---

## 2026-03-22 — Construction Phase 4: AI and Integrations

### AI Project Summary
- Added `generateProjectSummary()` to `lib.ai.ts` using Claude Haiku 4.5
- Generates 3-5 paragraph executive summary covering status, milestones, issues, budget, and recommendations
- Deducts 10 AI credits per generation (`project_summary` feature)

### AI Risk Flags
- Added `generateProjectRiskFlags()` to `lib.ai.ts`
- Detects overdue milestones, budget overruns (actual > approved), high-severity unresolved issues, stale projects
- Returns structured JSON array with severity, title, and detail per risk
- Deducts 5 AI credits per analysis (`project_risk_flags` feature)

### AI Customer Update Draft
- Added `generateCustomerUpdateDraft()` to `lib.ai.ts`
- Generates customer-safe progress update from internal project data
- Strips internal issues, delays, budget, payroll details — focuses on milestones and progress
- Deducts 5 AI credits per generation (`project_customer_draft` feature)

### Technical
- Added `ProjectAiContext` type to `lib.ai.ts` for structured project data input to AI
- Added `buildProjectAiContext()` helper in projects router for data assembly
- Added 3 tRPC mutation procedures: `generateSummary`, `getRiskFlags`, `generateCustomerDraft`
- Created `project-ai.tsx` client component with `ProjectAiInsights` card, `GenerateSummaryButton`, `RiskFlagsButton`, `GenerateCustomerDraftButton`
- Updated `/projects/[id]` detail page with AI Insights section (between Payroll and Customer Access)
- Credit deduction and usage logging on each successful AI generation

---

## 2026-03-22 — Construction Phase 3: Customer Project Visibility

### Customer Access Management
- Added `ProjectCustomerAccess` model linking customers to projects with access levels (overview, detailed)
- Added `ProjectCustomerAccessLevel` enum (overview, detailed)
- Grant/revoke access per customer per project with upsert pattern
- Staff can list customers with access and manage access levels

### Customer-Visible Content Controls
- Added `customerVisible` boolean to `ProjectUpdate` model (default false)
- Added `customerVisible` boolean to `ProjectMilestone` model (default false)
- Share/Hide toggle buttons on milestones and updates in staff dashboard
- Documents already support `visibility: shared` for customer access

### Customer Notices
- Added `ProjectCustomerNotice` model for staff-to-customer project notices
- Staff can send titled notices to specific customers with project access
- Notice creation form integrated into project detail page

### Technical
- Created `project-customer.ts` query module with 10 functions (access CRUD, customer-safe reads, visibility toggles)
- Added 7 tRPC procedures to projects router (listCustomerAccess, grantCustomerAccess, revokeCustomerAccess, createCustomerNotice, deleteCustomerNotice, toggleMilestoneVisibility, toggleUpdateVisibility)
- Created `project-customer-access.tsx` component (CustomerAccessList, GrantCustomerAccessForm, SendNoticeForm)
- Updated MilestoneList and UpdatesList with "Share"/"Hide" buttons and "Customer Visible" badges
- Updated `/projects/[id]` detail page with Customer Access card section

---

## 2026-03-22 — Construction Phase 2: Budget, Workers, Payroll

### Budget Tracking
- Added `ProjectBudget` model with approved/forecast/actual amounts
- Added `ProjectBudgetLineItem` model with category, quantity, rates, estimated/actual
- Added `ProjectBudgetLineCategory` enum (preliminaries, substructure, superstructure, mep, finishing, external_works, contingency, professional_fees, other)
- Budget upsert pattern: one budget per project with line items
- Budget summary shows approved, forecast, actual, and variance
- Line item management with category badges, estimated/actual amounts

### Site Workers
- Added `ProjectWorker` model linked to Project and optionally to Employee
- Added `ProjectWorkerPayBasis` enum (daily, weekly, monthly, fixed_contract, milestone_based)
- Added `ProjectWorkerStatus` enum (active, inactive, terminated)
- Worker list with status management and pay info display
- Create worker form with name, role, pay basis, and pay rate

### Project Payroll
- Added `ProjectPayrollRun` model with period dates and status tracking
- Added `ProjectPayrollEntry` model linked to payroll run and worker
- Added `ProjectPayrollRunStatus` enum (draft, finalized, paid)
- Added `ProjectPayrollEntryPaymentStatus` enum (pending, paid, on_hold)
- Payroll run list with finalize/mark-paid workflow
- Create payroll run form with period date selection

### Technical
- Created `project-finance.ts` query module in packages/db with full CRUD
- Added 15 tRPC procedures to the projects router
- Created 3 client components: project-budget.tsx, project-workers.tsx, project-payroll.tsx
- Updated `/projects/[id]` detail page with Budget, Site Workers, and Project Payroll card sections

---

## 2026-03-21 — Phase 2 Continued: Notification Bell, Preferences, SubmitButton

### Notification Bell in Header
- Created `NotificationBell` client component with Popover dropdown
- Shows unread count badge (red dot with number, "9+" for 10+)
- Popover shows 5 most recent notifications with relative timestamps, unread highlighting, optional links
- "View all notifications" link at bottom
- Wired into `(app)/layout.tsx` with server-side data fetch via `getNotificationBellData()`

### Notification Preferences Page
- Created `NotificationPreference` Prisma model with unique constraint on (companyId, userId, type)
- Added relations to `User` and `Company` models
- Created `notification-preference.ts` query module (list, upsert, get)
- Built `/settings/notifications` page with 6 configurable notification types
- Each type has in-app and email toggle buttons (pill-style) with server action toggle
- Added `updateNotificationPreferenceAction` server action using upsert pattern
- Added "Notification preferences" link card to `/settings` page

### SubmitButton Adoption
- Added `"use client"` directive to `packages/ui/src/components/submit-button.tsx`
- Fixed `ButtonProps` import to use `React.ComponentProps<typeof Button>` instead of non-existent `ButtonProps`
- Replaced `<Button type="submit">` with `<SubmitButton>` in 6 pages:
  - `/hr/leave` — Submit Request
  - `/hr/employees` — Add Employee
  - `/hr/departments` — Add Department
  - `/hr/payroll` — Add Entry
  - `/settings` — Save profile
  - `/ai-credits` — Buy 100 Credits
- All forms now show loading spinner and disable button during server action execution

---

## 2026-03-21 — Phase 2 Continued: Leave, Payroll, CSV UI, Listing Analytics, Agent Performance

### Leave Management
- Created `leave-request.ts` DB query module: CRUD, status counts, approval/rejection
- Built `/hr/leave` page: submission form (employee select, type, dates, reason), status filters (pending/approved/rejected/cancelled), approve/reject/cancel workflow
- Added 4 server actions: `createLeaveRequestAction`, `approveLeaveRequestAction`, `rejectLeaveRequestAction`, `cancelLeaveRequestAction`
- All actions verify employee belongs to company before operating

### Payroll
- Created `payroll.ts` DB query module: CRUD, period summary, available periods, mark paid
- Built `/hr/payroll` page: monthly records, period selector tabs, summary cards (entries/gross/net/status), add entry form, mark paid flow
- Added 2 server actions: `createPayrollEntryAction`, `markPayrollPaidAction`
- Currency formatting with Intl.NumberFormat for NGN

### CSV Export UI
- Created `ExportCsvButton` client component: uses `useTransition`, creates Blob download, uses `URL.createObjectURL`
- Added export buttons to: Leads, Properties, Customers, Appointments, Employees list pages
- Each button calls its corresponding export server action and triggers download

### Listing Analytics Card
- Added per-property analytics card to `/properties/[id]` detail page
- Shows 3 metrics: Views (30 days), Views (7 days), Appointments
- Uses `prisma.analyticsEvent.count` and `prisma.appointment.count` for data

### Agent Performance Analytics
- Added `getAgentPerformanceStats()` query in payroll.ts
- Added agent performance section to analytics page: total appointments, completed appointments per agent
- Query joins agents with appointment groupBy counts

### Sidebar
- Added Leave (CalendarOff icon) and Payroll (Receipt icon) to HR & Team nav group with Plus badges

---

## 2026-03-21 — Phase 2: Analytics Expansion + HR Module

### Analytics Expansion
- Added `getTopPages()` query — groups page views by path, returns top 10
- Added `getTrafficSources()` query — buckets referrer into Direct/Google/Social/Other
- Added `getPropertyAnalytics()` query — property-level view counts
- Added `getLeadSourceBreakdown()` query — lead counts grouped by source
- Updated analytics page: 4-card stats strip (events, visitors, page views, leads), top pages table, traffic sources bars, property views list, lead source bars

### HR Module
- Created Prisma enums: `EmploymentType`, `EmployeeStatus`, `LeaveType`, `LeaveRequestStatus`, `PayrollStatus`
- Created Prisma models: `Department`, `Employee`, `LeaveRequest`, `PayrollEntry`
- Updated `Company` model with relations to departments, employees, payroll entries
- Created query modules: `department.ts` (CRUD + employee counts), `employee.ts` (CRUD + status/department counts)
- Built `/hr/employees` page: add form, status filter tabs, department filter, status badges, employment type badges
- Built `/hr/departments` page: add form, employee counts, link to filtered employee list
- Added server actions: `createEmployeeAction`, `updateEmployeeAction`, `deleteEmployeeAction`, `createDepartmentAction`, `updateDepartmentAction`, `deleteDepartmentAction`

### CSV Export
- Added `toCsvRow()` helper with proper CSV escaping
- Added export actions: `exportLeadsCsvAction`, `exportPropertiesCsvAction`, `exportCustomersCsvAction`, `exportAppointmentsCsvAction`, `exportEmployeesCsvAction`

### Sidebar Navigation
- Added HR & Team nav group with Employees (Briefcase icon), Departments (Network icon), Team links
- Moved Team from Platform to HR & Team group
- Removed Notifications and Settings from Platform group separation

---

## 2026-03-20 (Brain Template Catalog Update)

### Template Catalog Brain Documentation
- Updated `brain/modules/templates-catalog.md`: full per-template record for all 45 templates — description, plan/tier, purchasable flag, default market, accent colour, font pairing, pages, ordered home-page section composition, forms, and primary CTA links.
- Updated `brain/modules/sections-inventory.md`: split into implemented (14 live components) and planned sections. Added type keys, descriptions, form endpoints, and content key references for all implemented sections.
- Updated `brain/modules/pages-inventory.md`: clarified which pages are currently implemented (Home only for all templates), added per-template note about page inventory registry coverage, and retained planned page list.
- Updated `brain/modules/page-to-section-matrix.md`: added full per-template home page section matrix for all 45 templates in render order.

## 2026-03-20 — Tenant Dashboard Phase

### Dashboard Sidebar Navigation
- Created `(app)` route group in `apps/dashboard/src/app/` for all authenticated pages
- Built `DashboardSidebar` component at `src/components/nav/dashboard-sidebar.tsx` using shadcn sidebar primitives
- Nav groups: Overview (Home, Builder, Live Preview), Manage (Properties, Agents, Leads, Appointments), Insights (Analytics, AI Credits, Billing)
- Added `(app)/layout.tsx` wrapping all authenticated pages with `SidebarProvider` + `DashboardSidebar` + `SidebarInset`
- Added header bar with `SidebarTrigger` (mobile hamburger) and `ThemeToggle`
- Moved 11 page directories into `(app)/` route group, updated all relative imports
- Removed "← Dashboard" back links from sub-pages (sidebar handles navigation)
- Redesigned dashboard home page: metrics strip (properties/agents/leads/appointments), quick action cards, site status card
- Fixed missing `"use client"` directive on `packages/ui/src/components/sidebar.tsx`

---

## 2026-03-20 (Session 4 — Next Phase)

### Property/Agent Data Binding
- Wired `listFeaturedProperties()` and `listAgentsForCompany()` into builder page `resolveWebsitePresentation()` call
- Wired same into live page `resolveWebsitePresentation()` call
- PropertyGridSection and AgentShowcaseSection now render real DB data from properties and agents tables
- Pattern matches tenant-site approach already working in `apps/tenant-site/src/app/page.tsx`

### Tenant Domain Status Surfaces
- Added inline alerts on dashboard home page for failed and pending domains
- Failed domains show destructive alert with "View domains" link
- Pending domains show amber alert with "Provision now" form button
- Alerts dynamically computed from existing `domainStatuses` query data

### Email Template Expansion
- Created `packages/email/emails/new-lead.tsx` — React Email template for new lead notifications with lead details section
- Created `packages/email/emails/site-published.tsx` — React Email template for site publish confirmation
- Added `defaultNewLeadSubject()` and `defaultSitePublishedSubject()` to `packages/email/defaults.ts`
- Created `new_lead_captured` notification type definition with email + in_app channels
- Created `site_published` notification type definition with email + in_app channels
- Registered both in `plotKeysNotificationTypes` registry (now 10 types total)
- Added `new_lead_captured` and `site_published` email dispatch handlers in `EmailService.buildEmailPayload()`

---

## 2026-03-20 (Session 3 — High-Priority Phase 1)

### Tenant Domain Management UI
- Created `/domains` dashboard page with full domain listing, status badges (active/pending/provisioning/failed/detached), error display
- Added status filter tabs and summary stats strip (total/active/failed)
- Added re-sync button with `syncTenantDomainsAction` (revalidates `/domains`)
- Added Domains metric card + quick-nav card to dashboard home

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to dashboard
- Created `LogoUpload` client component with dual mode: file upload (Supabase storage) and URL paste fallback
- Created `setCompanyLogoAction` server action calling `workspace.setCompanyLogo` tRPC procedure
- Created `/settings` page with company info display and logo upload section
- Updated HeroBannerSection to render logo as `<img>` when value is an HTTP URL, text otherwise
- Added Settings quick-nav card to dashboard home

### WebsiteVersion Phase 4 Cleanup (reads)
- Removed SiteConfiguration fallback from `resolveActiveDraftForCompany()` in `packages/db/src/queries/website.ts`
- Removed SiteConfiguration fallback from `resolvePublishedForCompany()` in `packages/db/src/queries/website.ts`
- Added `legacyConfigId` to draft return shape for builder action compatibility
- Updated builder page to read from WebsiteVersion via `resolveActiveDraftForCompany()` (configId for actions still comes from SiteConfiguration via legacyConfigId link)
- Updated dashboard home page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated live page to use `resolvePublishedForCompany()` instead of direct SiteConfiguration query
- Updated `ensureBuilderConfigurationExists()` to check WebsiteVersion existence
- Added `./queries/website` export to `@plotkeys/db` package
- Note: Write paths still go through SiteConfiguration with Phase 2 dual-write (WebsiteVersion stays in sync)

## Roadmap Steps 10-21 Completion

### Step 10: Auto domain sync on onboarding
- Added `grantTemplateLicense()` and `runInBackground(domainSyncHandler)` calls after `createCompanyOnboardingBundle` in `completeOnboarding` mutation
- Both non-blocking — domain sync failures are caught silently

### Step 13: Hostname middleware
- Verified already complete via `proxy.ts` pattern in both dashboard and tenant-site
- `resolveTenantByHostname()` handles DB lookup with slug fallback

### Step 16: Auto-grant free template license
- Added `grantTemplateLicense()` call in `completeOnboarding` mutation
- Grants the selected template as a free pick during onboarding

### Step 17: Section visibility toggles
- Added `visibleSections?: Record<string, boolean>` to `TemplateConfig` type
- Updated serialize/deserialize/applyConfigUpdate helpers
- Added `SectionVisibilityToggles` component with Switch toggles in builder sidebar
- Updated `BuilderPreviewPanel` to filter sections by visibility
- Wired `sectionTypes` and `visibleSections` through builder page.tsx and drawer
- Added visibility filtering to tenant-site public rendering

### Step 18: Website/WebsiteVersion dual-write (Phase 2)
- Updated `createCompanyOnboardingBundle` to create Website + WebsiteVersion in transaction
- Updated all SiteConfiguration CRUD to mirror changes to draft WebsiteVersion
- Converted `publishSiteConfiguration` from batch to interactive transaction for dual-write publish

### Step 20: Lead capture
- Created Prisma model: `lead.prisma` (enum + model with status tracking)
- Created query functions: createLead, listLeadsForCompany, countLeadsByStatus, updateLeadStatus, findLeadById
- Updated tenant-site contact endpoint to persist leads to database
- Added tRPC procedures: listLeads, getLeadStats, updateLeadStatus
- Added server action: updateLeadStatusAction
- Created dashboard page: `/leads` with status filtering, stats bar, status progression buttons

### Step 21: Unified billing (Paystack)
- Created Paystack API client wrapper (`packages/utils/src/paystack.ts`): transaction init, verify, plan CRUD, subscription management, webhook signature verification (HMAC-SHA512)
- Created webhook endpoint (`apps/dashboard/src/app/api/webhooks/paystack/route.ts`): handles charge.success, subscription.create, subscription.disable, invoice.payment_failed events; verifies signature; updates plans and template licenses
- Added tRPC procedures: `getBillingInfo` (plan status + billing history), `initializeCheckout` (create Paystack transaction + pending billing line item)
- Created billing dashboard page (`/billing`): current plan display, monthly/annual toggle, plan comparison cards with upgrade buttons, billing history
- Created checkout callback page (`/billing/callback`): handles Paystack redirect after payment
- Added `initializeCheckoutAction` server action: calls tRPC initializeCheckout and redirects to Paystack authorization URL

## 2026-03-19 (Session 3 — Todos)

### Tenant Domain Management UI
- Created `/domains` dashboard page with domain list, status badges, error details, and re-sync button
- Added `syncDomainsAction` server action (redirects to `/domains?synced=1` on success)
- Updated dashboard home quick-nav from 2 to 4 cards (added Domains + Settings)

### Logo Upload Flow
- Added `@plotkeys/platform-integrations` dependency to `apps/dashboard`
- Created `POST /api/upload` API route that validates file type/size and uploads to Supabase logos bucket
- Created `LogoUploadForm` client component with file picker and URL paste fallback
- Created `/settings` dashboard page with workspace info and logo upload section
- Added `setCompanyLogoAction` server action calling existing `setCompanyLogo` tRPC procedure

### Logo rendering in tenant site
- Added `logoUrl?: string` field to `ThemeConfig` and `TenantThemeRecord`
- Added `companyLogoUrl` option to `ResolveTemplateOptions`
- Updated `resolveWebsitePresentation` to propagate `companyLogoUrl` through theme
- Updated `HeroBannerSection` in `home-page.tsx` to render `<img>` when `theme.logoUrl` is set
- Wired `company.logoUrl` from `tenant-site/page.tsx`

### Better Auth Migration
- Refactored `signUpUser()` to use `auth.api.signUpEmail()` instead of manual Prisma user creation
- Refactored `signInUser()` to use `auth.api.signInEmail()` instead of manual bcrypt comparison
- Removed unused `verifyPasswordHash()` and `compare` import

### Appointment Scheduling
- Created `appointment.prisma` model with AppointmentStatus enum (scheduled/completed/cancelled/no_show)
- Built CRUD queries in `packages/db/src/queries/appointments.ts`
- Added 5 tRPC procedures: listAppointments, getAppointmentStats, createAppointment, updateAppointmentStatus, deleteAppointment
- Created `/appointments` dashboard page with create form, status filtering, management actions
- Added server actions: createAppointmentAction, updateAppointmentStatusAction, deleteAppointmentAction

### Website/WebsiteVersion Phase 3 Read Cutover
- Added `resolveActiveDraftForCompany()` and `resolvePublishedForCompany()` read helpers
- Both prefer WebsiteVersion, fall back to SiteConfiguration for pre-migration companies
- Updated tenant-site page.tsx to use `resolvePublishedForCompany()`

### Stock Image Marketplace
- Created `stock-image-license.prisma` model with unique constraint on companyId+imageId
- Built grant/check/list query functions
- Added listStockImageLicenses + purchaseStockImage tRPC procedures with billing line item creation

### AI Credit Tracking
- Created `ai-credits.prisma` with AiUsageLog and AiCreditLedger models (ledger pattern)
- Built query functions: getAiCreditBalance, hasEnoughCredits, grantAiCredits, deductAiCredits, logAiUsage, getAiUsageStats
- Wired credit deduction + usage logging into smartFillField tRPC mutation
- Added getAiCreditInfo + purchaseAiCredits tRPC procedures
- Created `/ai-credits` dashboard page with balance display, usage breakdown, top-up button

### Analytics Foundations
- Created `analytics.prisma` AnalyticsEvent model with company/type/date indexes
- Built recordAnalyticsEvent, getAnalyticsSummary, getPageViewsByDay query functions
- Created tenant-site `/api/track` endpoint with privacy-safe visitor fingerprinting (SHA-256 of IP+UA)
- Added getAnalytics tRPC procedure
- Created `/analytics` dashboard page with stat cards, event type breakdown, page view bar chart, recent events

- Enhanced Builder Preview page (`/builder/preview`) with:
  - **Sidebar layout**: Added persistent builder config sidebar (hidden below xl breakpoint) with template selector, style presets, color systems, and preview info
  - **Dark mode toggle**: Integrated `ThemeToggle` component in preview header for light/dark mode switching
  - **Compact template picker**: Simplified template selection UI with tier tabs and smooth transitions (compact inline display in header, full sidebar picker on desktop)
  - **Responsive design**: Mobile-friendly template picker dropdown in header, desktop sidebar with comprehensive preview controls
  - **Design tokens**: Used shadcn design tokens throughout (semantic colors, spacing, rounded corners) for consistent visual hierarchy
  - Grid layout matches main builder page structure (2-column on xl: sidebar + content)
  - Style presets and color systems displayed as interactive grid previews in sidebar

## 2026-03-18
- Added `/builder/preview` client-side testing page for previewing all templates without DB.
  - Template cycling via back/next buttons and dropdown with tabbed tier selector.
  - Local publish checkbox state per template.
  - Renders sections using `sectionComponents` registry and `resolveWebsitePresentation`.
- Compacted `BuilderSidebarControls` spacing (py-3→py-2, gap-5→gap-3).
- Further compacted builder setup across desktop sidebar and mobile drawer.
  - Reduced builder shell width, outer padding, section gaps, and metadata card padding in `apps/dashboard/src/app/builder/page.tsx` and `apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`.
  - Tightened picker button padding, template rows, tab spacing, and image slot input spacing in `apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`.
  - Restored optional `namedImageSlots` on `TemplateDefinition` in `packages/section-registry/src/index.ts` so builder image controls remain correctly typed.
- Made builder page sidebar responsive: hidden below `xl`, replaced with Sheet-based drawer (`BuilderSidebarDrawer`) triggered by Settings2 icon.
- Updated auth password hashing in `packages/auth/src/index.ts` to use `bcrypt-ts` (`hash`/`compare`) instead of local scrypt-based helpers.
- Added `bcrypt-ts` dependency in `packages/auth/package.json`.
- Verified no file-level TypeScript errors in `packages/auth/src/index.ts`.
- Note: workspace `packages/auth` typecheck still reports pre-existing DB query typing errors in `packages/db/src/queries/agent.ts` and `packages/db/src/queries/property.ts`.
- Fixed sign-in redirect loop where authenticated users were bounced from onboarding back to sign-in by aligning all session cookie reads/writes to `plotkeys.session_token` (`authSessionCookieName`) across dashboard middleware/session utilities, dashboard server actions, and API auth redirect resolution.
- Fixed NEXT_REDIRECT error in all dashboard server actions: moved `redirect()` calls outside `try/catch` blocks so Next.js redirect throws are no longer caught and re-thrown as error redirects.

## Section Registry Expansion
- Added 3 new section components to `extended-sections.tsx`: HeroSearchSection, WhyChooseUsSection, ServiceHighlightsSection.
- Registered all 5 new section types (FAQ, Newsletter, HeroSearch, WhyChooseUs, ServiceHighlights) in section builders, component registry, and union types in `index.ts`.
- Added 15 new template definitions (template-31 through template-45) with unique themes, content, and tier assignments.
- Created page inventory compositions for templates 31-45 in `page-inventory.ts` with reusable slot definitions.

## Dark Mode Support
- Added `dark:` variant Tailwind classes to all hardcoded color references in `home-page.tsx` section components: Eyebrow, Surface, ActionButton, HeroBannerSection, MarketStatsSection, StoryGridSection, ListingSpotlightSection, TestimonialStripSection.
- CtaBandSection left unchanged (already dark-on-dark gradient).
- Added dark variants for ContactForm error state in `extended-sections.tsx`.
- Other extended sections already use CSS variables (`--foreground`, `--muted-foreground`, etc.) that auto-adapt via `@custom-variant dark` in globals.css.
- TypeScript compilation verified clean.

## Inline Edit Fix
- Root cause: `BuilderPreviewPanel` rendered sections without `WebsiteRuntimeProvider`, so `EditableText` components could not detect draft mode via `useIsDraftMode()` hook.
- Fix: Wrapped the section rendering container with `<WebsiteRuntimeProvider renderMode="draft">` in `builder-preview-panel.tsx`.
- This enables the amber ring editing affordances and contentEditable behavior on text fields within sections when viewed in the builder.

## 2026-03-19 (Session 4 — Tenant Dashboard System)

### Dashboard route group and sidebar navigation
- Created `(app)` Next.js route group for all authenticated pages (no URL changes)
- Moved 11 page directories (agents, ai-credits, analytics, appointments, billing, builder, domains, leads, live, properties, settings) + their sub-pages into `(app)/`
- Fixed all relative imports across moved files (one extra `../` depth added)
- Created `DashboardSidebar` client component: 4-group nav (Workspace, Operations, Growth, Platform) with active state via `usePathname`, plan badges for Pro/Plus/Coming features, company info header, sign-out in footer
- Created `DashboardShell` client component wrapping SidebarProvider + DashboardSidebar + SidebarInset so `(app)/layout.tsx` stays a server component
- `(app)/layout.tsx` reads planTier from DB and passes to DashboardShell

### Dashboard home page rebuild
- Replaced dev-focused prototype home page with proper tenant-facing dashboard
- Header: company name + plan badge + "View site" + "Open builder" CTAs
- 4-metric stat strip: Properties, Agents, New leads, Appointments (all clickable)
- 4 quick-action cards: Builder, Analytics, Leads, Billing
- Plan upgrade prompt for starter users
- Platform feature roadmap grid (4 sections × features) showing Live/Partial/Plus/Pro/Coming status with icons and descriptions

### Bug fixes
- Fixed CSS custom property syntax in builder/page.tsx: `shadow-(--shadow-soft)` → `shadow-[var(--shadow-soft)]`
- Removed duplicate "Tenant domain management UI" entry from brain/progress.md
- Fixed `domains/page.tsx` locale from `en-US` back to `en-NG` (codebase convention)

## 2026-03-20 (Session 5 — Feature Completion)

### Team Management (Phase 1B)
- Added `/join/[token]` page for accepting team invites (handles expired/revoked/already-accepted states)
- Added `acceptInviteAction` server action calling `team.acceptInvite` tRPC procedure
- Added `/team` link (Users2Icon) and `/notifications` link (BellIcon) to `DashboardSidebar` Platform group

### Notifications Page
- Created `/notifications` dashboard page with list, unread badge, unread/all filter toggle, and "Mark all read" form button
- Direct DB query for notifications (no extra tRPC call needed for server page)

### Property Detail Page + Media Gallery
- Created `/properties/[id]` detail page with:
  - Property info header with publish state badge
  - Publish state controls: Publish, Unpublish, Archive, Restore to draft
  - Media gallery grid: photos, floor plans, virtual tour links
  - Add media form (URL + type + cover checkbox)
  - Set cover star button + delete button per media item
- Updated properties list page to show `publishState` badge on each property card
- Updated properties list to link property title to `/properties/[id]`
- Updated `addPropertyMediaAction`, `deletePropertyMediaAction`, `setPropertyCoverAction` to revalidate both `/properties` and `/properties/[propertyId]` paths
- Updated `updatePropertyPublishStateAction` to revalidate both paths

## 2026-03-20 (Session 6 — Core Product Gaps + Dashboard Expansion)

### Property/Agent Data Binding Fix
- Updated `listFeaturedProperties` to filter by `publishState: "published"` (only published listings appear on live tenant sites)
- Updated `listFeaturedProperties` to include cover media from `PropertyMedia` when `imageUrl` is null (includes `media` relation with cover filter, maps `imageUrl` to cover media URL as fallback)

### Listing Categories & Types
- Added `PropertyType` enum: residential, commercial, land, industrial, mixed_use
- Added `type` and `subType` fields to `Property` model
- Created migration: `20260320093931/migration.sql`
- Updated `createProperty`/`updateProperty` DB queries to accept `type`/`subType`
- Updated `createProperty`/`updateProperty` tRPC procedures (workspace.route.ts) with new fields
- Updated `createPropertyAction`/`updatePropertyAction` server actions to pass type/subType from form
- Updated `PropertyForm` component to include type selector and subType input
- Updated properties list page with type filter tabs and type badge per card
- Added `PropertyTypeValue` type export from `@plotkeys/db`

### Settings Expansion
- Expanded `/settings` page with:
  - Company Profile section with editable name and market (owners/admins only)
  - Workspace read-only section (subdomain, plan with Upgrade button)
  - Logo upload section (unchanged)
  - Danger zone with disabled Delete button (owners/admins only)
- Added `updateCompanyProfile` DB query function
- Added `updateCompanyProfile` tRPC procedure (admin+ role required)
- Added `updateCompanyProfileAction` server action

### Customer Model + Lead Promotion
- Added `CustomerStatus` enum: active, inactive, vip
- Added `Customer` Prisma model (company, name, email, phone, notes, status, sourceLeadId)
- Created migration in `20260320093931/migration.sql`
- Added `Customer` relation to `Company` model
- Created customer DB queries: createCustomer, listCustomersForCompany, getCustomerById, updateCustomer, softDeleteCustomer, countCustomersByStatus
- Created `customers.route.ts` tRPC router: list, stats, create, update, delete
- Registered `customersRouter` in `_app.ts`
- Added server actions: createCustomerAction, updateCustomerStatusAction, deleteCustomerAction, convertLeadToCustomerAction
- Created `/customers` dashboard page with stats strip, status filter tabs, customer cards with status management
- Added "→ Customer" convert button on qualified leads in `/leads` page
- Updated `DashboardSidebar` Customers link from `#` to `/customers`

### Construction Project Management — Phase 1
- Created Prisma enums file (`packages/db/prisma/enums/project.prisma`) with 11 enums: ProjectStatus, ProjectType, ProjectPhaseStatus, ProjectMilestoneStatus, ProjectDocumentKind, ProjectDocumentVisibility, ProjectUpdateKind, ProjectIssueSeverity, ProjectIssueStatus, ProjectRole, ProjectAssignmentStatus
- Created 7 Prisma model files: Project, ProjectPhase, ProjectMilestone, ProjectDocument, ProjectUpdate, ProjectIssue, ProjectAssignment
- Added `projects` relation to Company model, `projectAssignments` to Membership model
- Created project query module (`packages/db/src/queries/project.ts`) with full CRUD for projects, phases, milestones, updates, issues, assignments, and documents
- Exported project queries from `@plotkeys/db` index and package.json exports map
- Created `projects.route.ts` tRPC router with all mutations and queries (list, get, stats, create, update, delete + phases, milestones, updates, issues, team assignments)
- Registered `projectsRouter` in `_app.ts`
- Created 6 client components using `useMutation` in `apps/dashboard/src/components/projects/` (create-project-form, project-actions, project-phases, project-milestones, project-updates, project-issues, project-team)
- Refactored `/projects` list page to use client components for mutations
- Refactored `/projects/[id]` detail page to use client components for mutations
- Added "Construction" nav group with HardHat icon to dashboard sidebar

### Construction Project Management — Phase 2 (Finance and Workforce)
- Added 4 new Prisma enums to `project.prisma`: ProjectWorkerPayBasis, ProjectWorkerStatus, ProjectPayrollRunStatus, ProjectWorkerPaymentStatus
- Created `project-budget.prisma` model file with ProjectBudget and ProjectBudgetLineItem models
- Created `project-workforce.prisma` model file with ProjectWorker, ProjectPayrollRun, and ProjectPayrollEntry models
- Updated Project model with relations to budget, workers, and payrollRuns
- Extended `packages/db/src/queries/project.ts` with budget, worker, and payroll queries (getOrCreateProjectBudget, updateProjectBudget, getProjectBudgetWithLineItems, createProjectBudgetLineItem, updateProjectBudgetLineItem, deleteProjectBudgetLineItem, listProjectWorkers, createProjectWorker, updateProjectWorker, deleteProjectWorker, listProjectPayrollRuns, getProjectPayrollRunWithEntries, createProjectPayrollRun, updateProjectPayrollRun, deleteProjectPayrollRun, upsertProjectPayrollEntry, deleteProjectPayrollEntry)
- Extended `projects.route.ts` tRPC router with 16 new Phase 2 procedures for budget, workers, and payroll runs
- Created `project-budget.tsx` client component with BudgetSummaryCard (totals + update form), BudgetLineItemList (with delete), AddBudgetLineItemForm
- Created `project-workforce.tsx` client component with WorkerList (with status toggle + remove), AddWorkerForm, PayrollRunList (with confirm/mark paid/delete), CreatePayrollRunForm
- Created `/projects/[id]/budget` page showing budget summary and line items
- Created `/projects/[id]/workforce` page showing workers and payroll runs
- Updated `/projects/[id]` detail page header with Budget and Workforce navigation buttons
# Progress Log

- 2026-03-25: Fixed the dashboard projects page so failed project-creation attempts now surface the redirected `error` query string in a destructive alert, matching the error-handling pattern already used on properties, agents, team, and other dashboard pages. Also normalized the client-side redirecting forms for project creation, property create/edit, agent create/edit, team invites, employee invites, and final onboarding completion to await server actions directly instead of wrapping them in `startTransition(async () => ...)`, which had been causing submissions to behave like plain page refreshes instead of following the intended redirect flow.
## 2026-03-30 — WebsiteVersion Phase 4 Writes

### What was built
- **WebsiteVersion-first builder writes** — Added `findDraftWebsiteVersionByIdForCompany()` and `upsertDraftWebsiteVersion()` in `packages/db/src/queries/website.ts` so the active draft can be looked up and updated directly by `WebsiteVersion.id` instead of routing writes through legacy `SiteConfiguration`.
- **Workspace mutation cutover** — Updated `createTemplateDraft`, `ensureBuilderConfigurationExists`, `publishSiteConfiguration`, `smartFillField`, `updateSiteField`, and `updateSiteThemeField` in `apps/api/src/routers/workspace.route.ts` to use WebsiteVersion draft records as the primary write target.
- **Builder config ID cutover** — `apps/dashboard/src/components/builder/builder-workspace.tsx` now always passes the resolved active draft WebsiteVersion ID to all builder actions. The previous fallback to `legacyConfigId` / latest `SiteConfiguration.id` was removed.
- **Removed onboarding dual-write in active draft path** — `updateOnboardingInputs` / onboarding AI content updates now write only to the active WebsiteVersion draft instead of mirroring field-by-field back into SiteConfiguration.

### Validation notes
- Focused Biome checks passed on the touched files with only pre-existing warnings in unrelated `workspace.route.ts` mutations (`ctx` unused in lead/appointment handlers).
- `packages/db` typecheck remains blocked in this sandbox because `@plotkeys/tsconfig/base.json` is not resolvable here.
- `apps/api` typecheck remains blocked in this sandbox because installed package resolution for the workspace dependencies is incomplete (`drizzle-orm/node-postgres` and related modules unavailable to `tsc` here).
- Manual code-path verification confirmed the builder now uses `resolvedActiveDraft.id` as `configId`, and the targeted website builder mutations no longer call `createSiteConfiguration`, `updateSiteConfigurationContentField`, `updateSiteConfigurationThemeField`, or `publishSiteConfiguration`.
