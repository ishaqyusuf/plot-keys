# Database Relationships

## Purpose
This file captures the major entity relationships as they become defined.

## How To Use
- Update when relationship direction, cardinality, or ownership changes.
- Keep this focused on data relationships rather than API flow.

## Relationships
- `Company` has many `Memberships`
- `Company` has one or more `Websites` when dedicated website roots are introduced
- `Company` has many `WebsiteVersions` through `Website`
- `Company` has many `SiteConfigurations`
- `Company` has many `TenantDomains`
- `Company` has many `TenantTemplateLicenses`
- `Company` has many `TenantTemplateConfigs`
- `Company` has many `TenantStockImageLicenses`
- `Company` has many `TenantLogos`
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
- `Membership` has one access role within a company such as `owner`, `admin`, `agent`, or `staff`
- `Membership` also has one normalized `workRole` used for employee persona and default dashboard routing
- `TeamInvite` carries both the invite access role and the intended `workRole`
- `Employee` belongs to `Company` and stores the normalized `workRole` used by HR and invite completion flows
- `SiteConfiguration` belongs to `Company`
- `Website` belongs to `Company`
- `Website` has one active `WebsiteVersion`
- `Website` has one draft `WebsiteVersion`
- `WebsiteVersion` belongs to `Website`
- `WebsiteVersion` has many `PageVersions`
- `PageVersion` belongs to `WebsiteVersion`
- `PageVersion` has many `SectionInstances`
- `TenantDomain` belongs to `Company`
- `TenantTemplateLicense` belongs to `Company`
- `TenantTemplateConfig` belongs to `Company`
- `TenantStockImageLicense` belongs to `Company`
- `TenantLogo` belongs to `Company`
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
- `Template` has many `TemplatePages`
- `TemplatePage` belongs to `Template`
- `TemplatePage` has many `TemplateSections`
- `TemplateSection` belongs to `TemplatePage`
- `Template` has many `TemplatePlanAccess` rules
- `TemplatePurchase` belongs to `Company`
- `TemplatePurchase` belongs to `Template`
- `TenantTemplateLicense` belongs to `Template` or references a stable template key
- `TenantTemplateConfig` belongs to a tenant website aggregate such as `Website` or `SiteConfiguration`
- `WebsiteAssetAssignment` belongs to a tenant website aggregate
- `WebsiteAssetAssignment` may reference `StockImage`, `TenantLogo`, or future asset records
- `StockImagePurchase` belongs to `Company`
- `StockImagePurchase` belongs to `StockImage`
- `TenantStockImageLicense` belongs to `StockImage`
- `SiteConfiguration` is tenant-owned and versioned across drafts and publish states
- `TenantDomain` is tenant-owned and distinguishes between website and dashboard hostname records
- `TenantDomain` is now also the basis for hostname-aware runtime lookup in the public website renderer when a matching host is available

## Open Items
- TODO: Decide whether `AiCreditBalance` is ledger-based or snapshot-based
- TODO: Decide whether `Agent` stays as a separate profile table or is absorbed by membership plus profile fields
- TODO: Decide how property-to-client interest tracking is normalized
- TODO: Decide when platform templates move from code in `packages/section-registry` into relational records
- TODO: Decide whether publish history needs a dedicated table in MVP or can be deferred until after first publish workflow lands
- TODO: Decide whether planned `Website` and `WebsiteVersion` tables replace or wrap the existing `SiteConfiguration` model
- TODO: Extend dashboard runtime routing from preview/query-param lookup to canonical `TenantDomain.hostname` lookup
