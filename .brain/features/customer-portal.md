# Customer Portal & Estate Management

## Purpose
This file documents the customer-facing portal that lets end customers of tenant companies manage their properties, interact with listings, make payments, and handle property transactions through the tenant's branded site.

## Current Status
- **Phase 0 / Foundation shell complete** — Central tenant-site portal routes now exist under `/portal/*` for login, signup, dashboard, saved listings, offers, payments, and account pages.
- These routes use a shared branded application shell inside `apps/tenant-site`, and the root tenant layout now suppresses template-family nav/footer on `/portal/*`.
- Public saved-listing links in register-family nav/footer configs now point into `/portal/saved`.
- **Phase 1A / Auth foundation complete** — Portal signup and login now create/use real Better Auth users, issue tenant-scoped customer portal sessions, and protect non-auth `/portal/*` routes behind customer sign-in.
- Portal access currently resolves by matching the authenticated user's email to a company-scoped `Customer` record for the current tenant. Signup creates that customer record when it does not already exist.
- **Phase 1B / Saved listings complete** — Customers can now save listings from public property detail pages after sign-in, and `/portal/dashboard` plus `/portal/saved` now show live saved-listing data.
- Public listing browsing and inquiry are live on the tenant site, but offer tracking, payment tracking, owned-property management, transfer, and sell-back are still deferred.
- The current `Customer` model in code is still company-scoped and staff-managed. The planned global customer identity and tenant-customer bridge model remain future work.
- Customer email verification and 2FA are not part of this first auth slice yet. Customer signup currently auto-verifies email until the portal verification flow is designed.

## Product Direction
- Customers are the end users served by tenant companies (buyers, renters, investors).
- Each customer has a single global identity across the platform.
- Each tenant company sees only their own customer relationships.
- The portal is a gated section of the tenant site, not a separate app.
- Customer auth and account routes should live under a central tenant-site route group such as `/portal/*`, not inside the template page inventory.
- Public marketing and discovery pages can remain template-based, but authenticated customer account pages should use a shared central UI shell that only inherits tenant branding tokens (logo, colours, fonts).
- This feature is gated to Plus tier and above per the pricing plan.

## Page Boundary Decision

### Template-Based Public Pages
- These pages should continue to be driven by the template registry and WebsiteVersion page inventory.
- Examples:
  - `/`
  - `/about`
  - `/contact`
  - `/listings`, `/properties`, `/rentals`, `/portfolio`, `/projects`
  - public property / listing detail pages such as `/listings/[slug]`
  - `/services`, `/agents`, `/blog`, `/areas`, `/faq`
- These pages may differ by family and plan tier, and they should remain a key surface for template differentiation.

### Central Customer Portal Pages
- These pages should not be template-section pages.
- They should use a central application shell inside `apps/tenant-site` with tenant branding applied through shared theme tokens.
- Examples:
  - `/portal/login`
  - `/portal/signup`
  - `/portal/dashboard`
  - `/portal/saved`
  - `/portal/offers`
  - `/portal/payments`
  - `/portal/account/*`
- Templates may link to these routes, but they should not own the page composition or layout logic.

### Listing Overview Direction
- Public listing overview pages should stay template-based because they are part of the tenant's branded marketing and browsing experience.
- However, search/filter/sort/pagination behavior should come from a central data contract so all template families use the same listing query rules.
- In practice this means:
  - templates control page composition, copy, and visual layout
  - central code controls listing data retrieval, filtering, search state, and auth-aware actions such as save / inquire

## Core Capabilities

### Customer Authentication
- Customers sign up and log in through the tenant site (not the staff dashboard).
- The login and signup experiences should be central portal pages, not template pages.
- Auth should share the platform auth infrastructure where practical, but customer session handling and route guards should be distinct from staff/dashboard membership flows.
- A customer who interacts with multiple companies on the platform uses one account.
- Social login and magic link options should be considered alongside email/password.
- Current code status: implemented for the tenant portal foundation using Better Auth users plus tenant-scoped customer-record matching.

### Customer Dashboard (Portal Home)
- Route direction: `/portal/dashboard`
- Overview of owned/reserved properties.
- Recent activity feed (payments, offers, messages).
- Quick actions: browse listings, view saved, make payment.
- Notification center for updates from the company.
- Current code status: authenticated route with real customer-session context plus live saved-listing summary cards. Offers, payments, and ownership widgets remain pending.

### Property Management
- View properties the customer owns or has reserved.
- Track payment schedules and outstanding balances.
- Download property documents (title deeds, receipts, agreements).
- View property status (under construction, completed, handed over).
- Current code status: not implemented.

### Browse & Save Listings
- Browse the company's available listings through template-based public overview pages (for example `/listings`, `/properties`, `/rentals`, `/portfolio`).
- Listing overview pages remain public/template-driven; save/favorite actions can become auth-aware when a customer signs in.
- Save/favorite listings for later review.
- Compare saved listings side by side.
- Receive alerts when saved listing details change (price drop, status change).
- Current code status: public browse is implemented and save/favorite is now implemented from property detail pages into the portal.

### Offers & Expressions of Interest
- Submit an offer or expression of interest on a listing.
- Track offer status (pending, accepted, rejected, countered).
- Negotiate via counter-offers if enabled by the company.
- Offer history and audit trail.
- Current code status: not implemented.

### Payments
- Make payments for property purchases, reservations, deposits, installments.
- View payment history and receipts.
- Track payment plans and upcoming due dates.
- Multiple payment methods (bank transfer, card, mobile money — dependent on company's payment provider).
- Payment confirmation and receipt generation.
- Current code status: not implemented.

### Property Transfer
- Initiate transfer of owned property to another customer.
- Transfer requires company approval workflow.
- Transfer history and documentation.
- Current code status: not implemented.

### Sell-Back to Company
- Customer can express intent to sell a property back to the tenant company.
- Company reviews and accepts/rejects/negotiates.
- Automated valuation suggestion (future AI feature).
- Transaction record and settlement tracking.
- Current code status: not implemented.

### Communication
- In-portal messaging with assigned agent or company.
- Appointment scheduling for viewings or meetings.
- Document sharing between customer and company.
- Current code status: not implemented inside the portal.

## Data Model

### Customer (Current Code)
- One record per company-managed customer contact today.
- Holds: companyId, name, email, phone, notes, status, sourceLeadId.
- Used by tenant staff inside the dashboard and by project customer-access features.
- Does not yet provide customer auth credentials or a global cross-tenant identity.

### TenantCustomer (Planned Target Model)
- Bridges `Customer` ↔ `Company`.
- One record per (customerId, companyId) pair.
- Holds tenant-specific data: status, assigned agent, loyalty tier, notes, preferences.
- Unique constraint on (companyId, customerId).
- This is what tenant staff see and manage in their dashboard.

### Supporting Entities
- `CustomerProperty` — ownership/reservation record linking TenantCustomer to Property.
- `SavedListing` — customer's favorited listings within a tenant.
- `Offer` — expression of interest or formal offer on a property.
- `CustomerPayment` — payment transactions made by a customer.
- `PropertyTransfer` — transfer request and approval records.
- `SellBackRequest` — customer-initiated sell-back proposals.
- Current code status: `SavedListing` is now implemented as a company-scoped customer-to-property relation. Other supporting entities remain pending.

## Lead-to-Customer Promotion
- Existing `Lead` records can be promoted into the current company-scoped `Customer` record.
- Promotion into the planned global-customer-plus-tenant-bridge model remains future work.
- Lead history is preserved for attribution and analytics.

## Tenant Dashboard Integration
- Company staff see a "Customers" section in their dashboard.
- Staff can view current company-scoped `Customer` records and promote leads into customers.
- Staff can grant project visibility to customers and send project notices.
- Staff cannot yet manage portal payments, offers, saved listings, transfers, or sell-back flows because those features are not implemented.

## Access Control
- Customers can only see data belonging to the company they are interacting with.
- Customers cannot see other customers' data.
- Company staff can only see their own TenantCustomer records (not other companies').
- Platform admins can see cross-tenant Customer records for support purposes only.

## Phased Delivery

### Phase 0 — Routing & UX Boundary Planning
- Confirm that public listing overview pages remain template-based.
- Confirm that customer auth and dashboard routes are central `/portal/*` pages in `apps/tenant-site`.
- Define the minimal central portal route map:
  - `/portal/login`
  - `/portal/signup`
  - `/portal/dashboard`
  - `/portal/saved`
  - `/portal/offers`
  - `/portal/account`
- Define the central listing query contract used by all template-based listing overview pages.

### Phase 1 — Customer Identity and Portal Access (Partial)
- Customer auth flow on tenant site.
- Customer session model and route guards for `/portal/*`.
- Decide whether to evolve the current company-scoped `Customer` model or introduce a global identity + tenant bridge.
- Keep lead-to-customer promotion aligned with the chosen identity model.
- Remaining in this phase: customer verification model, stronger account security, and final identity-model direction.

### Phase 2 — Listings & Engagement (In Progress)
- Saved listings and favorites. ✅
- Offer submission and tracking.
- Basic in-portal messaging.
- Wire portal dashboard, saved, and offers pages to live customer data. 🟡 Dashboard/saved complete; offers pending.

### Phase 3 — Payments & Transactions
- Customer payment processing.
- Payment history and receipts.
- Payment plan tracking.
- Portal payments page with provider-backed receipts and due dates.

### Phase 4 — Ownership & Transfers
- CustomerProperty ownership records.
- Property transfer workflow.
- Sell-back request flow.
- Document management.
- Account security features such as verification and 2FA can land here or immediately after Phase 1 depending on auth design.

## Next Phase Breakdown

### Next Phase A — Portal Identity Foundation
- Finalize the customer identity model before layering more customer features on top.
- Replace temporary email-linking with an explicit durable customer-auth relation when the model is ready.
- Add customer verification and stronger account security such as 2FA.

### Next Phase B — Listing Engagement
- Add customer offer submission and offer-status tracking.
- Add customer activity history beyond saved listings.
- Decide whether compare/alerts ship before or after offers.

### Next Phase C — Payments and Ownership
- Add customer payment records, receipts, and payment-plan views.
- Add ownership/reservation records so customers can see properties they own or have reserved.
- Add transfer and sell-back workflow records plus staff review surfaces.

## Open Questions
- Should customer auth share the Better Auth instance with a separate account type / session guard, or should it use a parallel auth adapter built on the same primitives?
- What payment providers will be supported initially? (Paystack, Flutterwave, Stripe?)
- Should customers be able to interact with multiple properties from different companies using a single login session, or must they log in per tenant site?
- How does KYC/identity verification fit into the customer model?
