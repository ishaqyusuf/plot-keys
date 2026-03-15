# Database Relationships

## Purpose
This file captures the major entity relationships as they become defined.

## How To Use
- Update when relationship direction, cardinality, or ownership changes.
- Keep this focused on data relationships rather than API flow.

## Relationships
- `Company` has many `Memberships`
- `Company` has many `SiteConfigurations`
- `Company` has many `TenantDomains`
- `Company` has many `Agents`
- `Company` has many `Properties`
- `Company` has many `Clients`
- `Company` has many `Leads`
- `Company` has many `Appointments`
- `Company` has many `WebsitePages`
- `Company` has many `BlogPosts`
- `Company` has many `Payments`
- `Company` has many `Domains`
- `Company` has one or more `AiCreditBalance` records over time or by ledger model

- `User` has many `Memberships`
- `User` may have one global platform role for support-only workflows, but tenant authorization should come from memberships
- `Membership` belongs to `User`
- `Membership` belongs to `Company`
- `Membership` has one role within a company such as `owner`, `admin`, `agent`, or `staff`
- `SiteConfiguration` belongs to `Company`
- `TenantDomain` belongs to `Company`
- `SiteConfiguration` may be created or updated by a `User`
- `Company` should have at most one active `published` `SiteConfiguration` at a time

## Current Implementation State
- `Company -> Membership -> User` is the implemented relational foundation in `packages/db`.
- Membership uniqueness is enforced per `(companyId, userId)`.
- Prisma owns the canonical relation definitions and Drizzle mirrors them for specialist query usage.
- The implemented core tables now support soft delete through nullable `deleted_at` columns; uniqueness applies only to non-deleted records.
- `Company -> SiteConfiguration` is now implemented in Prisma.
- `Company -> TenantDomain` is now implemented in Prisma.
- `User -> SiteConfiguration` creator/updater relations are now implemented in Prisma.
- `User.emailVerified` is the current verification gate for onboarding and dashboard access.
- Feature relationships beyond tenant membership and site configuration are still planned only.

- `Agent` belongs to `Company`
- `Agent` may reference one `User` membership-backed profile
- `Agent` may have many assigned `Properties`
- `Agent` may have many assigned `Leads`
- `Agent` may have many `Appointments`

- `Property` belongs to `Company`
- `Property` has many `PropertyMedia`
- `Property` may have many `Leads`
- `Property` may have many `Appointments`

- `Lead` belongs to `Company`
- `Lead` may belong to `Property`
- `Lead` may be assigned to `Agent`
- `Lead` may be promoted into `Client`

- `Client` belongs to `Company`
- `Client` may reference multiple properties of interest

- `WebsitePage` belongs to `Company`
- `WebsitePage` has many `SectionInstance` records
- `WebsitePage` may reference a `Template`

- `Theme` belongs to `Company`
- `Template` may be platform-owned and reusable across companies
- `SiteConfiguration` is tenant-owned and versioned across drafts and publish states
- `TenantDomain` is tenant-owned and distinguishes between website and dashboard hostname records
- `TenantDomain` is now also the basis for hostname-aware runtime lookup in the public website renderer when a matching host is available

## Open Items
- TODO: Decide whether `AiCreditBalance` is ledger-based or snapshot-based
- TODO: Decide whether `Agent` stays as a separate profile table or is absorbed by membership plus profile fields
- TODO: Decide how property-to-client interest tracking is normalized
- TODO: Decide when platform templates move from code in `packages/section-registry` into relational records
- TODO: Decide whether publish history needs a dedicated table in MVP or can be deferred until after first publish workflow lands
- TODO: Extend dashboard runtime routing from preview/query-param lookup to canonical `TenantDomain.hostname` lookup
