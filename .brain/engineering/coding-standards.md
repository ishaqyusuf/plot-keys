# Coding Standards

## Purpose
This file defines implementation guardrails for the repository.

## How To Use
- Read before coding.
- Update when conventions become explicit through implementation.

## General Rules
- Keep modules small and composable.
- Prefer shared packages over copy-paste across apps.
- Avoid introducing speculative abstractions too early.
- Use clear schema validation around external input and AI output.
- Follow the Midday-style backend layering:
  - `apps/api/src/schemas/*` owns API-facing Zod schemas and contract types
  - `packages/db/src/queries/*` owns reusable Prisma-backed query and mutation helpers
  - `apps/api/src/routers/*` should stay thin and orchestrate schemas, auth checks, and query/service calls
- Do not leave Prisma queries inline inside app pages, route handlers, or tRPC procedures when the logic can live in `packages/db/src/queries/*`.
- Query helpers must accept the database instance explicitly, for example `findUserByEmail(db, email)`, rather than creating or reading the client internally.
- Do not place API transport schemas in `packages/auth`, `packages/utils`, or UI components unless the contract is truly shared outside the API layer.

## Frontend Rules
- Base design system and project structure on the approved `midday` reference project.
- Use the latest stable Next.js and Tailwind CSS versions at setup time.
- Prefer a shared `packages/ui` package over app-local component duplication.
- Default new product UI and shared primitives to semantic tokens that can support both light and dark mode; document any intentional exceptions.
- Do not use raw palette utilities or hardcoded color values in app pages when a semantic token exists; prefer `background`, `card`, `foreground`, `muted-foreground`, `border`, `primary`, `accent`, `destructive`, and token-derived opacity/gradient treatments.
- Keep section renderer components stateless and predictable.
- Follow `.brain/system/design-system.md` as the source of truth for tokens, primitives, and composition boundaries.
- Standardize validated client forms on the Midday-style React Hook Form stack used in `apps/dashboard`.
- Initialize schema-backed forms with `useZodForm(schema, options)` instead of wiring `zodResolver` inline in app components.
- Use direct `register(...)` bindings for native inputs that already behave like standard form controls.
- Use `Controller` for controlled or third-party inputs that cannot be reliably handled with `register(...)`; a shared wrapper such as `FormField` is acceptable only when it remains a thin layer over `Controller`.
- Route reusable form chrome through shared `packages/ui` primitives instead of recreating labels, messages, and layout per app.
- Prefer a shared `SubmitButton` pattern for submit actions so pending, disabled, and loading-label behavior stays consistent across forms.
- Treat simple non-validated search or filter controls as the exception; user-editable mutation forms should follow the `useZodForm` + `Controller` + shared submit-action pattern by default.
- Every new dashboard form must support one-click dev quick fill so QA, onboarding demos, and manual regression testing do not depend on repetitive typing.
- Form-specific quick-fill behavior must be declared explicitly rather than inferred from field names; implement pure fill logic in `apps/dashboard/src/lib/quick-fill.ts` and bind forms through the standard `apps/dashboard/src/components/quick-fill.tsx` component.
- Dashboard mutation forms should use `useZodForm(...)` as the standard form state layer so quick fill can update values through `form.reset(...)` and `form.setValue(...)` instead of DOM selectors or query-based field discovery.
- Quick fill must not rely on `querySelector`, hidden DOM probing, or click automation for field population. Use the form instance as the source of truth.
- Generic fallback quick fill is acceptable only as a temporary stopgap while a new form is being introduced; new forms should ship with their own stable profile before the work is considered complete.

## Local QA And Dev Commands

- Root `.env.local`, `.env.remote.local`, and `.env.prod` are the only local environment sources. Do not add values to app- or package-local env files.
- Invoke shared local-infra entrypoints through `bun --env-file=/dev/null` so Bun cannot preload a different profile before root mode resolution.
- Default workspace `dev` and `with-env` scripts must inherit `PLOTKEYS_ENV_MODE`; use an explicit `--mode` only for commands whose name is explicitly local, remote, or production.
- Document new environment variables in the root `.env.example` and add them to Turbo's `globalEnv` allowlist.
- Hosted apps use platform-injected environment variables; `.env.prod` is for local production-mode commands and must remain ignored.
- Website/dashboard QA should start the local web stack with `bun run dev --local --filter dashboard tenant-site` when those apps are in scope. Add API or other app filters only when the QA slice needs them.
- Website QA must use Portless hostnames instead of raw localhost ports:
  - tenant public site: `<tenant>.tenant-plotkeys.localhost`
  - tenant dashboard: `dashboard.<tenant>.app-plotkeys.localhost`
- Use raw localhost ports only for low-level debugging when Portless itself is the suspected failure.
- For schema readiness checks, use the repository DB push command against the intended profile. If profile flags are added to this repo, use `bun run db:push --local` for local checks and `bun run db:push --prod` only for explicitly requested production validation.
- Do not run production-profile DB commands unless the task explicitly calls for production validation and the target database is confirmed.

## Midday Architecture Standards
- Midday is the primary implementation standard for pages, tables, modals, sheets, sidebar, forms, onboarding, layouts, tRPC calls, loading states, error states, and caching patterns.
- Pages, tables, modals, sheets, forms, onboarding, sidebar, sign-out, and shared dashboard components must follow Midday architecture, file naming, and coding patterns.
- Tables should use the Midday table layout:
  - `components/tables/core`
  - `components/tables/<domain>/columns.tsx`
  - `components/tables/<domain>/data-table.tsx`
  - `components/tables/<domain>/table-header.tsx`
  - `components/tables/<domain>/skeleton.tsx`
  - `components/tables/<domain>/empty-states.tsx`
  - `components/tables/<domain>/bottom-bar.tsx` when needed
  - `components/tables/<domain>/action-menu.tsx` when needed
- Sheets should use the Midday global sheet pattern:
  - `components/sheets/global-sheets.tsx`
  - `components/sheets/global-sheets-provider.tsx`
  - `components/sheets/...`
- Forms must follow Midday validation, error handling, and mutation patterns.
- Data fetching and mutations must use standard Midday tRPC patterns, including invalidation, loading states, errors, and caching behavior.
- Loading states should be implemented with domain-specific skeletons and stable layout dimensions instead of ad hoc spinners in page bodies.
- Error states should be explicit, recoverable where possible, and colocated with the interaction or data surface that failed.
- Use shadcn standard components and patterns. Never directly modify shadcn source components; create wrapper components for project-specific behavior.
- Use GND as the reference for the standard notification package system.
- Use After Service as the reference for local URL handling, portless/proxy support, root env mode loading, and generated app links.
- Prisma schema changes must be followed by root `bun db:migrate` and `bun db:push` when those scripts exist. Do not manually create migration files.

## Multi-Tenant Rules
- Scope tenant data explicitly in every app and service boundary.
- Prevent tenant-specific content leakage across rendering or caching layers.
- Model custom domains and subdomains as tenant-level concerns.

## AI Rules
- Route all AI feature calls through a centralized service.
- Validate structured outputs before storing or rendering them.
- Track usage for billing and analytics.

## Documentation Rules
- Update Brain docs after meaningful implementation changes.
- Create ADRs for durable architectural choices.
- Keep the root `.env.example` as the canonical contract for every app and runtime package.
- Do not add app- or package-local env examples; group new variables by subsystem in the root example.

<!-- personal-coding-rules:start -->
## Global Personal Coding Rules

Agents must treat these global coding rule references as non-negotiable:

- `/Users/M1PRO/.me/coding-standards/global.md`
- `/Users/M1PRO/.me/coding-standards/nextjs.md`

Project-specific exceptions require an ADR in `.brain/decisions/` before agents may diverge.
<!-- personal-coding-rules:end -->
