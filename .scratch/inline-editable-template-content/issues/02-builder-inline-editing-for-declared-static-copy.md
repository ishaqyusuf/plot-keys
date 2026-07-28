# 02 — Builder inline editing for declared static copy

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/29

**What to build:** Make declared static template copy directly editable in the dashboard builder. A tenant should be able to hover editable text, see clear edit chrome, click or use the keyboard to edit, commit the edit into the staged configuration, and still see normal non-editor rendering outside draft/editor modes.

**Blocked by:** 01 — Canonical editable field contract.

**Status:** ready-for-agent

- [ ] Declared editable text shows a visible hover/focus edit boundary in builder draft mode.
- [ ] Clicking editable text starts inline editing immediately.
- [ ] Keyboard users can focus editable text and start editing with the expected activation keys.
- [ ] Blur or an equivalent commit action saves the new value to the staged configuration.
- [ ] Escape or an equivalent cancel path restores the previous value without saving.
- [ ] Dynamic listing, property, agent, blog, and similar data-backed item text does not show edit chrome or become content-editable.
- [ ] Published/live rendering does not show builder editing affordances.
- [ ] Browser or component tests cover hover, click-to-edit, commit, cancel, keyboard activation, and dynamic-data negative cases.
