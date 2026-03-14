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
- Theme config
- Page layout

## Rendering Rules
- Sections must be stateless components.
- Each section accepts `config` and `theme`.
- Renderer maps section `type` to a component.
- Invalid or unknown section types must not render unpredictably.
- Theme overrides may change approved visual tokens, but not section structure.

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

## Future Improvements
- Limited drag-and-drop inside structured constraints
- AI-generated sections
- AI layout suggestions
- Template marketplace
