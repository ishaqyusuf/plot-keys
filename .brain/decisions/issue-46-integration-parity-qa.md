# Issue 46 - Integration Parity QA

Focused parity checks completed for the #28 onward implementation:

- Template manifest/editable-field contract tests cover editable metadata, AI-enabled fields, page aliases, carry-forward switching, and manifest guardrails.
- Dashboard list-contract tests cover pagination metadata, final-page cursors, shared table identity config, and infinite-query flattening.
- Notification tests cover durable event registry keys, provider support boundaries, task payload parsing, delivery planning, and email configuration skips.
- Import checks cover migrated DB query modules, table entry modules, workspace router event wiring, dashboard actions, notification service, and notification jobs.
- `git diff --check` passes.

Dirty-worktree note: the repository contained unrelated changes before this implementation, including environment/package/documentation edits, deleted local dev files, and existing Riwaq/template edits. Those were left in place and not reverted.
