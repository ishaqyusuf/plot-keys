# PlotKeys

Multi-tenant real-estate SaaS scaffold built as a Bun + Turbo monorepo for PlotKeys.

## Apps
- `apps/api`: Hono + tRPC API
- `apps/dashboard`: authenticated dashboard
- `apps/sandbox`: dedicated template testing and public share previews
- `apps/website`: platform marketing website
- `apps/tenant-site`: tenant website renderer

## Packages
- `packages/auth`
- `packages/chat-bot`
- `packages/db`
- `packages/email`
- `packages/jobs`
- `packages/section-registry`
- `packages/supabase`
- `packages/tsconfig`
- `packages/ui`
- `packages/utils`
- `packages/website-builder`: reusable template preview/rendering runtime

## Local Infrastructure

Plot Keys uses the shared `local-infra-kit` beside this repository for profile-aware environment loading, service startup, filtered port cleanup, and dev routing. A thin root launcher makes the selected root profile authoritative before dispatching to the shared toolkit.

Create the env files you need from `.env.example`:

- `.env.local` for local development
- `.env.remote.local` for hosted development overrides
- `.env.prod` for local production-mode commands

These root files are the only local environment sources. Do not create values in `apps/*/.env*` or `packages/*/.env*`. Hosted deployments continue to use environment variables injected by Vercel, Trigger.dev, or the relevant platform.

The default local database is PostgreSQL 16 in Docker at `127.0.0.1:55432`. Start it with:

```bash
bun run db:start
```

Use `bun run db:generate`, `bun run db:migrate`, and `bun run db:push` for the local profile. Remote and production commands are explicit, for example `bun run db:migrate:remote` and `bun run db:migrate:prod`.

To use a hosted development database, put its `DATABASE_URL` in `.env.remote.local` and start the workspace with `bun run dev --remote`. Local services are skipped when the active database URL is not the managed Docker target.

## Portless Local URLs
PlotKeys supports [Vercel Portless](https://www.npmjs.com/package/portless) for stable named `.localhost` URLs during development.

1. Install the CLI once with `npm install -g portless`
2. Start the full workspace with `bun run dev`
3. Or start a single app with `bun run dev -f dashboard`, `bun run dev -f sandbox`, `bun run dev -f website`, `bun run dev -f tenant-site`, or `bun run dev -f api`
4. Use `bun run dev --remote` for hosted development services, or the explicit `bun run dev --prod` profile when production-profile validation is intended.

Default routes:
- `https://plotkeys.localhost` for the marketing site
- `https://app-plotkeys.localhost` for shared signup and onboarding
- `https://api-plotkeys.localhost` for the API
- `https://tenant-plotkeys.localhost` for the tenant site
- `https://sandbox-plotkeys.localhost` for the dedicated Sandbox app

Tenant subdomains also work through the tenant-site route, so a host like `https://acme.tenant-plotkeys.localhost` maps to the tenant-site app.
Tenant dashboard hosts use `https://dashboard.<tenant>.app-plotkeys.localhost`, for example `https://dashboard.acme.app-plotkeys.localhost`.

If you use Portless locally, update root env vars that still point at hardcoded `localhost:<port>` URLs to the matching named host above.

## Database Architecture
- App code should depend on `@plotkeys/db` for relational access.
- `@plotkeys/db` is provider-aware and currently supports the `postgres` and `supabase-postgres` provider identifiers.
- `packages/supabase` is optional and reserved for Supabase-specific services such as storage or realtime helpers.
