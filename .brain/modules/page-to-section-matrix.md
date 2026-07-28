# Page To Section Matrix

## Documentation Date: 2026-03-20

## Purpose
This file defines the default section composition for common page types and the per-template home page section matrices.

---

## Standard Page Compositions (planned — not yet multi-page)

### Home
- `Navbar`
- `Hero` or `HeroWithSearch`
- `FeaturedListings`
- `StatsCounter`
- `WhyChooseUs`
- `Testimonials`
- `BlogPreview`
- `CTASection`
- `Footer`

### Listings
- `Navbar`
- `FilterSidebar`
- `SortControls`
- `PropertyGrid`
- `Pagination`
- `Footer`

### Property Detail
- `Navbar`
- `PropertyGallery`
- `PropertySummary`
- `Amenities`
- `FloorPlans`
- `MapSection`
- `AgentCard`
- `RelatedProperties`
- `Footer`

### About
- `Navbar`
- `CompanyStory`
- `MissionVision`
- `TeamGrid`
- `StatsCounter`
- `Footer`

### Contact
- `Navbar`
- `ContactForm`
- `MapSection`
- `Footer`

### Agents
- `Navbar`
- `AgentGrid`
- `Footer`

### Agent Detail
- `Navbar`
- `AgentProfile`
- `AgentListings`
- `Testimonials`
- `Footer`

### Projects
- `Navbar`
- `ProjectGrid`
- `Footer`

### Project Detail
- `Navbar`
- `ProjectGallery`
- `UnitTypes`
- `PaymentPlan`
- `ContactForm`
- `Footer`

### Blog
- `Navbar`
- `ArticleGrid`
- `Footer`

### Blog Post
- `Navbar`
- `ArticleContent`
- `AuthorBox`
- `RelatedPosts`
- `Footer`

### FAQ
- `Navbar`
- `FAQAccordion`
- `CTASection`
- `Footer`

### Services
- `Navbar`
- `ServiceGrid`
- `ProcessSteps`
- `CTASection`
- `Footer`

### Landing Page
- `Hero`
- `BenefitsSection`
- `LeadForm`
- `Testimonials`
- `FAQ`
- `CTASection`

---

## Implemented Home Page Section Matrix (all 45 templates)

> Sections listed in render order. `[off]` = present in inventory but disabled by default.

### Base composition (templates 1, 3, 6, 7–30 except 2, 4, 5)
`hero_banner` → `market_stats` → `listing_spotlight` → `story_grid` → `[testimonial_strip]` → `cta_band`

### template-2 · Leila (Plus)
`hero_banner` → `market_stats` → `listing_spotlight` → `story_grid` → **`testimonial_strip`** → `cta_band`

### template-4 · Kiran (Plus) — listings promoted
`listing_spotlight` → `hero_banner` → `market_stats` → `story_grid` → `[testimonial_strip]` → `cta_band`

### template-5 · Anbar (Pro)
`hero_banner` → `market_stats` → `listing_spotlight` → `story_grid` → **`testimonial_strip`** → `cta_band`

### template-31 · Sama (Starter)
`hero_search` → `listing_spotlight` → `why_choose_us` → `cta_band`

### template-32 · Rania (Starter)
`hero_banner` → `agent_showcase` → `testimonial_strip` → `listing_spotlight` → `cta_band`

### template-33 · Jihan (Starter)
`hero_banner` → `property_grid` → `cta_band`

### template-34 · Nadia (Starter)
`hero_banner` → `story_grid` → `testimonial_strip` → `service_highlights` → `cta_band`

### template-35 · Walid (Starter)
`hero_banner` → `market_stats` → `listing_spotlight` → `market_stats`(×2) → `cta_band`

### template-36 · Tariq (Plus)
`hero_search` → `market_stats` → `listing_spotlight` → `story_grid` → `why_choose_us` → `testimonial_strip` → `cta_band`

### template-37 · Soraya (Plus)
`hero_banner` → `story_grid` → `listing_spotlight` → `agent_showcase` → `testimonial_strip` → `newsletter_strip` → `cta_band`

### template-38 · Rashid (Plus)
`hero_banner` → `market_stats` → `property_grid` → `why_choose_us` → `faq_accordion` → `cta_band`

### template-39 · Dalal (Plus)
`hero_banner` → `service_highlights` → `listing_spotlight` → `story_grid` → `testimonial_strip` → `contact_section` → `cta_band`

### template-40 · Imran (Plus)
`hero_banner` → `why_choose_us` → `listing_spotlight` → `agent_showcase` → `testimonial_strip` → `newsletter_strip` → `cta_band`

### template-41 · Khalid (Pro)
`hero_search` → `market_stats` → `listing_spotlight` → `why_choose_us` → `agent_showcase` → `testimonial_strip` → `faq_accordion` → `contact_section` → `cta_band`

### template-42 · Salma (Pro)
`hero_banner` → `listing_spotlight` → `story_grid` → `testimonial_strip` → `property_grid` → `agent_showcase` → `cta_band`

### template-43 · Faisal (Pro)
`hero_banner` → `market_stats` → `property_grid` → `why_choose_us` → `faq_accordion` → `service_highlights` → `contact_section` → `cta_band`

### template-44 · Dina (Pro)
`hero_banner` → `service_highlights` → `listing_spotlight` → `story_grid` → `why_choose_us` → `testimonial_strip` → `agent_showcase` → `newsletter_strip` → `contact_section` → `cta_band`

### template-45 · Omar (Pro)
`hero_search` → `story_grid` → `listing_spotlight` → `agent_showcase` → `testimonial_strip` → `faq_accordion` → `cta_band`

---

## Notes
- This matrix defines the default home page composition as implemented in `packages/section-registry/src/page-inventory.ts`.
- Templates can override section order, visibility, and variants without changing the shared section components.
- Sections are dynamic and configurable via `visibleSections` in `TemplateConfig`.
- Templates not listed individually (7–30, except 2, 4, 5) use the base composition.
