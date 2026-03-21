# Template Config Mode

The template system includes a structured configuration mode.

Users do not edit raw design tokens manually.
Users configure templates through controlled selections.

## User Editable Areas

Users can configure:

- font
- color system
- style preset
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
- Myra
- Lyra

These presets are similar to style systems in modern code-generated design tooling.

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

Images
- named image slots with upload and preview

This keeps the experience simple for non-technical users.

## UI System Guidance

- Configure mode controls should be built primarily with shadcn/ui primitives and composition patterns.
- Prefer shadcn components for tabs, dialogs, sheets, cards, inputs, selects, alerts, tables, and navigation controls.
- Avoid bespoke editor control patterns when shadcn composition can provide the same behavior cleanly.
