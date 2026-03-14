# Database Schema

## Purpose
This file tracks the current and planned core entities.

## How To Use
- Update when tables or major fields become concrete.
- Mark uncertain items as `Planned` or `TODO`.

## Planned Core Entities
- `Company`
- `User`
- `Membership`
- `SiteTemplate`
- `SiteConfiguration`
- `SiteConfigurationPublishEvent`
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
- `SiteTemplate`: platform-defined website preset with section structure and metadata
- `SiteConfiguration`: tenant-owned draft or published website configuration created from a template
- `SiteConfigurationPublishEvent`: optional audit record for publish/replace operations

## Status
- Initial schema foundation is implemented in `packages/db` for `Company`, `User`, and `Membership`.
- Canonical schema owner: Prisma in `packages/db/prisma/schema.prisma`.
- Mirrored query schema: Drizzle in `packages/db/drizzle/schema.ts`.
- Chosen stack: provider-based `packages/db` with Prisma migrations and Postgres-compatible providers first.
- Current provider identifiers: `postgres` and `supabase-postgres`.
- Implemented soft-delete support with nullable `deletedAt`/`deleted_at` columns on the current core tables.
- Better Auth tables and feature-specific tables are not implemented yet.

## Planned Website Builder Schema
- `SiteTemplate`
  - Purpose: platform-owned template definition such as `template-1`, `template-2`, `template-3`
  - Suggested fields:
    - `id`
    - `key`
    - `name`
    - `description`
    - `thumbnailUrl`
    - `templateSchemaJson`
    - `isActive`
    - `createdAt`
    - `updatedAt`
- `SiteConfiguration`
  - Purpose: tenant-owned instantiated website setup created from a platform template
  - Suggested fields:
    - `id`
    - `companyId`
    - `templateId` or stable `templateKey`
    - `name`
    - `status` with values like `draft`, `published`, `archived`
    - `subdomain`
    - `themeJson`
    - `contentJson`
    - `version`
    - `publishedAt`
    - `createdById`
    - `updatedById`
    - `createdAt`
    - `updatedAt`
- `SiteConfigurationPublishEvent`
  - Purpose: optional audit trail for publish actions and live-site replacements
  - Suggested fields:
    - `id`
    - `companyId`
    - `previousConfigurationId`
    - `nextConfigurationId`
    - `publishedById`
    - `publishedAt`
    - `notes`

## Recommended JSON Ownership
- `templateSchemaJson` should hold the platform-owned section structure and section metadata contract.
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
