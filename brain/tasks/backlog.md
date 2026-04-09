# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

---

## Phase 1 — Core Product Gaps (High Impact)

- [x] **Tenant Domain Management UI** — `/domains` dashboard page with domain listing, status filtering, summary stats, and manual re-sync button. ✅ Done
- [x] **Custom Domain Purchase Flow (Phase 1)** — Domain service abstraction (`domain-service.ts`) with split Vercel/registrar architecture. DNS-based availability search (supports .com.ng). Custom domain connection flow: tRPC procedures (`connectCustomDomain`, `removeCustomDomain`, `searchDomains`, `getCustomDomainDnsInstructions`), dashboard `/domains/connect` page, DNS instruction cards on `/domains` page, server actions. Phase 2 remaining: registrar purchase API integration, renewal tracking, WHOIS privacy. ✅ Done
- [x] **Property/Agent Data Binding** — Builder and live pages now fetch featured properties and agents and pass them as `liveListings`/`liveAgents` to `resolveWebsitePresentation()`. PropertyGrid and AgentShowcase sections render real DB data. ✅ Done
- [x] **Website/WebsiteVersion Phase 4 Cleanup** — Removed SiteConfiguration fallback paths from read helpers and switched builder/site write mutations to WebsiteVersion draft IDs. Builder, dashboard home, live page, and actions now operate on WebsiteVersion as the active website state. ✅ Done
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
- [x] **AI-Powered Content Generation** — Expanded beyond smart-fill with `generatePageContent()` AI function that generates all editable fields for a specific page in a single LLM call. Added `generatePageContent` tRPC mutation (10 credits), `GeneratePageContentButton` in builder sidebar "AI content" section with per-page label and credit cost display. Property descriptions and blog posts deferred to dedicated modules. ✅ Done
- [x] **Template Usage Analytics** — Add usage-count aggregation so tenants can assess template uniqueness before selecting. ✅ Done
- [x] **Template Family Differentiation** — Register-family home pages now follow clearer structural identities by business model: Noor stays listings-first with proof/team before story, Bana becomes project-first, Wafi shifts to service/owner-acquisition, Faris emphasizes the solo agent, Thuraya becomes editorial/portfolio-led, and Sakan stays search/renter-conversion-first. Existing family-specific nav models and CTAs now line up with these stronger home-page compositions across Starter / Plus / Pro tiers. ✅ Done

## Phase 4 — Scale & Infrastructure

- [x] **Multi-page Website Support** — Public tenant pages already resolve through page inventories at runtime; builder now supports URL-backed page selection so non-home template pages can be edited. ✅ Done
- [x] **Customer Portal Foundation Planning** — Central tenant-site `/portal/*` routes now exist for login, signup, dashboard, saved listings, offers, payments, and account pages, using a branded shared shell outside the template inventory. ✅ Done
- [x] **Listing Overview Standardization** — Public listing overview pages remain template-based, but now share centralized route resolution plus shared tenant-site query parsing for location / priceRange / sort / page. ✅ Done
- [x] **Multi-page Template Depth** — Add meaningful per-template page inventories (for example About, Contact, Listings, Projects, Services) so templates differ structurally, not only by styling and seed content. ✅ Done (per-page hero defaults + content aliasing; inline editing scope deferred)
- [x] **Path-Aware Builder Preview** — Make internal template links work in preview/configure mode via query state such as `?path=/about` so users can navigate multi-page templates without leaving the builder shell. ✅ Done
- [x] **Preview-Safe Action Interception** — ClickGuard now intercepts all button clicks (not just `type="submit"`), ContactSection skips real `fetch()` in non-live modes, PreviewBanner shows mode label at page top, and PreviewToast flashes on swallowed button clicks. ✅ Done
- [x] **Builder UI Shadcn Standardization** — Refactored builder-sidebar-controls.tsx: PickerButton now uses shadcn Button variant="outline", ChevronIcon uses lucide-react ChevronRight, raw textarea replaced with Textarea component, read-only banner uses Alert+AlertDescription. ✅ Done
- [x] **Blog/CMS Module** — BlogPost Prisma model, dashboard `/blog` list + `/blog/[id]` editor with markdown toolbar, server actions (CRUD + publish/archive), BlogListSection + BlogPostSection in section-registry, blog page slots in all Pro-tier families, tenant-site rendering. ✅ Done
- [x] **SEO & Meta Tags** — Add per-page SEO metadata (title, description, OG image) management in builder; render in tenant-site head. ✅ Done
- [ ] **Mobile App Request Flow** — Define packaging and fulfillment for Pro customers' mobile app requests.
- [ ] **Database Adapter Abstraction** — Add first non-Postgres adapter only when concrete deployment need arises.
- [ ] **Supabase Package Rename** — Decide whether `packages/supabase` should become a general platform-integrations package.

## Next Phase — Customer Tenant Features

- [ ] **Customer Portal Phase 1A Follow-up — Identity Hardening** — Finalize whether customer identity stays company-scoped or becomes global-plus-tenant-bridge, replace temporary email-linking with an explicit relation, and add customer verification/2FA follow-up.
- ✅ **Customer Portal Phase 1C — Offers Workflow** — Offer submission + status tracking live. Staff review workflow deferred.
- [ ] **Customer Portal Phase 2 — Payments + Ownership Records** — Add customer payment records, receipts, due dates, and owned/reserved property visibility.
- [ ] **Customer Portal Phase 3 — Transfer and Sell-Back** — Add transfer and sell-back workflows after payments and ownership records exist.

## Next Phase — Construction Tenant Features

- [ ] **Construction Phase 3A — Project Documents UI** — Ship dashboard UI for project document upload, listing, approval metadata, and customer-share visibility.
- [ ] **Construction Phase 3B — Tenant-Site Customer Project Viewer** — Build read-only `/portal/projects` and `/portal/projects/[id]` using existing project-customer access and customer-safe query helpers.
- [ ] **Construction Phase 4A — Native BOQ Workflow** — Add project-description-to-BOQ drafting and reusable BOQ templates.
- [ ] **Construction Phase 4B — Historical Price Suggestions** — Use past project budget line items to suggest quantities/rates for new BOQ entries.
- [ ] **Construction Phase 4C — Design Ingestion and Evaluation** — Add architectural drawing upload, extraction, and AI-assisted evaluation hooks.
