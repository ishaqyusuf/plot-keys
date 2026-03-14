# Design System

## Purpose
This file defines the shared design-system foundation for PlotKeys across the dashboard, platform marketing site, and tenant websites.

## Why It Exists
- The current Brain references a shared UI package, but it does not yet define the visual system in a durable way.
- PlotKeys needs consistency across internal product surfaces and public website surfaces without forcing every experience to look identical.
- Tenant websites require theme flexibility on top of a stable component and token foundation.

## Design System Goals
- Establish one shared token and component foundation in `packages/ui`.
- Keep dashboard and platform product experiences visually consistent and operationally efficient.
- Allow tenant websites to theme safely without breaking layout, accessibility, or brand quality.
- Prevent ad hoc app-local UI patterns from replacing shared primitives.

## Ownership
- `packages/ui`: canonical home for shared tokens, primitives, compositions, and global styles
- `apps/dashboard`: consumes the product-facing portion of the design system
- `apps/website`: consumes shared marketing-facing primitives and layouts
- `apps/websites`: consumes theme-aware public components that can adapt per tenant

## Layers
1. Foundations
- Color tokens
- Typography scale
- Spacing scale
- Radius scale
- Shadows
- Border treatments
- Motion durations and easing

2. Primitives
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Card
- Dialog
- Sheet
- Tabs
- Table
- Dropdown menu

3. Application Patterns
- Page shell
- Section header
- Empty state
- Data table toolbar
- Form layout
- Filter bar
- Summary stat card
- Modal workflows

4. Website System
- Theme tokens
- Section chrome
- Content width rules
- Hero, grid, CTA, testimonial, and listing presentation patterns

## Core Rules
- Shared tokens must be defined once and consumed everywhere rather than re-declared per app.
- `packages/ui` is the default home for reusable components; app-local components should only exist when they are genuinely app-specific.
- Dashboard and platform marketing should share the same foundational tokens even when compositions differ.
- Tenant website theming should override approved theme tokens, not component structure.
- New reusable UI should ship with explicit variants instead of boolean prop sprawl.
- Accessibility is a first-order requirement for color contrast, focus states, keyboard interaction, and semantic structure.

## Initial Token Direction
### Color
- Use semantic tokens first: `background`, `foreground`, `muted`, `border`, `primary`, `accent`, `success`, `warning`, `destructive`
- Keep tenant branding layered on top of semantic roles rather than replacing the full palette contract

### Typography
- Define a compact product reading scale for dashboard surfaces
- Define a more expressive display scale for marketing and tenant website hero sections
- Use shared token names even when website compositions apply them differently

### Spacing and Layout
- Use a predictable spacing scale for product UI and section layouts
- Define shared content width tokens for marketing and tenant website pages
- Keep section spacing and card spacing tied to tokens rather than hardcoded one-off values

### Motion
- Use restrained motion for product workflows
- Use richer reveal and section transitions for public website surfaces only where they improve clarity

## Product vs Tenant Website Rules
- Dashboard and platform experiences should feel like one coherent product family
- Tenant websites may vary through theme tokens, content, and section composition
- Tenant theming must not alter accessibility behavior, spacing contracts, or section rendering rules

## Component Acceptance Criteria
- Has a clear ownership layer: token, primitive, or composition
- Uses shared tokens instead of hardcoded one-off values
- Has documented variants and default state behavior
- Works across desktop and mobile
- Preserves accessible focus and interaction behavior

## Current Gaps
- TODO: Define the first canonical token set in `packages/ui`
- TODO: Define the first approved typography stack and scale
- TODO: Define the minimum shared primitive set for the dashboard
- TODO: Define which website-specific primitives belong in `packages/ui` versus `packages/section-registry`
- TODO: Decide whether charts/data-viz primitives belong in the first design-system milestone

## Near-Term Implementation Order
1. Define token names and CSS variable contract in `packages/ui`
2. Normalize typography, spacing, radius, and color usage in existing app shells
3. Build the first primitive set around buttons, inputs, cards, dialogs, and tables
4. Add product-level compositions for forms, empty states, filters, and stats
5. Add website theme tokens that map cleanly into section rendering
