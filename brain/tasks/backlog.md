# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

## Backlog

### Tenant Onboarding (High → Low)

- Add refresh recommendations button on Launch step wired to refreshOnboardingProfile tRPC procedure
- Add multi-tenant membership switching support (future — defer until second workspace user exists)
- Progressive enrichment: allow skipping non-critical onboarding steps and enriching later from the dashboard

### Section Registry / Website Builder (High → Low)

- Connect page-inventory overrides to section composition so getEnabledSections drives the resolver pipeline
- Add rich text delta support (V3 content nodes): implement richTextDelta field in section components
- Add inline editing primitives: EditableText, EditableRichText, EditableImage, EditableRepeater components
- Build publish confirmation modal and rollback-friendly replacement UX
- Preview-before-purchase flows and paid unlock handling for locked premium templates
- Free-pick claim tracking per tenant (3 free Plus picks, 3 free Pro picks)

### Auth and Sessions
- Migrate the temporary Prisma-backed auth/session implementation onto full Better Auth handlers and adapters

### Onboarding
- Expand onboarding to collect business identity, market focus, brand style, contact details, and content-readiness inputs
- Persist resumable onboarding state with current step, completed steps, and editable input data
- Allow rerunning recommendation and default-config generation when core onboarding inputs change later
- Create the first draft website directly from onboarding completion and open the editor on that draft

### Platform and Infrastructure
- Choose initial domain provider
- Define Hono + tRPC API folder conventions
- Define Trigger.dev job boundaries for future async work
- Add async Vercel provisioning jobs and retry handling for pending sitefront and dashboard subdomains
- Add tenant domain status surfaces in the dashboard so setup failures do not stay silent
- Add the first true non-Postgres database adapter only when a concrete product or deployment need exists

### Billing and Plans
- Add mobile app request packaging and fulfillment flow for Pro customers
- Add paid template-unlock records and free-pick claim tracking per tenant
- Add upgrade/downgrade lifecycle handling that updates Company.planTier and Company.planStatus from the future billing provider
- Create a unified billing line-item model spanning subscriptions, template purchases, stock images, domains, and AI credits

### UI Shared
- Add a shared SubmitButton primitive in packages/ui and standardize dashboard forms on the useZodForm + Controller pattern
