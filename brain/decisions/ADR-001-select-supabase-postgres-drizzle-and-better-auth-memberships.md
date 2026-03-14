# ADR: Select Supabase Postgres, Drizzle ORM, and Better Auth Memberships

## Status

Accepted

## Context

PlotKeys is a multi-tenant SaaS at the initialization stage. The repository already includes placeholder packages for `@plotkeys/auth`, `@plotkeys/db`, and `@plotkeys/supabase`, but the durable database stack, migration workflow, and tenant membership model were still undecided.

The platform needs:
- strong tenant isolation for company-scoped data
- a relational model that supports CRM, listings, billing, domains, and website content
- a database workflow that fits Bun, TypeScript, Hono, and Vercel deployment targets
- Better Auth integration without coupling tenant authorization rules directly to app code

## Decision

PlotKeys will use Supabase Postgres as the primary database vendor and managed Postgres platform.

PlotKeys will use Drizzle ORM in `packages/db` for schema definition, typed queries, and migrations.

Better Auth will remain the authentication layer in `packages/auth`. Tenant access will be modeled with first-party application tables owned in the main database:
- `users`: identity records mapped to Better Auth users
- `companies`: tenant root records
- `memberships`: join table between users and companies
- `sessions` and auth tables managed for Better Auth integration

The initial membership roles are:
- `platform_admin`
- `owner`
- `admin`
- `agent`
- `staff`

Authorization rules will resolve from membership records, not from a single global user role.

`packages/supabase` will be reserved for Supabase-specific integrations such as storage, signed asset access, and optional realtime usage. It will not own the primary auth model.

## Alternatives

- Neon + Drizzle
- Plain Postgres on another managed host
- Prisma instead of Drizzle
- Supabase Auth instead of Better Auth
- Global roles without a company membership join model

## Consequences

Positive outcomes:
- keeps the data model relational and tenant-safe for the product’s core modules
- aligns with the existing `packages/supabase` placeholder without forcing Supabase Auth
- keeps auth and authorization responsibilities separate
- gives the repo a clear migration toolchain and typed schema ownership in `packages/db`

Tradeoffs:
- adds one more integration boundary between Better Auth and application membership records
- requires careful row ownership and query scoping to avoid cross-tenant leakage
- means some Supabase capabilities may stay unused until storage or realtime needs arrive

## Implementation Notes

- `packages/db` should own Drizzle schema files, database client creation, migrations, and seed entrypoints.
- `packages/auth` should expose Better Auth config, auth route wiring, session helpers, and membership-aware helper functions.
- API context should resolve both the authenticated user and the active company membership before tenant-scoped procedures run.
- Use additive migrations and index tenant-owned tables by `companyId`.
- TODO: decide whether Postgres row-level security is enabled in the first delivery or introduced after the application query layer is stable.
