# Backlog

## Purpose
This file holds actionable work that is identified but not currently in progress.

## How To Use
- Add concrete tasks, not vague ideas.
- Move tasks to `in-progress.md` when started.

## Backlog

### Tenant Onboarding (High → Low)

- Add multi-tenant membership switching support (future — defer until second workspace user exists)
- Progressive enrichment: allow skipping non-critical onboarding steps and enriching later from the dashboard

### Section Registry / Website Builder (High → Low)

- Add rich text delta support (V3 content nodes): implement richTextDelta field in section components
- Preview-before-purchase flows and paid unlock handling for locked premium templates
- Free-pick claim tracking per tenant (3 free Plus picks, 3 free Pro picks)
- Wire EditableText/EditableImage primitives into actual section components (HeroBannerSection, StoryGridSection, etc.)

### Auth and Sessions
- Complete server-side Better Auth migration: replace custom signInUser + createBetterAuthSession with auth.api.signInEmail; requires password re-hash migration (current accounts use scrypt on user.passwordHash, Better Auth uses argon2 on account.password)
- Add email verification requirement to Better Auth config (requireEmailVerification: true) to enforce native pre-signin check

### Dashboard Routes
- Property listings CRUD — add "View on website" link once template section is connected to live DB records
- Agent management — add featured/display-order sorting controls

### Platform and Infrastructure
- Choose initial domain provider
- Define Trigger.dev job boundaries for future async work
- Add async Vercel provisioning jobs and retry handling for pending sitefront and dashboard subdomains
- Add tenant domain status surfaces in the dashboard so setup failures do not stay silent
- Add the first true non-Postgres database adapter only when a concrete product or deployment need exists

### Billing and Plans
- Add mobile app request packaging and fulfillment flow for Pro customers
- Add paid template-unlock records and free-pick claim tracking per tenant
