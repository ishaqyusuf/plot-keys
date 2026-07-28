# 06 — Sandbox template selector with config preservation

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/33

**What to build:** Add template selection to sandbox config mode using the shared template-switching behavior. A sandbox user should be able to compare templates from the sandbox rail/config surface without resetting shared profile content, theme, sample data boundaries, or editing context.

**Blocked by:** 03 — Shared template switch carry-forward logic.

**Status:** ready-for-agent

- [ ] Sandbox config mode includes a template selector populated from the template catalog.
- [ ] Selecting a template updates the sandbox preview immediately and keeps the user in sandbox mode.
- [ ] Shared sandbox profile content and theme values are preserved through the switch.
- [ ] Missing template-specific fields and placeholder data needed by the selected template are initialized safely.
- [ ] Previously edited values are retained so switching back restores them where compatible.
- [ ] Dynamic sample listing, agent, blog, and similar data remains display-only after switching.
- [ ] Tests verify sandbox selector behavior, config preservation, defaulting, switching back, and display-only dynamic sample data.
