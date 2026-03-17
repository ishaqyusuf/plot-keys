# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

## Backlog
- Define exact pricing amounts, billing intervals, and upgrade/downgrade rules for Starter, Plus, and Pro
- Implement template entitlement rules for starter, plus, and pro templates including free picks and paid unlocks
- Create durable tenant template license records with sources `free`, `plan_included`, `purchased`, and `admin_granted`
- Define mobile app request packaging and fulfillment flow for Pro customers
- Choose initial domain provider
- Replace header-based auth scaffolding with Better Auth session verification and adapter wiring
- Define Hono + tRPC API folder conventions
- Define Trigger.dev job boundaries for future async work
- Expand onboarding to collect business identity, market focus, brand style, contact details, and content-readiness inputs
- Persist resumable onboarding state with current step, completed steps, and editable input data
- Generate and store the onboarding business summary after step 1
- Add derived tenant-profile generation from onboarding responses
- Add template recommendation scoring based on onboarding inputs and tenant-profile inference
- Add fallback template selection and premium-upgrade suggestion rules to recommendation results
- Add onboarding-driven default design selection for font, color system, and style preset
- Add onboarding-driven page composition rule selection
- Add onboarding-driven section visibility rules for agents, projects, blog preview, testimonials, and similar modules
- Add onboarding-driven AI bootstrap generation for hero, intro, CTA, contact copy, and section headings
- Create the first draft website directly from onboarding completion and open the editor on that draft
- Allow rerunning recommendation and default-config generation when core onboarding inputs change later
- Expand the code-backed template catalog from the current starter set toward the documented 30-template plan catalog
- Define page inventory ownership and section-matrix overrides for templates
- Connect the first website template to live property, agent, and company-profile records
- Migrate the temporary Prisma-backed auth/session implementation onto full Better Auth handlers and adapters
- Decide whether platform templates stay code-backed or move into a Prisma `SiteTemplate` table
- Seed or sync default platform templates such as `template-1`, `template-2`, and `template-3`
- Add template metadata for tier, preview media, marketing description, and purchase eligibility
- Add usage-count aggregation for template cards so tenants can assess template uniqueness
- Design the migration path from `SiteConfiguration` to a dedicated `Website` plus `WebsiteVersion` model, or explicitly defer it
- Add page-version and section-instance persistence if the richer website version graph is adopted
- Define tenant runtime context shape and hooks for live, draft, preview-token, and host-based rendering
- Add a public runtime API split for site config, content/data, and safe actions
- Add a form action registry for contact, inquiry, newsletter, and similar public actions
- Add mode-aware draft rendering behavior for placeholders, hidden outlines, and inline validation
- Add controlled template config storage for selected font, color system, style preset, and named image assignments
- Add internal font-fallback resolution for special UI slots without exposing raw typography complexity to users
- Add upgrade/downgrade lifecycle handling that updates `Company.planTier` and `Company.planStatus` from the future billing provider
- Add paid template-unlock records and free-pick claim tracking per tenant
- Add stock-image catalog, licensing, and watermark-safe preview behavior
- Add tenant logo asset storage and AI-assisted logo generation workflow
- Build inline editor hover states, focus mapping, and sidebar field controls
- Replace the current smart-fill placeholder with model-backed AI generation using `shortDetail` and `longDetail`
- Evolve editable strings toward structured content nodes with AI metadata where section schemas benefit from it
- Build publish confirmation modal and rollback-friendly replacement UX
- Create a unified billing line-item model spanning subscriptions, template purchases, stock images, domains, and AI credits
- Add runtime host resolution that reads tenant website and dashboard hosts from `tenant_domains`
- Add async Vercel provisioning jobs and retry handling for pending `sitefront` and `dashboard` subdomains
- Add tenant domain status surfaces in the dashboard so setup failures do not stay silent
- Add middleware-based hostname resolution for dashboard and public site instead of relying on preview query params
- Implement app-wide dark mode support in `packages/ui` and the Next.js apps using a shared token strategy
- Add a shared `SubmitButton` primitive in `packages/ui` and standardize dashboard forms on the `useZodForm` + `Controller` pattern documented from the Midday reference
- Decide whether `packages/supabase` should be renamed to a more general platform-integrations package once non-Supabase adapters exist
- Add the first true non-Postgres database adapter only when a concrete product or deployment need exists
