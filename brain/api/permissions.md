# API Permissions

## Purpose
This file tracks authorization and permission expectations.

## How To Use
- Update when roles, scopes, or tenant access rules change.
- Keep this aligned with actual auth implementation.

## Planned Roles
- Platform admin
- Company owner
- Company admin
- Agent
- Staff user

## Core Rules
- All tenant data access must be company-scoped.
- Public website visitors may access published tenant website content only.
- Agents should access assigned leads, appointments, and properties based on company rules.
- Platform admins may require cross-tenant visibility for support and operations.
- Authentication should be implemented with Better Auth.
- Authorization should resolve from company membership records, not only from a global user role.
- Every authenticated request should resolve an active company context before tenant-scoped procedures run.
- Authorization continues to resolve from `Membership.role`, while employee persona and landing behavior resolve from `Membership.workRole`.

## Open Items
- Initial role model: `platform_admin`, `owner`, `admin`, `agent`, `staff`
- Standardized work-role model: `operations`, `sales_agent`, `sales_manager`, `hr`, `finance`, `marketing`, `project_manager`, `executive`
- Better Auth should manage identity and sessions; application tables should manage company memberships
- Current API scaffold can now resolve auth context from either request headers or the session cookie when mounted through the dashboard-owned `/api/trpc` route
- Current auth implementation detail: dashboard auth forms now call same-origin tRPC auth mutations and persist the returned signed session token through a temporary same-origin dashboard session route
- The API now distinguishes between:
  - authenticated procedures that require a signed-in user
  - membership procedures that require an active tenant membership before company-scoped builder, onboarding-completion, or domain mutations run
- Workspace builder and domain mutations now enforce company scoping in the API layer before hitting Prisma-backed query helpers.
- TODO: Fine-grained permissions for CRM, billing, AI, and domain operations
