# Tenant Onboarding

## Purpose
This file documents the tenant account-entry flow from sign-up through onboarding handoff.

## Goal
Guide a new user from account creation to verified access, then into tenant company setup and finally the dashboard, without dropping them into an empty or ambiguous state.

## Implemented End-to-End Flow
1. User signs up.
2. Signup validates the requested tenant subdomain.
3. System creates an authenticated session immediately for the owner account.
4. System checks onboarding completion state.
5. User is routed to onboarding if company setup is incomplete.
6. User completes company name, subdomain, market, and default template setup.
7. System creates the tenant company, owner membership, default website configuration, and pending tenant-domain records.
8. User lands in the tenant dashboard ready to continue website editing.

## Current Implementation
- `apps/dashboard` now includes working routes for:
  - `/sign-up`
  - `/sign-in`
  - `/verify-email`
  - `/onboarding`
  - `/builder`
  - `/live`
- `apps/dashboard/src/app/actions.ts` now persists sign-up, sign-in, email verification, onboarding, builder edits, draft creation, and publish actions through Prisma.
- Auth entry pages now use client-side `use-zod-form` forms backed by tRPC auth mutations, while onboarding and builder flows still use server actions for now.
- `apps/api` now owns the implemented auth mutations for sign-up, sign-in, and verify-email.
- `apps/dashboard` now mounts the shared app router through a same-origin `/api/trpc` route and uses a Midday-style `src/trpc/client.tsx` and `src/trpc/server.tsx` split.
- `apps/dashboard/src/app/api/session/route.ts` now persists and clears the signed session cookie after successful auth mutations.
- Signup now captures:
  - company name
  - tenant subdomain
  - website hostname preview
  - dashboard hostname preview
- `apps/dashboard/src/lib/session.ts` now reads the signed session cookie and enforces:
  - authenticated access
  - onboarding completion before dashboard access
- `packages/auth` now contains:
  - route constants
  - password hashing and verification helpers
  - signed session-token helpers
  - email verification token helpers
  - Prisma-backed sign-up, sign-in, and verification helpers
- Onboarding now creates:
  - company
  - owner membership
  - default tenant site configuration
  - pending `sitefront` and `dashboard` tenant domain records
- Dashboard home now routes an onboarded tenant into the website builder flow instead of leaving them on a placeholder workspace.
- Dashboard home now shows tenant hostname records and exposes a sync action for Vercel provisioning or refresh.

## Current Implementation Notes
- The auth/session layer is currently a local Prisma-backed implementation inside `packages/auth`.
- Auth business logic for sign-up, sign-in, and verify-email now flows through `apps/api` tRPC procedures instead of dashboard server actions.
- Better Auth remains the intended long-term auth runtime, but the current flow is not yet wired through Better Auth adapters or handlers.
- The implemented flow is intended to keep product momentum while the final auth integration is still pending.
- Signup currently uses an instant verified-session handoff for the primary path instead of forcing the user through the verification screen first.
- The `/verify-email` route remains available as a legacy/manual verification path.

## Current UI Contract
- Sign-up captures:
  - name
  - email
  - password
  - company name
  - subdomain
- Sign-up now previews:
  - `{subdomain}.plotkeys.com`
  - `dashboard.{subdomain}.plotkeys.com`
- Verify-email explains the manual verification fallback contract.
- Onboarding captures:
  - company name
  - subdomain
  - primary market
  - default template

## Current Routing Contract
- Unauthenticated users can access sign-up, sign-in, and verify-email.
- Signed-in users created through the primary signup flow are marked verified immediately and continue into onboarding.
- Signed-in users without `emailVerified` are redirected toward verification.
- Signed-in users without an active company membership are redirected to onboarding.
- Signed-in users with onboarding complete can access dashboard, builder, and live preview routes.

## Permissions
- Unauthenticated users may access sign-up, sign-in, and verify-email routes.
- Verified users without completed onboarding should be routed to onboarding.
- Verified users with onboarding complete should be routed to the dashboard.

## Edge Cases
- Email verified but no company created yet.
- User belongs to multiple companies in the future.
- Subdomain already taken.
- Verification link expires before onboarding begins.

## Next Backend Work
- Replace the local session and verification helpers with full Better Auth handler and adapter wiring.
- Add real instant verification with OTP or magic code instead of the current local trusted-session shortcut.
- Replace the current dashboard-triggered Vercel sync action with background jobs and durable retry handling.
- Add route middleware once auth/runtime boundaries are finalized.
- Add support for switching between multiple tenant memberships.

## Future Improvements
- Invite-based company joining
- Multi-step onboarding with saved progress
- Owner/team invite step during onboarding
