# 01 — Canonical editable field contract

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/28

**What to build:** Make the template registry the authoritative source for which content fields are editable, AI-enabled, and valid to save. The system should accept edits only for declared static authored content keys and reject undeclared or dynamic data-backed keys before they can be persisted.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Editable content key validation is driven by template metadata, not by rendered DOM text or client-provided assumptions.
- [ ] Static authored fields can be identified with label, field type, AI eligibility, and AI/editor guidance.
- [ ] Dynamic data-source item text is not treated as editable content.
- [ ] Server-side update paths reject unknown, undeclared, or dynamic data-backed content keys.
- [ ] Registry-level tests cover allowed static keys, rejected unknown keys, and the data-source display-only boundary.
