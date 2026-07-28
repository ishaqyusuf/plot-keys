# Database Migrations

## Purpose
This file tracks migration conventions and migration milestones.

## How To Use
- Record migration naming and rollout rules once the database stack is chosen.
- Add notable schema milestones as implementation begins.

## Current State
- Prisma 7 schema now lives in the folder-based `packages/db/prisma/` layout, with `schema.prisma` as the main entrypoint.
- Prisma migration history now lives in `packages/db/prisma/migrations/`.
- Prisma CLI config now lives in `packages/db/prisma.config.ts`.
- Drizzle config remains in `packages/db/drizzle.config.ts` for the mirrored Drizzle layer.
- Local Docker Postgres is available through the root `docker-compose.yml`.
- Initial tenancy migration now exists in `packages/db/prisma/migrations/0001_init/migration.sql`.
- Legacy Drizzle-generated migration artifacts still exist in `packages/db/drizzle/` from the earlier setup.
- Root scripts `bun run db:generate` and `bun run db:migrate` now target Prisma generation and Prisma migration execution against the local Docker Postgres URL.
- `packages/db` now exposes provider metadata so the migration and schema boundary stays app-owned even when infrastructure vendors change.

## Planned Conventions

- Use the repository DB push command against the intended database profile for schema readiness checks.
- If profile flags are added to this repo, use `bun run db:push --local` for local checks and `bun run db:push --prod` only for explicitly requested production validation/push after confirming the target database and risk. Do not force data-loss prompts or destructive changes without approval.
- Use Prisma migrations from `packages/db/prisma`.
- If repository root scripts `db:migrate` and `db:push` exist, run `bun db:migrate` and `bun db:push` after Prisma schema/database updates.
- Do not manually create migration files; use the repository scripts and Prisma workflow.
- Keep migration commands aligned with root `package.json` and `packages/db` scripts.
- Keep migrations additive and reviewable.
- Reflect tenant-safety concerns in schema design and indexes.
- Document any destructive migration separately before execution.
- Prefix the first milestone around auth and tenancy tables before domain feature tables.

## Milestones
- Initial tenancy foundation migration captured for `users`, `companies`, and `memberships` plus supporting enums and indexes.
- Soft-delete support added for the tenancy foundation tables, including active-record-only unique indexes for `users.email`, `companies.slug`, and `(memberships.companyId, memberships.userId)`.
- Auth and onboarding support added in `0003_auth_onboarding_and_site_configurations`, including:
  - `users.password_hash`
  - `users.email_verified`
  - `companies.market`
  - `site_configurations`
- Tenant domain support added in `0004_tenant_domains`, including:
  - `TenantDomainKind`
  - `TenantDomainStatus`
  - `tenant_domains`
- User contact support added in `0005_user_phone_number`, including:
  - `users.phone_number`
- Company subscription-tier support added in `0006_company_plan_tiers`, including:
  - `company_plan_tier`
  - `company_plan_status`
  - `companies.plan_tier`
  - `companies.plan_status`
  - `companies.plan_started_at`
  - `companies.plan_ends_at`
- Workforce-role support added in `20260325150000_add_work_roles`, including:
  - `work_role`
  - `memberships.work_role`
  - `team_invites.work_role`
  - `employees.work_role`

## TODO
- Define migration naming convention beyond Drizzle's generated names
- Define seeding strategy for code-backed template defaults and future section library data
- Decide whether platform templates should remain code-backed or move into a Prisma `SiteTemplate` table
- Decide whether template seeds should be Prisma seeds, static bootstrap scripts, or app-owned sync code
- Add the first migration that records provisioning events or domain retry history once Vercel integration is implemented
# QA cleanup schema

- Adds company QA lifecycle fields and global purge-run receipts. Apply both
  `db:migrate` and `db:push` before application/job rollout.
