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

## Open Items
- TODO: Final role model
- TODO: Final Better Auth session and tenant-membership model
- TODO: Fine-grained permissions for CRM, billing, AI, and domain operations
