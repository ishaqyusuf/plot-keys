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
- `WebsitePage`: structured page container for sections
- `BlogPost`: CMS content for tenant websites
- `Payment`: subscriptions, reservations, service fees, or credit purchases
- `Theme`: tenant website visual configuration
- `Template`: predefined structured website layout
- `SectionInstance`: page-level section with type and config
- `Domain`: purchased or connected tenant domain
- `AiUsageLog`: auditable record of AI actions
- `AiCreditBalance`: tenant credit accounting state

## Status
- Initial schema foundation is implemented in `packages/db` for `Company`, `User`, and `Membership`.
- Chosen stack: provider-based `packages/db` with Drizzle migrations and Postgres-compatible providers first.
- Current provider identifiers: `postgres` and `supabase-postgres`.
- Better Auth tables and feature-specific tables are not implemented yet.
