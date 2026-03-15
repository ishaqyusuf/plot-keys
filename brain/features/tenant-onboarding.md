# Tenant Onboarding

## Purpose
This file documents the tenant account-entry flow from sign-up through onboarding handoff.

## Goal
Guide a new user from account creation to verified access, then into tenant company setup and finally the dashboard, without dropping them into an empty or ambiguous state.

## Implemented End-to-End Flow
1. User signs up.
2. Signup validates the requested tenant subdomain.
3. System creates an unverified owner account and plans verification notifications for email, WhatsApp, and in-app delivery based on the captured contact data.
4. User verifies the account email.
5. System sends post-verification notifications, creates the authenticated session, and restores the reserved onboarding payload.
6. User is routed to onboarding if company setup is incomplete.
7. User reviews the company name and subdomain reserved during signup, then completes market and default template setup.
8. System creates the tenant company, owner membership, default website configuration, and pending tenant-domain records.
9. User lands in the tenant dashboard ready to continue website editing.

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
- `apps/dashboard/src/app/api/session/route.ts` now persists and clears the signed session cookie after successful auth mutations and carries the reserved signup company/subdomain into onboarding through an HTTP-only cookie.
- Signup now captures:
  - company name
  - WhatsApp phone number
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
- Auth notifications now actively trigger:
  - `auth_verification_requested` on signup
  - `auth_email_verified` after successful verification
- `onboarding_reminder` is implemented as a reusable trigger and is ready for scheduled/background execution once reminder timing is introduced.
- Better Auth remains the intended long-term auth runtime, but the current flow is not yet wired through Better Auth adapters or handlers.
- The implemented flow is intended to keep product momentum while the final auth integration is still pending.
- Signup now uses a verification-first handoff and does not persist the dashboard session until verification succeeds.
- The `/verify-email` route is now part of the primary signup path, not just a legacy/manual fallback.

## Current UI Contract
- Sign-up captures:
  - name
  - email
  - password
  - phone number
  - company name
  - subdomain
- Sign-up now previews:
  - `{subdomain}.plotkeys.com`
  - `dashboard.{subdomain}.plotkeys.com`
- Verify-email explains the manual verification fallback contract.
- Onboarding captures:
  - primary market
  - default template
- Onboarding displays the reserved signup payload:
  - company name
  - subdomain
  - website hostname
  - dashboard hostname

## Current Routing Contract
- Unauthenticated users can access sign-up, sign-in, and verify-email.
- Signed-up users must verify first before the dashboard session is persisted.
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
