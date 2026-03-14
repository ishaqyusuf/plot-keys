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
- Use Trigger.dev for jobs instead of introducing a custom worker app at the start.
- Deploy web surfaces on Vercel.

## Planned App Boundaries
- `apps/dashboard`: Authenticated tenant/admin product UI
- `apps/website`: Platform marketing site and shared public presentation concerns
- `apps/websites`: Tenant website renderer and page delivery
- `apps/api`: Core API and business orchestration

## Planned Shared Package Boundaries
- `packages/auth`: Better Auth configuration and shared auth helpers
- `packages/chat-bot`: Shared chatbot logic, prompts, and tenant-safe integration helpers
- `packages/ui`: Reusable design system primitives and shared styles
- `packages/db`: Schema, migrations, and database access
- `packages/email`: Shared email templates and delivery helpers
- `packages/jobs`: Trigger.dev tasks and shared job helpers
- `packages/supabase`: Shared Supabase client and integration helpers
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
- Cross-cutting provider logic belongs in packages or services, not scattered across apps.

## Deferred Decisions
- Exact database technology
- Exact database access layer details
- Exact Vercel deployment topology for tenant websites
