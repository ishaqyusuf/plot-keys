# 04 — Server-authorized field AI generation

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/31

**What to build:** Make field-level AI generation safe and specific. The AI action on editable text should generate copy only for that exact declared field, using server-resolved field metadata and tenant/company context rather than trusting client-provided prompt details as the authority.

**Blocked by:** 01 — Canonical editable field contract; 02 — Builder inline editing for declared static copy.

**Status:** ready-for-agent

- [ ] AI generation validates the requested content key against the active template metadata before generating or saving content.
- [ ] The server resolves field label, type, AI eligibility, guidance, and length expectations from template metadata.
- [ ] Tenant/company context from registration or onboarding is appended to the generation context when available.
- [ ] AI generation updates only the requested allowed content field in staged configuration.
- [ ] Non-AI-enabled fields do not show the AI action in the editor surface.
- [ ] Dynamic data-backed item fields cannot be generated or overwritten through this path.
- [ ] Tests cover server-side metadata resolution, tenant context enrichment, non-AI field rejection or hiding, and dynamic-data rejection.
