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
- [ ] **Analytics Expansion** — Extend `/analytics` with 90-day range (Plus+), property-level view counts, traffic source chart (referrer bucketing), and lead source bar chart.
- [x] **Notification Model + Bell + Page** — Add persistent `Notification` model; show unread badge in header; build `/notifications` list page; add `/settings/notifications` preference toggles.
- [x] **Settings Expansion** — Expand `/settings` into tabs: Company Profile, Branding (colours/fonts), Integrations, Notification Preferences, Danger Zone.
- [x] **Customer Model + List + Lead Promotion** — Add `Customer` and `TenantCustomer` Prisma models; build `/customers` list and `/customers/[id]` detail page; add "Convert to customer" action on leads. Plus plan gate.
- [ ] **Employee List + Detail** — Add `Employee`, `Department` Prisma models; build `/hr/employees` list and `/hr/employees/[id]` detail (personal info, employment, linked agent profile, linked dashboard invite). Starter: up to 5; Plus+: unlimited.
- [ ] **Department Management** — Add `/hr/departments` page for creating and managing departments used to organise employees.
- [ ] **Leave Management** — Add `LeaveRequest` model; build leave request submission and approval flow inside HR section. Plus plan gate.
- [ ] **Payroll Record-Keeping** — Add `PayrollEntry` model; build monthly payroll summary table (record-only, no payment processing). Plus plan gate.
- [ ] **Listing Analytics Card** — Show per-property views/leads/appointments and conversion funnel on the property detail page. Uses `AnalyticsEvent`. Plus plan gate.
- [ ] **CSV Export** — Add export actions for leads, appointments, customers, and properties. Plus plan gate.
- [ ] **Agent Performance Analytics** — Extend `/analytics` or `/agents` with per-agent lead count, appointment count, and closed-deal attribution. Plus plan gate.

## Phase 2 — Platform Polish & Engagement

- [x] **Email Template Expansion** — Added `new-lead.tsx` and `site-published.tsx` email templates; created `new_lead_captured` and `site_published` notification type definitions; wired email dispatch in EmailService. ✅ Done (new lead + site published)
- [ ] **Notification Dashboard UI** — Create `/notifications` page showing notification history; allow tenants to configure which events trigger emails.
- [ ] **Tenant Onboarding Improvements** — Allow rerunning template recommendation when core inputs change; add AI bootstrap for hero/intro/CTA copy from onboarding data.
- [ ] **SubmitButton + Form Standardization** — Add shared `SubmitButton` primitive in `packages/ui`; standardize dashboard forms on `useZodForm` + `Controller` pattern.
- [x] **Tenant Domain Status Surfaces** — Inline alerts on dashboard home for failed (destructive) and pending (amber) domains with action buttons. ✅ Done

## Phase 3 — Growth & Monetization

- [ ] **Trigger.dev Job Integration** — Replace custom queue handlers with real Trigger.dev tasks; add retry logic and monitoring for domainSync, planSync, siteContentGeneration, notificationDispatch.
- [ ] **Chat-bot LLM Integration** — Connect chat-bot to Anthropic/OpenAI for tenant-site visitor Q&A; add UI widget for tenant sites.
- [ ] **App Store Expansion** — Add integrations beyond WhatsApp: Google Analytics, Facebook Pixel, Calendly, property listing portals.
- [ ] **AI-Powered Content Generation** — Expand beyond smart-fill: generate full page copy, property descriptions, blog posts from onboarding context.
- [ ] **Template Usage Analytics** — Add usage-count aggregation so tenants can assess template uniqueness before selecting.

## Phase 4 — Scale & Infrastructure

- [ ] **Multi-page Website Support** — Extend WebsiteVersion to support multiple pages (About, Services, Blog) beyond single-page sites.
- [ ] **Blog/CMS Module** — Add blog post model, rich text editor, and blog section rendering for tenant sites.
- [ ] **SEO & Meta Tags** — Add per-page SEO metadata (title, description, OG image) management in builder; render in tenant-site head.
- [ ] **Mobile App Request Flow** — Define packaging and fulfillment for Pro customers' mobile app requests.
- [ ] **Database Adapter Abstraction** — Add first non-Postgres adapter only when concrete deployment need arises.
- [ ] **Supabase Package Rename** — Decide whether `packages/supabase` should become a general platform-integrations package.
