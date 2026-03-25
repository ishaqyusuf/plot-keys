# Dashboard Design System

## Purpose
This file documents the visual system for `apps/dashboard`, the internal multi-tenant product UI.

## Design Role
- Product workspace for authenticated company owners and team members
- Operational interface for onboarding, CRM, listings, builder, domains, billing, and settings
- Should feel efficient, calm, premium, and trustworthy rather than promotional

## Foundation
- Inherits shared tokens, globals, and primitives from `@plotkeys/ui`
- Uses semantic token classes such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `bg-accent`
- Must support light and dark mode through the shared token contract rather than app-local palette hacks

## Visual Direction
- Tone: focused, composed, product-grade, and high-clarity
- Typography: serif display for page-defining moments, sans-serif for workflow reading and controls
- Layout: card-based, spacious enough to reduce noise, compact enough for operational density
- Motion: restrained and functional, never decorative-first

## Core Patterns
- Auth and onboarding may be more expressive, but must still read as part of the same dashboard family
- Application surfaces should prefer shared `Card`, `Badge`, `Button`, `Alert`, `Field`, `Input`, `Select`, and related primitives from `@plotkeys/ui`
- Navigation, tables, filters, empty states, and summary cards should prioritize scanability before ornament
- Gradients and visual accents should be token-derived and used sparingly for hero or status emphasis

## Form Rules
- Default to `useZodForm` for client forms
- Use shared field primitives before inventing app-local form chrome
- Validation, helper text, loading, and disabled states should be visibly consistent across modules
- Dev-only affordances like account autofill and quick-fill tools must stay clearly separated from production UX

## What Does Not Belong Here
- Raw hardcoded palette classes as the primary styling strategy
- One-off form and card systems that duplicate `@plotkeys/ui`
- Marketing-style layouts that trade workflow clarity for spectacle

## Documentation Rule
- Any meaningful dashboard visual change should update this file if it changes the dashboard's design language, component usage rules, or layout conventions.
- If a dashboard-specific pattern becomes broadly reusable, promote it into `packages/ui` and reflect that change in `brain/system/design-system.md`.
