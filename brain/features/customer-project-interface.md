# Customer Project Interface

## Purpose
This file documents the customer-facing project interface that lets a tenant company's customer view progress, milestones, approved documents, and project-related updates for an ongoing construction or development project.

## Goal
Give customers transparent, controlled visibility into their own ongoing project without exposing internal operational, payroll, budget, or issue-management details.

## Product Direction
- This is the customer-facing companion to internal construction project management.
- The interface should live within the tenant's branded site or customer portal experience.
- It should read from approved project data rather than exposing raw internal project records.
- This feature is intended for Pro tier tenants after the internal project management foundation exists.

## Scope
- Customer project overview
- Milestone and phase visibility
- Approved progress updates
- Shared documents
- Project notices and communication hooks
- Limited payment/progress coordination where applicable

## User Flow
1. Company links a customer to a project with explicit customer access.
2. Internal staff choose which updates, milestones, and documents are customer-visible.
3. Customer signs in through the tenant-facing portal.
4. Customer views current project status, milestone progress, approved updates, and shared files.
5. Customer receives notices or responds to permitted actions such as acknowledgements or questions.

## Data Model
- `ProjectCustomerAccess`
  - projectId, tenantCustomerId, accessLevel, enabledAt, disabledAt?
- `ProjectCustomerNotice`
  - projectId, tenantCustomerId, title, body, postedAt
- Customer-visible records should derive from internal `ProjectMilestone`, `ProjectDocument`, and `ProjectUpdate` using explicit visibility or approval rules.

## APIs
- Customer-safe read procedures for project overview, milestones, updates, and documents.
- Notification endpoints for project notices.
- TODO: Decide whether customer replies should live in the existing customer portal messaging model or a project-specific thread model.

## UI
- Tenant-site portal route such as `/portal/projects/[id]`.
- Surfaces:
  - project summary card
  - milestone tracker
  - approved updates timeline
  - shared documents list
  - notices and next steps

## Edge Cases
- A customer may be linked to more than one project.
- A project may have more than one customer stakeholder.
- Some milestones may exist internally but not be suitable for customer display.
- Delays may require a review/approval step before being published externally.

## Permissions
- Customers can only see projects explicitly linked to their tenant-customer relationship.
- Customers cannot see internal issue logs, payroll, staff-only documents, or raw budget data.
- Company staff control what becomes externally visible.

## Future Improvements
- Customer acknowledgements and approvals
- Progress photo galleries
- Payment-linked milestone progress
- AI-generated customer-friendly weekly reports
