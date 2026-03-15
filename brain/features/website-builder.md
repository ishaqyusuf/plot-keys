# Website Builder

## Purpose
This file documents the structured section-based tenant website builder.

## Goal
Allow each company to launch and manage a professional website using predefined templates, sections, and theme configuration without freeform drag-and-drop complexity.

## Scope
- Structured page layouts
- Reusable section library
- Template selection
- Theme configuration
- CMS edits mapped to section configs
- Automatic property listing sync to public website

## Core Concepts
- Page
- Section
- Section config
- Theme
- Template
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
- The current implementation keeps platform templates in code rather than a `SiteTemplate` database table.
- This is an intentional MVP shortcut and should be treated as the current source of truth until a DB-backed template catalog is added.

## Current Implemented Builder Flow
- On onboarding completion, the system creates a default tenant `SiteConfiguration`.
- `apps/dashboard/src/app/builder/page.tsx` now provides:
  - template browser
  - draft list
  - active-configuration selector
  - central live preview
  - editable field sidebar
  - smart-fill action for editable fields
  - publish action
- `apps/dashboard/src/app/live/page.tsx` now renders the current published tenant website for a selected subdomain.
- `apps/tenant-site/src/app/page.tsx` now resolves published tenant configurations from Prisma and falls back to sample content only when no published tenant site exists.

## Current Tenant Flow
1. User signs up.
2. User verifies account.
3. User creates or confirms company setup and chooses a subdomain.
4. System creates owner membership and a default tenant website configuration from the default platform template.
5. Tenant lands in the dashboard with builder access.
6. Tenant can open the template browser and create additional drafts from `template-1`, `template-2`, or `template-3`.
7. Tenant edits allowed content through the builder sidebar.
8. Tenant can publish a selected draft, which demotes the previous live configuration.

## Current Builder UX
- Template browser opens with a starter tenant configuration already available.
- Selecting a template creates a new tenant-owned draft configuration instead of replacing the live site immediately.
- The builder uses a central live preview and a sidebar field editor.
- Editable fields expose:
  - `label`
  - `shortDetail`
  - `preferredLength`
  - optional smart-fill action
- Publishing now swaps the active live site configuration in the database.

## Current Missing UX
- Inline hover-to-edit with dashed borders is not implemented yet.
- Click-to-focus preview editing is not implemented yet.
- Publish confirmation modal is not implemented yet.
- Derived live business content such as listings is not connected yet.

## Current Data Model
- Platform template
  - Owned in code by `packages/section-registry`
  - Defines section order, section types, default content, default theme, and editable-field metadata
- Tenant site configuration
  - Owned by the tenant company in Prisma
  - Stores editable content, theme overrides, configuration name, version state, and publish status
- Published site
  - Exactly one configuration should be treated as live for a company at a time
- Draft site
  - Multiple drafts may exist for the same company

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
5. Decide when to move platform templates from code into Prisma-backed records

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
