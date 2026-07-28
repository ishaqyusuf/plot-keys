# Template Config Mode

The template system includes a structured configuration mode.

Users do not edit raw design tokens manually.
Users configure templates through controlled selections.

## User Editable Areas

Users can configure:

- font
- color system
- accent/theme color
- chart color
- style preset
- icon library
- radius
- menu style
- menu accent
- named template images

## Font Selection

Users select a single primary font by name.

Examples:
- Inter
- Roboto
- Manrope
- Lora

The primary font is the base font for the template.

## Internal Font Fallbacks

Some UI slots may intentionally use a different font from the primary font.

This is controlled internally using font fallback mappings.

Example:
selectedFont = inter

fontFallbacks.inter.subscribeButton = roboto

Resolved usage:
fontFallbacks[selected]?.subscribeButton || selected

This allows templates to preserve refined typography without exposing complexity to users.

## Color Systems

Users select a predefined color system by name.

Users do not select individual shadcn color tokens.

Each color system includes a full token set for:
- background
- foreground
- card
- cardForeground
- popover
- popoverForeground
- primary
- primaryForeground
- secondary
- secondaryForeground
- muted
- mutedForeground
- accent
- accentForeground
- destructive
- destructiveForeground
- border
- input
- ring

Each color system also defines both:
- light mode tokens
- dark mode tokens

## Style Presets

Users select a named style preset.

Style presets control:
- paddings
- spacing
- border radius
- density

Supported presets:
- Vega
- Nova
- Maia
- Lyra
- Mira
- Luma
- Sera
- Rhea

Legacy note:
- `myra` may exist in older stored configs and should continue resolving as a backward-compatible alias, but new configure UI should present `Mira`.

These presets are similar to style systems in modern code-generated design tooling.

## shadcn Create-Style Configure Surface

Template sandbox configure mode should mirror the clean side-panel structure of `ui.shadcn.com/create`:

- full-screen website viewer as the primary surface
- compact floating left side config panel
- expanded state at rest, icon-only collapsed state after the website surface scrolls, and hover/focus expansion while collapsed
- row-based controls for Style, Base Color, Theme, Chart Color, Heading, Font, Icon Library, Radius, Menu, and Menu Accent
- section visibility controls after the style group
- direct select-and-save behavior for row controls, without a separate save button per row
- action buttons for preview/live surfaces without treating tenant profile metadata as configuration
- preset-like command display for quick visual state sharing

The side panel should use standard shadcn/ui primitives from `@plotkeys/ui` for dashboard/editor chrome.

Public template-rendered UI should not import platform dashboard components directly. Template pages should use template-local shadcn-style primitives or registry helpers that resolve through tenant-owned `--pk-*` tokens.

The sandbox config rail should not expose template name, company, market, subdomain, or plan tier as normal style configuration. Those belong to profile/admin flows, not the visual template tuning surface.

## Page Configuration Loading Contract

Each concrete page route should load page configuration through the backend/tRPC layer. The backend decides which source to resolve:

- live tenant site: published tenant website/site snapshot
- sandbox live mode: saved sandbox live snapshot
- sandbox draft mode: latest editable sandbox profile/page config
- dev/dummy mode: valid mock or seed data returned by the same backend contract

Template-owned page components must not fetch raw database state directly. They render from normalized registry context:

- `ctx.content`
- `ctx.theme`
- `ctx.mode`
- `ctx.page`
- `ctx.tenant`
- registry-scoped query/mutation helpers where a page-specific data query is needed

Edits from sandbox/builder mode should save through the owning dashboard/tRPC action, then reload through the same page configuration contract.

## Template Images

Templates define named image slots.

Examples:
- heroImage
- aboutImage
- ctaBackground
- teamPhoto

Each image slot has:
- key
- name
- description
- default image

Users can:
- preview image
- upload replacement image
- reset to default

## Separation of Concerns

Template config mode is separate from section content editing.

Global template config includes:
- selected font
- selected color system
- selected style preset
- named images

Section config includes:
- visibility
- editable content
- section variants
- data bindings

Static marketing copy should be edited inline on the rendered website surface, not through a separate sidebar form. Listing/property/agent data that comes from the database is not inline editable as content, but the surrounding section heading, intro text, labels, and CTA copy should use editable content keys.

For template-owned page components, section visibility controls must be consumed by the page component itself. Saving `sectionVisible.<sectionType>` is not enough if the page bypasses the section-list renderer.

## Preview Navigation Behavior

Template config mode should preserve internal template navigation while keeping the user inside the editor.

- Internal links should resolve through builder query state such as `?path=/`, `?path=/about`, or `?path=/properties`.
- The active `path` should control which page is rendered in preview.
- Navigating inside preview should not exit configure mode or lose unsaved editing context.
- Preview path state should be shareable and restorable when possible.

## Safe Interaction Rules

Template config mode is a simulation environment, not a live runtime.

- Action buttons must not execute their real production behavior in configure mode.
- Contact forms, newsletter forms, booking actions, payment actions, and other mutations must be intercepted.
- Safe behavior may include:
  - no-op interaction
  - editor hint or toast
  - opening the related editable configuration surface
- Interactive elements should remain visually realistic enough for design review, but must not mutate live data or trigger user-facing workflows.

## Runtime Resolution

At runtime, the system resolves:

- selected font
- color system token set
- style preset values
- image slots

Components consume resolved config through hooks.

## Recommended Hooks

- useTemplateConfig
- useResolvedFont
- useColorSystem
- useTemplateStylePreset
- useTemplateImage

## Template UI Primitive Contract

Template-local primitives should compose the active style preset rather than hardcoding radius or density per family.

Implemented registry helpers:
- `templateButtonVariants()`
- `templateInputVariants()`
- `templateSurfaceVariants()`
- `createTemplateUiResolver()`

These helpers translate the active style preset radius settings into reusable button, input, and surface classes for future template-local `ui/*` components.

## Recommended Internal Layers
- user-facing template config
- resolved color-system tokens
- resolved style-preset values
- named image-slot resolution
- internal font fallback mapping for specific UI slots

## Reference Examples
- [brain/code-examples/font-fallbacks.example.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/font-fallbacks.example.ts)
- [brain/code-examples/color-systems.example.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/color-systems.example.ts)
- [brain/code-examples/style-presets.example.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/style-presets.example.ts)
- [brain/code-examples/template-config-provider.example.tsx](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/template-config-provider.example.tsx)

## Editor Experience

Template config mode should provide clear grouped controls:

Design
- font
- color system
- style preset
- radius
- icon/menu controls

Sections
- show/hide section controls
- future section ordering controls

This keeps the experience simple for non-technical users.

## UI System Guidance

- Configure mode controls should be built primarily with shadcn/ui primitives and composition patterns.
- Prefer shadcn components for tabs, dialogs, sheets, cards, inputs, selects, alerts, tables, and navigation controls.
- Avoid bespoke editor control patterns when shadcn composition can provide the same behavior cleanly.

## Standalone Sandbox Configuration Mode

- `apps/sandbox` owns the full-screen internal testing workbench.
- Profile and selected-page state is route-addressable; do not introduce a
  selection sheet or bulk table interaction.
- `page` and `path` query values survive refresh and internal template
  navigation. Invalid editor state falls back to the template home/first page.
- Field controls may update optimistically but must roll back on mutation
  failure and reset when the profile, selected template, or persisted value
  changes.
- Preview/runtime presentation is shared through
  `packages/website-builder`; authentication, tRPC adapters, routing, and
  persistence stay app-owned.
- Public share previews use manifest-declared static and dynamic paths, return
  not found for unsupported routes, preserve draft/live mode across links, and
  keep production actions behind the preview interaction guard.
