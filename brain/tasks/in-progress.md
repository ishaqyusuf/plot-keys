# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress
- Migrate remaining dashboard server actions for onboarding, builder, and tenant-domain sync onto the new API-owned tRPC mutation pattern
- Move onboarding, builder, and domain Prisma access behind `packages/db/src/queries/*` and place API contracts under `apps/api/src/schemas/*`
- Replace header-based auth scaffolding with Better Auth session verification and adapter wiring
- Connect the first website template to live company and property records beyond company-level tenant content
- Add inline hover editing, click-to-focus preview editing, and publish confirmation UX in the builder
- Move Vercel tenant-domain sync from dashboard server actions into background jobs with durable retries
