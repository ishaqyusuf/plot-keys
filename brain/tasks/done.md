# Done

## Purpose
This file records completed work milestones.

## How To Use
- Add concise completion notes with enough context for future readers.

## Done
- Initialized Project Brain for the real-estate SaaS repository
- Scaffolded the Bun + Turbo monorepo with `apps/api`, `apps/dashboard`, `apps/website`, `apps/websites`, and the agreed shared packages
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
- Implemented code-backed platform templates plus tenant draft/publish website builder flow across `apps/dashboard`, `packages/auth`, `packages/section-registry`, and `apps/websites`
- Added subdomain-first signup UX with PlotKeys website and dashboard hostname previews
- Added Prisma `tenant_domains` schema plus onboarding creation of pending `sitefront` and `dashboard` hostname records
- Added dashboard-triggered Vercel tenant-domain sync logic plus hostname-aware public site lookup fallbacking to slug-based preview mode
- Added shared notifications packages with a framework-agnostic core, a React adapter for hooks/providers, and provider wiring across the three web apps
- Extended the notifications core with a typed registry and the first `signup_successful` notification surfaced in the signup-to-onboarding flow
- Reshaped `packages/email` toward the Midday/GND React Email package layout with starter components, defaults, render helper, and a welcome email template
