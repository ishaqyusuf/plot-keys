# Repo Structure

## Purpose
This file defines the intended repository layout for the project.

## How To Use
- Update when top-level app or package boundaries change.
- Keep this aligned with actual repository structure as code is added.

## Structural Constraint
- Project structure must be based on `/Users/M1PRO/Documents/code/_kitchen_sink/midday`.
- Use the same monorepo philosophy: `apps/*` for runnable products and `packages/*` for shared code.
- Do not copy domain-specific business modules from the reference project.
- Upgrade frontend implementation to current Next.js and Tailwind CSS rather than mirroring reference versions.

## Planned Top-Level Layout
```text
apps/
  api/
  dashboard/
  website/
  tenant-site/
packages/
  auth/
  chat-bot/
  db/
  email/
  jobs/
  supabase/
  section-registry/
  tsconfig/
  ui/
  utils/
brain/
```

## Intended Responsibilities
- `apps/dashboard`: Internal multi-tenant product UI
- `apps/website`: Platform marketing site
- `apps/tenant-site`: Structured tenant website rendering
- `apps/api`: Core product APIs and orchestration
- `packages/auth`: Better Auth setup and shared auth helpers
- `packages/chat-bot`: Shared chatbot logic, prompts, UI integration helpers, and tenant-safe assistant flows
- `packages/db`: Shared provider-aware database access, schema, and migrations
- `packages/email`: Shared email templates and delivery utilities
- `packages/jobs`: Trigger.dev jobs when async workflows are introduced
- `packages/supabase`: Optional Supabase-only platform integration helpers
- `packages/tsconfig`: Shared TypeScript base configs
- `packages/ui`: Shared UI library and styling foundation
- `packages/section-registry`: Section schemas and renderer mapping
- `packages/utils`: Shared utilities

## Midday-Inspired Internal Layout
- `apps/api/src/schemas/*`: API request/response Zod schemas and API-owned contract types
- `apps/api/src/routers/*`: tRPC router namespaces that compose schemas, auth checks, and service/query calls
- `packages/db/src/queries/*`: database-facing query and mutation modules grouped by domain
- `apps/dashboard/src/trpc/client.tsx`: browser-side tRPC provider and `useTRPC` access
- `apps/dashboard/src/trpc/server.tsx`: server-side tRPC query options, hydration, and prefetch helpers

## Structural Rules
- Prefer adding a new module under `packages/db/src/queries/*` before writing inline Prisma in an app or router.
- Query modules under `packages/db/src/queries/*` should receive `db` from the caller instead of constructing their own client.
- Prefer adding a schema under `apps/api/src/schemas/*` before defining a new API contract in an app component or shared utility package.
- Keep routers thin; if a procedure is doing substantial data shaping or persistence work, extract that work downward into query or service modules.
- Every frontend app under `apps/*` should maintain a local `DESIGN_SYSTEM.md` describing that app's visual-system rules, with tenant-site documenting template/theming constraints instead of a fixed brand language.

## Later Additions
- Add new packages only when a responsibility cannot live cleanly in the current baseline packages.
- Likely future candidates: dedicated AI, billing, and domain packages.

## Initial Guidance
- Start lean and add packages only when there is real code to own.
- Keep package names aligned with actual responsibilities, not future guesses.
- Do not create `apps/worker` at this stage.
