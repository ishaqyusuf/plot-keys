# Customer Portal & Estate Management

## Purpose
This file documents the customer-facing portal that lets end customers of tenant companies manage their properties, interact with listings, make payments, and handle property transactions through the tenant's branded site.

## Product Direction
- Customers are the end users served by tenant companies (buyers, renters, investors).
- Each customer has a single global identity across the platform.
- Each tenant company sees only their own customer relationships.
- The portal is a gated section of the tenant site, not a separate app.
- This feature is gated to Plus tier and above per the pricing plan.

## Core Capabilities

### Customer Authentication
- Customers sign up and log in through the tenant site (not the dashboard).
- Auth flow is separate from staff/dashboard auth.
- A customer who interacts with multiple companies on the platform uses one account.
- Social login and magic link options should be considered alongside email/password.

### Customer Dashboard (Portal Home)
- Overview of owned/reserved properties.
- Recent activity feed (payments, offers, messages).
- Quick actions: browse listings, view saved, make payment.
- Notification center for updates from the company.

### Property Management
- View properties the customer owns or has reserved.
- Track payment schedules and outstanding balances.
- Download property documents (title deeds, receipts, agreements).
- View property status (under construction, completed, handed over).

### Browse & Save Listings
- Browse the company's available listings (already exists on tenant site, but now with auth context).
- Save/favorite listings for later review.
- Compare saved listings side by side.
- Receive alerts when saved listing details change (price drop, status change).

### Offers & Expressions of Interest
- Submit an offer or expression of interest on a listing.
- Track offer status (pending, accepted, rejected, countered).
- Negotiate via counter-offers if enabled by the company.
- Offer history and audit trail.

### Payments
- Make payments for property purchases, reservations, deposits, installments.
- View payment history and receipts.
- Track payment plans and upcoming due dates.
- Multiple payment methods (bank transfer, card, mobile money — dependent on company's payment provider).
- Payment confirmation and receipt generation.

### Property Transfer
- Initiate transfer of owned property to another customer.
- Transfer requires company approval workflow.
- Transfer history and documentation.

### Sell-Back to Company
- Customer can express intent to sell a property back to the tenant company.
- Company reviews and accepts/rejects/negotiates.
- Automated valuation suggestion (future AI feature).
- Transaction record and settlement tracking.

### Communication
- In-portal messaging with assigned agent or company.
- Appointment scheduling for viewings or meetings.
- Document sharing between customer and company.

## Data Model

### Customer (Global)
- Single record per person across the entire platform.
- Holds: email, phone, name, auth credentials, email verification status.
- Not tenant-scoped — shared identity layer.
- Separate from `User` (staff/admin accounts).

### TenantCustomer (Tenant-Scoped Relationship)
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

## Lead-to-Customer Promotion
- Existing `Lead` records can be promoted to `TenantCustomer` when a lead becomes a paying customer.
- Promotion creates a `Customer` (if not already existing by email) and a `TenantCustomer` link.
- Lead history is preserved for attribution and analytics.

## Tenant Dashboard Integration
- Company staff see a "Customers" section in their dashboard.
- Staff can view all TenantCustomer records, filter by status, assigned agent, etc.
- Staff can view customer activity (payments, offers, saved listings).
- Staff can approve/reject offers, transfers, and sell-back requests.
- Staff can assign agents to customers.

## Access Control
- Customers can only see data belonging to the company they are interacting with.
- Customers cannot see other customers' data.
- Company staff can only see their own TenantCustomer records (not other companies').
- Platform admins can see cross-tenant Customer records for support purposes only.

## Phased Delivery

### Phase 1 — Foundation
- Customer and TenantCustomer schema.
- Customer auth flow on tenant site.
- Basic portal with profile and dashboard shell.
- Lead-to-customer promotion in staff dashboard.

### Phase 2 — Listings & Engagement
- Saved listings and favorites.
- Offer submission and tracking.
- Basic in-portal messaging.

### Phase 3 — Payments & Transactions
- Customer payment processing.
- Payment history and receipts.
- Payment plan tracking.

### Phase 4 — Ownership & Transfers
- CustomerProperty ownership records.
- Property transfer workflow.
- Sell-back request flow.
- Document management.

## Open Questions
- Should customer auth share the Better Auth instance (with a role/type flag) or use a completely separate auth system?
- Should the portal be a route group within `apps/tenant-site` (e.g., `/portal/...`) or a separate app?
- What payment providers will be supported initially? (Paystack, Flutterwave, Stripe?)
- Should customers be able to interact with multiple properties from different companies using a single login session, or must they log in per tenant site?
- How does KYC/identity verification fit into the customer model?
