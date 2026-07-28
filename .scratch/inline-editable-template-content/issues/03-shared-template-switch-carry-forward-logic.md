# 03 — Shared template switch carry-forward logic

GitHub issue: https://github.com/ishaqyusuf/plot-keys/issues/30

**What to build:** Create a shared template-switching path that keeps a tenant or sandbox user's configuration continuous when moving between templates. Switching should preserve compatible shared content/theme fields, initialize fields required by the newly selected template, keep unused prior-template values available for switching back, and enforce template access rules.

**Blocked by:** 01 — Canonical editable field contract.

**Status:** ready-for-agent

- [ ] Switching templates preserves shared theme values such as style preset, colors, fonts, radius, menu treatment, named image assignments, section visibility, and SEO where applicable.
- [ ] Switching templates preserves exact matching shared content keys.
- [ ] Newly required template-specific content fields are populated from the selected template defaults when missing.
- [ ] Content and theme values unused by the selected template are retained rather than deleted.
- [ ] Switching back to a previous template restores previously edited compatible values.
- [ ] Template access and licensing rules are enforced before a tenant can switch into an unavailable template.
- [ ] Tests cover preservation, defaulting, retained unused fields, switching back, and access rejection.
