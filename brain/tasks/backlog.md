# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

## Backlog
- Define exact pricing amounts, billing intervals, and upgrade/downgrade rules for Starter, Plus, and Pro
- Implement template entitlement rules for starter, plus, and pro templates including free picks and paid unlocks
- Define mobile app request packaging and fulfillment flow for Pro customers
- Choose initial domain provider
- Replace header-based auth scaffolding with Better Auth session verification and adapter wiring
- Define Hono + tRPC API folder conventions
- Define Trigger.dev job boundaries for future async work
- Connect the first website template to live property, agent, and company-profile records
- Migrate the temporary Prisma-backed auth/session implementation onto full Better Auth handlers and adapters
- Decide whether platform templates stay code-backed or move into a Prisma `SiteTemplate` table
- Seed or sync default platform templates such as `template-1`, `template-2`, and `template-3`
- Add template metadata for tier, preview media, marketing description, and purchase eligibility
- Add usage-count aggregation for template cards so tenants can assess template uniqueness
- Add upgrade/downgrade lifecycle handling that updates `Company.planTier` and `Company.planStatus` from the future billing provider
- Add paid template-unlock records and free-pick claim tracking per tenant
- Build inline editor hover states, focus mapping, and sidebar field controls
- Replace the current smart-fill placeholder with model-backed AI generation using `shortDetail` and `longDetail`
- Build publish confirmation modal and rollback-friendly replacement UX
- Add runtime host resolution that reads tenant website and dashboard hosts from `tenant_domains`
- Add async Vercel provisioning jobs and retry handling for pending `sitefront` and `dashboard` subdomains
- Add tenant domain status surfaces in the dashboard so setup failures do not stay silent
- Add middleware-based hostname resolution for dashboard and public site instead of relying on preview query params
- Implement app-wide dark mode support in `packages/ui` and the Next.js apps using a shared token strategy
- Add a shared `SubmitButton` primitive in `packages/ui` and standardize dashboard forms on the `useZodForm` + `Controller` pattern documented from the Midday reference
- Decide whether `packages/supabase` should be renamed to a more general platform-integrations package once non-Supabase adapters exist
- Add the first true non-Postgres database adapter only when a concrete product or deployment need exists
