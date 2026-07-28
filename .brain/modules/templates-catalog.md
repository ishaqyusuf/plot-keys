# Templates Catalog

## Documentation Date: 2026-03-20

## Purpose
Complete reference for all 45 live templates. Each entry records the template key, name, plan/tier, description, marketing tagline, default market, accent colour, pages, home-page section composition (ordered), form endpoints, primary CTA links, and whether the template can be purchased individually.

---

## Section Type Key

| Component name | Type key | Form? | Description |
|---|---|---|---|
| HeroBannerSection | `hero_banner` | No | Two-column hero: eyebrow label, H1 title, subtitle, primary CTA button, signature image card |
| MarketStatsSection | `market_stats` | No | Horizontal strip of 3 market stat items (label + value) |
| ListingSpotlightSection | `listing_spotlight` | No | Editorial grid of up to 3 featured listings; pulls from live listings or shows placeholder cards |
| StoryGridSection | `story_grid` | No | Brand story / positioning block: headline, intro paragraph, 3 feature tiles |
| TestimonialStripSection | `testimonial_strip` | No | Strip of 3 client quotes with speaker name and role |
| CtaBandSection | `cta_band` | No | Full-width conversion band: headline, body, primary CTA button (consultation), secondary CTA (view homes) |
| AgentShowcaseSection | `agent_showcase` | No | Agent team cards (photo, name, title, bio); populated from live agents |
| PropertyGridSection | `property_grid` | No | Grid of property cards (image, title, location, price, specs); links to /properties |
| ContactSection | `contact_section` | **Yes** — contact form; POST `/api/contact`; fields: name, email, phone, message | Contact info column + form column; shows phone, email, address, WhatsApp |
| FAQAccordionSection | `faq_accordion` | No | Expandable FAQ accordion; 4 default items (schedule viewing, areas covered, financing, buying timeline) |
| NewsletterSection | `newsletter_strip` | **Yes** — newsletter signup; `forms.submitNewsletterSignup`; field: email | Email capture strip: headline, subtitle, email input, subscribe button |
| HeroSearchSection | `hero_search` | No | Full-width dark hero with integrated search bar: property type selector, location dropdown, price range; CTA → /properties |
| WhyChooseUsSection | `why_choose_us` | No | 4-column icon/stat grid: 500+ Properties Sold, 98% Client Satisfaction, 25+ Neighborhoods, 15+ Years Experience |
| ServiceHighlightsSection | `service_highlights` | No | 3-column service cards (icon, title, description): Property Search, Transaction Management, Market Advisory |

---

## Starter Plan (15 templates)

### template-1 · Zara

| Field | Value |
|---|---|
| Key | `template-1` |
| Name | Zara |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Zara Realty |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f8fafc` |
| Font | Satoshi / Georgia |
| Description | Premium luxury positioning with calm, editorial presentation. |
| Marketing Tagline | A calm, editorial layout built for luxury and premium residential brands. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ❌ off | — |
| 6 | CTA Band | `cta_band` | ✅ | # (consultation) / #featured-listings |

**Forms:** None

---

### template-7 · Nura

| Field | Value |
|---|---|
| Key | `template-7` |
| Name | Nura |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Nura Realty |
| Default Market | Lagos |
| Accent Colour | `#0369a1` (blue) |
| Background | `#f0f9ff` |
| Font | Inter |
| Description | Lightweight, clean starter for high-volume residential agencies. |
| Marketing Tagline | Simple, clean layout that puts your listings first without the fluff. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-8 · Siraj

| Field | Value |
|---|---|
| Key | `template-8` |
| Name | Siraj |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Siraj Homes |
| Default Market | Abuja |
| Accent Colour | `#1e293b` (slate) |
| Background | `#f8fafc` |
| Font | Satoshi / Space Grotesk |
| Description | Bold, professional starter for urban and commercial-leaning agencies. |
| Marketing Tagline | Bold and professional — a confident first impression for modern agencies. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-9 · Saba

| Field | Value |
|---|---|
| Key | `template-9` |
| Name | Saba |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Saba Properties |
| Default Market | Port Harcourt |
| Accent Colour | `#1d4ed8` (blue) |
| Background | `#f8fafc` |
| Font | Satoshi |
| Description | Energetic, lead-focused starter for growing agencies. |
| Marketing Tagline | High-energy layout built to convert browsers into enquiries. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-10 · Reem

| Field | Value |
|---|---|
| Key | `template-10` |
| Name | Reem |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Reem Realty |
| Default Market | Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f0fdf4` |
| Font | Inter |
| Description | Clean, trustworthy starter ideal for rental and property management brands. |
| Marketing Tagline | Calm and credible — built for rental agencies and property managers. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-14 · Hana

| Field | Value |
|---|---|
| Key | `template-14` |
| Name | Hana |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Hana Realty |
| Default Market | Ibadan |
| Accent Colour | `#d97706` (amber) |
| Background | `#fffbeb` |
| Font | Georgia |
| Description | Warm, family-friendly starter for community-rooted agencies. |
| Marketing Tagline | A warm, family-centred starter for agencies rooted in community trust. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-15 · Farah

| Field | Value |
|---|---|
| Key | `template-15` |
| Name | Farah |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Farah Realty |
| Default Market | Lagos |
| Accent Colour | `#7c3aed` (violet) |
| Background | `#faf5ff` |
| Font | Inter / Epilogue |
| Description | Bright, conversion-optimised starter that drives enquiries fast. |
| Marketing Tagline | Bright and conversion-focused — built to turn visitors into enquiries. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-16 · Dara

| Field | Value |
|---|---|
| Key | `template-16` |
| Name | Dara |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Dara Properties |
| Default Market | Enugu |
| Accent Colour | `#059669` (emerald) |
| Background | `#f0fdf4` |
| Font | Satoshi |
| Description | Trustworthy, no-nonsense starter for honest mid-market agencies. |
| Marketing Tagline | No-nonsense, trustworthy starter for agencies that put honesty first. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-17 · Layla

| Field | Value |
|---|---|
| Key | `template-17` |
| Name | Layla |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Layla Homes |
| Default Market | Port Harcourt |
| Accent Colour | `#9f1239` (rose) |
| Background | `#fff1f2` |
| Font | Georgia / Playfair Display |
| Description | Boutique-elegant starter for curated, high-care residential brands. |
| Marketing Tagline | Boutique-elegant starter for residential brands with a curated, personal touch. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-18 · Jouri

| Field | Value |
|---|---|
| Key | `template-18` |
| Name | Jouri |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Jouri Realty |
| Default Market | Lagos |
| Accent Colour | `#0891b2` (cyan) |
| Background | `#ecfeff` |
| Font | Inter |
| Description | Fresh, lifestyle-led starter for agencies targeting young urban buyers. |
| Marketing Tagline | Fresh and lifestyle-led — built for agencies targeting young urban buyers. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-31 · Sama

| Field | Value |
|---|---|
| Key | `template-31` |
| Name | Sama |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Sama Estates |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0d9488` (teal) |
| Background | `#f0fdfa` |
| Font | Inter |
| Description | Clean, search-driven starter that puts the property search bar front and center. |
| Marketing Tagline | Search-first residential starter with prominent property search hero. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Search | `hero_search` | ✅ | /properties |
| 2 | Featured Listings | `listing_spotlight` | ✅ | — |
| 3 | Why Choose Us | `why_choose_us` | ✅ | — |
| 4 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-32 · Rania

| Field | Value |
|---|---|
| Key | `template-32` |
| Name | Rania |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Rania Realty |
| Default Market | Abuja |
| Accent Colour | `#6366f1` (indigo) |
| Background | `#eef2ff` |
| Font | Satoshi / Space Grotesk |
| Description | Boutique starter layout that puts your agents and team front and center. |
| Marketing Tagline | Agent-first boutique starter that leads with your team. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Agent Showcase | `agent_showcase` | ✅ | — |
| 3 | Testimonials | `testimonial_strip` | ✅ | — |
| 4 | Featured Listings | `listing_spotlight` | ✅ | — |
| 5 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-33 · Jihan

| Field | Value |
|---|---|
| Key | `template-33` |
| Name | Jihan |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Jihan Properties |
| Default Market | Port Harcourt |
| Accent Colour | `#475569` (slate) |
| Background | `#f8fafc` |
| Font | Inter / Epilogue |
| Description | Ultra-clean starter that strips away everything except hero and listings. |
| Marketing Tagline | Minimal, listings-only starter with maximum clarity. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Property Grid | `property_grid` | ✅ | /properties |
| 3 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-34 · Nadia

| Field | Value |
|---|---|
| Key | `template-34` |
| Name | Nadia |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Nadia Living |
| Default Market | Ikoyi, Lagos |
| Accent Colour | `#c026d3` (fuchsia) |
| Background | `#fdf4ff` |
| Font | Georgia / Playfair Display |
| Description | Narrative-first starter for agencies that lead with their brand story. |
| Marketing Tagline | Story-driven starter focused on brand narrative over listings. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | About / Story | `story_grid` | ✅ | — |
| 3 | Testimonials | `testimonial_strip` | ✅ | — |
| 4 | Service Highlights | `service_highlights` | ✅ | — |
| 5 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-35 · Walid

| Field | Value |
|---|---|
| Key | `template-35` |
| Name | Walid |
| Plan | Starter |
| Purchasable | No (free) |
| Default Company | Walid Capital |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#1d4ed8` (blue) |
| Background | `#eff6ff` |
| Font | Satoshi |
| Description | Statistics-forward starter that leads with market data and numbers. |
| Marketing Tagline | Stats-heavy starter for data-confident agencies. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | Market Stats (2nd) | `market_stats` | ✅ | — |
| 5 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

## Plus Plan (15 templates)

### template-2 · Leila

| Field | Value |
|---|---|
| Key | `template-2` |
| Name | Leila |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Leila Homes |
| Default Market | Ikoyi, Lagos |
| Accent Colour | `#1d4ed8` (blue) |
| Background | `#f8fafc` |
| Font | Satoshi / Georgia |
| Description | Sharper city-led positioning for modern urban inventory. |
| Marketing Tagline | Bold, listing-first layout for urban agencies and commercial portfolios. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-4 · Kiran

| Field | Value |
|---|---|
| Key | `template-4` |
| Name | Kiran |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Kiran Estates |
| Default Market | Port Harcourt |
| Accent Colour | `#0369a1` (blue) |
| Background | `#f0f9ff` |
| Font | Inter |
| Description | Clean, listing-first layout for high-volume residential markets. |
| Marketing Tagline | Listing-first, data-backed layout for residential sales agencies. |

**Pages:** Home

**Home Page Sections (ordered — listings promoted to top):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Featured Listings | `listing_spotlight` | ✅ | — |
| 2 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 3 | Market Stats | `market_stats` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ❌ off | — |
| 6 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-11 · Mira

| Field | Value |
|---|---|
| Key | `template-11` |
| Name | Mira |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Mira Living |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f4efe7` (warm ivory) |
| Font | Georgia / Playfair Display |
| Description | Editorial, lifestyle-driven layout for brand-first agencies. |
| Marketing Tagline | Lifestyle-led editorial layout that makes your brand unforgettable. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-12 · Rand

| Field | Value |
|---|---|
| Key | `template-12` |
| Name | Rand |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Rand Realty |
| Default Market | Abuja |
| Accent Colour | `#0369a1` (blue) |
| Background | `#f0f9ff` |
| Font | Inter / Epilogue |
| Description | Versatile, data-forward layout for mixed-portfolio agencies. |
| Marketing Tagline | Balanced and data-forward — handles sales, rentals, and commercial with ease. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-19 · Amal

| Field | Value |
|---|---|
| Key | `template-19` |
| Name | Amal |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Amal Living |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f0fdfa` |
| Font | Georgia / Playfair Display |
| Description | Brand storytelling layout for aspirational residential positioning. |
| Marketing Tagline | Brand storytelling layout for aspirational residential agencies with a clear voice. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-20 · Bayan

| Field | Value |
|---|---|
| Key | `template-20` |
| Name | Bayan |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Bayan Properties |
| Default Market | Abuja |
| Accent Colour | `#2563eb` (blue) |
| Background | `#eff6ff` |
| Font | Inter / Epilogue |
| Description | Data-rich, clear layout for agencies with deep market insight. |
| Marketing Tagline | Data-forward plus layout for agencies with deep market knowledge to share. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-21 · Yasmin

| Field | Value |
|---|---|
| Key | `template-21` |
| Name | Yasmin |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Yasmin Realty |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#be185d` (pink) |
| Background | `#fdf2f8` |
| Font | Georgia / Fraunces |
| Description | Warm, elegant plus layout for boutique and lifestyle-driven agencies. |
| Marketing Tagline | Warm and elegant plus layout for boutique agencies with a lifestyle-first brand. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-22 · Sahar

| Field | Value |
|---|---|
| Key | `template-22` |
| Name | Sahar |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Sahar Estates |
| Default Market | Abuja |
| Accent Colour | `#0369a1` (blue) |
| Background | `#f0f9ff` |
| Font | Satoshi / Space Grotesk |
| Description | Fresh, forward-looking layout for agencies with a growth story to tell. |
| Marketing Tagline | Fresh, growth-oriented plus layout for agencies ready to announce their momentum. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-23 · Tamar

| Field | Value |
|---|---|
| Key | `template-23` |
| Name | Tamar |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Tamar Properties |
| Default Market | Ibadan |
| Accent Colour | `#15803d` (green) |
| Background | `#f0fdf4` |
| Font | Satoshi / Georgia |
| Description | Community-rooted layout for agencies built on long-term client trust. |
| Marketing Tagline | Community-rooted plus layout for agencies where trust is the real product. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-24 · Zain

| Field | Value |
|---|---|
| Key | `template-24` |
| Name | Zain |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Zain Realty |
| Default Market | Lagos |
| Accent Colour | `#334155` (slate) |
| Background | `#f8fafc` |
| Font | Inter / Space Grotesk |
| Description | Minimal, graceful layout that lets properties and brand speak clearly. |
| Marketing Tagline | Graceful and minimal — a plus layout that lets your properties do the talking. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-36 · Tariq

| Field | Value |
|---|---|
| Key | `template-36` |
| Name | Tariq |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Tariq Realty |
| Default Market | Lagos |
| Accent Colour | `#0891b2` (cyan) |
| Background | `#ecfeff` |
| Font | Inter / Space Grotesk |
| Description | Complete search-centric plus layout combining search hero with full content sections. |
| Marketing Tagline | Full-featured search layout with stats, stories, and social proof. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Search | `hero_search` | ✅ | /properties |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Why Choose Us | `why_choose_us` | ✅ | — |
| 6 | Testimonials | `testimonial_strip` | ✅ | — |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-37 · Soraya

| Field | Value |
|---|---|
| Key | `template-37` |
| Name | Soraya |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Soraya Living |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f4efe7` (warm ivory) |
| Font | Georgia / Fraunces |
| Description | Editorial plus layout blending story, listings, and agent showcase in a magazine format. |
| Marketing Tagline | Magazine-style editorial layout for content-rich brands. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | About / Story | `story_grid` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | Agent Showcase | `agent_showcase` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | Newsletter | `newsletter_strip` | ✅ | — |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** Newsletter signup (`forms.submitNewsletterSignup`)

---

### template-38 · Rashid

| Field | Value |
|---|---|
| Key | `template-38` |
| Name | Rashid |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Rashid Investments |
| Default Market | Abuja |
| Accent Colour | `#1e40af` (deep blue) |
| Background | `#f0f9ff` |
| Font | Satoshi / Epilogue |
| Description | Investor-focused plus layout leading with market data and a browseable property grid. |
| Marketing Tagline | Data-driven investor layout with analytics and property grid. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Property Grid | `property_grid` | ✅ | /properties |
| 4 | Why Choose Us | `why_choose_us` | ✅ | — |
| 5 | FAQ Accordion | `faq_accordion` | ✅ | — |
| 6 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-39 · Dalal

| Field | Value |
|---|---|
| Key | `template-39` |
| Name | Dalal |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Dalal Homes |
| Default Market | Ikoyi, Lagos |
| Accent Colour | `#be185d` (pink) |
| Background | `#fdf2f8` |
| Font | Georgia / Playfair Display |
| Description | Service-oriented plus layout that blends lifestyle branding with lead capture. |
| Marketing Tagline | Lifestyle showcase with service highlights and brand storytelling. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Service Highlights | `service_highlights` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | Contact | `contact_section` | ✅ | POST /api/contact |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** Contact form (`contact_section`) — fields: name, email, phone, message → POST `/api/contact`

---

### template-40 · Imran

| Field | Value |
|---|---|
| Key | `template-40` |
| Name | Imran |
| Plan | Plus |
| Purchasable | Yes |
| Default Company | Imran Properties |
| Default Market | Ibadan |
| Accent Colour | `#15803d` (green) |
| Background | `#f0fdf4` |
| Font | Satoshi / Georgia |
| Description | Community-trust plus layout combining social proof with agent prominence. |
| Marketing Tagline | Community-focused layout with trust signals and team showcase. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Why Choose Us | `why_choose_us` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | Agent Showcase | `agent_showcase` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | Newsletter | `newsletter_strip` | ✅ | — |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** Newsletter signup (`forms.submitNewsletterSignup`)

---

## Pro Plan (15 templates)

### template-3 · Cedar

| Field | Value |
|---|---|
| Key | `template-3` |
| Name | Cedar |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Cedar Properties |
| Default Market | Abuja |
| Accent Colour | `#b45309` (amber) |
| Background | `#fffaf0` |
| Font | Satoshi / Georgia |
| Description | Warm, trust-led presentation for family and investor audiences. |
| Marketing Tagline | Warm, trust-driven layout ideal for family buyers and investor audiences. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-5 · Anbar

| Field | Value |
|---|---|
| Key | `template-5` |
| Name | Anbar |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Anbar Capital |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#1e293b` (slate) |
| Background | `#f8fafc` |
| Font | Satoshi / Space Grotesk |
| Description | Bold, data-confident presentation for commercial and investor audiences. |
| Marketing Tagline | High-conviction layout built for commercial and investment-grade mandates. |

**Pages:** Home

**Home Page Sections (ordered — testimonials enabled):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-6 · Duha

| Field | Value |
|---|---|
| Key | `template-6` |
| Name | Duha |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Duha Homes |
| Default Market | Abuja |
| Accent Colour | `#16a34a` (green) |
| Background | `#f0fdf4` |
| Font | Satoshi / Georgia |
| Description | Warm, community-led layout for family-focused mid-market agencies. |
| Marketing Tagline | Welcoming, community-driven layout for family-first residential agencies. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-13 · Noor

| Field | Value |
|---|---|
| Key | `template-13` |
| Name | Noor |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Noor Capital |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#1e293b` (slate) |
| Background | `#0f172a` (dark navy) |
| Font | Satoshi / Space Grotesk |
| Description | Dark, premium pro layout for luxury and high-end commercial brands. |
| Marketing Tagline | Dark, high-conviction layout reserved for luxury and commercial leaders. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-25 · Shams

| Field | Value |
|---|---|
| Key | `template-25` |
| Name | Shams |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Shams Realty |
| Default Market | Lekki, Lagos |
| Accent Colour | `#b45309` (amber) |
| Background | `#fffbeb` |
| Font | Georgia / Playfair Display |
| Description | Sun-lit luxury pro layout for premium warm-market residential mandates. |
| Marketing Tagline | Warm luxury pro layout for agencies serving the premium residential market. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-26 · Karim

| Field | Value |
|---|---|
| Key | `template-26` |
| Name | Karim |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Karim Estates |
| Default Market | Abuja |
| Accent Colour | `#0f766e` (teal) |
| Background | `#f0fdfa` |
| Font | Satoshi |
| Description | Full-featured pro layout for established agencies with broad service offerings. |
| Marketing Tagline | Full-featured pro layout for established agencies with a broad, confident offer. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-27 · Rafiq

| Field | Value |
|---|---|
| Key | `template-27` |
| Name | Rafiq |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Rafiq Properties |
| Default Market | Lagos |
| Accent Colour | `#1e40af` (deep blue) |
| Background | `#f0f9ff` |
| Font | Georgia |
| Description | Trusted-advisor pro layout for agencies where relationships drive everything. |
| Marketing Tagline | Trusted-advisor pro layout for agencies where long-term relationships are the edge. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-28 · Amber

| Field | Value |
|---|---|
| Key | `template-28` |
| Name | Amber |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Amber Realty |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#92400e` (brown-amber) |
| Background | `#fef3c7` |
| Font | Georgia / Fraunces |
| Description | Rich, warm luxury pro for heritage residential and high-value investor markets. |
| Marketing Tagline | Rich, warm luxury pro layout for heritage residential and investor-grade mandates. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-29 · Saffron

| Field | Value |
|---|---|
| Key | `template-29` |
| Name | Saffron |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Saffron Realty |
| Default Market | Ikoyi, Lagos |
| Accent Colour | `#a21caf` (purple) |
| Background | `#fdf4ff` |
| Font | Satoshi / Space Grotesk |
| Description | Premium pro layout for exclusive, invitation-only or ultra-high-net-worth audiences. |
| Marketing Tagline | Premium pro layout for exclusive agencies serving ultra-high-net-worth clients. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-30 · Coral

| Field | Value |
|---|---|
| Key | `template-30` |
| Name | Coral |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Coral Realty |
| Default Market | Lagos Island |
| Accent Colour | `#be123c` (red) |
| Background | `#fff1f2` |
| Font | Inter / Epilogue |
| Description | Coastal-inspired pro layout for aspirational waterfront and high-rise markets. |
| Marketing Tagline | Coastal-inspired pro layout for waterfront and high-rise aspirational markets. |

**Pages:** Home

**Home Page Sections:** Same as template-1 (baseHomeSections) — Testimonials disabled by default.

**Forms:** None

---

### template-41 · Khalid

| Field | Value |
|---|---|
| Key | `template-41` |
| Name | Khalid |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Khalid Group |
| Default Market | Lagos |
| Accent Colour | `#1e293b` (slate) |
| Background | `#f8fafc` |
| Font | Inter / Space Grotesk |
| Description | Maximum-section pro layout with search hero, stats, listings, agents, FAQ, contact, and more. |
| Marketing Tagline | Enterprise search portal with maximum sections and full conversion funnel. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Search | `hero_search` | ✅ | /properties |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | Why Choose Us | `why_choose_us` | ✅ | — |
| 5 | Agent Showcase | `agent_showcase` | ✅ | — |
| 6 | Testimonials | `testimonial_strip` | ✅ | — |
| 7 | FAQ Accordion | `faq_accordion` | ✅ | — |
| 8 | Contact | `contact_section` | ✅ | POST /api/contact |
| 9 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** Contact form (`contact_section`) — fields: name, email, phone, message → POST `/api/contact`

---

### template-42 · Salma

| Field | Value |
|---|---|
| Key | `template-42` |
| Name | Salma |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Salma Realty |
| Default Market | Banana Island, Lagos |
| Accent Colour | `#92400e` (brown-amber) |
| Background | `#fffbeb` |
| Font | Georgia / Playfair Display |
| Description | Visual-first luxury pro layout showcasing properties through editorial presentation. |
| Marketing Tagline | Luxury gallery layout with visual-heavy property showcase. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Featured Listings | `listing_spotlight` | ✅ | — |
| 3 | About / Story | `story_grid` | ✅ | — |
| 4 | Testimonials | `testimonial_strip` | ✅ | — |
| 5 | Property Grid | `property_grid` | ✅ | /properties |
| 6 | Agent Showcase | `agent_showcase` | ✅ | — |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

### template-43 · Faisal

| Field | Value |
|---|---|
| Key | `template-43` |
| Name | Faisal |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Faisal Capital |
| Default Market | Abuja |
| Accent Colour | `#0369a1` (blue) |
| Background | `#f0f9ff` |
| Font | Satoshi |
| Description | Data-heavy investor pro with market stats, property grid, FAQ, and service highlights. |
| Marketing Tagline | Investor pro layout with deep data, FAQ, and service focus. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Market Stats | `market_stats` | ✅ | — |
| 3 | Property Grid | `property_grid` | ✅ | /properties |
| 4 | Why Choose Us | `why_choose_us` | ✅ | — |
| 5 | FAQ Accordion | `faq_accordion` | ✅ | — |
| 6 | Service Highlights | `service_highlights` | ✅ | — |
| 7 | Contact | `contact_section` | ✅ | POST /api/contact |
| 8 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** Contact form (`contact_section`) — fields: name, email, phone, message → POST `/api/contact`

---

### template-44 · Dina

| Field | Value |
|---|---|
| Key | `template-44` |
| Name | Dina |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Dina Realty |
| Default Market | Victoria Island, Lagos |
| Accent Colour | `#7c3aed` (violet) |
| Background | `#faf5ff` |
| Font | Inter / Epilogue |
| Description | Complete conversion funnel pro layout with services, listings, stories, agents, newsletter, and contact. |
| Marketing Tagline | Full marketing funnel with every section for complete conversion. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Banner | `hero_banner` | ✅ | #featured-listings |
| 2 | Service Highlights | `service_highlights` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | About / Story | `story_grid` | ✅ | — |
| 5 | Why Choose Us | `why_choose_us` | ✅ | — |
| 6 | Testimonials | `testimonial_strip` | ✅ | — |
| 7 | Agent Showcase | `agent_showcase` | ✅ | — |
| 8 | Newsletter | `newsletter_strip` | ✅ | — |
| 9 | Contact | `contact_section` | ✅ | POST /api/contact |
| 10 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:**
- Newsletter signup (`forms.submitNewsletterSignup`) — field: email
- Contact form (`contact_section`) — fields: name, email, phone, message → POST `/api/contact`

---

### template-45 · Omar

| Field | Value |
|---|---|
| Key | `template-45` |
| Name | Omar |
| Plan | Pro |
| Purchasable | Yes |
| Default Company | Omar Realty |
| Default Market | Lekki, Lagos |
| Accent Colour | `#0f766e` (teal) |
| Background | `#0f172a` (dark navy) |
| Font | Satoshi / Space Grotesk |
| Description | Dark premium pro combining search hero with story and personal agent service. |
| Marketing Tagline | Premium concierge layout with search hero and personal service focus. |

**Pages:** Home

**Home Page Sections (ordered):**

| # | Section | Type Key | Enabled | CTA / Link |
|---|---|---|---|---|
| 1 | Hero Search | `hero_search` | ✅ | /properties |
| 2 | About / Story | `story_grid` | ✅ | — |
| 3 | Featured Listings | `listing_spotlight` | ✅ | — |
| 4 | Agent Showcase | `agent_showcase` | ✅ | — |
| 5 | Testimonials | `testimonial_strip` | ✅ | — |
| 6 | FAQ Accordion | `faq_accordion` | ✅ | — |
| 7 | CTA Band | `cta_band` | ✅ | # / #featured-listings |

**Forms:** None

---

## Summary Table

| Key | Name | Plan | Purchasable | Home Sections | Forms |
|---|---|---|---|---|---|
| template-1 | Zara | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-2 | Leila | Plus | Yes | Hero → Stats → Listings → Story → Testimonials → CTA | — |
| template-3 | Cedar | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-4 | Kiran | Plus | Yes | **Listings** → Hero → Stats → Story → [Testimonials] → CTA | — |
| template-5 | Anbar | Pro | Yes | Hero → Stats → Listings → Story → Testimonials → CTA | — |
| template-6 | Duha | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-7 | Nura | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-8 | Siraj | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-9 | Saba | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-10 | Reem | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-11 | Mira | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-12 | Rand | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-13 | Noor | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-14 | Hana | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-15 | Farah | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-16 | Dara | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-17 | Layla | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-18 | Jouri | Starter | No | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-19 | Amal | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-20 | Bayan | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-21 | Yasmin | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-22 | Sahar | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-23 | Tamar | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-24 | Zain | Plus | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-25 | Shams | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-26 | Karim | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-27 | Rafiq | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-28 | Amber | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-29 | Saffron | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-30 | Coral | Pro | Yes | Hero → Stats → Listings → Story → [Testimonials] → CTA | — |
| template-31 | Sama | Starter | No | HeroSearch → Listings → WhyChooseUs → CTA | — |
| template-32 | Rania | Starter | No | Hero → Agents → Testimonials → Listings → CTA | — |
| template-33 | Jihan | Starter | No | Hero → PropertyGrid → CTA | — |
| template-34 | Nadia | Starter | No | Hero → Story → Testimonials → ServiceHighlights → CTA | — |
| template-35 | Walid | Starter | No | Hero → Stats → Listings → Stats(2) → CTA | — |
| template-36 | Tariq | Plus | Yes | HeroSearch → Stats → Listings → Story → WhyChooseUs → Testimonials → CTA | — |
| template-37 | Soraya | Plus | Yes | Hero → Story → Listings → Agents → Testimonials → Newsletter → CTA | Newsletter |
| template-38 | Rashid | Plus | Yes | Hero → Stats → PropertyGrid → WhyChooseUs → FAQ → CTA | — |
| template-39 | Dalal | Plus | Yes | Hero → ServiceHighlights → Listings → Story → Testimonials → Contact → CTA | Contact |
| template-40 | Imran | Plus | Yes | Hero → WhyChooseUs → Listings → Agents → Testimonials → Newsletter → CTA | Newsletter |
| template-41 | Khalid | Pro | Yes | HeroSearch → Stats → Listings → WhyChooseUs → Agents → Testimonials → FAQ → Contact → CTA | Contact |
| template-42 | Salma | Pro | Yes | Hero → Listings → Story → Testimonials → PropertyGrid → Agents → CTA | — |
| template-43 | Faisal | Pro | Yes | Hero → Stats → PropertyGrid → WhyChooseUs → FAQ → ServiceHighlights → Contact → CTA | Contact |
| template-44 | Dina | Pro | Yes | Hero → ServiceHighlights → Listings → Story → WhyChooseUs → Testimonials → Agents → Newsletter → Contact → CTA | Newsletter + Contact |
| template-45 | Omar | Pro | Yes | HeroSearch → Story → Listings → Agents → Testimonials → FAQ → CTA | — |

> [Testimonials] = section present but disabled by default for that template.

## Notes
- Templates 7–30 (except 2, 4, 5) not in the page inventory registry: they fall back to `template-1`'s home page composition (baseHomeSections).
- HeroSearchSection (location filter, property type selector) is used in: Sama (31), Tariq (36), Khalid (41), Omar (45).
- Templates with Contact form: Dalal (39), Khalid (41), Faisal (43), Dina (44).
- Templates with Newsletter form: Soraya (37), Imran (40), Dina (44).
- All template CTA band primary link → `#` (book consultation), secondary → `#featured-listings`.
- PropertyGrid CTA → `/properties`.
- HeroSearch CTA → `/properties`.
