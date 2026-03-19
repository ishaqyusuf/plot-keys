# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

---

## Phase 1 — Core Product Gaps (High Impact)

- [x] **Tenant Domain Management UI** — Created `/domains` dashboard page showing provisioned domains, status (pending/active/error), and manual re-sync button.
- [ ] **Custom Domain Purchase Flow** — Registrar API integration (Namecheap/GoDaddy), domain search, DNS provisioning, SSL, renewal tracking. Large scope.
- [ ] **Property/Agent Data Binding** — Wire live property + agent DB data into template section rendering (PropertyGrid, AgentShowcase) so tenant sites show real listings.
- [ ] **Website/WebsiteVersion Phase 4 Cleanup** — Remove SiteConfiguration as primary model; migrate all reads/writes to WebsiteVersion exclusively; drop legacy fallback paths.
- [x] **Logo Upload Flow** — Built `/settings` dashboard page with company logo upload using Supabase storage via `/api/upload` route; wired `logoUrl` into template header rendering via `resolveWebsitePresentation`.
- [x] **Tenant Dashboard System** — Built persistent sidebar navigation (`DashboardSidebar` + `DashboardShell`) with `(app)` route group layout. Revamped home page with stats strip, quick actions, plan upgrade prompt, and platform feature roadmap grid.

## Phase 2 — Platform Polish & Engagement

- [ ] **Email Template Expansion** — Add transactional emails: new lead notification, appointment confirmation, payment receipt, plan upgrade/downgrade, site published. Currently only Welcome + Verification exist.
- [ ] **Notification Dashboard UI** — Create `/notifications` page showing notification history; allow tenants to configure which events trigger emails.
- [ ] **Tenant Onboarding Improvements** — Allow rerunning template recommendation when core inputs change; add AI bootstrap for hero/intro/CTA copy from onboarding data.
- [ ] **SubmitButton + Form Standardization** — Add shared `SubmitButton` primitive in `packages/ui`; standardize dashboard forms on `useZodForm` + `Controller` pattern.
- [ ] **Tenant Domain Status Surfaces** — Add inline status badges on dashboard home for pending/failed domain provisioning so failures don't stay silent.

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
