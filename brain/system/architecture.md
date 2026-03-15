# Architecture

## Purpose
This file records the intended high-level architecture and boundaries between apps and shared packages.

## How To Use
- Update when app boundaries, service ownership, or major patterns change.
- Add an ADR when introducing a new architectural pattern with long-term impact.

## Initial Architecture Direction
- Use a monorepo inspired by the approved `midday` project.
- Organize runnable apps under `apps/`.
- Organize reusable packages under `packages/`.
- Keep tenant-facing public rendering separate from internal dashboard concerns.
- Follow Midday's Hono + tRPC API style.
- Use Better Auth for authentication.
- Use a provider-based database boundary in `packages/db`.
- Use Prisma in `packages/db/prisma` as the canonical schema and migration boundary.
- Keep Drizzle in `packages/db/drizzle` as a mirrored specialist query layer only when lower-level SQL control is useful.
- Use Trigger.dev for jobs instead of introducing a custom worker app at the start.
- Deploy web surfaces on Vercel.

## Planned App Boundaries
- `apps/dashboard`: Authenticated tenant/admin product UI
- `apps/website`: Platform marketing site and shared public presentation concerns
- `apps/websites`: Tenant website renderer and page delivery
- `apps/api`: Core API and business orchestration

## Planned Shared Package Boundaries
- `packages/auth`: Better Auth configuration and shared auth helpers
- `packages/auth`: Better Auth configuration, route wiring, session helpers, and membership-aware authorization helpers
- `packages/chat-bot`: Shared chatbot logic, prompts, and tenant-safe integration helpers
- `packages/ui`: Reusable design system primitives and shared styles
- `packages/db`: Provider-aware database client creation, Prisma schema and migrations, generated Prisma Client, optional mirrored Drizzle query layer, seed logic, and shared database access
- `packages/email`: Shared React Email templates, starter components, defaults, and rendering helpers
- `packages/jobs`: Trigger.dev tasks and shared job helpers
- `packages/notifications`: Framework-agnostic notification types, typed notification definitions, recipient contacts, and store contracts
- `packages/notifications-react`: React notification provider, hooks, and viewport for web apps
- `packages/supabase`: Optional Supabase-only integrations such as storage helpers and realtime utilities
- `packages/tsconfig`: Shared TypeScript base configs
- `packages/utils`: Shared utilities
- `packages/section-registry`: Website section registry, config schemas, and renderer mappings

## Package Strategy
- Start from the tighter Midday-style shared package baseline plus required project additions: `auth`, `chat-bot`, `db`, `email`, `jobs`, `section-registry`, `supabase`, `tsconfig`, `ui`, `utils`.
- Add dedicated packages for AI, billing, or domains later only when the codebase clearly benefits from the separation.

## Key Rules
- Keep website sections stateless.
- Each section must accept `config` and `theme`.
- Layout generation remains structured rather than freeform.
- Template metadata should define editable versus derived content boundaries.
- Editable website fields should carry both user-facing guidance and AI-generation guidance.
- Cross-cutting provider logic belongs in packages or services, not scattered across apps.
- Application code should depend on `@plotkeys/db` rather than a vendor package for relational queries.

## Current Implementation Notes
- Prisma is the schema and migration owner for the implemented onboarding and site-configuration flows.
- `packages/auth` currently uses a local Prisma-backed auth/session implementation to keep signup and dashboard flows moving.
- Better Auth remains the target auth runtime and should replace the temporary local implementation when adapter wiring is added.
- Platform website templates are currently code-backed in `packages/section-registry`; tenant-owned site configurations are relational records in Prisma.
- Tenant subdomain ownership is now modeled explicitly through Prisma `TenantDomain` records.
- Current hostname direction:
  - public website target: `{subdomain}.plotkeys.com`
  - dashboard target: `dashboard.{subdomain}.plotkeys.com`
- Locale should continue to follow the Midday-style path segment pattern inside each app.
- Vercel domain attachment can now be triggered from the dashboard through a server action that syncs pending or failed tenant domains against the configured Vercel projects.
- Public website rendering can now resolve the tenant by hostname when a matching `TenantDomain` record exists, with slug/query fallback still present for previews and local development.
- Notifications now use a split-package pattern: framework-agnostic models in `packages/notifications` and React hooks/provider rendering in `packages/notifications-react`.
- The notifications core is moving toward the GND pattern by centering typed `notificationType` definitions rather than app-local string usage.

## Deferred Decisions
- Exact Vercel deployment topology for tenant websites and dashboard hostnames
- TODO: Decide whether Postgres RLS is part of the first production hardening pass
- TODO: Decide when a non-Postgres adapter is justified in `packages/db`
