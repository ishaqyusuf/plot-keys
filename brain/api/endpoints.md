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
- Implemented query-layer example in `apps/api/src/db/queries/health.ts`.
