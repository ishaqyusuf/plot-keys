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
- Follow `brain/system/design-system.md` as the source of truth for tokens, primitives, and composition boundaries.
- Standardize validated client forms on the Midday-style React Hook Form stack used in `apps/dashboard`.
- Initialize schema-backed forms with `useZodForm(schema, options)` instead of wiring `zodResolver` inline in app components.
- Use direct `register(...)` bindings for native inputs that already behave like standard form controls.
- Use `Controller` for controlled or third-party inputs that cannot be reliably handled with `register(...)`; a shared wrapper such as `FormField` is acceptable only when it remains a thin layer over `Controller`.
- Route reusable form chrome through shared `packages/ui` primitives instead of recreating labels, messages, and layout per app.
- Prefer a shared `SubmitButton` pattern for submit actions so pending, disabled, and loading-label behavior stays consistent across forms.
- Treat simple non-validated search or filter controls as the exception; user-editable mutation forms should follow the `useZodForm` + `Controller` + shared submit-action pattern by default.

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
- Keep a `.env.example` file in every runnable `apps/*` directory, even if some entries are placeholders for future wiring.
- Add or update `packages/jobs/.env.example` when that package begins using environment variables.
- Shared packages should document required env vars through the consuming app's `.env.example` rather than package-local env files.
