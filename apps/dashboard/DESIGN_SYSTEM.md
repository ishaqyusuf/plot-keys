# Dashboard Design System

## Purpose
This file defines the visual, structural, and implementation rules for `apps/dashboard`, the authenticated internal multi-tenant product UI.

## Product Role
- Operational workspace for company owners and team members
- Supports onboarding, CRM, listings, builder, domains, billing, reporting, and settings
- Must feel calm, premium, efficient, and trustworthy

## Midday Direction
- The dashboard must follow a Midday-style product direction
- The goal is not generic "modern SaaS UI"; it is composed, dense, restrained, and systemized
- Visual tone should feel editorially polished but operational first
- Surfaces should be neutral-first with sparse accent usage
- Emphasis should come from hierarchy, spacing, and contrast, not loud decoration

## Shared Foundation
- The dashboard inherits tokens, primitives, and global styles from `@plotkeys/ui`
- Source of truth for global tokens lives in [packages/ui/src/globals.css](/Users/M1PRO/Documents/code/plot-keys/packages/ui/src/globals.css)
- Shared primitives such as `Button`, `Card`, `Field`, `Input`, `Dialog`, `Sheet`, `Table`, `Badge`, and `Empty` must be used before creating dashboard-local chrome
- `packages/site-nav` remains the navigation foundation and must not be replaced with app-local navigation infrastructure

## Architecture Rules
- `packages/ui`: generic reusable primitives only
- `packages/site-nav`: reusable navigation foundation only
- `apps/dashboard/src/components/nav`: dashboard shell wiring, app rail, topbar, workspace-level navigation composition
- `apps/dashboard/src/components/dashboard`: dashboard-specific page composition layer
- Route files under `src/app/(app)` should primarily do data loading and compose shared dashboard UI patterns

## Shell Contract
- The authenticated source of truth is `src/app/(app)/layout.tsx`
- The shell must be composed of:
  - app rail
  - site-nav sidebar
  - sticky product header
  - optional page toolbar row
  - standardized content container
- Pages must not invent their own outer shell or ad hoc full-screen layout unless they are deliberate workspace-mode exceptions such as builder

## Page Composition Contract
All standard dashboard routes should be composed with shared dashboard page primitives:
- `DashboardPage`
- `DashboardPageHeader`
- `DashboardPageActions`
- `DashboardPageToolbar`
- `DashboardSection`
- `DashboardSurface`
- `DashboardEmptyState`

Page rules:
- one outer page container
- one standard title block
- one standard actions area
- one optional toolbar row for filters, search, tabs, exports, and view controls
- content should use sections or surfaces instead of freeform stacked wrappers

## Styling Rules
- Prefer semantic token classes such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `bg-accent`
- Do not use raw palette classes as the default styling strategy
- Do not build app-local palette hacks that bypass the shared token contract
- Dark mode must come from the same semantic token contract rather than separate custom palettes

## Tailwind Rules
- Use Tailwind for layout, spacing, density, and structural styling
- Use semantic utility classes instead of raw color utilities whenever possible
- If a UI pattern repeats three or more times, promote it into a dashboard composition component
- Keep route-level class strings structural, not decorative
- Prefer component-level APIs and `cva` variants for reusable states
- Avoid long route-local utility piles for headers, toolbars, filter bars, empty states, and list cards

## Visual Direction
- Tone: composed, precise, premium, and high-clarity
- Density: operational and compact, never cramped
- Borders: low-contrast and consistent
- Elevation: soft and restrained
- Radius: rounded but disciplined, consistent across cards, inputs, dialogs, and sheets
- Accent: used sparingly for active state, primary actions, and status emphasis
- Motion: subtle and functional, never decorative-first

## Typography
- Sans-serif for workflow content, controls, tables, and forms
- Serif may be used sparingly for page-defining moments if it still feels native to the dashboard system
- Page titles should be confident but not oversized
- Section titles should be compact and readable
- Support scanability first, expressiveness second

## Navigation Rules
- Preserve `packages/site-nav` as the dashboard nav foundation
- App rail, sidebar, and topbar must read as one coordinated system
- Active states should use restrained fills, border emphasis, and foreground contrast
- Navigation should not rely on bright fills or generic gray-on-white defaults
- Expanded and collapsed states should feel intentional and polished

## Form Rules
- Default to `useZodForm`
- Use shared field primitives before inventing local form wrappers
- Use dashboard form sections for grouped settings and multi-part editing flows
- Validation, helper text, disabled, destructive, and pending states must be consistent across modules
- Create/edit workflows should prefer sheets for contextual editing and dialogs for confirm/commit moments

## Modal And Sheet Rules
- `Dialog` for confirmation and compact commit flows
- `Sheet` for create, edit, or detail workflows with larger content
- `AlertDialog` for destructive confirmation only
- All overlays should use consistent width, header, footer, and close affordances
- Footer actions should be ordered and spaced consistently
- Overlay surfaces should use token-led classes such as `border-border/70`, `bg-card`, and restrained backdrop blur instead of raw white/gray fallback surfaces

## Collection Rules
- Dashboard collections should use either:
  - card list pattern for richer summaries
  - table pattern for dense operational views
- Filters, search, export, and create actions belong in a shared toolbar contract
- Empty, loading, and error states must use shared patterns

## Exception Rule
- Specialized workspaces such as builder may diverge in layout structure
- Even when layout diverges, they must still honor the same tokens, form rules, dialog rules, sheet rules, and visual language

## Accessibility Rules
- Every icon-only control must have an explicit `aria-label`
- Interactive controls must expose a visible `focus-visible` treatment
- Dialogs and sheets must keep descriptive titles and descriptions whenever the action is not self-evident
- Dense operational layouts are acceptable, but tap targets and keyboard reachability must remain intact

## QA Gate
- Before considering a dashboard change complete, verify:
- page shell consistency
- semantic token usage instead of raw palette drift
- responsive behavior across laptop, tablet, and mobile
- keyboard and focus behavior for nav, forms, dialogs, and sheets
- empty, loading, and error states for affected workflows

## Anti-Drift Rules
- Do not introduce new dashboard page shells, one-off sidebars, or custom topbars outside the shared composition layer
- Do not add raw `bg-white`, `border-gray-*`, `text-slate-*`, or similar palette shortcuts for standard product surfaces unless there is a documented exception
- If a route needs a repeated surface pattern, promote it into `apps/dashboard/src/components/dashboard` before copying utility strings again
- Builder-specific tooling may diverge in layout, but should still inherit the same token discipline for cards, overlays, and controls

## What Does Not Belong Here
- Raw hardcoded palette classes as the default styling strategy
- One-off card and form systems that duplicate `@plotkeys/ui`
- Route-specific shell padding conventions
- Loud marketing-style gradients or decorative motion inside normal product workflows
- Replacing `packages/site-nav` with a parallel dashboard-only navigation foundation

## Documentation Rule
- Any meaningful dashboard visual or structural change should update this file if it changes shell rules, composition rules, component usage, or styling standards
- If a dashboard-specific pattern becomes broadly reusable, promote it into `packages/ui` or `packages/site-nav` as appropriate and document the change here
