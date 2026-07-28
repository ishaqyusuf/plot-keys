# ADR-008 — Template Family UI Design System

## Date: 2026-03-24
## Status: Accepted

---

## Context

The plan-based template register (ADR-007) introduced 6 template families × 3 plan tiers = 18 templates with structured page inventories, content schemas, and data-binding contracts. However, all 18 templates still rendered using the same generic shared section components (`HeroBannerSection`, `ListingSpotlightSection`, etc. from `home-page.tsx` and `extended-sections.tsx`). A Thuraya luxury site and a Noor agency site looked visually identical — only the theme tokens (color, font) differed.

The goal of this ADR is to establish how each template family gets its own distinct visual UI design that works correctly with draft mode, live mode, preview mode, and template browse mode.

---

## The Two Layers of a Template

A template is composed of two independent layers:

| Layer | What it is | Where it lives |
|-------|-----------|---------------|
| **Data layer** | Page inventory, content keys, data sources, default content, theme defaults, nav/footer config | `register/{family}/{tier}/*.ts` and `register/{family}/common/*.ts` — all `.ts`, no React |
| **UI layer** | React section components that render the visual design | `register/{family}/ui/{family}-sections.tsx` — `.tsx`, React + Tailwind |

These two layers are deliberately separate. The data layer is pure TypeScript with no React dependency — it is safe to import from server contexts, edge functions, and config utilities. The UI layer depends on React and is only loaded when rendering pages.

---

## Architecture

### Family UI folder structure

```
register/
  ui-types.ts                        ← SectionComponentOverrides type
  noor/
    ui/
      noor-sections.tsx              ← All Noor section components
      index.ts                       ← exports noorSectionComponents map
  thuraya/
    ui/
      thuraya-sections.tsx
      index.ts
  bana/ui/   wafi/ui/   faris/ui/   sakan/ui/   (same pattern)
```

### SectionComponentOverrides

```typescript
// register/ui-types.ts
export type SectionComponentOverrides = Record<
  string,
  (props: { config: unknown; theme: ThemeConfig }) => JSX.Element
>;
```

Each family exports a map keyed by **snake_case section type strings** (e.g. `"hero_banner"`, `"listing_spotlight"`) pointing to that family's branded React component.

```typescript
// register/noor/ui/index.ts
export const noorSectionComponents: SectionComponentOverrides = {
  hero_banner:        NoorHeroBannerSection,
  listing_spotlight:  NoorListingSpotlightSection,
  market_stats:       NoorMarketStatsSection,
  story_grid:         NoorStoryGridSection,
  cta_band:           NoorCtaBandSection,
  // ...
};
```

### Resolution function

```typescript
// register/index.ts
export function resolveFamilySectionComponents(
  family: TemplateFamilyKey | undefined,
): SectionComponentOverrides {
  if (!family) return {};
  return familySectionComponentMap[family] ?? {};
}
```

- Returns an empty map for `undefined` (old `template-1` style keys) → generic fallback, no breakage.
- Returns the family-specific override map for any of the 6 register families.

### Component swapping in resolveWebsitePresentation

```typescript
// src/index.ts — resolveWebsitePresentation()
const registerVariant = _getRegisterTemplate(templateKey);
const familyOverrides = _resolveFamilySectionComponents(registerVariant?.family);

const page = {
  ...builtPage,
  sections: builtPage.sections.map((s) => ({
    ...s,
    component: (familyOverrides[s.type] as typeof s.component | undefined) ?? s.component,
  })) as HomeSectionDefinition[],
};
```

The swap happens **after** `buildPageSections` assembles sections using the shared `sectionBuilders`. Only the `component` reference is swapped — `config`, `id`, and `type` are unchanged. If a family doesn't override a section type, the generic component is used as-is.

### Priority chain

```
familyOverrides[s.type]   ← family-specific branded component (highest priority)
  ?? s.component          ← generic shared component (fallback)
```

---

## Family Design Identities

| Family | Key | Visual Identity |
|--------|-----|----------------|
| **Noor** | `agency` | Bold navy/blue. Multi-agent listings-first. Strong grid, data-forward stats. Navy hero with credential panel. |
| **Bana** | `developer` | Industrial charcoal/zinc + amber. Project-forward. Construction progress bars, status badges (Under Construction / Ready). |
| **Wafi** | `manager` | Clean teal/white. Operations-structured. Step-numbered process cards, availability badges (Available / Let). |
| **Faris** | `solo` | Warm stone/amber. Personal brand. Large agent headshot area, bio-forward, prominent client testimonials. |
| **Thuraya** | `luxury` | Editorial cream/ivory + gold rule. Serif headings, generous whitespace, minimal grid density, muted palette. |
| **Sakan** | `rental` | Fresh teal/emerald. Renter-friendly. Monthly price display, availability badges, numbered rental process steps. |

---

## Section Component Contract

Every section component in a family `.tsx` file must follow this contract:

### 1. File-level directive
```tsx
"use client";
```
All section components use React hooks (`useIsDraftMode`, etc.) from `runtime-context.tsx` and must be client components.

### 2. Props signature
```tsx
function FamilyXxxSection({
  config,
  theme,
}: {
  config: XxxConfig;   // exact type from home-page.tsx or extended-sections.tsx
  theme: ThemeConfig;
}) { ... }
```
Config types are **reused from the generic sections** — families change the visual rendering, not the config shape. This ensures compatibility with the existing `sectionBuilders` that produce those configs.

### 3. EditableText for static content
Every field listed in the slot's `contentKeys` must be wrapped with `EditableText`:
```tsx
<EditableText
  as="h1"
  contentKey="hero.title"       // must match the registered contentKey
  value={config.title}
  className="..."
  style={{ fontFamily: theme.headingFontFamily }}
/>
```

### 4. dataSource items are display-only
Items that come from a `dataSource` (listing cards, agent cards, project cards) must never be wrapped in `EditableText`. They are read from the DB and managed through the dashboard:
```tsx
// ✅ correct — display-only
{config.items.map((item) => <div key={item.id}>{item.title}</div>)}

// ❌ wrong — never wrap DB items in EditableText
{config.items.map((item) => <EditableText contentKey="???" value={item.title} />)}
```

### 5. Tailwind + CSS vars only
```tsx
// ✅ correct
<div className="bg-[color:var(--primary)] text-white" />

// ❌ wrong — never import from @plotkeys/ui inside section components
import { Button } from "@plotkeys/ui";
```

### 6. Shell helper pattern
```tsx
function shell(theme: ThemeConfig) {
  return {
    "--section-bg": theme.backgroundColor,
    fontFamily: theme.fontFamily,
  } as CSSProperties;
}

// Applied to the outermost <section> element
<section style={shell(theme)} className="...">
```

---

## What Does NOT Change

- `sectionBuilders` in `src/index.ts` — still maps `sectionType → SectionBuilder → config`. Families do not need their own builders unless they add new content keys.
- `shared-slots.ts` — `sectionType` strings remain unchanged (e.g. `"HeroBannerSection"`).
- `sectionComponents` client map — still used by builder client components for client-side rendering; family overrides are applied separately via `resolveFamilySectionComponents`.
- The data layer `.ts` files — untouched by the UI layer.

---

## Consequences

- Adding a new family requires: one `{family}-sections.tsx`, one `ui/index.ts`, one entry in `familySectionComponentMap`.
- A family only needs to override the sections it cares about — any unoverridden type falls back to the generic shared component automatically.
- The generic shared components (`home-page.tsx`, `extended-sections.tsx`) remain as the safety net and default rendering path for all legacy template keys.
- Zero TypeScript errors — the `as HomeSectionDefinition[]` cast is required at the swap site because TypeScript cannot narrow the mapped union back to the discriminated type.

---

## Related
- `brain/decisions/ADR-007-template-register-standards.md` — editable boundary, UI system split, responsive baseline
- `brain/modules/template-register-plan.md` — register data specification
- `packages/section-registry/src/register/ui-types.ts` — `SectionComponentOverrides` type
- `packages/section-registry/src/register/index.ts` — `resolveFamilySectionComponents()`
- `packages/section-registry/src/index.ts` — component swap in `resolveWebsitePresentation()`
