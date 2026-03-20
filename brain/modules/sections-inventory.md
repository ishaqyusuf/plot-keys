# Sections Inventory

## Documentation Date: 2026-03-20

## Purpose
This file defines the reusable UI building blocks in the template system. Sections marked **[IMPLEMENTED]** exist as live React components in `packages/section-registry`. All others are planned or directional.

---

## Implemented Sections (14 live components)

### Hero

| Component | Type Key | Description |
|---|---|---|
| HeroBannerSection | `hero_banner` | Two-column hero: eyebrow label, H1 title, subtitle paragraph, primary CTA button, image/signature card area. Default CTA → `#featured-listings`. Content keys: `hero.eyebrow`, `hero.title`, `hero.subtitle`, `hero.ctaText`. |
| HeroSearchSection | `hero_search` | Full-width dark hero with integrated search bar: property type selector, location dropdown (All locations, Lekki, Ikoyi, Victoria Island, Abuja, Port Harcourt), price range. CTA → `/properties`. Content keys: `hero.title`, `hero.subtitle`, `hero.ctaText`. |

### Listings

| Component | Type Key | Description |
|---|---|---|
| ListingSpotlightSection | `listing_spotlight` | Editorial grid of up to 3 featured listings. Pulls from live listings or shows 3 placeholder cards (Banana Island, Ikoyi, Lekki). Content keys: `listings.heading`, `listings.subheading`, `listings.ctaLabel`. |
| PropertyGridSection | `property_grid` | Grid of property cards with image, title, location, price, specs. Populated from live listings. CTA → `/properties`. Content keys: none (live data). |

### Brand & Trust

| Component | Type Key | Description |
|---|---|---|
| StoryGridSection | `story_grid` | Brand story / positioning block: headline, intro paragraph, 3 feature tiles. Content keys: `story.eyebrow`, `story.heading`, `story.body`, `story.ctaLabel`, `story.title`, `story.description`. |
| TestimonialStripSection | `testimonial_strip` | Horizontal strip of 3 client quotes. Default quotes are Nigeria real estate market personas. Content keys: `testimonials.heading`, `testimonials.quote1`, `testimonials.author1`, etc. |
| WhyChooseUsSection | `why_choose_us` | 4-column stat/icon grid with accent-coloured icons. Default stats: 500+ Properties Sold, 98% Client Satisfaction, 25+ Neighborhoods, 15+ Years Experience. Content keys: none (hardcoded defaults). |

### Stats

| Component | Type Key | Description |
|---|---|---|
| MarketStatsSection | `market_stats` | Horizontal 3-item stat strip. Default: 128 homes sold last year, 21-day closing, 94% verified inquiries. Content keys: `marketStats.*`. |

### Agents

| Component | Type Key | Description |
|---|---|---|
| AgentShowcaseSection | `agent_showcase` | Agent team cards: photo, name, role title, bio. Populated from live agents. Eyebrow: "Our team", title: "The people who make it happen." Content keys: none (live data). |

### Services

| Component | Type Key | Description |
|---|---|---|
| ServiceHighlightsSection | `service_highlights` | 3-column horizontal service cards with icon, title, description. Default services: Property Search, Transaction Management, Market Advisory. Content keys: none (hardcoded defaults). |

### Content

| Component | Type Key | Description |
|---|---|---|
| FAQAccordionSection | `faq_accordion` | Expandable accordion with 4 default Q&As: how to schedule a viewing, areas covered, financing help, buying timeline. Content keys: none (hardcoded defaults). |

### Forms

| Component | Type Key | Form Action | Description |
|---|---|---|---|
| ContactSection | `contact_section` | `forms.submitContact` → POST `/api/contact` | Two-column layout: company info (phone, email, address, WhatsApp) left, contact form right. Fields: name, email, phone, message. Content keys: `contact.email`, `contact.phone`, `contact.address`, `contact.whatsapp`. |
| NewsletterSection | `newsletter_strip` | `forms.submitNewsletterSignup` | Email capture strip: headline "Stay ahead of the market", subtitle, email input, subscribe button, no-spam disclaimer. Field: email only. Content keys: none (hardcoded). |

### Conversion

| Component | Type Key | Description |
|---|---|---|
| CtaBandSection | `cta_band` | Full-width dark conversion band: headline, body paragraph, primary CTA "Book a consultation" → `#`, secondary "View available homes" → `#featured-listings`. Content keys: `cta.heading`, `cta.subheading`, `cta.ctaLabel`, `cta.title`, `cta.body`. |

---

## Form Registry

Form actions are registered in `packages/section-registry/src/form-registry.ts`.

| Section Type | Form Kind | tRPC Procedure | Button Label |
|---|---|---|---|
| `contact_section` | contact | `forms.submitContact` | Send message |
| `property_inquiry_form` | inquiry | `forms.submitInquiry` | Request information |
| `newsletter_section` | newsletter | `forms.submitNewsletterSignup` | Subscribe |
| `seller_form` | seller | `forms.submitContact` | Get a valuation |
| `buyer_form` | buyer | `forms.submitContact` | Start your search |

---

## Planned / Directional Sections (not yet implemented)

### Navigation
- `Navbar`
- `AnnouncementBar`
- `MegaMenu`
- `Breadcrumbs`
- `Footer`
- `MobileActionBar`

### Hero Variants
- `HeroSplit`
- `HeroVideo`
- `HeroSlider`
- `PageHero`

### Listings (extended)
- `LatestListings`
- `PropertyList`
- `PropertyCarousel`
- `RelatedProperties`
- `RecentlyViewed`

### Property Detail
- `PropertyGallery`
- `FullGallery`
- `PropertySummary`
- `Amenities`
- `PropertyFacts`
- `FloorPlans`
- `VirtualTour`
- `VideoTour`
- `DocumentsDownload`

### Agents (extended)
- `AgentGrid`
- `AgentCarousel`
- `AgentCard`
- `AgentProfile`
- `TeamGrid`

### Brand And Trust (extended)
- `AboutPreview`
- `CompanyStory`
- `MissionVision`
- `StatsCounter`
- `Certifications`
- `PartnerLogos`
- `CaseStudies`

### Location And Map
- `MapSection`
- `LocationExplorer`
- `NearbyPlaces`
- `AreaHighlights`

### Services (extended)
- `ServicesPreview`
- `ServiceGrid`
- `ServiceDetail`
- `ProcessSteps`
- `BenefitsSection`
- `PricingPreview`

### Content (extended)
- `RichText`
- `BlogPreview`
- `ArticleGrid`
- `VideoEmbed`
- `ImageGallery`
- `Timeline`
- `Tabs`
- `Accordion`

### Forms (extended)
- `PropertyInquiryForm`
- `BookingForm`
- `LeadForm`
- `SellerForm`
- `BuyerForm`
- `PartnershipForm`

### Utility
- `SearchBar`
- `FilterSidebar`
- `FilterBar`
- `SortControls`
- `Pagination`
- `EmptyState`
- `CTASection`
- `PromoStrip`
- `Countdown`
- `SocialShare`

### Commerce-Like
- `Categories`
- `ROIIndicators`
- `PaymentPlan`
- `AvailabilityTable`

---

## Notes
- Sections are reusable across templates.
- Section = configurable UI unit with `config`, `content`, and visibility rules.
- All 14 implemented sections live in `packages/section-registry/src/sections/`.
  - `home-page.tsx`: HeroBannerSection, MarketStatsSection, StoryGridSection, ListingSpotlightSection, TestimonialStripSection, CtaBandSection
  - `extended-sections.tsx`: AgentShowcaseSection, PropertyGridSection, ContactSection, FAQAccordionSection, NewsletterSection, HeroSearchSection, WhyChooseUsSection, ServiceHighlightsSection
- Type keys are registered in `sectionComponents` map and `sectionBuilders` map in `packages/section-registry/src/index.ts`.
