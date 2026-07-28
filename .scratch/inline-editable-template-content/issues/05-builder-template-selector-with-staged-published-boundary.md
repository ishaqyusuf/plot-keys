# 05 — Builder template selector with staged/published boundary

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/32

**What to build:** Add template selection to dashboard template configuration mode. A tenant should be able to choose another accessible template, see the staged preview update immediately with preserved shared configuration, continue editing, and keep the published site unchanged until an explicit publish.

**Blocked by:** 03 — Shared template switch carry-forward logic.

**Status:** ready-for-agent

- [ ] Template configuration mode includes a template selector populated with available templates and access state.
- [ ] Selecting an accessible template updates the staged preview without leaving the builder flow.
- [ ] Shared content and theme values are preserved through the switch.
- [ ] Missing template-specific fields are defaulted so the new template renders complete content.
- [ ] Locked or unlicensed template selection is blocked with a clear upgrade/access path.
- [ ] Published site data remains unchanged until the tenant publishes the staged version.
- [ ] Tests verify selector behavior, config preservation, locked template handling, and staged-versus-published isolation.
