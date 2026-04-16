# PlotKeys

Multi-tenant real-estate SaaS scaffold built as a Bun + Turbo monorepo for PlotKeys.

## Apps
- `apps/api`: Hono + tRPC API
- `apps/dashboard`: authenticated dashboard
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

## Local Database
1. Start Postgres with `bun run db:up`
2. Generate migrations with `bun run db:generate`
3. Apply migrations with `bun run db:migrate`
4. Use `DATABASE_URL=postgres://postgres:postgres@localhost:5432/plotkeys`
5. Stop it with `bun run db:down`

You can follow container output with `bun run db:logs`.

## Portless Local URLs
PlotKeys supports [Vercel Portless](https://www.npmjs.com/package/portless) for stable named `.localhost` URLs during development.

1. Install the CLI once with `npm install -g portless`
2. Start the full workspace with `bun run dev:portless`
3. Or start a single app with `bun run dev:dashboard:portless`, `bun run dev:website:portless`, `bun run dev:tenant-site:portless`, or `bun run dev:api:portless`

Default routes:
- `http://plotkeys.localhost:1355` for the marketing site
- `http://app.plotkeys.localhost:1355` for shared signup and onboarding
- `http://api.plotkeys.localhost:1355` for the API
- `http://tenant.plotkeys.localhost:1355` for the tenant site

Tenant subdomains also work through the tenant-site route, so a host like `http://acme.tenant.plotkeys.localhost:1355` maps to the tenant-site app.
Tenant dashboard hosts use `http://dashboard.<tenant>.app.plotkeys.localhost:1355`, for example `http://dashboard.acme.app.plotkeys.localhost:1355`.

If you use Portless locally, update app env vars that still point at hardcoded `localhost:<port>` URLs to the matching named host above.

## Database Architecture
- App code should depend on `@plotkeys/db` for relational access.
- `@plotkeys/db` is provider-aware and currently supports the `postgres` and `supabase-postgres` provider identifiers.
- `packages/supabase` is optional and reserved for Supabase-specific services such as storage or realtime helpers.
