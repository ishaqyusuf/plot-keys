# ADR-010: Reuse Better Auth For Customer Portal Foundation

## Status
Accepted

## Context
The tenant-site customer portal moved from placeholder pages to a real authenticated experience in Phase 1A. The repository already had:

- Better Auth-backed `User`, `Session`, `Account`, and `Verification` tables
- working staff/dashboard session creation and cookie handling
- company-scoped `Customer` records used by dashboard CRM and project-customer visibility

The unresolved product question was whether customer identity should immediately become a separate global customer-auth system or whether the first portal-auth slice should reuse the existing auth foundation.

## Decision
For the initial customer portal auth foundation, reuse the existing Better Auth `User` + `Session` stack and link portal access to the current tenant by matching the authenticated user's email to a `Customer` record in the current company.

Implementation shape:

- customer portal signup creates a Better Auth user
- signup also creates a company-scoped `Customer` record when one does not already exist for that tenant/email
- portal sign-in uses the same Better Auth password flow as staff auth
- tenant-site resolves portal access by requiring both:
  - a valid Better Auth session
  - a matching `Customer` record for the current company
- tenant-site stores the session in a tenant-scoped Better Auth cookie name derived from the tenant slug so the existing session resolver can read it cleanly

## Consequences

### Positive
- Ships real customer auth quickly without introducing a second auth provider or bespoke session format
- Reuses existing security-sensitive session creation and validation logic
- Keeps portal auth aligned with the existing multi-tenant cookie strategy
- Lets tenant-site route guards and account pages become real immediately

### Negative
- Customer identity is still not modeled as the final global-customer-plus-tenant-bridge design
- Portal access currently depends on email matching between `User` and `Customer`
- Customer signup currently auto-verifies email for this foundation phase, which is acceptable as a temporary implementation but not the final verification model

## Follow-Up
- Introduce the long-term customer identity model when the product is ready for cross-tenant customer access
- Add customer email verification and stronger account-security flows such as 2FA
- Replace email-linking with an explicit durable relation once the customer identity model is finalized
