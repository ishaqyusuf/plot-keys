# Construction Project Management

## Purpose
This file documents the future internal construction project management system for tenant companies that build, supervise, or deliver real-estate projects from planning through handover.

## Goal
Give a company one operational system to manage a building or estate project end-to-end, including structure, phases, documents, QS/budget workflows, workforce coordination, project-scoped permissions, reporting, and AI assistance.

## Product Direction
- This is a construction and development operations module, not a generic project management tool.
- The primary users are company owners, admins, project directors, project managers, QS/finance staff, site supervisors, and other assigned internal staff.
- The feature lives in the dashboard and is company-scoped, with project-level access layered on top.
- `Project` should sit above related units, properties, or development inventory rather than replacing listing management.
- This feature is intended for Plus and Pro plans, with advanced AI, customer visibility, and integrations reserved for Pro.

## Scope

### Included
- Construction/development project setup
- Project lifecycle, phases, milestones, and status tracking
- Project documents and approvals
- QS and budget structures
- Site worker and project payroll planning
- Staff invitation and assignment to a project with project-specific roles
- Progress updates, issues, and internal reporting
- AI assistance for summaries, extraction, risk signals, and update drafting

### Excluded
- Generic kanban/task-board software
- Full accounting or ERP replacement
- BIM/CAD authoring tools
- Deep external QS software integration in phase 1
- Customer-facing project visibility as the primary definition of this module

## User Flow
1. Company creates a `Project` with name, type, location, owner, and delivery targets.
2. Company defines project phases, milestones, and initial budget structure.
3. Internal staff upload documents, approvals, BOQ/QS artifacts, and project notes.
4. Company assigns staff and workers to the project with scoped project roles.
5. Project managers and site supervisors post progress updates, issues, and milestone changes.
6. QS/finance staff record budget adjustments, valuations, payroll inputs, and variance notes.
7. AI assists with document extraction, weekly summaries, risk flags, and customer-safe update drafts.
8. Approved progress can later be exposed to linked customers through the customer project interface.

## Core Capabilities

### Project Foundation
- Create and manage projects for buildings, estates, fit-outs, or infrastructure-related real-estate work.
- Track core metadata: project code, location, type, client/customer relationship, planned start date, target completion date, delivery status.
- Support project states such as `draft`, `active`, `paused`, `delayed`, `completed`, and `archived`.

### Phases and Milestones
- Define phases such as planning, foundation, structure, MEP, finishing, handover.
- Track milestone status, owner, due date, completion date, and notes.
- Roll up phase progress into project-level status summaries.

### Documents and Approvals
- Upload and organize drawings, contracts, permits, invoices, receipts, site reports, inspection records, and handover files.
- Support document categories, version notes, approval state, and restricted visibility.
- Keep project documents distinct from public listing media.

### QS, Budget, and Cost Tracking
- Track project budget at summary and line-item level.
- Support BOQ-aligned cost structures and quantity/cost notes.
- Record projected cost, approved cost, actual cost, and variance commentary.
- Allow finance or QS users to review and update construction cost positions without turning the feature into full accounting software.

### Site Workforce and Payroll
- Track project workers, crews, contractors, and internal staff assigned to the project.
- Record pay basis such as daily, weekly, fixed contract, or milestone-based.
- Support payroll periods, attendance/workdays inputs, advances, deductions, payment status, and payroll summaries per project.
- Keep this separate from general company employee payroll where needed.

### Project Roles and Access
- Invite or assign existing company staff to a project.
- Support project-scoped roles layered on top of company membership.
- Example roles: `project_owner`, `project_manager`, `qs_manager`, `finance_reviewer`, `site_supervisor`, `viewer`.

### Updates, Issues, and Reporting
- Post daily or weekly updates with status, photos, notes, risks, and blockers.
- Track issues, delays, dependencies, and decision logs.
- Generate project summaries and progress reports for internal leadership review.

### AI Support
- Summarize updates and meeting/report notes.
- Extract key facts from uploaded documents.
- Flag delayed milestones or budget variance patterns.
- Draft customer-safe progress updates from internal logs.
- Future: assist with BOQ/QS interpretation and architectural quick-view reasoning.

## Validation Rules
- This feature should only be activated for construction/development workflows, not generic company operations.
- The MVP must be useful without external QS integrations.
- `Project` must remain a domain object above listings/properties, not a duplicate listing record.
- Site worker payroll is part of the module direction, but detailed payroll automation can be phased.
- Customer visibility is a dependent feature, not the internal system's primary workflow.

## Data Model

### Core Entities
- `Project`
  - companyId, name, code, type, location, status, startDate, targetCompletionDate, completedAt
- `ProjectPhase`
  - projectId, name, order, status, startDate, endDate
- `ProjectMilestone`
  - projectId, phaseId?, name, status, dueDate, completedAt, ownerId?
- `ProjectDocument`
  - projectId, kind, title, fileUrl, visibility, versionLabel, uploadedById, approvedById?
- `ProjectUpdate`
  - projectId, authorId, kind, summary, details, progressPercent?, postedAt
- `ProjectIssue`
  - projectId, title, severity, status, ownerId?, openedAt, closedAt?

### Finance and Workforce
- `ProjectBudget`
  - projectId, currency, approvedBudgetMinor, forecastBudgetMinor, actualBudgetMinor
- `ProjectBudgetLineItem`
  - projectId, budgetId, category, description, quantity?, unitRateMinor?, estimatedMinor, actualMinor
- `ProjectWorker`
  - projectId, employeeId?, contractorName?, fullName, role, payBasis, payRateMinor, status
- `ProjectPayrollRun`
  - projectId, periodStart, periodEnd, status, totalGrossMinor, totalNetMinor
- `ProjectPayrollEntry`
  - payrollRunId, workerId, attendanceUnits, grossMinor, deductionMinor, advanceMinor, netMinor, paymentStatus

### Access and Relationships
- `ProjectAssignment`
  - projectId, membershipId, projectRole, invitedById, status
- `ProjectPropertyLink`
  - projectId, propertyId
- `ProjectCustomerAccess`
  - projectId, tenantCustomerId, accessLevel, enabledAt

## APIs
- Dashboard procedures for project CRUD, phase/milestone management, document upload metadata, updates, assignments, budgets, and payroll runs.
- Reporting procedures for project progress summaries and budget variance.
- Customer-safe read procedures should be separated from internal project procedures.
- TODO: Finalize whether project payroll should share existing HR endpoints or live under project-specific routes.

## UI
- Dashboard navigation group: `Projects` or `Construction`.
- Internal surfaces:
  - `/projects`
  - `/projects/[id]`
  - `/projects/[id]/phases`
  - `/projects/[id]/documents`
  - `/projects/[id]/budget`
  - `/projects/[id]/payroll`
  - `/projects/[id]/team`
  - `/projects/[id]/reports`
- Project detail should provide an executive summary header, phase tracker, recent updates, issues, financial summary, and assigned staff.

## Permissions
- Company membership is required to enter the dashboard.
- Project access is granted through project assignment and role.
- Owners/admins can create projects and delegate project roles.
- Finance/QS users may need access to budget and payroll areas without full document control.
- Customer-facing project visibility must only expose approved records and should never reveal internal-only documents, payroll, or issue logs.

## Plan Gating
- Starter
  - Not included.
- Plus
  - Internal project CRUD
  - Phases and milestones
  - Project documents
  - Project staff assignment
  - Basic budget tracking
  - Basic project updates
- Pro
  - Advanced budget variance and reporting
  - Site worker payroll workflows
  - AI summaries and risk alerts
  - Customer project interface
  - Future external QS integrations

## Phased Delivery

### Phase 1 — Internal Project Core
- Project CRUD
- Phases and milestones
- Documents
- Project team and project roles
- Internal updates and issue log

### Phase 2 — Finance and Workforce
- Budget summary and line items
- Site worker records
- Project payroll runs and entries
- Financial reporting basics

### Phase 3 — Customer Visibility
- Controlled project sharing to linked customers
- Customer-safe updates and milestone progress
- Shared documents and notices

### Phase 4 — AI and Integrations
- AI summaries, extraction, and risk support
- QS/BOQ assistance
- Architectural quick-view analysis
- External QS software integrations

## Edge Cases
- A company may manage many projects with overlapping staff but different project roles.
- Some workers may not be dashboard users and should still be payable within project payroll.
- A project may map to many units/properties, while some projects may not yet have saleable units.
- Customer updates may need approval before they become visible externally.
- Payroll and budget records must remain internal even when project progress is shared with customers.

## Open Questions
- Should `Project` own units directly, or should it only link existing `Property` records?
- Should worker attendance be built into project payroll or integrated later?
- Should project documents include formal approval workflows in v1 or just approval state metadata?
- How much of QS/BOQ structure should be native before external integrations exist?
- Should project customers see percentage progress, milestone progress, or only approved narrative updates?

## Future Improvements
- Native BOQ templates and valuation flows
- Supplier and procurement workflows
- Photo timeline and drone/image progress records
- Delay forecasting and cost overrun prediction
- Drawing interpretation and AI-assisted quantity extraction
- External QS software sync
