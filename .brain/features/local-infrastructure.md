# Local Infrastructure

## Status

Implemented on 2026-07-28.

## Purpose

Provide one predictable development entrypoint for Plot Keys, with explicit local, remote-development, and production environment profiles.

## Shared Toolkit Boundary

Plot Keys delegates environment loading, local service startup, filtered port cleanup, and dev command routing to `/Users/M1PRO/Documents/code/local-infra-kit` using the `plotkeys` profile.

Repository scripts should invoke the toolkit directly rather than adding project-local copies of its routers or env loaders.

## Environment Contract

- `.env.local`: local development
- `.env.remote.local`: remote-development overrides loaded over `.env.local`
- `.env.prod`: production
- `DATABASE_URL`: the database URL in every profile
- `PLOTKEYS_ENV_MODE`: derived by the toolkit as `local`, `remote`, or `prod`

The checked-in `.env.example` documents shared ports, URLs, and service variables. Secrets remain in ignored profile files.

## Local Services

- PostgreSQL 16 runs through the root `docker-compose.yml`.
- The managed local URL is `postgresql://postgres:postgres@127.0.0.1:55432/plotkeys`.
- `bun run dev:services:local` starts Postgres and waits for readiness.
- Service startup is skipped when the active `DATABASE_URL` points to an external database.

## Developer Commands

- `bun run dev`: local profile, Portless apps, and managed local services
- `bun run dev --remote`: remote-development env with local database startup skipped for an external URL
- `bun run dev --prod`: explicit production-profile development
- `bun run dev -f dashboard api`: filtered workspace startup and filtered port cleanup
- `bun run db:migrate` / `bun run db:push`: local database profile
- `bun run db:migrate:remote` / `bun run db:push:remote`: remote-development profile
- `bun run db:migrate:prod` / `bun run db:push:prod`: explicit production profile

## Portless Hosts

- Marketing: `plotkeys.localhost`
- Dashboard: `app-plotkeys.localhost`
- API: `api-plotkeys.localhost`
- Tenant site: `tenant-plotkeys.localhost`
- Tenant dashboard: `dashboard.<tenant>.app-plotkeys.localhost`
- Tenant public site: `<tenant>.tenant-plotkeys.localhost`

## Safety Rules

- Production database commands must remain explicit `:prod` scripts.
- Do not run production-profile database commands without confirming the target.
- Add new app ports through a stable `<WORKSPACE_NAME>_PORT` variable so filtered cleanup can derive the matching port from the workspace package name.
- Keep production-mode checks compatible with the toolkit's canonical `prod` value.
