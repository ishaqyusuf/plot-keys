# Website Design System

## Purpose
This file documents the visual system for `apps/website`, the platform marketing site.

## Design Role
- Public-facing acquisition surface for the PlotKeys platform
- Responsible for brand impression, positioning clarity, and conversion into the dashboard auth flow
- Should feel more expressive than the dashboard while still belonging to the same product family

## Foundation
- Inherits shared tokens, globals, and primitives from `@plotkeys/ui`
- Uses the shared semantic color system instead of app-local hardcoded palettes
- Should remain visually aligned with the dashboard at the token level even when compositions are more editorial

## Visual Direction
- Tone: polished, brand-forward, confident, and modern
- Typography: stronger display moments, expressive section headings, cleaner narrative rhythm
- Layout: generous spacing, bold split sections, strong hero composition, high-clarity calls to action
- Motion: allowed to be richer than dashboard surfaces, but only when it improves comprehension or emphasis

## Core Patterns
- Hero sections, feature grids, workflow storytelling, pricing, and CTA bands should feel intentional rather than template-generic
- Reuse shared primitives like `Card`, `Badge`, `Button`, and `SectionHeading` before building app-local alternatives
- Brand panels, gradients, and atmospheric treatments should still be derived from semantic tokens
- Website routes that hand off into dashboard auth should keep visual continuity with the product family

## What Does Not Belong Here
- Dashboard-density operational layouts
- Randomized visual treatments per page without a strong brand rationale
- Hardcoded color drift that breaks consistency with the shared token system

## Documentation Rule
- Any meaningful marketing-site visual direction change should update this file if it changes composition rules, hierarchy, or brand presentation standards.
- Shared changes that affect dashboard and website together should also be reflected in `brain/system/design-system.md`.
