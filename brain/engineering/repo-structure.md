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
  websites/
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
- `apps/websites`: Structured tenant website rendering
- `apps/api`: Core product APIs and orchestration
- `packages/auth`: Better Auth setup and shared auth helpers
- `packages/chat-bot`: Shared chatbot logic, prompts, UI integration helpers, and tenant-safe assistant flows
- `packages/db`: Shared database access and schema
- `packages/email`: Shared email templates and delivery utilities
- `packages/jobs`: Trigger.dev jobs when async workflows are introduced
- `packages/supabase`: Shared Supabase client and platform integration helpers
- `packages/tsconfig`: Shared TypeScript base configs
- `packages/ui`: Shared UI library and styling foundation
- `packages/section-registry`: Section schemas and renderer mapping
- `packages/utils`: Shared utilities

## Later Additions
- Add new packages only when a responsibility cannot live cleanly in the current baseline packages.
- Likely future candidates: dedicated AI, billing, and domain packages.

## Initial Guidance
- Start lean and add packages only when there is real code to own.
- Keep package names aligned with actual responsibilities, not future guesses.
- Do not create `apps/worker` at this stage.
