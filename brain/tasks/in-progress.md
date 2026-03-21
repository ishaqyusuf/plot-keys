# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Construction Project Management — Phase 1 (Internal Project Core)
- [x] Created Prisma enums: ProjectStatus, ProjectType, ProjectPhaseStatus, ProjectMilestoneStatus, ProjectDocumentKind, ProjectDocumentVisibility, ProjectUpdateKind, ProjectIssueSeverity, ProjectIssueStatus, ProjectRole, ProjectAssignmentStatus
- [x] Created Prisma models: Project, ProjectPhase, ProjectMilestone, ProjectDocument, ProjectUpdate, ProjectIssue, ProjectAssignment
- [x] Added Company→projects and Membership→projectAssignments relations
- [x] Created project query module with CRUD for all entities (packages/db/src/queries/project.ts)
- [x] Exported project queries from @plotkeys/db index and package.json exports map
- [x] Added server actions: createProject, updateProject, deleteProject, createPhase, updatePhase, createMilestone, updateMilestone, createUpdate, createIssue, updateIssue, assignMember, removeMember
- [x] Created /projects list page with create form, status filters, and project cards
- [x] Created /projects/[id] detail page with phases, milestones, updates, issues, and team sections
- [x] Added "Construction" nav group with Projects item to dashboard sidebar

Next: Run migration, test pages, or continue with Phase 2 (Budget and Workforce).
