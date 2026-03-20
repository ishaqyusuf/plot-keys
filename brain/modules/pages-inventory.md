# Pages Inventory

## Documentation Date: 2026-03-20

## Purpose
This file defines the pages supported by the real-estate template system. Pages marked **[IMPLEMENTED]** exist as live routes in the current codebase.

---

## Implemented Pages

All 45 templates currently ship with a single **Home** page. The page composition (sections and their order) varies per template and is documented in detail in `brain/modules/templates-catalog.md`.

### Home (slug: `/`)
- Always present in every template
- Section composition varies — see templates-catalog.md for per-template section order
- 14 available section types: `hero_banner`, `hero_search`, `market_stats`, `listing_spotlight`, `property_grid`, `story_grid`, `testimonial_strip`, `why_choose_us`, `agent_showcase`, `service_highlights`, `faq_accordion`, `contact_section`, `newsletter_strip`, `cta_band`

---

## Planned Pages (directional — not yet implemented as multi-page templates)

### Core Pages
- `Home` — template home (✅ done)
- `Properties` / `Listings` — searchable property grid
- `Property Detail` — single property view
- `About` — agency story and team
- `Contact` — contact form + map

### Business Pages
- `Services` / `Service Detail`
- `Agents` — agent directory
- `Agent Detail` — individual agent profile
- `Projects` / `Developments` — development projects
- `Project Detail`
- `Property Management`
- `Sell With Us`
- `Buy Property`
- `Rentals`
- `Commercial Real Estate`
- `Luxury Properties`
- `Land / Plots`

### Growth Pages
- `Blog` / `Insights`
- `Blog Post`
- `Area Guide` / `Area Detail`
- `Testimonials`
- `Case Studies`
- `FAQ`
- `Resources / Downloads`
- `Events / Open House`

### Conversion Pages
- `Landing Page`
- `Lead Capture Page`
- `Appointment Booking`
- `Mortgage Calculator`

### User And System Pages
- `Saved Listings`
- `Search Results`
- `Compare Properties`

### Utility Pages
- `404`
- `Coming Soon`
- `Maintenance`

### Legal Pages
- `Privacy Policy`
- `Terms of Service`
- `Cookie Policy`
- `Disclaimer`

---

## Notes
- All templates currently render one page (Home) through `resolveWebsitePresentation()`.
- Page definitions live in `packages/section-registry/src/page-inventory.ts` via `TemplatePageInventory`.
- The page inventory registry currently contains entries for: template-1 through template-6 and template-31 through template-45. Templates 7–30 (except 2, 4, 5) fall back to template-1's home section composition.
- Future multi-page support will extend `PageDefinition[]` per template and add corresponding tenant-site routes.
