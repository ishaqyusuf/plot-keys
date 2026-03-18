# Done

## Purpose
This file records completed work milestones.

## How To Use
- Add concise completion notes with enough context for future readers.

## Done
- Initialized Project Brain for the real-estate SaaS repository
- Scaffolded the Bun + Turbo monorepo with `apps/api`, `apps/dashboard`, `apps/website`, `apps/tenant-site`, and the agreed shared packages
- Added validated starter configs for Next.js, Tailwind CSS, Hono + tRPC, Biome, and shared TypeScript setup
- Chose Supabase Postgres + Drizzle as the database foundation and documented the Better Auth membership model in ADR-001
- Scaffolded the first Drizzle-backed database package and membership-aware API request context
- Expanded the Supabase package with env-safe client factories and tenant storage helpers
- Added app-level `.env.example` documentation and aligned the repo convention for future env files
- Added `.env.example` files to every current app directory for a uniform setup convention
- Added Docker-based local Postgres setup and root database lifecycle scripts
- Generated the initial Drizzle migration for the tenancy foundation tables in `packages/db`
- Added a dedicated Brain design-system foundation document
- Introduced a provider-based database boundary in `packages/db` so app code is no longer architecturally tied to Supabase
- Replaced the platform website shell with a polished SaaS landing page in `apps/website`
- Defined the first canonical UI token contract and starter shared primitives in `packages/ui`
- Implemented the first structured tenant website template and expanded section library in `packages/section-registry`
- Replaced the dashboard placeholder page with an MVP-oriented onboarding and roadmap workspace
- Restructured `packages/db` so Prisma owns schema and migrations while Drizzle remains available for specialist queries
- Added starter dashboard routes for sign-up, sign-in, verify-email, and onboarding to begin the tenant entry flow
- Implemented Prisma-backed tenant signup, verification, onboarding, session cookies, and dashboard route guards
- Added Prisma schema and migration support for onboarding fields and tenant `site_configurations`
- Implemented code-backed platform templates plus tenant draft/publish website builder flow across `apps/dashboard`, `packages/auth`, `packages/section-registry`, and `apps/tenant-site`
- Added subdomain-first signup UX with PlotKeys website and dashboard hostname previews
- Added Prisma `tenant_domains` schema plus onboarding creation of pending `sitefront` and `dashboard` hostname records
- Added dashboard-triggered Vercel tenant-domain sync logic plus hostname-aware public site lookup fallbacking to slug-based preview mode
- Added shared notifications packages with a framework-agnostic core, a React adapter for hooks/providers, and provider wiring across the three web apps
- Extended the notifications core with a typed registry and the first `signup_successful` notification surfaced in the signup-to-onboarding flow
- Reshaped `packages/email` toward the Midday/GND React Email package layout with starter components, defaults, render helper, and a welcome email template
- Moved sign-up, sign-in, and verify-email into `apps/api` tRPC mutations, added a Midday-style dashboard `client.tsx`/`server.tsx` tRPC setup with a same-origin `/api/trpc` route, added `use-zod-form`, and introduced a temporary session bridge route for auth cookie persistence
- Started the Midday-style backend structure by moving auth API contracts into `apps/api/src/schemas` and creating the first reusable Prisma-backed query modules under `packages/db/src/queries`
- Added GND-style channel planning to the notifications core for `email`, `whatsapp`, and `in_app`, introduced the first verification-email template, and changed signup into a verification-first flow that routes through `/verify-email` before session persistence
- Extended signup to capture and store the owner phone number, added Prisma support for `users.phone_number`, and made auth verification notifications WhatsApp-eligible through shared recipient contacts
- Reworked `packages/notifications` toward the GND notification structure with `payload-utils`, a `NotificationService` trigger layer in `services/`, and auth notification triggering migrated onto the new service-oriented API
- Wired the notification services to real channel senders using Resend-compatible email delivery and a new `packages/app-store` WhatsApp client, and documented the required API env vars
- Activated the remaining discussed auth notification types by triggering `auth_email_verified` after verify-email and adding a reusable `onboarding_reminder` notification trigger alongside the existing signup verification flow
- Moved notification definitions into separate files under `packages/notifications/src/types` and replaced the remaining direct dashboard notification creation with `NotificationService` usage so domain notifications now consistently flow through the service layer
- Added tenant subscription-tier support on `Company`, introduced shared plan-entitlement helpers, tagged code-backed templates with Starter/Plus/Pro tiers, restricted onboarding to Starter templates, and enforced builder draft creation through server-side template access checks
- Moved onboarding, builder, and tenant-domain mutation orchestration into API-owned `workspace` tRPC procedures, added dedicated API transport schemas under `apps/api/src/schemas/workspace.schema.ts`, extracted reusable Prisma-backed onboarding/site-configuration/tenant-domain query helpers into `packages/db/src/queries/*`, and reduced dashboard server actions to cookie/redirect wrappers
- Replaced header-based auth scaffolding with Better Auth session verification and adapter wiring: added Better Auth Prisma models (`Session`, `Account`, `Verification`), configured `betterAuth()` with Prisma adapter and email/password support in `packages/auth/src/better-auth.ts`, replaced `resolveSessionFromHeaders` with `getAppSessionFromBetterAuth` in the API context, added the Better Auth route handler in `apps/api/src/index.ts`, updated all auth actions to create Better Auth sessions via `createBetterAuthSession`, and migrated sign-up to create Better Auth `Account` credential records alongside users
- Connected the first website template to live property records: added `Property` and `Agent` Prisma models with company relations, added `listFeaturedProperties` and `listAgentsForCompany` queries in `packages/db/src/queries/`, updated `resolveWebsitePresentation` in the section-registry to accept `liveListings?: LiveListingItem[]`, and updated the tenant-site page to load and pass featured properties to the template renderer
- Added inline hover editing, click-to-focus section editing, and publish confirmation UX in the builder: created `BuilderPreviewPanel` client component with per-section click-to-focus and inline `FieldEditor` sub-components with save and AI-fill actions, created `PublishConfirmationDialog` with name editing before publish, and replaced the static builder preview with the new interactive panel
- Moved Vercel tenant-domain sync from synchronous request-path execution into background jobs with durable exponential-backoff retries: added `runWithRetry` and `runInBackground` queue helpers to `packages/jobs`, extracted `domainSyncHandler` with per-domain error isolation, and updated the `syncTenantDomains` workspace mutation to queue the job instead of blocking the request
- Added resumable onboarding persistence: introduced `TenantOnboarding` Prisma model (`tenant_onboardings` table) with `companyName`, `subdomain`, `market`, `templateKey`, `currentStep`, and `completedAt`; sign-up now calls `upsertTenantOnboarding` immediately after user creation so company identity is durable from the start; the onboarding page loads saved state from the DB and pre-fills market and template (showing "Resume and finish" when in-progress values exist); `completeOnboardingAction` reads DB as source of truth and falls back to cookie for pre-migration accounts; `completeOnboarding` workspace procedure uses the saved record and marks it complete; new `saveOnboardingProgress` and `getOnboardingState` procedures let the dashboard persist partial progress on each step
