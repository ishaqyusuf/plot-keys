# Tenant-Site Design System

## Purpose
This file documents the design-system rules for `apps/tenant-site`, the public tenant website renderer.

## Design Role
- Public tenant-facing website surface
- Must render branded experiences for individual companies without breaking structural consistency
- Uses template-driven presentation rather than one fixed platform-owned layout language

## Foundation
- Built on the shared token and rendering foundation defined in `@plotkeys/ui`, `@plotkeys/section-registry`, and the tenant runtime theme contract
- Tenant sections must consume tenant theme variables and template configuration rather than dashboard-only semantic styling assumptions
- The renderer must preserve accessibility, responsive behavior, and content structure regardless of tenant branding choices

## Visual Direction
- The tenant-site is not one single design system in the same way the dashboard or marketing site is
- It is a controlled theming and template system
- Visual identity comes from template family, tenant theme tokens, content, and section composition

## Template Rule
- `apps/tenant-site` is based on template families and section components, not a single app-local brand system
- Template components must respect the tenant token contract and approved section architecture
- Tenant customization may change tone, palette emphasis, and presentation style, but must not break spacing contracts, accessibility, or layout resilience

## Platform Boundary
- Tenant-facing sections should not import dashboard/product UI patterns directly
- Builder overlays and dashboard chrome belong to the platform design system, not the tenant-site design system
- Theme flexibility should happen through approved variables and template APIs, not ad hoc component rewrites

## Documentation Rule
- Any change to tenant theming, template family rules, section-level visual contracts, or runtime token behavior should update this file and the relevant Brain design docs.
- If a tenant-site change affects template-wide standards, also update `brain/system/design-system.md` and any related ADR or module doc.
