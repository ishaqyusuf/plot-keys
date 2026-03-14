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

## Open Items
- Initial role model: `platform_admin`, `owner`, `admin`, `agent`, `staff`
- Better Auth should manage identity and sessions; application tables should manage company memberships
- Current API scaffold resolves request auth context from headers and exposes active membership data in the server context
- TODO: Fine-grained permissions for CRM, billing, AI, and domain operations
