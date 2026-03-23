# ADR-007 — Template Register Standards

## Date: 2026-03-23
## Status: Accepted

---

## Context

The existing 45 templates are differentiated primarily by color, font, and copy. They all ship with only a Home page, share the same base section composition, and have no formal standards for content editability, UI consistency, or mobile layout. A new plan-based template register is being introduced to address structural depth and company-type fit.

Three standards were debated and decided during design of the register.

---

## Decision 1 — Editable Boundary: Static Content Only

### Decision
Only static text fields (declared in `contentKeys` on a `SectionSlot`) are editable in the builder via `EditableText`. Dynamic data items that come from a `dataSource` (listings, agents, projects, testimonials) are always display-only in the builder.

### Rationale
- Dynamic DB items are managed in the dashboard (property manager, agent manager, etc.), not the website builder. Allowing inline editing of live data in the builder would create a second edit path for the same data, causing sync conflicts and confusion.
- `EditableText` on DB-owned fields would also break the draft/live boundary — live data changes would not be versioned through the draft publishing flow.
- AI content generation is only meaningful for authored copy (hero title, story body, CTA text), not for structured DB records.

### Consequences
- Section components that receive `items[]` from a `dataSource` must never wrap item fields in `EditableText`.
- The eyebrow/title/description *above* a dynamic grid section can be editable. The card content itself cannot.
- AI generation targets `contentKeys` only.

---

## Decision 2 — UI System: Split By Context

### Decision
Two UI contexts with different rules:

| Context | Standard |
|---------|----------|
| Section components (tenant-visible rendering) | Raw Tailwind classes + `var(--pk-*)` CSS variables from `WebsiteRuntimeProvider`. No imports from `@plotkeys/ui`. |
| Builder overlay components (action bars, panels, ClickGuard, AI panel, InlineOverview) | `@plotkeys/ui` (shadcn/ui, New York style, Lucide icons) |
| Dashboard and builder shell | `@plotkeys/ui` (shadcn/ui) |

### Rationale
- Section components must consume the *tenant's* theme tokens (color system, style preset, font family), not the platform's zinc/slate shadcn tokens. If sections import shadcn components directly, those components hardcode the platform's design tokens and break tenant theme portability.
- `WebsiteRuntimeProvider` injects `--pk-*` CSS variables derived from the tenant's `TemplateConfig`. Sections must read from these variables only.
- Builder overlay components (action bars, edit panels, ClickGuard) float *above* sections in the builder chrome. They belong to the platform shell and should use the consistent platform design system (`@plotkeys/ui`).

### Consequences
- The `packages/section-registry` package does not depend on `@plotkeys/ui`.
- Shadcn components (Button, Sheet, Dialog, etc.) used in builder overlays are imported in the dashboard/builder app layer, not inside section components.
- The `common/nav.ts` in each template family defines the mobile navigation contract using `@plotkeys/ui` Sheet/Drawer — but the nav is rendered by the builder shell, not directly inside section components.

---

## Decision 3 — Mobile Responsive: Baseline Requirement, Not A Plan Feature

### Decision
All templates across all families and all plan tiers must meet the same responsive breakpoint contract. Responsiveness is a baseline engineering requirement, not a feature gated to Plus or Pro.

Mandatory breakpoints: 320px (small mobile), 375px (standard mobile), 768px (tablet), 1024px (laptop), 1440px (desktop).

Mobile navigation (hamburger menu using Sheet or Drawer from `@plotkeys/ui`) is mandatory in every family's `common/nav.ts`.

### Rationale
- Tenants on Starter should not be penalised with a broken mobile layout. A non-responsive site damages the tenant's brand and generates support burden.
- Differentiating plan tiers on page depth, feature access, and content richness is appropriate. Differentiating on layout quality is not.
- The `StylePreset` system already defines responsive spacing tokens (`sectionY`, `containerX`, `gridGap`) — the contract simply formalises their required application.

### Consequences
- Every new section component in the register must be tested at 320px and 1440px before being considered complete.
- `common/nav.ts` per family is a required file (not optional) and must include mobile nav config.
- The responsive grid contract is:

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Property / project grid | 1 col | 2 cols | 3 cols |
| Agent grid | 1 col | 2 cols | 3–4 cols |
| Service highlights | 1 col | 2 cols | 3 cols |
| Hero layout | Stacked | Stacked | Two-column |
| Navigation | Hamburger (Sheet) | Hamburger or inline | Full inline |
| CTA buttons | Full width | Auto | Auto |

---

## Related
- `brain/modules/template-register-plan.md` — full register specification
- `brain/tasks/in-progress.md` — active implementation task
