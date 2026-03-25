# ADR-009 — Standardize Work Roles Separately From Access Roles

## Date: 2026-03-25
## Status: Accepted

## Context

The dashboard already used `Membership.role` for access control with values such as `owner`, `admin`, `agent`, and `staff`. That was enough for permission checks, but it was too coarse for employee onboarding and login routing.

Examples:
- HR staff and finance staff both logged in as `staff`, even though they should land in different product areas.
- Employee invites could only express `staff`, not the actual workplace role the person was joining under.
- Team and HR views had no normalized persona field to display alongside permission role.

We needed a standard role system that keeps authorization stable while also giving the product a reliable “who is this person in the company?” signal.

## Decision

We split roles into two layers:

1. Access role
- Stored in `Membership.role`
- Used for authorization and API guards
- Values remain: `platform_admin`, `owner`, `admin`, `agent`, `staff`

2. Work role
- Stored in `Membership.workRole`
- Also persisted on `TeamInvite.workRole` and `Employee.workRole`
- Used for invite semantics, employee categorization, and default post-login routing

Standardized work roles:
- `operations`
- `sales_agent`
- `sales_manager`
- `hr`
- `finance`
- `marketing`
- `project_manager`
- `executive`

## Routing Rules

Default dashboard landing routes now resolve from `workRole`:
- `operations` → `/`
- `sales_agent` → `/leads`
- `sales_manager` → `/customers`
- `hr` → `/hr/employees`
- `finance` → `/hr/payroll`
- `marketing` → `/builder`
- `project_manager` → `/projects`
- `executive` → `/analytics`

If a user has no active membership, auth still routes them into onboarding.

## Consequences

- Permission checks stay backward-compatible because API guards still use `Membership.role`.
- Employee invites can now express a standardized workplace role without promoting everyone to a stronger permission level.
- Team and HR screens can display both access role and work role where useful.
- Invite acceptance can create memberships and employee records with the correct work role immediately.

## Notes

- Employee invites continue to use access role `staff`; the selected work role refines their workspace experience.
- Agent-style access remains tied to access role `agent`; its default work role is `sales_agent`.
