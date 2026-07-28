# Local Infrastructure

## Status

Implemented on 2026-07-28.

## Purpose

Provide one predictable development entrypoint for Plot Keys, with explicit local, remote-development, and production environment profiles.

## Shared Toolkit Boundary

Plot Keys delegates environment loading, local service startup, filtered port cleanup, and dev command routing to `/Users/M1PRO/Documents/code/local-infra-kit` using the `plotkeys` profile.

`scripts/local-infra-command.ts` is the only project-owned launcher. It makes the selected root profile authoritative, validates non-local database targets, disables Bun's implicit env preload, and then dispatches to the toolkit. It must not grow project-local copies of the shared routers or service implementation.

## Environment Contract

- `.env.local`: local development
- `.env.remote.local`: remote-development overrides loaded over `.env.local`
- `.env.prod`: local production-mode commands
- `DATABASE_URL`: the database URL in every profile
- `PLOTKEYS_ENV_MODE`: derived by the launcher as `local`, `remote`, or `prod`

The checked-in root `.env.example` is the sole local environment contract. App- and package-local env value files are unsupported. Secrets remain in ignored root profile files, while hosted deployments use platform-injected variables.

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
- Database mutations and interactive tools pass through `scripts/db-command.ts`, which rejects external targets in local mode and managed-local targets in remote or production modes.
- Remote and production database commands require their URL in the matching profile file; they never inherit `DATABASE_URL` from the local profile.
- All toolkit entrypoints use `bun --env-file=/dev/null` so Bun cannot preload an unintended app or root env file.
- Default workspace `dev` scripts inherit `PLOTKEYS_ENV_MODE`; they must not hard-code local mode.
- Turbo forwards the canonical root env contract through its explicit `globalEnv` allowlist.
- Add new app ports through a stable `<WORKSPACE_NAME>_PORT` variable so filtered cleanup can derive the matching port from the workspace package name.
- Keep production-mode checks compatible with the toolkit's canonical `prod` value.
