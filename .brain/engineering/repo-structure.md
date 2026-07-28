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
  sandbox/
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
  website-builder/
.brain/
```

## Intended Responsibilities
- `apps/dashboard`: Internal multi-tenant product UI
- `apps/website`: Platform marketing site
- `apps/tenant-site`: Structured tenant website rendering
- `apps/sandbox`: Dedicated platform-admin template testing environment and
  public share preview host
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
- `packages/website-builder`: Framework-compatible preview presentation
  components and pure sandbox normalization/routing helpers

## Midday-Inspired Internal Layout
- `apps/api/src/schemas/*`: API request/response Zod schemas and API-owned contract types
- `apps/api/src/routers/*`: tRPC router namespaces that compose schemas, auth checks, and service/query calls
- `packages/db/src/queries/*`: database-facing query and mutation modules grouped by domain
- `apps/dashboard/src/trpc/client.tsx`: browser-side tRPC provider and `useTRPC` access
- `apps/dashboard/src/trpc/server.tsx`: server-side tRPC query options, hydration, and prefetch helpers
- `apps/sandbox/src/trpc/*`: focused standalone-app tRPC client/server boundary
  backed by `SandboxAppRouter`
- `apps/sandbox/src/app/preview/[shareId]/[[...slug]]`: public catch-all only
  for manifest-declared sandbox preview paths; it must not become a tenant-site
  catch-all
- `apps/dashboard/src/components/tables/core`: shared table primitives and behavior
- `apps/dashboard/src/components/tables/<domain>/columns.tsx`: domain table column definitions
- `apps/dashboard/src/components/tables/<domain>/data-table.tsx`: domain table composition
- `apps/dashboard/src/components/tables/<domain>/table-header.tsx`: domain table header, filters, and actions
- `apps/dashboard/src/components/tables/<domain>/skeleton.tsx`: domain table loading state
- `apps/dashboard/src/components/tables/<domain>/empty-states.tsx`: domain table empty and zero-result states
- `apps/dashboard/src/components/tables/<domain>/bottom-bar.tsx`: optional domain table bottom bar
- `apps/dashboard/src/components/tables/<domain>/action-menu.tsx`: optional row or bulk action menu
- `apps/dashboard/src/components/sheets/global-sheets.tsx`: global sheet registry
- `apps/dashboard/src/components/sheets/global-sheets-provider.tsx`: global sheet provider and state boundary
- `apps/dashboard/src/components/sheets/*`: sheet implementations grouped by domain or workflow
- `apps/dashboard/src/components/forms/*`: domain form implementations
- `apps/dashboard/src/components/onboarding/*`: onboarding flow components
- `apps/dashboard/src/components/sidebar.tsx`: shared sidebar shell when the app uses a standalone sidebar component
- `apps/dashboard/src/components/sign-out.tsx`: shared sign-out control when the app uses a standalone sign-out component
- `apps/dashboard/src/app/[...slug]/page.tsx`: default catch-all redirect route unless an ADR documents explicit route handling instead
- `apps/dashboard/src/app/(sidebar)/layout.tsx`: sidebar route-group layout when using the Midday route-group pattern
- `apps/dashboard/src/app/(sidebar)/error.tsx`: sidebar route-group error boundary when using the Midday route-group pattern

## Structural Rules
- Prefer adding a new module under `packages/db/src/queries/*` before writing inline Prisma in an app or router.
- Query modules under `packages/db/src/queries/*` should receive `db` from the caller instead of constructing their own client.
- Apps may orchestrate shared preview runtime behavior, but one app must never
  import another app. Reusable Builder/Sandbox presentation logic belongs in
  `packages/website-builder`.
- Prefer adding a schema under `apps/api/src/schemas/*` before defining a new API contract in an app component or shared utility package.
- Keep routers thin; if a procedure is doing substantial data shaping or persistence work, extract that work downward into query or service modules.
- Every frontend app under `apps/*` should maintain a local `DESIGN_SYSTEM.md` describing that app's visual-system rules, with tenant-site documenting template/theming constraints instead of a fixed brand language.
- Pages, tables, modals, sheets, forms, onboarding, sidebar, sign-out, and shared dashboard components must follow Midday architecture, file naming, and coding patterns.
- Dashboard tables must follow the `components/tables/core` plus `components/tables/<domain>/*` structure unless an explicit Brain decision documents why the feature diverges.
- Dashboard sheets must follow the global sheets structure under `components/sheets/*`.
- Forms must use Midday validation, error handling, and mutation patterns.
- Data fetching and mutations must use standard Midday tRPC patterns, including invalidation, loading states, errors, and caching behavior.
- Use shadcn standard components and patterns. Never directly modify shadcn source components; create wrapper components for project-specific behavior.
- Tenant-site public pages must use explicit App Router page routes; do not add a public `[...slug]` catch-all unless an ADR documents a narrow exception.

## Later Additions
- Add new packages only when a responsibility cannot live cleanly in the current baseline packages.
- Likely future candidates: dedicated AI, billing, and domain packages.

## Initial Guidance
- Start lean and add packages only when there is real code to own.
- Keep package names aligned with actual responsibilities, not future guesses.
- Do not create `apps/worker` at this stage.
