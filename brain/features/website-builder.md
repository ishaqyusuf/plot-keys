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
- `apps/websites`: section rendering and page delivery
- `apps/dashboard`: CMS editing and template/theme management

## Current Starter Template
- The first home-page template is a premium real-estate marketing layout built from six structured sections.
- It is currently sample-data driven and intended to become the contract for future CMS editing and property-sync wiring.
- The renderer remains deterministic: each section entry carries its component, type, and config payload.

## Planned Tenant Flow
1. User signs up.
2. User verifies account.
3. User creates or confirms company setup and chooses a subdomain.
4. System creates owner membership and a default tenant website configuration from the default platform template.
5. Tenant lands in dashboard onboarding with a live starter website or starter draft, depending on final onboarding policy.
6. Tenant can open the template browser and create or reopen template drafts.
7. Tenant edits allowed content through inline editing and sidebar controls.
8. Tenant publishes a selected draft after a replacement confirmation modal.

## Planned Builder UX
- Template browser should feel seamless for a new tenant and open with at least one default template already applied.
- Template browser should support multiple templates per tenant, such as `Template 1`, `Template 2`, and `Template 3`.
- Selecting a template should create or open a tenant-owned draft configuration instead of immediately replacing the live site.
- The builder UI should use a central live preview with sidebar configuration controls.
- Hovering editable content should show a dashed or broken border plus editor cursor affordance.
- Clicking editable content should focus the matching sidebar control.
- Derived content should show a read-only indicator such as `Managed from Listings` or `Managed from Company Profile`.
- Publish flow should show a modal explaining that the current live site will be replaced.

## Planned Data Model
- Platform template
  - Owned by the platform
  - Defines section order, section types, default config, and editable-field metadata
- Tenant site configuration
  - Owned by the tenant company
  - Stores editable content, theme overrides, configuration name, version state, and publish status
- Published site
  - Exactly one published configuration per company should be active at a time
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
  - richer guidance used by AI content generation
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

## Recommended Prisma Model Direction
```prisma
model SiteTemplate {
  id                 String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  key                String   @unique
  name               String
  description        String?
  thumbnailUrl       String?  @map("thumbnail_url")
  templateSchemaJson Json     @map("template_schema_json")
  isActive           Boolean  @default(true) @map("is_active")
  createdAt          DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt          DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)
}

model SiteConfiguration {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  companyId   String   @map("company_id") @db.Uuid
  templateId  String   @map("template_id") @db.Uuid
  name        String
  status      String
  subdomain   String?
  themeJson   Json     @map("theme_json")
  contentJson Json     @map("content_json")
  version     Int      @default(1)
  publishedAt DateTime? @map("published_at") @db.Timestamptz(6)
  createdById String?  @map("created_by_id")
  updatedById String?  @map("updated_by_id")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)
}
```

## Recommended Flow Implementation Order
1. Signup and verification
2. Tenant onboarding and subdomain selection
3. Default site configuration bootstrap
4. Tenant dashboard website entrypoint
5. Template browser and draft selection
6. Inline editing and sidebar controls
7. AI generate actions using field metadata
8. Publish confirmation and live replacement flow

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
