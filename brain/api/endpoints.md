# API Endpoints

## Purpose
This file tracks implemented and planned API surfaces.

## How To Use
- Update when routes, procedures, or service entry points are added or changed.
- Keep implementation status explicit.

## Planned Domains
- Auth and tenant context
- Company management
- Agent management
- Property listings
- Property media
- Leads
- Appointments
- Client CRM
- Website pages and CMS
- Templates and themes
- Payments and subscriptions
- AI generation and AI credits
- Domains and DNS management
- Analytics

## API Style
- Use Hono + tRPC following the approved Midday pattern.
- Keep typed application procedures in tRPC.
- Use Hono as the API framework and routing shell around the service layer.

## Early Candidate Service Areas
- `companyService`
- `propertyService`
- `leadService`
- `appointmentService`
- `websiteService`
- `aiService`
- `billingService`
- `domainService`

## Status
- Implemented starter Hono app root route at `/`.
- Implemented starter tRPC router namespace `health`.
- Implemented tRPC router namespace `auth` with public mutations for:
  - `auth.signUp`
  - `auth.signIn`
  - `auth.verifyEmail`
- Implemented tRPC router namespace `workspace` for authenticated tenant/dashboard mutations:
  - `workspace.completeOnboarding`
  - `workspace.ensureBuilderConfigurationExists`
  - `workspace.createTemplateDraft`
  - `workspace.updateSiteField`
  - `workspace.publishSiteConfiguration`
  - `workspace.smartFillField`
  - `workspace.syncTenantDomains`
- `auth.signUp` now creates unverified users, plans a channel-aware verification notification through the shared notifications package, and redirects the dashboard flow to `/verify-email` instead of dropping directly into onboarding with an active session.
- Implemented dashboard-owned Next route adapter at `/api/trpc` so the dashboard can call the shared app router through a same-origin endpoint.
- Implemented query-layer example in `apps/api/src/db/queries/health.ts`.
- Dashboard server actions for onboarding, builder mutations, and tenant-domain sync are now thin wrappers around same-origin tRPC workspace mutations instead of owning the core business logic inline.
