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

## Database Architecture
- App code should depend on `@plotkeys/db` for relational access.
- `@plotkeys/db` is provider-aware and currently supports the `postgres` and `supabase-postgres` provider identifiers.
- `packages/supabase` is optional and reserved for Supabase-specific services such as storage or realtime helpers.
