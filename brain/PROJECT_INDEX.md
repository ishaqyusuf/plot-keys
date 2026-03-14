# Project Index

## Applications
- `apps/dashboard`: Implemented Next.js dashboard shell for internal company workflows.
- `apps/website`: Implemented Next.js marketing site shell for the platform.
- `apps/api`: Implemented Hono + tRPC API scaffold with a health router and query-layer split.
- `apps/websites`: Implemented Next.js tenant website renderer shell backed by the section registry package.
- `apps/docs`: Optional future docs app if product or developer documentation becomes public.

## Packages
- `packages/ui`: Implemented shared UI starter package with global styles and a reusable button primitive.
- `packages/auth`: Implemented Better Auth-oriented shared config plus request header parsing and membership-aware session context helpers.
- `packages/chat-bot`: Implemented starter chatbot types and prompt helper.
- `packages/db`: Implemented Drizzle-based Postgres foundation for `users`, `companies`, and `memberships`, plus shared database client bootstrap and migration config.
- `packages/email`: Implemented starter email payload helpers.
- `packages/jobs`: Implemented starter Trigger.dev-oriented job identifiers package.
- `packages/supabase`: Implemented shared Supabase env readers, browser/server/admin client factories, and tenant storage helpers.
- `packages/tsconfig`: Implemented shared TypeScript base and Next.js configs.
- `packages/utils`: Implemented shared utility helpers including `cn`.
- `packages/section-registry`: Implemented section registry starter with a hero banner section and sample page data.
- `packages/notifications`: TODO: Define when email, SMS, and in-app messaging requirements are implemented.

## Services
- AI generation and credit accounting service
- Domain provider integration service
- Payment provider integrations
- Media storage and delivery service
- Notification delivery service
- Trigger.dev-powered background job execution

## Core Modules
- Multi-tenant company management
- Website generation and structured section rendering
- Property listings and media
- Agent management
- Lead management
- Appointment scheduling
- Client CRM
- Subscription billing and AI credits
- Domain purchase and custom domain connection
- Analytics

## Important Files
- `package.json`: Implemented monorepo workspace manifest and root scripts.
- `docker-compose.yml`: Runs the local Postgres database for development.
- `turbo.json`: Implemented Turbo task pipeline for build, dev, lint, and typecheck.
- `bunfig.toml`: Implemented Bun workspace configuration.
- `tsconfig.json`: Implemented top-level TypeScript entrypoint extending shared config.
- `biome.json`: Implemented linting and formatting rules.
- `bun.lock`: Installed dependency lockfile.
- `brain/system/design-system.md`: Defines the shared design-system foundation and rollout order.
- `apps/api/.env.example`: Documents API runtime variables for local development.
- `apps/dashboard/.env.example`: Documents dashboard app variables and shared platform placeholders.
- `apps/website/.env.example`: Documents marketing site browser-safe variables.
- `apps/websites/.env.example`: Documents tenant website browser-safe variables.
- `packages/db/drizzle.config.ts`: Implemented Drizzle migration configuration for the shared database package.
- `packages/supabase/src/index.ts`: Implemented shared Supabase runtime helpers for env loading and storage operations.
- `trigger.config.*`: Planned Trigger.dev configuration once jobs are added.

## Notes
- Repository now includes the initial monorepo scaffold plus Brain docs.
- Repo structure should continue to evolve as real business modules are implemented.
- The default shared package baseline should stay close to Midday and include project-required additions: `auth`, `chat-bot`, `db`, `email`, `jobs`, `section-registry`, `supabase`, `tsconfig`, `ui`, `utils`.
