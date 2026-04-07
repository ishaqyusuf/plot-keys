# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Modular Dashboard Sidebar — branch `claude/modular-dashboard-sidebar-KqqHz`
- **Status:** ✅ Complete — committed and pushed

**Deliverables:**
- [x] `CompanyApp` Prisma model (`packages/db/prisma/models/company-app.prisma`)
- [x] `Company` relation extended (`installedApps CompanyApp[]`)
- [x] DB query module: `getInstalledAppKeys`, `installApp`, `uninstallApp` (`packages/db/src/queries/company-apps.ts`)
- [x] `APP_REGISTRY` with 5 installable apps + 2 core groups (`apps/dashboard/src/lib/app-registry.ts`)
- [x] `DashboardSidebar` now accepts `installedAppKeys` prop, renders only active modules
- [x] `layout.tsx` fetches installed keys server-side with fallback to `DEFAULT_APP_KEYS`
- [x] App Store redesigned: "Workspace Apps" install/uninstall section + "Integrations" section
- [x] `installAppAction` / `uninstallAppAction` added to `actions.ts`
- [x] `InstallButton` client component for optimistic install/uninstall

**Note:** DB migration (`db:generate` + `db:migrate`) is pending — sidebar falls back to DEFAULT_APP_KEYS until migrated.

---

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

### Preview-Safe Action Interception
- **Branch:** `copilot/next-high-priority-task-another-one`
- **Status:** ✅ Complete — template CTAs, forms, and buttons are now safely intercepted in non-live modes
- **Scope:** ContactSection render-mode guard (skip real fetch in preview/template/draft), ClickGuard expanded to intercept all `<button>` clicks, PreviewBanner sticky mode label, PreviewToast on swallowed actions.

### Builder UI Shadcn Standardization
- **Branch:** `copilot/next-high-priority-task-another-one`
- **Status:** ✅ Complete — builder sidebar controls now use shadcn/ui primitives
- **Scope:** PickerButton → shadcn Button variant="outline", ChevronIcon → lucide-react ChevronRight, raw textarea → Textarea component, read-only warning → Alert + AlertDescription.

### Blog/CMS Module
- **Branch:** `copilot/next-high-priority-task-another-one`
- **Status:** ✅ Complete — full blog authoring and public rendering pipeline
- **Scope:** BlogPost Prisma model + migration, DB query module, dashboard `/blog` list + `/blog/[id]` editor with markdown toolbar, server actions (CRUD + publish/archive), BlogListSection + BlogPostSection in section-registry with lightweight markdown renderer, blog page slots in all 6 Pro-tier families, tenant-site live data resolution and blog-post detail rendering via slug.

### shadcn Upgrade + HugeIcons Migration + Minimal Page Redesign
- **Branch:** `claude/upgrade-shadcn-redesign-8wncn`
- **Status:** ✅ Complete — committed and pushed
- **ADR:** `brain/decisions/ADR-011-shadcn-upgrade-hugeicons-minimal-redesign.md`

**Completed deliverables:**
- [x] `components.json` updated: `iconLibrary: "hugeicons"`, `baseColor: "slate"`
- [x] `@hugeicons/react@0.6.2` installed, `lucide-react` removed from all packages
- [x] `packages/ui/src/components/icons.tsx` created — centralized `Icon` namespace (40+ icons)
- [x] `"./icons"` export added to `packages/ui/package.json`
- [x] All 23 `packages/ui` component icon imports migrated to `Icon.X`
- [x] All 13 dashboard component/page icon imports migrated to `Icon.X`
- [x] `globals.css` redesigned — standard HSL slate tokens, no body gradients, clean neutral palette
- [x] `apps/website/src/app/page.tsx` fully redesigned — clean nav/hero/features/workflow/pricing/CTA, no heavy gradients
- [x] `apps/dashboard/src/app/sign-in/page.tsx` redesigned — clean two-column, no radial gradient bg
- [x] `apps/dashboard/src/components/flow-shell.tsx` redesigned — `bg-muted/40` side panel replaces dark gradient card
- [x] `apps/dashboard/src/app/onboarding/page.tsx` side panel token cleanup — `primary-foreground` → `foreground`/`muted-foreground`
- [x] `apps/dashboard/src/app/(app)/page.tsx` cleaned — removed `font-serif`, normalized stat card icons
