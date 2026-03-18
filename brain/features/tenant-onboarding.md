# Tenant Onboarding

## Purpose
This file documents the tenant account-entry flow from sign-up through onboarding handoff, including the onboarding data used to generate the first useful website draft.

## Goal
Guide a new user from account creation to verified access, then into a guided onboarding setup that produces a relevant draft website quickly instead of dropping the user into an empty or ambiguous state.

## Product Direction
- Onboarding is the input engine for website generation, template recommendation, default configuration, section visibility, and AI content bootstrapping.
- Onboarding should ask only for information that can be used immediately.
- Onboarding should feel like a guided setup, not a long form.
- Guided choices should be preferred over free text wherever possible.
- The user should land in a working draft website immediately after onboarding.
- The canonical workflow is documented in [brain/workflows/onboarding-flow.md](/Users/M1PRO/Documents/code/plot-keys/brain/workflows/onboarding-flow.md).

## Core Uses Of Onboarding Data
- Build a tenant profile
- Recommend templates
- Select default theme and style settings
- Prefill business and contact information
- Decide which sections to show or hide
- Generate initial AI content
- Create the initial website draft

## Recommended Onboarding Steps
1. Business Identity
2. Market Focus
3. Brand Style
4. Contact and Operations
5. Content Readiness
6. Build tenant profile, recommend templates, select design defaults, generate content, create the draft, and open the editor

## Data To Collect

### Business Identity
- Required:
  - `businessName`
  - `businessType`
  - `primaryGoal`
- Optional:
  - `tagline`
- Example `businessType` values:
  - `agency`
  - `developer`
  - `property_manager`
  - `independent_agent`
  - `luxury_firm`
  - `rental_business`
- Example `primaryGoal` values:
  - `sell`
  - `rent`
  - `both`
  - `generate_leads`
  - `promote_projects`

### Market Focus
- Required:
  - `locations`
  - `propertyTypes`
- Optional:
  - `targetAudience` — **multi-select tag input** (`String[]` in DB)
    - UI: badge-based selector with system suggestions + custom tags
    - Users can pick from predefined suggestions or type custom values
- System-provided `targetAudience` suggestions:
  - `First-time buyers`
  - `Investors`
  - `Diaspora clients`
  - `Luxury buyers`
  - `Mid-market renters`
  - `Commercial tenants`
  - `Families`
  - `Young professionals`
  - `Corporate relocations`
  - `HNW individuals`
- Users may also create custom audience tags

### Brand Style
- Required:
  - `tone`
  - `stylePreference`
- Optional:
  - `preferredColorHint`
- Example `tone` values:
  - `professional`
  - `luxury`
  - `friendly`
  - `modern`
  - `corporate`
- Example `stylePreference` values:
  - `minimal`
  - `bold`
  - `elegant`
  - `corporate`
  - `premium`

### Contact And Operations
- Recommended:
  - `phone`
  - `email`
  - `whatsapp`
  - `officeAddress`
- Optional:
  - `officeLocations`
- Immediate uses:
  - header
  - footer
  - contact page
  - inquiry forms
  - WhatsApp CTA

### Content Readiness
- Required:
  - `hasLogo`
  - `hasListings`
  - `hasExistingContent`
- Optional:
  - `hasAgents`
  - `hasProjects`
  - `hasTestimonials`
  - `hasBlogContent`
- Immediate uses:
  - skip irrelevant setup steps
  - decide whether AI should generate content
  - show or hide sections
  - decide whether demo placeholders should appear

## Derived Tenant Profile Direction
- Onboarding should derive an internal tenant profile instead of asking the user to choose one directly.
- Example profile outputs:
  - `agency_general`
  - `agency_luxury`
  - `developer`
  - `rental_business`
  - `independent_agent`
- Additional derived fields:
  - `complexity`
  - `designIntent`
  - `conversionFocus`
- Example engine contract lives in [brain/code-examples/onboarding-engine.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/onboarding-engine.ts).

## Recommendation And Defaults Contract
- Template scoring should be driven by:
  - `segment`
  - `designIntent`
  - `conversionFocus`
  - `complexity`
- Theme defaults should produce:
  - `selectedFont`
  - `selectedColorSystem`
  - `selectedStylePreset`
- Section visibility should at minimum control:
  - `showAgents`
  - `showProjects`
  - `showTestimonials`
  - `showBlog`
- Example recommendation contract lives in [brain/code-examples/template-recommendation.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/template-recommendation.ts).

## Immediate Generation Outcomes
- Template recommendation
  - rank and recommend the most relevant templates first instead of opening on a giant template grid
- Default design configuration
  - auto-select font, color system, and style preset
- Section visibility
  - hide irrelevant sections such as agents, projects, testimonials, or blog previews when onboarding shows they are not ready
- AI content generation
  - generate hero copy, company intro, CTA text, contact descriptions, section headings, and service blurbs where relevant
- Draft website creation
  - install the selected template into draft mode with default pages, sections, personalized config, contact details, style defaults, and generated starter content

## Workflow Contract
1. Business identity
2. Market focus
3. Brand style
4. Contact and operations
5. Content readiness
6. Tenant profile generation
7. Template recommendation
8. Default config generation
9. AI content bootstrapping
10. Draft website creation
11. Open editor or recommended preview

## State And Rerun Rules
- Onboarding must be resumable.
- Onboarding must save progress step-by-step.
- Onboarding inputs must remain editable later.
- Template recommendation should be repeatable.
- Design defaults should be rerunnable when core identity inputs change.

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
- The current onboarding implementation captures only a small subset of the future generation inputs and should be treated as an MVP bridge.

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
- Current onboarding implementation captures:
  - primary market
  - default template
- Planned onboarding expansion should capture:
  - business identity
  - market focus
  - brand style
  - contact and operations
  - content readiness
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
- User has no listings, no logo, and no existing content, so AI and demo placeholders must still produce a credible first draft.
- User has listings but no agents or projects, so template scoring and section visibility must avoid irrelevant blocks.
- User skips optional contact details, so runtime CTA and contact modules must degrade gracefully.

## Next Backend Work
- Replace the local session and verification helpers with full Better Auth handler and adapter wiring.
- Add real instant verification with OTP or magic code instead of the current local trusted-session shortcut.
- Replace the current dashboard-triggered Vercel sync action with background jobs and durable retry handling.
- Add route middleware once auth/runtime boundaries are finalized.
- Add support for switching between multiple tenant memberships.
- Expand onboarding persistence to store structured generation inputs rather than only market plus template.
- Add tenant-profile derivation logic from onboarding responses.
- Add template recommendation scoring driven by onboarding inputs.
- Add default design selection logic for font, color system, and style preset.
- Add section-visibility rules driven by onboarding content-readiness signals.
- Add first-draft AI generation pipeline that uses onboarding inputs plus derived tenant profile.

## Future Improvements
- Invite-based company joining
- Multi-step onboarding with saved progress
- Owner/team invite step during onboarding
- Progressive enrichment after first draft creation so non-critical questions can be deferred until later
