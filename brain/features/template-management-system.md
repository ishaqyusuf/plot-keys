# Template Management System

## Purpose
This file documents the broader template-management system that sits under the website builder and governs template access, versioning, configuration, editable content, assets, and billing-aware entitlements.

## Goal
Allow a tenant to browse, license, configure, install, edit, preview, and publish structured website templates without exposing raw theme internals or freeform page-building complexity.

## Scope
- Template marketplace
- Plan-aware template access
- Tenant template licenses
- Onboarding-driven template recommendation
- Draft/live website versioning
- Section registry and immutable template blueprints
- Structured template configuration mode
- Editable content nodes and AI-assisted writing
- Stock image assignment
- Logo and brand asset management
- Unified billing touchpoints for templates, stock images, and AI credits

## Core Concepts
- `Template`: reusable website blueprint owned by the platform
- `TemplateLicense`: tenant-specific right to install or reuse a template
- `TenantProfile`: derived internal profile created from onboarding inputs and used for recommendations and draft defaults
- `Website`: tenant-owned website root
- `WebsiteVersion`: draft or live snapshot boundary
- `PageVersion`: page record within a website version
- `SectionInstance`: ordered page section with config and data bindings
- `SectionDefinition`: registry-owned type, schema, defaults, and renderer contract
- `EditableContentNode`: structured content value with AI metadata
- `TemplateConfig`: controlled tenant selections for font, color system, style preset, and named images
- `WebsiteAssetAssignment`: tenant asset mapped into a named template slot

## Product Rules
- Templates can be free, plan-included, purchase-based, or admin-granted.
- All template access should resolve into a tenant license record instead of implicit UI state.
- Onboarding should recommend a short ranked set of templates before exposing the full marketplace.
- Editor writes only to draft website state.
- Public website runtime reads only the active live version.
- Publish should be atomic.
- Master template blueprints remain immutable after installation and publish.
- Users configure templates through controlled preset selections rather than raw token editing.
- Paid stock images may appear as watermarked previews in edit mode, but never on the live site without a license.
- AI content generation should update only draft content nodes after user acceptance.
- Preview/configure-mode navigation should support internal page traversal through editor-managed path state rather than leaving the builder runtime.
- Preview/configure-mode actions must be intercepted so template evaluation never triggers real lead capture, payment, booking, or other business mutations.
- Builder-side management UI should default to shadcn/ui-based composition for consistency and maintainability.

## Access Model
- Starter
  - starter-free templates are available
- Plus
  - starter-free templates are available
  - three included Plus claims should produce `PLAN_INCLUDED` license records
  - additional templates should be purchasable
- Pro
  - starter-free templates are available
  - three included Pro claims should produce `PLAN_INCLUDED` license records
  - additional templates should be purchasable

## Template Metadata Direction
- `title`
- `slug`
- `shortDescription`
- `fullDescription`
- `contentDescription`
- `previewImage`
- `previewGallery`
- `demoUrl`
- `tags`
- `stylePreset`
- `pricingModel`
- `price`
- `supportedPages`
- `supportedSections`
- The working inventory for templates, pages, and sections is documented in:
  - [brain/modules/templates-catalog.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/templates-catalog.md)
  - [brain/modules/pages-inventory.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/pages-inventory.md)
  - [brain/modules/sections-inventory.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/sections-inventory.md)
  - [brain/modules/page-to-section-matrix.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/page-to-section-matrix.md)

## Runtime Model Direction
- Tenant resolution sources:
  - custom domain
  - subdomain
  - preview token
  - editor preview route
- Runtime context should carry:
  - tenant identity
  - website identity
  - mode (`draft` or `live`)
  - domain and locale when relevant
  - branding values such as logo, primary color, and font family
  - feature flags for listings, agents, blog, and contact forms
- Planned runtime hooks:
  - `useTenantWebsiteContext()`
  - `useWebsiteMode()`
  - `useTenantTheme()`
  - `useTenantListings()`
  - `useTenantAgents()`
  - `useTenantContactInfo()`
  - `useTemplateConfig()`
- Recommended package split:
  - `apps/web/(dashboard)`
  - `apps/web/(website-runtime)`
  - `apps/web/(website-editor)`
  - `packages/website-builder/core`
  - `packages/website-builder/registry`
  - `packages/website-builder/sections`
  - `packages/website-builder/templates`
  - `packages/website-builder/hooks`
  - `packages/website-builder/actions`
  - `packages/website-builder/schemas`

## Onboarding Integration Direction
- Onboarding inputs should immediately drive:
  - tenant profile derivation
  - recommended template ranking
  - default font, color system, and style preset selection
  - default page composition rules
  - section visibility defaults
  - AI bootstrap prompts for initial draft content
- Content-readiness inputs should directly influence whether sections such as agents, projects, blog preview, or testimonials are hidden, AI-filled, or left with placeholders.
- The initial draft should be created from the recommended or selected template using onboarding inputs before the user enters the editor.
- Template recommendation should produce:
  - top recommendations
  - fallback templates
  - optional premium upgrade suggestions

## Config Mode Direction
- Editable areas:
  - font
  - color system
  - style preset
  - named template images
- Color systems should expose a full token set for light and dark themes.
- Style presets should control spacing, padding, radius, and density choices.
- Resolved config should be derived from small tenant selections rather than copied token blobs wherever possible.
- Some UI slots may intentionally resolve to a different internal font via font fallback maps while still presenting a single primary font choice to the user.

## Editable Content and AI
- Editable text should be modeled as structured content nodes instead of plain strings.
- Content nodes should carry:
  - `key`
  - `type`
  - `value`
  - optional `description`
  - optional `minLength`
  - optional `maxLength`
  - optional `aiEnabled`
- Configure mode behavior:
  1. hover editable text
  2. show outline and action bar
  3. click to edit inline
  4. show AI action for eligible users and eligible content
  5. prepare structured AI payload with tenant, page, and section context
  6. preview result before acceptance
  7. write accepted result back into draft config only
- Reference docs:
  - [brain/modules/editable-content-and-ai.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/editable-content-and-ai.md)
  - [brain/code-examples/editable-text.example.tsx](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/editable-text.example.tsx)
  - [brain/code-examples/section-definition.example.ts](/Users/M1PRO/Documents/code/plot-keys/brain/code-examples/section-definition.example.ts)

## Install And Purchase Flows
- Template install flow:
  1. tenant selects template
  2. system checks existing license, plan claim, or purchase requirement
  3. system creates or confirms the tenant template license
  4. system installs into draft website by copying pages, section instances, default config, and theme baseline
- Asset purchase flow:
  1. user selects paid template or stock image
  2. system checks existing entitlement
  3. system creates purchase intent and billing line item if needed
  4. payment success creates license/entitlement
  5. asset becomes assignable to the tenant website
- Related workflow docs:
  - [brain/workflows/template-install-flow.md](/Users/M1PRO/Documents/code/plot-keys/brain/workflows/template-install-flow.md)
  - [brain/modules/template-marketplace.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/template-marketplace.md)

## Current Implementation Alignment
- The repo already has a structured website builder with code-backed templates, section registry ownership, draft/published `SiteConfiguration` records, and plan-aware template gating.
- The current onboarding flow is still much narrower than the intended onboarding-driven draft generation model.
- The broader marketplace, version graph, stock-image marketplace, logo system, and unified billing center are still planned rather than implemented.
- The imported reference docs describe the target direction and should be treated as design guidance until corresponding code and schema land.

## Current Template Gap
- Most live templates are currently differentiated more by theme, copy defaults, and marketing positioning than by truly distinct page systems or information architecture.
- All 45 live templates currently ship with only a single implemented `Home` page.
- Several templates reuse the same home-page section composition or fall back to a shared base composition.
- This means the current template library has breadth in branding presets, but not yet enough structural uniqueness for users who want a site that feels materially different from other tenants.
- The working evidence for this gap is documented in:
  - [brain/modules/templates-catalog.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/templates-catalog.md)
  - [brain/modules/pages-inventory.md](/Users/M1PRO/Documents/code/plot-keys/brain/modules/pages-inventory.md)

## Template Uniqueness Direction
- Future template work should improve both visual uniqueness and structural uniqueness.
- Structural uniqueness should include:
  - distinct page inventories per template family
  - different home-page section compositions
  - varied navigation models
  - business-model-specific page sets such as listings-heavy, developer/project-focused, rental-management, or luxury/editorial
- A template should not be considered meaningfully unique if the only differences are colors, fonts, seed copy, or image choices.
- Template usage counts should remain visible, but uniqueness should be improved primarily by stronger template families and multi-page depth rather than marketing copy alone.

## Template Family Direction
- The catalog should evolve toward a smaller number of stronger template families, each with clearer structural identity.
- Example family directions:
  - listing-first agency templates
  - luxury editorial templates
  - developer and project-led templates
  - rental/property-management templates
  - corporate real-estate templates
- Each family should have a defined page inventory, section system, and conversion strategy before variants are multiplied.

## Template Register (2026-03-23)

A new plan-based template register is being built at `packages/section-registry/src/register/`. Full specification in `brain/modules/template-register-plan.md`. Key decisions:

- **18 templates** — 6 company-type families × 3 plan tiers (Starter / Plus / Pro)
- **Arabic/MENA naming accent** — consistent with existing catalog (Noor, Bana, Wafi, Faris, Thuraya, Sakan)
- **One name per family** — plan variants live under one folder: `noor/common/`, `noor/starter/`, `noor/plus/`, `noor/pro/`
- **Full page inventories** — all pages per family/plan including Login, Sign Up, Saved Listings, Inquiry Basket, 404, Privacy, Terms
- **Formal content injection contract** — `dataSource` + `requiredResources` on `SectionSlot`; `resolvePage()` resolver; two content channels (static text vs live DB data)
- **4th render mode** — `"template"` added to `RenderMode` for marketplace browse (placeholder data, intercepted clicks)
- **Three non-negotiable standards** — editable boundary (static only), UI system split (sections = raw Tailwind + CSS vars; overlays = shadcn), mobile responsive baseline (mandatory for all tiers)

## Open Items
- TODO: Decide whether `SiteConfiguration` continues as the primary website aggregate or becomes a bridge toward `Website` plus `WebsiteVersion`
- TODO: Decide when template definitions move from code into relational records
- TODO: Finalize license shapes for `FREE`, `PLAN_INCLUDED`, `PURCHASED`, and `ADMIN_GRANTED`
- TODO: Define billing provider and purchase lifecycle ownership for templates and stock images
- TODO: Implement `EditableText` AI icon + action bar (separate task from register)
- TODO: Implement `ClickGuard` + `InlineOverview` panel (separate task from register)
