# 07 — Template compliance guardrails

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/34

**What to build:** Add regression coverage and authoring guardrails so future templates keep the same editable/static boundary, inline editing behavior, field-level AI behavior, and template-switching expectations. This ticket should make the contract durable after the implementation tickets land.

**Blocked by:** 01 — Canonical editable field contract; 02 — Builder inline editing for declared static copy; 04 — Server-authorized field AI generation; 05 — Builder template selector with staged/published boundary; 06 — Sandbox template selector with config preservation.

**Status:** ready-for-agent

- [ ] Tests or lint-style checks verify that editable template text maps to declared content metadata.
- [ ] Tests verify that dynamic data-source item text is not wrapped with inline editing behavior.
- [ ] Tests verify that AI actions appear only for AI-enabled editable fields.
- [ ] Tests verify builder and sandbox template switching preserve shared configuration and default missing template-specific fields.
- [ ] Tests verify staged edits and template switches do not mutate published configuration before publish.
- [ ] Template authoring guidance documents the editable/static boundary, field metadata requirements, AI eligibility rules, and dynamic data-source restrictions.
- [ ] The resulting guardrails can be run by future implementation agents without needing to inspect every template manually.
