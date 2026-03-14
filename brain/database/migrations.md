# Database Migrations

## Purpose
This file tracks migration conventions and migration milestones.

## How To Use
- Record migration naming and rollout rules once the database stack is chosen.
- Add notable schema milestones as implementation begins.

## Current State
- Drizzle migration config exists in `packages/db/drizzle.config.ts`.
- Local Docker Postgres is available through the root `docker-compose.yml`.
- Initial migration files now exist in `packages/db/drizzle/`.
- Root scripts `bun run db:generate` and `bun run db:migrate` run the shared database package against the local Docker Postgres URL.

## Planned Conventions
- Use Drizzle migrations from `packages/db`.
- Keep migrations additive and reviewable.
- Reflect tenant-safety concerns in schema design and indexes.
- Document any destructive migration separately before execution.
- Prefix the first milestone around auth and tenancy tables before domain feature tables.

## Milestones
- Initial tenancy foundation migration generated for `users`, `companies`, and `memberships` plus supporting enums and indexes.

## TODO
- Define migration naming convention beyond Drizzle's generated names
- Define seeding strategy for templates and section library data
