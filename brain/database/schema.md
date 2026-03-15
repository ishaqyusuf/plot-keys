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
- `SectionInstance`
- `Domain`
- `AiUsageLog`
- `AiCreditBalance`

## Entity Notes
- `Company`: tenant root entity
- `User`: authenticated platform user aligned to Better Auth identity
- `Membership`: joins a user to a company with role and status
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
- `SectionInstance`: page-level section with type and config
- `Domain`: purchased or connected tenant domain
- `AiUsageLog`: auditable record of AI actions
- `AiCreditBalance`: tenant credit accounting state
- `SiteConfiguration`: tenant-owned draft or published website configuration created from a template key
- `TenantDomain`: tenant-owned hostname record for PlotKeys subdomains and later custom domains

## Status
- Initial schema foundation is implemented in `packages/db` for `Company`, `User`, and `Membership`.
- Auth and website-builder schema is now partially implemented in Prisma for:
  - `users.password_hash`
  - `users.email_verified`
  - `companies.market`
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
- A `SiteTemplate` table is still optional future work, not current schema.

## Current Auth Notes
- `User.passwordHash` is currently used by the local Prisma-backed sign-up and sign-in flow.
- `User.emailVerified` currently gates verification and onboarding access.
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
