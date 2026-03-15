# Website Builder

## Purpose
This file documents the structured section-based tenant website builder.

## Goal
Allow each company to launch and manage a professional website using predefined templates, sections, and theme configuration without freeform drag-and-drop complexity.

## Scope
- Structured page layouts
- Reusable section library
- Template selection
- Plan-aware template entitlements
- Theme configuration
- CMS edits mapped to section configs
- Automatic property listing sync to public website

## Core Concepts
- Page
- Section
- Section config
- Theme
- Template
- Template tier
- Template entitlement
- Template purchase
- Site configuration
- Draft
- Published configuration
- Editable field metadata
- Derived content
- Theme config
- Page layout

## Rendering Rules
- Sections must be stateless components.
- Each section accepts `config` and `theme`.
- Renderer maps section `type` to a component.
- Invalid or unknown section types must not render unpredictably.
- Theme overrides may change approved visual tokens, but not section structure.
- Preview and published rendering should use the same resolver pipeline and differ only by selected configuration ID.
- Editable content should resolve from tenant `contentJson` keyed by stable `contentKey` values.
- Derived content should resolve from relational records such as company profile, listings, or agents and should not be inline-editable.

## Example Shape
```json
{
  "page": "home",
  "sections": [
    {
      "type": "hero_banner",
      "config": {
        "title": "Luxury Apartments",
        "subtitle": "Find your dream home",
        "backgroundImage": "hero.jpg"
      }
    }
  ]
}
```

## Current Implemented Starter Library
- Hero banner
- Market stats strip
- Story grid
- Listing spotlight cards
- Testimonial strip
- CTA band

## Next Planned Section Library
- Property grid backed by live listing records
- Agent showcase
- Company about section
- Property search bar
- Contact section
- Blog preview
- FAQ
- Map section
- Newsletter signup

## Planned Package and App Ownership
- `packages/section-registry`: section types, schemas, mappings
- `apps/tenant-site`: section rendering and page delivery
- `apps/dashboard`: CMS editing and template/theme management

## Current Implemented Template System
- `packages/section-registry` now exposes a code-backed template catalog with:
  - `template-1`
  - `template-2`
  - `template-3`
- Each template defines:
  - label and description
  - default theme values
  - starter content JSON
  - editable field metadata
  - tier metadata used for plan gating
- The current implementation keeps platform templates in code rather than a `SiteTemplate` database table.
- This is an intentional MVP shortcut and should be treated as the current source of truth until a DB-backed template catalog is added.

## Product Template Access Model
- Templates are grouped into three tabs in the builder selector:
  - Starter
  - Plus
  - Pro
- Starter templates
  - Any template labeled `starter` is free across all subscription tiers
- Plus templates
  - Included for Plus and Pro subscriptions
  - Plus tenants can choose 3 plus templates for free
  - Additional plus templates should support preview-then-purchase flows
- Pro templates
  - Reserved for Pro subscriptions
  - Pro tenants can choose 3 pro templates for free
  - Additional pro templates should support preview-then-purchase flows
- Builder selector behavior
  - Show templates under the three tier tabs
  - Disable templates a tenant is not entitled to use under their current subscription
  - Allow preview for locked paid templates before purchase

## Planned Template Card Metadata
- Template image
- Template title
- Template description
- Usage count
- Usage count should represent how many tenant companies currently use the template so buyers can judge how unique their site may feel

## Current Implemented Builder Flow
- On onboarding completion, the system creates a default tenant `SiteConfiguration`.
- `apps/dashboard/src/app/builder/page.tsx` now provides:
  - left-side builder control rail
  - template browser
  - draft list
  - active-configuration selector
  - central live preview studio
  - publish action
- `apps/dashboard/src/app/live/page.tsx` now renders the current published tenant website for a selected subdomain.
- `apps/tenant-site/src/app/page.tsx` now resolves published tenant configurations from Prisma and falls back to sample content only when no published tenant site exists.

## Current Tenant Flow
1. User signs up.
2. User verifies account.
3. User creates or confirms company setup and chooses a subdomain.
4. System creates owner membership and a default tenant website configuration from the default platform template.
5. Tenant lands in the dashboard with builder access.
6. Tenant can open the template browser and create additional drafts only from templates allowed by the tenant's current subscription tier.
7. Tenant edits allowed content through the builder sidebar.
8. Tenant can publish a selected draft, which demotes the previous live configuration.

## Current Builder UX
- Template browser opens with a starter tenant configuration already available.
- Selecting a template creates a new tenant-owned draft configuration instead of replacing the live site immediately.
- The builder now uses a left configuration rail and a central live preview studio.
- The current left rail now presents:
  - the tenant's active subscription tier
  - feature availability badges for customer accounts, website payments, custom domains, and AI tools
  - a plan-aware template browser grouped into Starter, Plus, and Pro tabs
- The current template picker uses the Brain-aligned tabs:
  - Starter
  - Plus
  - Pro
- The current template selector presents grouped template lists with title, one-line description, tenant-usage counts, locked-state messaging, and draft-creation actions.
- The old right-side content editor has been removed to make the preview the main workspace.
- Preview sections now show hover-level edit affordances as preparation for inline editing.
- Editable fields expose:
  - `label`
  - `shortDetail`
  - `preferredLength`
- Publishing now swaps the active live site configuration in the database.
- Server actions now enforce template access based on the tenant company's stored subscription tier rather than relying on UI state alone.

## Current Missing UX
- True click-to-type inline content editing is not implemented yet.
- Preview page navigation and left-rail theme/config tweaks are not implemented yet.
- Publish confirmation modal is not implemented yet.
- Derived live business content such as listings is not connected yet.
- Preview-before-purchase flows and paid unlock handling are not implemented yet.
- Free-pick tracking for Plus and Pro template allowances is not implemented yet.

## Current Data Model
- Platform template
  - Owned in code by `packages/section-registry`
  - Defines section order, section types, default content, default theme, editable-field metadata, and current tier metadata
- Tenant site configuration
  - Owned by the tenant company in Prisma
  - Stores editable content, theme overrides, configuration name, version state, and publish status
- Published site
  - Exactly one configuration should be treated as live for a company at a time
- Draft site
  - Multiple drafts may exist for the same company
- Planned entitlement data
  - Tenant subscription tier is now stored on `Company`
  - Free template picks already claimed for the tenant
  - Purchased template entitlements
  - Template usage counts derived from unique tenant configurations using each template

## Editable Field Metadata Contract
- Every editable field should define:
  - `contentKey`
  - `label`
  - `fieldType`
  - `shortDetail`
  - `longDetail`
  - optional `preferredLength`
  - optional `placeholder`
  - optional `aiEnabled`
- `shortDetail`
  - concise guidance shown to the tenant
  - example: `Homepage headline. Aim for 4-8 words.`
- `longDetail`
  - richer guidance used by AI or smart-fill generation
  - example: `Write a premium real-estate homepage headline for a Lagos luxury agency. Keep it concise, confident, and under 8 words.`

## Recommended TypeScript Shape
```ts
type EditableFieldDefinition = {
  contentKey: string;
  label: string;
  fieldType:
    | "text"
    | "textarea"
    | "richtext"
    | "image"
    | "url"
    | "color"
    | "select";
  shortDetail: string;
  longDetail: string;
  preferredLength?: string;
  placeholder?: string;
  aiEnabled?: boolean;
};
```

## Current Prisma Model Direction
- `SiteConfiguration` is implemented in Prisma.
- The current model stores:
  - `companyId`
  - `templateKey`
  - `name`
  - `status`
  - `subdomain`
  - `themeJson`
  - `contentJson`
  - `version`
  - `publishedAt`
  - `createdById`
  - `updatedById`
- `SiteTemplate` is not implemented as a database table yet because the current platform template catalog is code-defined.

## Current Remaining Flow Work
1. Replace the local auth/session implementation with Better Auth runtime wiring
2. Add inline hover editing and click-to-focus preview editing
3. Connect derived data sections from company, property, and agent records
4. Add publish confirmation UX
5. Add preview-before-purchase flows and paid unlock handling for locked premium templates
6. Track free-pick claims and other tenant-level template entitlement records
7. Decide when to move platform templates from code into Prisma-backed records

## Validation Goals
- A brand-new tenant never lands in an empty website-builder state.
- A tenant can create multiple draft configurations without affecting the live site.
- Only editable fields can be modified inline.
- AI generation uses section and field metadata rather than generic prompts.
- Publishing a new draft replaces the current live site atomically.

## Future Improvements
- Limited drag-and-drop inside structured constraints
- AI-generated sections
- AI layout suggestions
- Template marketplace
