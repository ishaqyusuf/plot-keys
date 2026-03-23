# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

---

## Phase 1 — Core Product Gaps (High Impact)

- [x] **Tenant Domain Management UI** — `/domains` dashboard page with domain listing, status filtering, summary stats, and manual re-sync button. ✅ Done
- [ ] **Custom Domain Purchase Flow** — Registrar API integration (Namecheap/GoDaddy), domain search, DNS provisioning, SSL, renewal tracking. Large scope.
- [x] **Property/Agent Data Binding** — Builder and live pages now fetch featured properties and agents and pass them as `liveListings`/`liveAgents` to `resolveWebsitePresentation()`. PropertyGrid and AgentShowcase sections render real DB data. ✅ Done
- [x] **Website/WebsiteVersion Phase 4 Cleanup** — Removed SiteConfiguration fallback paths from read helpers; builder, dashboard home, live page, and actions now read from WebsiteVersion exclusively. Writes still dual-write for backward compat. ✅ Done (reads)
- [x] **Logo Upload Flow** — `/settings` page with file upload (Supabase storage) + URL fallback; `setCompanyLogoAction` server action; logo rendered as image in HeroBannerSection when URL provided. ✅ Done
- [x] **Tenant Dashboard System** — Built persistent sidebar navigation (`DashboardSidebar` + `DashboardShell`) with `(app)` route group layout. Revamped home page with stats strip, quick actions, plan upgrade prompt, and platform feature roadmap grid.

## Phase 1B — Dashboard Feature Expansion (from dashboard-feature-plan.md)

- [x] **Team Invites + Role Enforcement** — Build `/team` page, invite flow (email + Membership status=invited), role-change UI, and server-action `requireRole()` enforcement. Plus plan gates invites; Pro removes member cap. See `brain/features/dashboard-feature-plan.md §2.1`.
- [x] **Listing Media Gallery** — Add `PropertyMedia` model (images, floor plans, virtual tour URL), multi-image upload via Supabase, drag-to-reorder, cover image selection. Starter: 3 images; Plus: 10; Pro: unlimited.
- [x] **Listing Publish States** — Add `publishState` (draft/published/archived) enum to `Property` model and filter public-site rendering by published state only.
- [x] **Listing Categories & Types** — Add `type` (residential/commercial/land/industrial) and `subType` to `Property`. Affects public-site section rendering.
- [x] **Analytics Expansion** — Extended `/analytics` with top pages, traffic source bucketing, property-level views, and lead source breakdown. ✅ Done
- [x] **Notification Model + Bell + Page** — Add persistent `Notification` model; show unread badge in header; build `/notifications` list page; add `/settings/notifications` preference toggles.
- [x] **Settings Expansion** — Expand `/settings` into tabs: Company Profile, Branding (colours/fonts), Integrations, Notification Preferences, Danger Zone.
- [x] **Customer Model + List + Lead Promotion** — Add `Customer` and `TenantCustomer` Prisma models; build `/customers` list and `/customers/[id]` detail page; add "Convert to customer" action on leads. Plus plan gate.
- [x] **Employee List + Detail** — Added `Employee`, `Department`, `LeaveRequest`, `PayrollEntry` Prisma models with enums; built `/hr/employees` list and add form, status filtering, department filtering. ✅ Done
- [x] **Department Management** — Added `/hr/departments` page for creating and managing departments with employee counts per department. ✅ Done
- [x] **Leave Management** — Added `leave-request.ts` DB query module; built `/hr/leave` page with submission form, approval/rejection/cancel workflow, status filters. ✅ Done
- [x] **Payroll Record-Keeping** — Added `payroll.ts` DB query module; built `/hr/payroll` page with monthly records, period selector, mark paid flow, summary cards. ✅ Done
- [x] **Listing Analytics Card** — Added per-property analytics card (7d/30d views, appointments) to `/properties/[id]` detail page. ✅ Done
- [x] **CSV Export** — Export actions exist + ExportCsvButton client component added to Leads, Properties, Customers, Appointments, Employees pages. ✅ Done
- [x] **Agent Performance Analytics** — Added `getAgentPerformanceStats()` query; added agent performance section to analytics page showing total/completed appointments per agent. ✅ Done

## Phase 2 — Platform Polish & Engagement

- [x] **Email Template Expansion** — Added `new-lead.tsx` and `site-published.tsx` email templates; created `new_lead_captured` and `site_published` notification type definitions; wired email dispatch in EmailService. ✅ Done (new lead + site published)
- [x] **Notification Dashboard UI** — `/notifications` page exists with history/filtering; notification bell in header with popover dropdown and unread badge; `/settings/notifications` preferences page with per-type in-app/email toggles; `NotificationPreference` Prisma model. ✅ Done
- [x] **Tenant Onboarding Improvements** — Re-run template recommendation from builder page when core inputs change (business type, goal, style, tone); AI bootstrap for hero/intro/CTA copy from onboarding data (15 credits). ✅ Done
- [x] **SubmitButton + Form Standardization** — SubmitButton primitive in `packages/ui` with auto-pending state; adopted across 6 dashboard form pages (leave, employees, departments, payroll, settings, ai-credits). ✅ Done
- [x] **Tenant Domain Status Surfaces** — Inline alerts on dashboard home for failed (destructive) and pending (amber) domains with action buttons. ✅ Done

## Phase 3 — Growth & Monetization

- [x] **Trigger.dev Job Integration** — Added `@trigger.dev/sdk`, created 4 task definitions (domain-sync, plan-sync, notification-dispatch, site-content-generation) with per-task retry config, `triggerJob()` dual-mode dispatch (Trigger.dev when configured, in-memory fallback), `trigger.config.ts` at root, wired form submissions to dispatch notification jobs. ✅ Done
- [x] **Chat-bot LLM Integration** — Expanded `@plotkeys/chat-bot` with Anthropic Claude Haiku 4.5 chat completion, context-aware system prompt (company, properties, agents, business summary). Added `chat` tRPC router with `sendMessage` mutation. Created `/api/chat` route in tenant-site. Built floating `ChatWidget` component with message thread, typing indicator. Widget injected into tenant-site layout via server-resolved subdomain. ✅ Done
- [x] **App Store Expansion** — Created `/app-store` dashboard page with integration cards (GA, Facebook Pixel, WhatsApp, Calendly) showing connect/disconnect status. Created `IntegrationScripts` component that injects GA4 and Facebook Pixel `<Script>` tags into tenant sites. Sidebar App Store link now functional. ✅ Done
- [x] **AI-Powered Content Generation** — Added `generatePropertyDescription()` AI function (Claude Haiku 4.5, 5 credits); `generatePropertyDescription` tRPC mutation in workspace router; `PropertyDescriptionGenerator` client component on property detail page. ✅ Done
- [x] **Template Usage Analytics** — `getTemplateCatalog` tRPC procedure already returned `usageCount` via `countCompaniesByTemplateKey`. Wired `useQuery(workspace.getTemplateCatalog)` into `TemplatePicker` in `builder-sidebar-controls.tsx` and `builder/preview/page.tsx`; each template item now shows "X tenants" count with a `Users2` icon. ✅ Done
- [ ] **Template Family Differentiation** — Reduce shared/fallback template structures; define stronger template families with distinct home-page composition, navigation patterns, and conversion strategy instead of mostly theme-level variation.

## Phase 4 — Scale & Infrastructure

- [ ] **Multi-page Website Support** — Extend WebsiteVersion to support multiple pages (About, Services, Blog) beyond single-page sites.
- [ ] **Multi-page Template Depth** — Add meaningful per-template page inventories (for example About, Contact, Listings, Projects, Services) so templates differ structurally, not only by styling and seed content.
- [ ] **Path-Aware Builder Preview** — Make internal template links work in preview/configure mode via query state such as `?path=/about` so users can navigate multi-page templates without leaving the builder shell.
- [ ] **Preview-Safe Action Interception** — Intercept template CTAs, forms, booking, and payment actions in preview/configure mode so interactive elements feel real but do not execute live workflows.
- [ ] **Builder UI Shadcn Standardization** — Refactor builder/configure-mode controls toward shadcn/ui primitives and composition patterns as the default editor UI system.
- [ ] **Blog/CMS Module** — Add blog post model, rich text editor, and blog section rendering for tenant sites.
- [ ] **SEO & Meta Tags** — Add per-page SEO metadata (title, description, OG image) management in builder; render in tenant-site head.
- [ ] **Mobile App Request Flow** — Define packaging and fulfillment for Pro customers' mobile app requests.
- [ ] **Database Adapter Abstraction** — Add first non-Postgres adapter only when concrete deployment need arises.
- [ ] **Supabase Package Rename** — Decide whether `packages/supabase` should become a general platform-integrations package.
