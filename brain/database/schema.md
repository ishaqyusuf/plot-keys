# Database Schema

## Purpose
This file tracks the current and planned core entities.

## How To Use
- Update when tables or major fields become concrete.
- Mark uncertain items as `Planned` or `TODO`.

## Core Entities
- `Company`
- `User`
- `Membership`
- `TenantOnboarding`
- `TenantProfile`
- `Website`
- `WebsiteVersion`
- `PageVersion`
- `SiteConfiguration`
- `TenantDomain`
- `Agent`
- `Property`
- `PropertyMedia`
- `Lead`
- `Client`
- `Appointment`
- `WebsitePage`
- `BlogPost`
- `Payment`
- `Theme`
- `Template`
- `TemplatePlanAccess`
- `TemplatePurchase`
- `TenantTemplateLicense`
- `TenantTemplateConfig`
- `SectionInstance`
- `TemplatePage`
- `TemplateSection`
- `Domain`
- `StockImage`
- `TenantStockImageLicense`
- `WebsiteAssetAssignment`
- `TenantLogo`
- `GeneratedLogoAsset`
- `ColorSystem`
- `StylePreset`
- `BillingLineItem`
- `Invoice`
- `Subscription`
- `StockImagePurchase`
- `AiCreditPurchase`
- `AiUsageLog`
- `AiCreditBalance`

## Entity Notes
- `Company`: tenant root entity
- `User`: authenticated platform user aligned to Better Auth identity
- `Membership`: joins a user to a company with role and status
- `TenantOnboarding`: planned persisted onboarding input and step-progress record
- `TenantProfile`: planned derived profile used for recommendation and default generation
- `Website`: planned tenant website root that can own active and draft version pointers
- `WebsiteVersion`: planned website snapshot boundary for draft/live state
- `PageVersion`: planned page record inside a website version
- `Agent`: role-specific company member or profile
- `Property`: listing record owned by a company
- `PropertyMedia`: media assets attached to a property
- `Lead`: inbound interest tied to a property and possibly an agent
- `Client`: CRM entity for deal progression
- `Appointment`: scheduled viewing or meeting
- `WebsitePage`: structured page container for sections when tenant-managed pages become relational records
- `BlogPost`: CMS content for tenant websites
- `Payment`: subscriptions, reservations, service fees, or credit purchases
- `Theme`: tenant website visual configuration
- `Template`: predefined structured website layout owned by the platform
- `TemplatePlanAccess`: plan-based access and pricing rules for templates
- `TemplatePurchase`: payment-backed template purchase record
- `TenantTemplateLicense`: tenant entitlement record for free, included, purchased, or admin-granted template access
- `TenantTemplateConfig`: controlled tenant selections for font, color system, style preset, and named images
- `SectionInstance`: page-level section with type and config
- `TemplatePage`: reusable page blueprint within a template
- `TemplateSection`: reusable section blueprint within a template page
- `Domain`: purchased or connected tenant domain
- `StockImage`: catalog asset usable in templates or websites
- `TenantStockImageLicense`: tenant entitlement for stock-image usage
- `WebsiteAssetAssignment`: asset mapped into a named template slot
- `TenantLogo`: uploaded tenant logo variant
- `GeneratedLogoAsset`: AI-generated logo candidate or derivative
- `ColorSystem`: named token palette for template config mode
- `StylePreset`: named spacing, density, and radius preset for template config mode
- `BillingLineItem`: unified billable item for subscriptions, templates, assets, domains, or credits
- `Invoice`: grouped billing record
- `Subscription`: recurring plan state
- `StockImagePurchase`: payment-backed stock-image purchase record
- `AiCreditPurchase`: payment-backed AI credit purchase record
- `AiUsageLog`: auditable record of AI actions
- `AiCreditBalance`: tenant credit accounting state
- `SiteConfiguration`: tenant-owned draft or published website configuration created from a template key
- `TenantDomain`: tenant-owned hostname record for PlotKeys subdomains and later custom domains

## Status
- Initial schema foundation is implemented in `packages/db` for `Company`, `User`, and `Membership`.
- Auth and website-builder schema is now partially implemented in Prisma for:
  - `users.password_hash`
  - `users.email_verified`
  - `users.phone_number`
  - `companies.market`
  - `companies.plan_tier`
  - `companies.plan_status`
  - `companies.plan_started_at`
  - `companies.plan_ends_at`
  - `site_configurations`
  - `tenant_domains`
- Canonical schema owner: Prisma in `packages/db/prisma/schema.prisma`.
- Mirrored query schema: Drizzle in `packages/db/drizzle/schema.ts`.
- Chosen stack: provider-based `packages/db` with Prisma migrations and Postgres-compatible providers first.
- Current provider identifiers: `postgres` and `supabase-postgres`.
- Implemented soft-delete support with nullable `deletedAt`/`deleted_at` columns on the current core tables.
- Better Auth-owned runtime tables are not implemented yet.

## Implemented Website Builder Schema
- `SiteConfiguration`
  - Purpose: tenant-owned draft or published website setup created from a platform template key
  - Implemented fields:
    - `id`
    - `companyId`
    - `templateKey`
    - `name`
    - `status` with values `draft`, `published`, `archived`
    - `subdomain`
    - `themeJson`
    - `contentJson`
    - `version`
    - `publishedAt`
    - `createdById`
    - `updatedById`
    - `createdAt`
    - `updatedAt`

## Implemented Company Plan Schema
- `Company`
  - Purpose: tenant root record plus the current subscription tier used for entitlement checks
  - Implemented fields:
    - `id`
    - `slug`
    - `name`
    - `market`
    - `planTier` with values `starter`, `plus`, `pro`
    - `planStatus` with values `active`, `past_due`, `canceled`
    - `planStartedAt`
    - `planEndsAt`
    - `isActive`
    - `createdAt`
    - `updatedAt`
  - Current behavior:
    - onboarding creates new companies on the `starter` tier with `active` status
    - builder template access now resolves from `Company.planTier`

## Implemented Tenant Domain Schema
- `TenantDomain`
  - Purpose: track tenant website and dashboard hostnames independently from the site configuration records
  - Implemented fields:
    - `id`
    - `companyId`
    - `kind`
    - `status`
    - `hostname`
    - `subdomainLabel`
    - `apexDomain`
    - `vercelProjectKey`
    - `vercelDomainName`
    - `verificationJson`
    - `lastError`
    - `provisionedAt`
    - `createdAt`
    - `updatedAt`
  - Current implemented enum values:
    - `kind`: `sitefront_subdomain`, `dashboard_subdomain`, `sitefront_custom_domain`, `dashboard_custom_domain`
    - `status`: `pending`, `provisioning`, `active`, `failed`, `detached`

## Current Template Ownership
- Platform template definitions are currently stored in code inside `packages/section-registry`.
- The code-backed template catalog currently includes:
  - `template-1`
  - `template-2`
  - `template-3`
- Each code-backed template now includes tier metadata so builder access can be enforced against the tenant company plan.
- A `SiteTemplate` table is still optional future work, not current schema.

## Planned Template Management Entities
- `TenantOnboarding`
  - Purpose: persist step-by-step onboarding inputs and resumable progress
  - Planned fields:
    - `companyId` or pre-company reserved identity key
    - `currentStep`
    - `completedStepsJson`
    - `inputJson`
    - `businessSummary`
    - `isCompleted`
    - `lastCompletedAt`
- `TenantProfile`
  - Purpose: store derived onboarding outputs that can be reused for recommendations and reruns
  - Planned fields:
    - `companyId`
    - `segment`
    - `complexity`
    - `designIntent`
    - `conversionFocus`
    - `generatedFromOnboardingAt`
- `Website`
  - Purpose: dedicated tenant website root that can separate draft and live version pointers from template installation history
  - Planned fields:
    - `id`
    - `companyId`
    - `activeVersionId`
    - `draftVersionId`
    - `status`
- `WebsiteVersion`
  - Purpose: immutable or append-only snapshot boundary for draft/live website state
  - Planned fields:
    - `id`
    - `websiteId`
    - `mode` with values such as `draft` and `live`
    - `versionNumber`
    - `createdAt`
    - `publishedAt`
- `PageVersion`
  - Purpose: page record attached to a website version
  - Planned fields:
    - `id`
    - `websiteVersionId`
    - `slug`
    - `title`
    - `seoJson`
    - `order`
- `SectionInstance`
  - Planned expansion:
    - `pageVersionId`
    - `type`
    - `order`
    - `isVisible`
    - `configJson`
    - `dataBindingJson`
- `TenantTemplateLicense`
  - Purpose: durable access record for template use
  - Planned fields:
    - `companyId`
    - `templateId` or `templateKey`
    - `source` with values such as `free`, `plan_included`, `purchased`, `admin_granted`
    - `grantedAt`
    - `expiresAt` if needed
- `TenantTemplateConfig`
  - Purpose: controlled template selections instead of raw token editing
  - Planned fields:
    - `companyId`
    - `websiteId` or `siteConfigurationId`
    - `selectedFont`
    - `selectedColorSystem`
    - `selectedStylePreset`
    - `imagesJson`
    - optional `pageCompositionRulesJson`
- `StockImage` and `TenantStockImageLicense`
  - Purpose: stock-media catalog plus tenant entitlement tracking
- `WebsiteAssetAssignment`
  - Purpose: assign licensed or free assets into named template image slots
- `TenantLogo` and `GeneratedLogoAsset`
  - Purpose: support uploaded and AI-assisted brand asset workflows
- `BillingLineItem`, `Invoice`, `Subscription`, `StockImagePurchase`, `AiCreditPurchase`
  - Purpose: unify billing across subscriptions, template purchases, stock assets, domains, and AI credits

## Current Auth Notes
- `User.passwordHash` is currently used by the local Prisma-backed sign-up and sign-in flow.
- `User.emailVerified` currently gates verification and onboarding access.
- `User.phoneNumber` is now captured during signup so notification recipients can support WhatsApp delivery planning.
- This is an implementation bridge until Better Auth adapter tables and runtime wiring are added.

## Current Domain Notes
- Signup currently validates the requested PlotKeys subdomain before onboarding.
- On onboarding completion, the system creates pending tenant-domain records for:
  - `{subdomain}.plotkeys.com`
  - `dashboard.{subdomain}.plotkeys.com`
- Dashboard now includes a sync action that attempts Vercel project-domain attachment for pending, failed, or provisioning tenant domains.
- `verificationJson` now stores Vercel verification challenges when a hostname is attached but not yet fully active.

## Recommended JSON Ownership
- `themeJson` should hold tenant theme overrides such as brand colors, fonts, and style tokens.
- `contentJson` should hold tenant-editable content keyed by stable `contentKey` paths.
- Content derived from operational tables such as listings, agents, or company profile should not be duplicated into editable JSON.

## Recommended Editable Field Metadata Shape
- Each editable template field should include:
  - `contentKey`
  - `label`
  - `fieldType`
  - `shortDetail`
  - `longDetail`
  - optional `preferredLength`
  - optional `placeholder`
  - optional `aiEnabled`
- `shortDetail` is the concise note shown to the tenant in the editor.
- `longDetail` is the richer instruction used when AI is asked to generate content for that field.

## Planned Editable Content Node Direction
- Richer section configs may evolve from flat string fields toward content-node objects with:
  - `key`
  - `type`
  - `value`
  - optional `description`
  - optional `minLength`
  - optional `maxLength`
  - optional `aiEnabled`
