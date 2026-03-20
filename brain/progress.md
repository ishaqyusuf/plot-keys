# Progress

## Current State (as of 2026-03-20)

### What's Built & Working
| Area | Status |
|------|--------|
| Onboarding (6 steps, resumable) | ✅ Done |
| Template catalog (45 templates) | ✅ Done |
| Billing/pricing (Paystack, 3 tiers) | ✅ Done |
| Auth (Better Auth, signup/signin) | ✅ Done |
| Builder (inline edit, publish, preview) | ✅ Done |
| Dark mode (ThemeProvider) | ✅ Done |
| Lead capture + dashboard | ✅ Done |
| Appointment scheduling + dashboard | ✅ Done |
| AI credits (ledger, smart-fill wired) | ✅ Done |
| Analytics (events, tracking, dashboard) | ✅ Done |
| Stock image marketplace | ✅ Done |
| Website/WebsiteVersion Phase 1-3 | ✅ Done |
| Section visibility toggles | ✅ Done |
| Domain auto-sync on onboarding | ✅ Done |
| Email (Welcome + Verification) | 🟡 Partial |
| Notifications (event system) | 🟡 Partial |
| Jobs (custom queue, 4 handlers) | 🟡 Partial |
| Property/agent data binding | 🟡 Partial |
| Logo upload | 🟡 Partial |
| Chat-bot | 🟡 Scaffolded |
| App-store (WhatsApp only) | 🟡 Scaffolded |
| Tenant domain management UI | ❌ Not started |
| Custom domain purchase | ❌ Not started |
| WebsiteVersion Phase 4 cleanup | ❌ Not started |

---

## 2026-03-20 (Brain Template Catalog Update)

### Template Catalog Brain Documentation
- Updated `brain/modules/templates-catalog.md`: full per-template record for all 45 templates — description, plan/tier, purchasable flag, default market, accent colour, font pairing, pages, ordered home-page section composition, forms, and primary CTA links.
- Updated `brain/modules/sections-inventory.md`: split into implemented (14 live components) and planned sections. Added type keys, descriptions, form endpoints, and content key references for all implemented sections.
- Updated `brain/modules/pages-inventory.md`: clarified which pages are currently implemented (Home only for all templates), added per-template note about page inventory registry coverage, and retained planned page list.
- Updated `brain/modules/page-to-section-matrix.md`: added full per-template home page section matrix for all 45 templates in render order.

---

## Roadmap Steps 10-21 Completion

### Step 10: Auto domain sync on onboarding
- Added `grantTemplateLicense()` and `runInBackground(domainSyncHandler)` calls after `createCompanyOnboardingBundle` in `completeOnboarding` mutation
- Both non-blocking — domain sync failures are caught silently

### Step 13: Hostname middleware
- Verified already complete via `proxy.ts` pattern in both dashboard and tenant-site
- `resolveTenantByHostname()` handles DB lookup with slug fallback

### Step 16: Auto-grant free template license
- Added `grantTemplateLicense()` call in `completeOnboarding` mutation
- Grants the selected template as a free pick during onboarding

### Step 17: Section visibility toggles
- Added `visibleSections?: Record<string, boolean>` to `TemplateConfig` type
- Updated serialize/deserialize/applyConfigUpdate helpers
- Added `SectionVisibilityToggles` component with Switch toggles in builder sidebar
- Updated `BuilderPreviewPanel` to filter sections by visibility
- Wired `sectionTypes` and `visibleSections` through builder page.tsx and drawer
- Added visibility filtering to tenant-site public rendering

### Step 18: Website/WebsiteVersion dual-write (Phase 2)
- Updated `createCompanyOnboardingBundle` to create Website + WebsiteVersion in transaction
- Updated all SiteConfiguration CRUD to mirror changes to draft WebsiteVersion
- Converted `publishSiteConfiguration` from batch to interactive transaction for dual-write publish

### Step 20: Lead capture
- Created Prisma model: `lead.prisma` (enum + model with status tracking)
- Created query functions: createLead, listLeadsForCompany, countLeadsByStatus, updateLeadStatus, findLeadById
- Updated tenant-site contact endpoint to persist leads to database
- Added tRPC procedures: listLeads, getLeadStats, updateLeadStatus
- Added server action: updateLeadStatusAction
- Created dashboard page: `/leads` with status filtering, stats bar, status progression buttons

### Step 21: Unified billing (Paystack)
- Created Paystack API client wrapper (`packages/utils/src/paystack.ts`): transaction init, verify, plan CRUD, subscription management, webhook signature verification (HMAC-SHA512)
- Created webhook endpoint (`apps/dashboard/src/app/api/webhooks/paystack/route.ts`): handles charge.success, subscription.create, subscription.disable, invoice.payment_failed events; verifies signature; updates plans and template licenses
- Added tRPC procedures: `getBillingInfo` (plan status + billing history), `initializeCheckout` (create Paystack transaction + pending billing line item)
- Created billing dashboard page (`/billing`): current plan display, monthly/annual toggle, plan comparison cards with upgrade buttons, billing history
- Created checkout callback page (`/billing/callback`): handles Paystack redirect after payment
- Added `initializeCheckoutAction` server action: calls tRPC initializeCheckout and redirects to Paystack authorization URL

## 2026-03-19 (Session 2 — High-Impact Features)

### Better Auth Migration
- Refactored `signUpUser()` to use `auth.api.signUpEmail()` instead of manual Prisma user creation
- Refactored `signInUser()` to use `auth.api.signInEmail()` instead of manual bcrypt comparison
- Removed unused `verifyPasswordHash()` and `compare` import

### Appointment Scheduling
- Created `appointment.prisma` model with AppointmentStatus enum (scheduled/completed/cancelled/no_show)
- Built CRUD queries in `packages/db/src/queries/appointments.ts`
- Added 5 tRPC procedures: listAppointments, getAppointmentStats, createAppointment, updateAppointmentStatus, deleteAppointment
- Created `/appointments` dashboard page with create form, status filtering, management actions
- Added server actions: createAppointmentAction, updateAppointmentStatusAction, deleteAppointmentAction

### Website/WebsiteVersion Phase 3 Read Cutover
- Added `resolveActiveDraftForCompany()` and `resolvePublishedForCompany()` read helpers
- Both prefer WebsiteVersion, fall back to SiteConfiguration for pre-migration companies
- Updated tenant-site page.tsx to use `resolvePublishedForCompany()`

### Stock Image Marketplace
- Created `stock-image-license.prisma` model with unique constraint on companyId+imageId
- Built grant/check/list query functions
- Added listStockImageLicenses + purchaseStockImage tRPC procedures with billing line item creation

### AI Credit Tracking
- Created `ai-credits.prisma` with AiUsageLog and AiCreditLedger models (ledger pattern)
- Built query functions: getAiCreditBalance, hasEnoughCredits, grantAiCredits, deductAiCredits, logAiUsage, getAiUsageStats
- Wired credit deduction + usage logging into smartFillField tRPC mutation
- Added getAiCreditInfo + purchaseAiCredits tRPC procedures
- Created `/ai-credits` dashboard page with balance display, usage breakdown, top-up button

### Analytics Foundations
- Created `analytics.prisma` AnalyticsEvent model with company/type/date indexes
- Built recordAnalyticsEvent, getAnalyticsSummary, getPageViewsByDay query functions
- Created tenant-site `/api/track` endpoint with privacy-safe visitor fingerprinting (SHA-256 of IP+UA)
- Added getAnalytics tRPC procedure
- Created `/analytics` dashboard page with stat cards, event type breakdown, page view bar chart, recent events

- Enhanced Builder Preview page (`/builder/preview`) with:
  - **Sidebar layout**: Added persistent builder config sidebar (hidden below xl breakpoint) with template selector, style presets, color systems, and preview info
  - **Dark mode toggle**: Integrated `ThemeToggle` component in preview header for light/dark mode switching
  - **Compact template picker**: Simplified template selection UI with tier tabs and smooth transitions (compact inline display in header, full sidebar picker on desktop)
  - **Responsive design**: Mobile-friendly template picker dropdown in header, desktop sidebar with comprehensive preview controls
  - **Design tokens**: Used shadcn design tokens throughout (semantic colors, spacing, rounded corners) for consistent visual hierarchy
  - Grid layout matches main builder page structure (2-column on xl: sidebar + content)
  - Style presets and color systems displayed as interactive grid previews in sidebar

## 2026-03-18
- Added `/builder/preview` client-side testing page for previewing all templates without DB.
  - Template cycling via back/next buttons and dropdown with tabbed tier selector.
  - Local publish checkbox state per template.
  - Renders sections using `sectionComponents` registry and `resolveWebsitePresentation`.
- Compacted `BuilderSidebarControls` spacing (py-3→py-2, gap-5→gap-3).
- Further compacted builder setup across desktop sidebar and mobile drawer.
  - Reduced builder shell width, outer padding, section gaps, and metadata card padding in `apps/dashboard/src/app/builder/page.tsx` and `apps/dashboard/src/components/builder/builder-sidebar-drawer.tsx`.
  - Tightened picker button padding, template rows, tab spacing, and image slot input spacing in `apps/dashboard/src/components/builder/builder-sidebar-controls.tsx`.
  - Restored optional `namedImageSlots` on `TemplateDefinition` in `packages/section-registry/src/index.ts` so builder image controls remain correctly typed.
- Made builder page sidebar responsive: hidden below `xl`, replaced with Sheet-based drawer (`BuilderSidebarDrawer`) triggered by Settings2 icon.
- Updated auth password hashing in `packages/auth/src/index.ts` to use `bcrypt-ts` (`hash`/`compare`) instead of local scrypt-based helpers.
- Added `bcrypt-ts` dependency in `packages/auth/package.json`.
- Verified no file-level TypeScript errors in `packages/auth/src/index.ts`.
- Note: workspace `packages/auth` typecheck still reports pre-existing DB query typing errors in `packages/db/src/queries/agent.ts` and `packages/db/src/queries/property.ts`.
- Fixed sign-in redirect loop where authenticated users were bounced from onboarding back to sign-in by aligning all session cookie reads/writes to `plotkeys.session_token` (`authSessionCookieName`) across dashboard middleware/session utilities, dashboard server actions, and API auth redirect resolution.
- Fixed NEXT_REDIRECT error in all dashboard server actions: moved `redirect()` calls outside `try/catch` blocks so Next.js redirect throws are no longer caught and re-thrown as error redirects.

## Section Registry Expansion
- Added 3 new section components to `extended-sections.tsx`: HeroSearchSection, WhyChooseUsSection, ServiceHighlightsSection.
- Registered all 5 new section types (FAQ, Newsletter, HeroSearch, WhyChooseUs, ServiceHighlights) in section builders, component registry, and union types in `index.ts`.
- Added 15 new template definitions (template-31 through template-45) with unique themes, content, and tier assignments.
- Created page inventory compositions for templates 31-45 in `page-inventory.ts` with reusable slot definitions.

## Dark Mode Support
- Added `dark:` variant Tailwind classes to all hardcoded color references in `home-page.tsx` section components: Eyebrow, Surface, ActionButton, HeroBannerSection, MarketStatsSection, StoryGridSection, ListingSpotlightSection, TestimonialStripSection.
- CtaBandSection left unchanged (already dark-on-dark gradient).
- Added dark variants for ContactForm error state in `extended-sections.tsx`.
- Other extended sections already use CSS variables (`--foreground`, `--muted-foreground`, etc.) that auto-adapt via `@custom-variant dark` in globals.css.
- TypeScript compilation verified clean.

## Inline Edit Fix
- Root cause: `BuilderPreviewPanel` rendered sections without `WebsiteRuntimeProvider`, so `EditableText` components could not detect draft mode via `useIsDraftMode()` hook.
- Fix: Wrapped the section rendering container with `<WebsiteRuntimeProvider renderMode="draft">` in `builder-preview-panel.tsx`.
- This enables the amber ring editing affordances and contentEditable behavior on text fields within sections when viewed in the builder.
