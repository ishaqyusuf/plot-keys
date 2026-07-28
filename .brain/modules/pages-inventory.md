# Pages Inventory

## Documentation Date: 2026-03-20

## Purpose
This file defines the pages supported by the real-estate template system. Pages marked **[IMPLEMENTED]** exist as live routes in the current codebase.

---

## Implemented Pages

The tenant site now exposes public template pages as explicit App Router files rather than one public catch-all route. Page composition still resolves through the section registry compatibility renderer while templates migrate toward concrete page components.

### Home (slug: `/`)
- Always present in every template
- Section composition varies — see templates-catalog.md for per-template section order
- 14 available section types: `hero_banner`, `hero_search`, `market_stats`, `listing_spotlight`, `property_grid`, `story_grid`, `testimonial_strip`, `why_choose_us`, `agent_showcase`, `service_highlights`, `faq_accordion`, `contact_section`, `newsletter_strip`, `cta_band`

### Explicit tenant-site routes
- Core: `/about`, `/contact`, `/contact-us`
- Blog/content: `/blog`, `/blog/[slug]`, `/blogs`, `/blogs/[slug]`, `/insights`, `/insights/[slug]`
- History: `/roadmap`
- Listing-style overview/detail: `/listings`, `/listings/[slug]`, `/properties`, `/properties/[slug]`, `/rentals`, `/rentals/[slug]`, `/portfolio`, `/portfolio/[slug]`, `/projects`, `/projects/[slug]`, `/our-project`
- Family/plan pages: `/agents`, `/areas`, `/services`, `/gallery`, `/faq`, `/testimonials`, `/resources`, `/investors`, `/landlords`, `/tenants`, `/private-sales`, `/press`, `/how-it-works`, `/tenant-resources`
- Utility/legal placeholders: `/privacy`, `/terms`, `/careers`, `/events`, `/inquire`

Unsupported pages return through the shared page support check instead of being accidentally handled by a catch-all route.

---

## Planned Pages (directional — not yet implemented as concrete template-owned page components)

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
- `Search Results`
- `Compare Properties`

### Central Customer Portal Pages (not part of template inventory)
- `Portal Login` — `/portal/login`
- `Portal Sign Up` — `/portal/signup`
- `Portal Dashboard` — `/portal/dashboard`
- `Saved Listings` — `/portal/saved`
- `Offers / Inquiry Tracking` — `/portal/offers`
- `Payments` — `/portal/payments`
- `Account Settings` — `/portal/account/*`

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
- Explicit tenant route mapping lives in `apps/tenant-site/src/lib/tenant-route-map.ts`.
- Shared tenant page rendering lives in `apps/tenant-site/src/lib/tenant-page.tsx`.
- Page definitions live in the template manifest/page inventory bridge and are exposed through `getTemplatePageInventoryStrict()`.
- Template-owned page migration can now target `templatePages` / `templates` from `packages/section-registry`, resolving handles such as `templates.aboutPage.resolve(ctx)` and typed dynamic handles such as `templates.blogContentPage.resolve(ctx)`.
- The active starter register template `riwaq-starter` supports landing, blog, contact, roadmap, privacy, and terms pages.
- The next migration step is replacing compatibility section-stack rendering with concrete template-owned page components while keeping the explicit route files stable.
- Future customer portal routes should live alongside the tenant site in a central route group, but they should not be represented as template page definitions.
