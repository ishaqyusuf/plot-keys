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
- Use Prisma migrations from `packages/db/prisma`.
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

## TODO
- Define migration naming convention beyond Drizzle's generated names
- Define seeding strategy for code-backed template defaults and future section library data
- Decide whether platform templates should remain code-backed or move into a Prisma `SiteTemplate` table
- Decide whether template seeds should be Prisma seeds, static bootstrap scripts, or app-owned sync code
- Add the first migration that records provisioning events or domain retry history once Vercel integration is implemented
