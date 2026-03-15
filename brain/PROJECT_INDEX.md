# Project Index

## Applications
- `apps/dashboard`: Implemented Next.js tenant dashboard with working sign-up, sign-in, verify-email, onboarding, builder, and live-preview flows; auth entry now uses a Midday-style `src/trpc/client.tsx` and `src/trpc/server.tsx` split, a dashboard-owned `/api/trpc` route, `use-zod-form`, and a temporary dashboard session bridge route while onboarding/builder/domain mutations still include legacy server-action paths during the ongoing migration.
- `apps/website`: Implemented Next.js marketing site landing page for the platform with hero, feature, workflow, and CTA sections; public `/signup`, `/sign-up`, `/login`, and `/sign-in` routes now hand off to the dashboard auth experience so main-site acquisition links resolve correctly.
- `apps/api`: Implemented Hono + tRPC API with a health router, public auth router (`signUp`, `signIn`, `verifyEmail`), API-owned auth schemas in `src/schemas`, SuperJSON transformer, and CORS setup for the dashboard app.
- `apps/tenant-site`: Implemented Next.js tenant website renderer that now loads published tenant site configurations from Prisma, can resolve by tenant hostname, and falls back to sample content when no live tenant site exists.
- `apps/docs`: Optional future docs app if product or developer documentation becomes public.

## Packages
- `packages/ui`: Implemented shared UI package with global styles and a full Shadcn-derived component set living directly in `src/components`, with each primitive exported through explicit package subpath exports instead of a root barrel file.
- `packages/auth`: Implemented route helpers plus a temporary Prisma-backed auth/session layer for sign-up, sign-in, verification, password hashing, and signed cookie sessions while Better Auth runtime wiring is still pending; browser-safe constants and validation schemas now live behind a shared subpath so client bundles do not import database-backed auth code.
- `packages/app-store`: Implemented a starter provider-client package and now includes a WhatsApp client for Meta Graph API delivery used by notification services.
- `packages/chat-bot`: Implemented starter chatbot types and prompt helper.
- `packages/db`: Implemented provider-aware shared database package with Prisma-owned schema/migrations, Prisma Client, a growing `src/queries` layer for reusable Prisma-backed domain queries, and a mirrored Drizzle query layer; current implemented Prisma models cover `users`, `companies`, `memberships`, `site_configurations`, and `tenant_domains`.
- `packages/email`: Implemented a Midday-aligned React Email package structure with shared email defaults, starter email components, a render helper, and a first welcome email template.
- `packages/jobs`: Implemented starter Trigger.dev-oriented job identifiers package.
- `packages/notifications`: Implemented framework-agnostic notification types with separate file-based definitions under `src/types/`, a typed notification-definition registry, recipient contacts for users/subscribers, an in-memory notification store contract using `notificationType` naming, a GND-style `payload-utils` trigger layer, and service classes for notification triggering plus real Resend/WhatsApp delivery wiring.
- `packages/notifications-react`: Implemented the shared React provider, hooks, and viewport used by the three Next.js apps.
- `packages/supabase`: Implemented optional Supabase env readers, browser/server/admin client factories, and tenant storage helpers.
- `packages/tsconfig`: Implemented shared TypeScript base and Next.js configs.
- `packages/utils`: Implemented shared utility helpers including `cn`, tenant hostname builders, and a Vercel project-domain sync helper.
- `packages/section-registry`: Implemented section registry with a multi-section home-page library, code-backed template catalog, editable field metadata, and tenant content/theme resolution helpers.
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
- `package.json`: Implemented monorepo workspace manifest and root scripts, including fixed-port local dev commands and Portless-powered `dev:portless` entry points for named `.localhost` URLs.
- `docker-compose.yml`: Runs the local Postgres database for development.
- `turbo.json`: Implemented Turbo task pipeline for build, dev, lint, and typecheck.
- `bunfig.toml`: Implemented Bun workspace configuration.
- `tsconfig.json`: Implemented top-level TypeScript entrypoint extending shared config.
- `biome.json`: Implemented linting and formatting rules.
- `bun.lock`: Installed dependency lockfile.
- `brain/system/design-system.md`: Defines the shared design-system foundation and rollout order.
- `apps/api/.env.example`: Documents API runtime variables for local development.
- `apps/dashboard/.env.example`: Documents dashboard app variables, auth secret, and Vercel project-domain provisioning env vars.
- `apps/website/.env.example`: Documents marketing site browser-safe variables.
- `apps/tenant-site/.env.example`: Documents tenant website browser-safe variables.
- `packages/db/prisma/`: Canonical Prisma 7 schema folder for the shared database package, with a main `schema.prisma` plus split domain files.
- `packages/db/prisma.config.ts`: Prisma 7 CLI configuration for schema location, datasource, and migrations.
- `packages/db/drizzle/schema.ts`: Mirrored Drizzle schema for specialist query usage.
- `packages/supabase/src/index.ts`: Implemented optional Supabase runtime helpers for env loading and storage operations.
- `trigger.config.*`: Planned Trigger.dev configuration once jobs are added.

## Notes
- Repository now includes the initial monorepo scaffold plus Brain docs.
- Repo structure should continue to evolve as real business modules are implemented.
- The default shared package baseline should stay close to Midday and include project-required additions: `auth`, `chat-bot`, `db`, `email`, `jobs`, `section-registry`, `supabase`, `tsconfig`, `ui`, `utils`.
- Relational application access should route through `packages/db`; vendor packages stay optional.
- Current auth/runtime note: dashboard auth is working through a local Prisma-backed implementation in `packages/auth`, but full Better Auth adapter and handler wiring remains future work.
- Domain/runtime note: tenant website and dashboard hostnames are stored as Prisma `TenantDomain` records, the dashboard can sync them against Vercel, and the public renderer can resolve by hostname when records exist.
- The notification implementation now follows the GND package anatomy more closely: `index.ts` as the entrypoint, `payload-utils` for trigger builders, `types/` for separate notification definitions, and `services/` for notification triggering plus channel delivery. The current auth and dashboard notification entry points now route through `NotificationService` instead of building domain notifications directly in app code.
