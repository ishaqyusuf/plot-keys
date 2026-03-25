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
- `apps/tenant-site`: consumes theme-aware public components that can adapt per tenant

## App-Level Documentation Rule
- Every runnable frontend app must keep its own `DESIGN_SYSTEM.md` file beside the app code.
- Current required app docs:
  - `apps/dashboard/DESIGN_SYSTEM.md`
  - `apps/website/DESIGN_SYSTEM.md`
  - `apps/tenant-site/DESIGN_SYSTEM.md`
- `apps/tenant-site` is a template-driven system, so its document should describe renderer and theming rules rather than pretending it has one fixed branded UI language.
- Any meaningful visual-system, component-usage, theming, or layout-rule change in an app should update that app's `DESIGN_SYSTEM.md` in the same workstream.
- Shared token or cross-app design changes should also update this file.

## Tooling Ownership
- Shared Tailwind entry styles should live in `packages/ui` alongside the token contract they expose.
- `packages/ui` should export the shared PostCSS configuration used to compile shared styles.
- Next.js apps should re-export the shared UI PostCSS config during app builds instead of redefining plugin wiring.
- Keep Tailwind v4 source discovery close to the shared stylesheet with explicit `@source` directives for app and package files.

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
- All product-facing and shared UI work must be evaluated for light and dark mode support before it is considered complete.
- Product pages must use semantic Tailwind tokens such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `bg-accent` instead of raw palette classes like `slate-*`, `teal-*`, `amber-*`, hardcoded hex values, or one-off rgba colors.
- If a surface needs a gradient, tint, or translucent treatment, build it from the semantic token contract with CSS variables or token-derived Tailwind values rather than fixed colors.
- Tenant website theming should override approved theme tokens, not component structure.
- New reusable UI should ship with explicit variants instead of boolean prop sprawl.
- Accessibility is a first-order requirement for color contrast, focus states, keyboard interaction, and semantic structure.

## Initial Token Direction
### Color
- Use semantic tokens first: `background`, `foreground`, `muted`, `border`, `primary`, `accent`, `success`, `warning`, `destructive`
- Define semantic color tokens so they can support both light and dark surfaces without component rewrites.
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
- Handles light and dark mode gracefully, or explicitly documents why that surface is intentionally single-theme
- Preserves accessible focus and interaction behavior

## Current Gaps
- TODO: Define the first table and modal primitives for dashboard-heavy workflows
- TODO: Define the shared dark mode strategy for `packages/ui`, including token overrides, activation model, and verification expectations
- TODO: Decide whether charts/data-viz primitives belong in the first design-system milestone
- TODO: Document the theming API for tenant-level overrides once theme editing exists
- TODO: Promote the current dashboard form approach into shared `packages/ui` guidance, including a reusable `SubmitButton` and the approved `Controller`/`FormField` boundary

## Current Implementation
- `packages/ui/src/globals.css` now provides the first semantic token contract for background, foreground, muted text, surface layers, borders, radius, shadows, and primary/accent roles.
- `packages/ui/src/globals.css` is now also responsible for the default dark-mode token contract; page code should not compensate for missing dark colors with app-local overrides.
- Typography now intentionally splits between serif display headings and a sans-serif product reading stack.
- Shared starter primitives now follow a shadcn-style API and include `Alert`, `Badge`, `Button`, `Card`, `Input`, `Label`, `Select`, `Textarea`, and `SectionHeading`.
- `packages/ui/src/components` now holds the installed Shadcn-derived component set directly, replacing the previous custom primitive implementations and exposing each component through explicit package subpath exports rather than a shared barrel file.
- Dashboard auth and builder flows now consume shared form, field-label, and status-message primitives instead of app-local form control styling.
- Dashboard form state should default to `useZodForm`, with `Controller` reserved for controlled inputs and a shared submit-action component used for loading/disabled submit states once exported from `packages/ui`.
- Dashboard, marketing, and tenant website shells should consume shared semantic tokens instead of relying on one-off local styling or fixed palette utilities.
- The first tenant website template uses the shared primitives while preserving a theme-aware boundary in `packages/section-registry`.

## Near-Term Implementation Order
1. Normalize remaining data-entry and empty-state patterns in the dashboard and website apps
2. Add table, dialog, and filter-bar primitives for operational modules
3. Expand the tenant theme token contract beyond accent/background/font values
4. Add field-level validation and helper-message compositions on top of the new form primitives
5. Convert the onboarding checklist into a real persisted flow
