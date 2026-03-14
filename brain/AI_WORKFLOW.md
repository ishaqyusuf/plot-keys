# AI Workflow

## Purpose
This file defines how AI agents should work in this repository before and after implementation begins.

## How To Use
- Read before coding or large planning tasks.
- Update when team workflow or documentation expectations change.
- Keep instructions practical and short.

## Required Read Order
1. `brain/BRAIN.md`
2. `brain/SYSTEM_OVERVIEW.md`
3. `brain/PROJECT_INDEX.md`
4. `brain/engineering/coding-standards.md`
5. Any domain-specific Brain docs relevant to the task

## Working Process
1. Confirm current Brain state.
2. Make reasonable assumptions when details are intentionally deferred.
3. Implement the smallest correct slice.
4. Update Brain docs after meaningful changes.
5. Add ADRs only when introducing new architectural patterns or irreversible decisions.

## Documentation Sync Rules
- Product scope change -> update product docs
- Repo or architecture change -> update system or engineering docs
- Schema change -> update database docs
- API change -> update API docs
- New feature implementation -> add or update a feature doc
- Task movement -> update task files

## Initialization Constraint
- At project start, prioritize clarity over completeness.
- Avoid pretending unbuilt architecture already exists.
