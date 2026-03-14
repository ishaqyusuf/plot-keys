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

## Planned Section Library
- Hero banner
- Property grid
- Featured properties
- Property carousel
- Agent showcase
- Testimonials
- CTA banner
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

## Future Improvements
- Limited drag-and-drop inside structured constraints
- AI-generated sections
- AI layout suggestions
- Template marketplace
