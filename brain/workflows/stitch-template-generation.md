# Stitch Template Generation Workflow

## Purpose
This file defines the prompt, workflow, and transfer process for generating new section components
on Stitch (AI UI generator) and integrating them into the PlotKeys `packages/section-registry`.

---

## What Stitch Generates

Stitch produces:
- A standalone React functional component (TSX)
- Scoped inline styles or Tailwind utility classes
- No external dependencies beyond `react` and project-safe utilities

What Stitch does NOT produce:
- tRPC calls or server logic (add after transfer)
- Auth / tenant context (wire up after transfer)
- Section registry registration (done manually after transfer)

---

## The Prompt

Use the block below verbatim in Stitch. Fill in the `[VARIABLES]` before submitting.

---

```
You are generating a React section component for a real-estate SaaS platform called PlotKeys.
The component will be dropped into packages/section-registry/src/sections/ with zero modifications
to its props or render contract.

## Section spec
- Section name: [SECTION_NAME]          e.g. "MapPreviewSection"
- Type key:     [TYPE_KEY]              e.g. "map_preview"
- Category:     [CATEGORY]             one of: hero | listing | agent | content | form | conversion
- Description:  [DESCRIPTION]          one short sentence
- Content keys: [CONTENT_KEYS]         comma-separated dot-notation keys, e.g. "map.heading, map.cta"

## Design system constraints
- Use Tailwind CSS utility classes only. No CSS modules, no styled-components.
- Honour these semantic tokens (already in the project):
    bg-background  bg-card  bg-primary  bg-accent
    text-foreground  text-muted-foreground  text-primary-foreground
    border-border  rounded-card  rounded-button
- Accent colour is injected via a CSS variable: var(--accent-color, #0f766e). Use it for highlights.
- Background colour is injected via: var(--section-bg, #f8fafc). Apply it as the section bg.
- Font family is injected via: var(--font-body) and var(--font-heading). Use font-[var(--font-heading)] for headings.
- Spacing presets (pick one and apply consistently):
    Balanced (default) → py-20 px-4 md:px-6 gap-6
    Airy               → py-24 px-5 md:px-8 gap-8
    Compact            → py-14 px-4 md:px-6 gap-4

## Props contract — copy exactly, do not rename
```tsx
export type [SECTION_NAME]Config = {
  // one key per content key listed above, typed as string
  // add boolean/number fields as needed for structural config
}

type ThemeConfig = {
  accentColor: string
  backgroundColor: string
  fontFamily: string
  headingFontFamily: string
  logo: string
  logoUrl?: string
  market: string
  supportLine: string
}

type Props = {
  config: [SECTION_NAME]Config
  theme: ThemeConfig
  mode: "draft" | "live"
}

export function [SECTION_NAME]({ config, theme, mode }: Props) { ... }
```

## Render rules
- Root element: <section> with style={{ "--section-bg": theme.backgroundColor, "--accent-color": theme.accentColor, fontFamily: theme.fontFamily } as React.CSSProperties}
- className on root: w-full [spacing-preset]
- If mode === "draft", add a data-section-type="[TYPE_KEY]" attribute to root for the builder overlay.
- Text content must come from config, not hardcoded strings.
- Images: use a <div> with aspect-video or aspect-square + bg-muted as a placeholder. Do NOT import next/image.
- No useState, useEffect, or data fetching — this is a pure presentational component.
- Export the Config type AND the component as named exports.

## Output format
Return ONLY the TypeScript code block. No explanations, no markdown prose outside the code fence.
```

---

## Variables Reference

| Variable | Where to find it |
|---|---|
| `[SECTION_NAME]` | PascalCase name, e.g. `MapPreviewSection` |
| `[TYPE_KEY]` | snake_case key used in page-inventory, e.g. `map_preview` |
| `[CATEGORY]` | See category list in `brain/modules/sections-inventory.md` |
| `[DESCRIPTION]` | One sentence max |
| `[CONTENT_KEYS]` | Dot-notation strings that map to EditableContentNode keys |

---

## Transfer Checklist (after Stitch generates the component)

### 1 — Paste the file
Copy the generated TSX into:
```
packages/section-registry/src/sections/[file-name].tsx
```
Use kebab-case for the file name, e.g. `map-preview-section.tsx`.

### 2 — Register the export
Open `packages/section-registry/src/sections/extended-sections.tsx` (or `home-page.tsx` for
hero/core sections) and add:
```ts
export { [SECTION_NAME], type [SECTION_NAME]Config } from "./[file-name]"
```

### 3 — Register in the index
Open `packages/section-registry/src/index.ts` and:
- Import the component and config type
- Add a case to the `renderSection` switch matching the type key
- Add the type key to the `SectionType` union

### 4 — Add to sections inventory
Update `brain/modules/sections-inventory.md`:
- Add a row to the relevant category table with component name, type key, and description
- Mark it `[IMPLEMENTED]`

### 5 — Register content keys
Open `packages/section-registry/src/content-nodes.ts` and add content key entries for each
key declared in the component, e.g.:
```ts
{ key: "map.heading", type: "title", label: "Map section heading", aiEnabled: true }
```

### 6 — Add to page inventory (if used in a template)
Open `packages/section-registry/src/page-inventory.ts` and add the section to the relevant
template's home page or subpage section array with `{ type: "[TYPE_KEY]", enabled: true }`.

### 7 — Smoke test
Run the tenant-site dev server and visit a page that uses the template where the section is
enabled. Confirm the section renders without runtime errors in draft and live mode.

### 8 — Update brain
After completing the transfer:
- Update `brain/tasks/in-progress.md` or move the task to `done.md`
- Update `brain/progress.md` with the new section name and date
- If this adds a new pattern (e.g. map embed, video background), add a brain/decisions ADR

---

## Example: Adding a "Neighborhood Map Preview" section

**Prompt variables:**
```
[SECTION_NAME]  = MapPreviewSection
[TYPE_KEY]      = map_preview
[CATEGORY]      = content
[DESCRIPTION]   = Static map placeholder with neighbourhood label and a "View on map" CTA.
[CONTENT_KEYS]  = map.heading, map.neighbourhood, map.ctaLabel, map.ctaHref
```

**After Stitch generates the component**, paste into:
```
packages/section-registry/src/sections/map-preview-section.tsx
```
Then follow the 8-step transfer checklist above.

---

## Notes
- Keep Stitch components purely presentational. Wire live data (listings, agents) inside
  the section-registry render layer after transfer, not inside the Stitch-generated file.
- If Stitch adds `useState` or data fetching, strip it before pasting.
- If Stitch uses `next/image`, replace with a plain `<img>` or `<div>` placeholder.
- Re-run the prompt with tighter constraints if the output uses unsupported libraries.
