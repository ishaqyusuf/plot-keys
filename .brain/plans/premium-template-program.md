# Premium Template Program

## Objective

Build a small, differentiated portfolio of premium, plug-and-play real-estate website templates that Plot Keys can recommend from onboarding, personalize automatically, populate from tenant data, and publish with a consistent quality bar. Research 50–100 strong products as evidence, but do not turn that research count into 50–100 Plot Keys templates.

The recommended launch target is 12 complete templates across 10–12 business archetypes. Each template must be a complete business website and conversion journey, not a theme variation.

## Product Principle

Use premium websites and commercial themes as a pattern library, not as source templates.

Every Plot Keys template should:

- solve a specific real-estate business model and conversion job
- combine insights from at least three unrelated references
- introduce Plot Keys-specific data, workflow, and onboarding advantages
- own its page inventory, information architecture, visual system, content schema, demo data, and conversion journey
- use shared headless data/action contracts for functionality
- never copy source code, proprietary assets, distinctive copy, or a reference's complete page composition

The portfolio rule is: fewer, deeper, and measurably different templates.

## Current-State Findings

Plot Keys already has useful foundations:

- a plan-owned template register
- explicit public tenant routes
- draft, preview, template-browse, and live rendering modes
- onboarding persistence and tenant-profile derivation
- deterministic recommendation scoring
- editable static content and protected database-owned content
- a form/action registry
- a template sandbox
- one active plan-owned template, `riwaq-starter`

The following issues should be resolved before the catalog is expanded:

1. Onboarding and template manifests do not share a canonical business taxonomy.
   - onboarding currently uses values such as `residential-sales`
   - the active register manifest uses `agency`
   - planned Brain documentation also uses `developer`, `property_manager`, `independent_agent`, and other values

2. Eligibility and ranking are currently combined.
   - plan access, required capabilities, supported data, and page requirements should be hard filters
   - fit should only be scored after a template is eligible

3. The active template has broad tags such as agency, residential, rental, luxury, listings, brand, and leads.
   - broad tags make one template appear suitable for almost every tenant
   - every template needs a narrow primary fit, explicit secondary fits, and explicit exclusions

4. Current scoring gives segment three points, visual intent two points, and conversion intent one point.
   - functional and conversion fit should be more important than visual preference
   - design preference should refine an eligible result, not choose an unsuitable site structure

5. Plan semantics need one contract.
   - product documentation says Starter templates are available on every plan
   - register access currently resolves templates by the tenant's exact plan folder
   - the manifest needs separate `nativeTier`, `availableToPlans`, and purchase/license rules

6. The old 45-template catalog and the new plan-owned register coexist.
   - the plan-owned register should become the only source for new premium work
   - legacy templates should be marked legacy, mapped to replacements, and retired progressively

7. Critical premium feature surfaces are still planned rather than deeply implemented.
   - searchable listing results
   - property details
   - developer/project details
   - land/plot availability and payment plans
   - agent profiles
   - area guides
   - viewing/consultation booking

## Research Program

### Corpus

The first versioned benchmark corpus contains 64 verified references:

- 51 live real-estate businesses
- 13 official commercial WordPress/theme products
- 10 onboarding-aligned archetypes
- an 18-reference benchmark shortlist

The current research catalog should live at:

- `.brain/research/premium-real-estate-template-landscape.md`

### Research Record

Capture the following for every reference:

- name and canonical URL
- source type and date reviewed
- region and market position
- primary business archetype
- target audience
- primary conversion action
- page inventory
- navigation model
- hero and homepage composition
- property/project discovery model
- detail-page model
- trust and proof mechanisms
- forms, booking, WhatsApp, maps, calculators, or other functional modules
- mobile behavior
- imagery and content requirements
- useful patterns
- anti-patterns
- asset/license notes

### Reference Scoring

Score references out of 100:

| Dimension | Weight |
| --- | ---: |
| Business-model fit and information architecture | 20 |
| Conversion journey | 15 |
| Visual direction and art direction | 15 |
| Feature depth | 15 |
| Mobile experience | 10 |
| Content and data resilience | 10 |
| Performance and accessibility signals | 10 |
| Originality/relevance to Plot Keys markets | 5 |

Create two outputs from the corpus:

1. A benchmark shortlist of 15–20 references worth revisiting.
2. Pattern cards such as “search-led hero,” “project availability table,” “agent-led trust,” or “WhatsApp viewing CTA.”

Pattern cards are the design input. Individual websites are not.

## Canonical Onboarding Taxonomy

Avoid asking one `businessType` field to represent the whole business. Store separate, orthogonal dimensions.

### Required Classification Dimensions

| Dimension | Example values | Immediate use |
| --- | --- | --- |
| Organization model | brokerage, developer, property manager, independent agent, investment firm | template eligibility and page inventory |
| Inventory model | for-sale, long-let, short-let, projects, plots, commercial, mixed | discovery and detail-page contracts |
| Primary conversion | inquiry, viewing, valuation, booking, application, WhatsApp, project brochure, plot reservation | CTA and funnel composition |
| Audience | first-time buyers, diaspora, investors, luxury buyers, families, commercial tenants | content, proof, and lead qualification |
| Operating scale | solo, team, multi-branch, enterprise | team, office, navigation, and governance depth |
| Content readiness | listings, projects, agents, testimonials, articles, logo, photography | visibility and placeholder behavior |
| Brand expression | minimal, editorial, architectural, corporate, bold, warm | eligible visual variants and design defaults |
| Required capabilities | search, maps, booking, agent routing, payment plans, plot availability, multilingual, multi-currency | hard eligibility filter |

### Recommendation Pipeline

Use a two-stage recommendation system:

1. Eligibility filter
   - tenant plan and license
   - required pages and capabilities
   - inventory model
   - supported locale/currency
   - data dependencies and valid empty-state behavior

2. Weighted ranking
   - business and inventory fit: 30%
   - conversion fit: 20%
   - audience fit: 15%
   - operational scale/complexity: 10%
   - content-readiness fit: 10%
   - brand expression: 10%
   - novelty/diversity adjustment: 5%

Return the best three options with human-readable reasons, tradeoffs, and any premium upgrade. Do not use AI for the primary ranking until deterministic recommendation data has enough measured outcomes. AI can explain recommendations and generate content after selection.

## Recommended Portfolio

All tiers must meet the same premium visual, accessibility, performance, and responsive standards. Tiers differ by page depth, business complexity, premium capabilities, and licensing—not by basic quality.

### Starter

1. General agency and trust
   - evolve Riwaq into a precise general-agency position
   - lead capture, company story, selected listings, contact, insights

2. Residential search-first
   - home search, featured areas, property results/detail, viewing inquiry

3. Independent agent
   - personal brand, track record, testimonials, listings, valuation/consultation

### Plus

4. Luxury editorial
   - private inventory, high-touch inquiry, editorial storytelling, press/proof

5. Developer and project launch
   - project portfolio, construction status, unit types, floor plans, brochure, payment plan

6. Land, estate, and plot sales
   - estate overview, plot availability, allocation plan, title documents, inspection/reservation CTA

7. Rental and short-let
   - availability, amenities, nightly/monthly pricing, booking or WhatsApp inquiry

8. Property management
   - landlord acquisition, tenant resources, managed portfolio, maintenance/contact flows

### Pro

9. Commercial and corporate
   - office/retail/industrial inventory, research, sectors, advisor routing, corporate inquiry

10. Multi-branch brokerage
   - location offices, agent directory, areas, advanced search, lead routing

11. Investment and portfolio
   - opportunities, ROI/payment-plan presentation, investor resources, gated documents, consultation

12. Master-planned community or mixed-use developer
   - phases, amenities, availability, galleries, maps, progress, investor/buyer journeys

Property portals and large marketplaces should be treated as a separate product mode, not merely a template, because their search, account, moderation, and data-volume requirements materially change the application.

## Template Contract

Extend the concrete template manifest so every template declares:

- `archetype`
- `primaryFit`
- `secondaryFits`
- `explicitExclusions`
- `nativeTier`
- `availableToPlans`
- `licenseModel`
- `supportedInventoryModels`
- `supportedConversions`
- `supportedAudiences`
- `supportedLocales`
- `supportedCurrencies`
- `requiredCapabilities`
- `optionalCapabilities`
- `requiredResources`
- `emptyStateStrategy`
- `pageInventory`
- `conversionJourneys`
- `contentDensity`
- `mediaRequirements`
- `designFingerprint`
- `performanceBudget`
- `accessibilityTarget`
- `demoScenario`
- `recommendationVector`
- `schemaVersion`

### Shared Versus Template-Owned

Shared platform contracts should own:

- tenant-safe data queries
- listing search/filter/sort/pagination rules
- property, project, agent, and area data models
- form and action validation
- booking, inquiry, newsletter, WhatsApp, and lead-routing actions
- analytics events
- SEO metadata primitives
- image and media handling
- preview-mode mutation blocking

Each template should own:

- visual page composition
- navigation and footer presentation
- section presentation
- local UI primitives
- visual states and motion
- authored content schema
- placeholder/demo narrative
- conversion placement

This preserves functional consistency without making every template look the same.

## Design Originality System

Each template needs a written design fingerprint before visual design begins:

- layout silhouette
- navigation model
- typography system
- palette behavior
- image treatment
- surface geometry
- grid rhythm
- iconography
- motion language
- signature interaction

Before approval, compare every new template to the active catalog. It must differ materially from its nearest neighbor on at least four high-salience axes, including at least one structural axis and one visual axis.

Use a 70/20/10 composition:

- 70% proven interaction and conversion conventions
- 20% Plot Keys/business-model differentiation
- 10% controlled experimentation

Run an originality review against the research corpus before release. If a reviewer can identify one source as the obvious parent composition, redesign it.

## Production Workflow

### Gate 0 — Portfolio Brief

Approve:

- archetype and target customer
- primary conversion
- required capabilities
- page inventory
- tier and license model
- nearest catalog competitors
- measurable reason this template should exist

Do not start a template that cannot answer these points.

### Gate 1 — Evidence and Journey

- select 8–12 relevant references from the corpus
- extract pattern cards
- define the visitor journey from landing to conversion
- define desktop and mobile information architecture
- identify empty, sparse, normal, and rich data scenarios

### Gate 2 — Content and Data Contract

- define page, section, content-key, data-source, action, and analytics contracts
- define every editable versus derived field
- define placeholder data and image slots
- define failure and empty-state behavior
- validate the manifest before UI work

### Gate 3 — Visual Concept

Design three key surfaces first:

- home
- the archetype's most important detail page
- the primary conversion surface

Review the three together. A beautiful homepage with a generic or weak detail page is not a premium template.

### Gate 4 — Vertical Slice

Build one end-to-end path using real contracts:

- onboarding recommendation
- draft installation
- tenant data population
- preview navigation
- field editing
- primary form/action
- publish
- live rendering

Only continue the full page inventory after this slice passes.

### Gate 5 — Complete Template

- implement the full page inventory
- connect all supported resources
- finish responsive behavior
- finish content and asset presets
- seed a realistic demo tenant
- add analytics events and SEO metadata

### Gate 6 — Adversarial QA

Test:

- no records
- one record
- many records
- missing optional fields
- missing/broken images
- long company names, titles, prices, locations, and descriptions
- multiple currencies and number formats
- slow network and lower-end mobile behavior
- keyboard-only navigation
- reduced-motion preferences
- invalid form data, repeated submits, rate limits, and server failure
- draft/live isolation
- template browse mode with every mutation blocked

### Gate 7 — Release

- canary with internal and selected test tenants
- collect qualitative review and measured defects
- release only after all blocking gates pass
- monitor performance, publish success, form success, and runtime errors

## Definition of Premium

Use a release scorecard out of 100:

| Dimension | Weight |
| --- | ---: |
| Archetype fit and information architecture | 15 |
| Conversion journey | 15 |
| Visual craft and originality | 15 |
| Feature completeness | 15 |
| Content/data resilience | 10 |
| Responsive and browser quality | 10 |
| Accessibility | 10 |
| Performance | 5 |
| Builder/runtime integrity | 5 |

Release threshold:

- total score at least 90
- no critical defect in any dimension
- no individual dimension below 80% of its available points
- sign-off from product/design, engineering, and QA

## Non-Negotiable Quality Gates

### Functional

- every route, internal link, CTA, form, filter, and action works
- preview/template modes cannot create real business mutations
- draft edits never leak into the live website before publish
- template installation and reinstallation are deterministic
- database-owned content is never editable through static content controls

### Responsive

- visual and interaction tests at 320, 375, 768, 1024, and 1440 pixels
- test current Safari, Chrome, Firefox, Edge, iOS Safari, and Android Chrome
- no horizontal overflow, obscured controls, or hover-only requirements

### Accessibility

- target WCAG 2.2 AA
- zero automated critical/serious accessibility violations
- keyboard, focus order, landmarks, labels, error messages, zoom, and reduced motion manually reviewed
- color customization cannot create an invalid contrast combination

### Performance

At the 75th percentile in field data, target:

- LCP at or below 2.5 seconds
- INP at or below 200 milliseconds
- CLS at or below 0.1

Set per-template image, font, JavaScript, and third-party-script budgets from the first approved baseline. Block regressions greater than the agreed tolerance. Optimize through Next.js image handling, self-hosted/optimized fonts, stable media aspect ratios, and deferred non-critical scripts.

### SEO and Sharing

- unique page titles and descriptions
- canonical URLs
- index/no-index behavior by render mode
- sitemap and robots handling
- Open Graph/Twitter images and alt text
- correct heading hierarchy
- crawlable internal links
- JSON-LD only when it accurately represents visible content and a supported schema
- structured data validated before release

### Security and Privacy

- schema-validated input
- output encoding and sanitization
- tenant isolation
- rate limiting and spam protection on public forms
- secure upload/media policies
- consent-aware analytics and cookie behavior where applicable
- security requirements traced to a current OWASP ASVS baseline

### Content and Assets

- no unlicensed photography, icons, fonts, copy, or demo data
- every image has ownership/provenance metadata
- template works with user-provided photography of uneven quality
- demo content is realistic, geographically appropriate, and clearly replaceable

## Automation

The template CI matrix should generate and test:

- every template
- every supported page
- every render mode
- every critical breakpoint
- empty, sparse, normal, and rich fixture profiles

Automate:

- TypeScript and schema validation
- unit tests for manifest and recommendation logic
- contract tests for data/action hooks
- Playwright navigation and conversion journeys
- screenshot regression tests in a stable environment
- axe accessibility scans
- Lighthouse CI or equivalent lab budgets
- broken-link and metadata checks
- Rich Results Test-compatible structured-data validation where used

Automation is a safety net, not the final design review. Every release still needs manual mobile, keyboard, content, visual, and conversion QA.

## Success Metrics

Track by template and archetype:

- top-three recommendation acceptance rate
- recommendation override rate and selected replacement
- time from onboarding completion to first credible preview
- time to first publish
- percentage publishing without structural edits
- fields and sections changed before publish
- form/WhatsApp/viewing conversion rate
- publish failure rate
- template-related support tickets
- Core Web Vitals pass rate
- accessibility and runtime defect escape rate
- template retention and switch rate after 30/90 days

Use these outcomes to adjust recommendation weights and portfolio coverage. Do not rank templates by subjective popularity alone.

## Delivery Sequence

### Phase 0 — Consolidate the Foundation

- establish canonical taxonomy
- split template eligibility from ranking
- fix plan-access semantics
- make the plan-owned register the forward source of truth
- expand the manifest and validator
- define shared capability contracts

### Phase 1 — Prove the Factory

Build three intentionally different vertical slices:

- Riwaq/general agency
- residential search-first
- developer/project launch

These exercise brand/story, listings, and projects—the three most important system shapes.

### Phase 2 — Release the Core Six

Complete:

- the first three templates
- luxury editorial
- land/estate/plot sales
- rental/short-let

Do not begin Phase 3 until these templates pass the release scorecard and can be installed from onboarding end to end.

### Phase 3 — Complete the 12-Template Portfolio

Add:

- independent agent
- property management
- commercial/corporate
- multi-branch brokerage
- investment/portfolio
- master-planned community

### Phase 4 — Optimize Before Multiplying

- compare recommendation acceptance and publish outcomes
- improve weak archetypes
- retire or merge overlapping legacy templates
- add variants only where measured demand and genuine design distance justify them

## Team Model

The minimum accountable roles are:

- product/template portfolio owner
- senior product or brand designer
- template frontend engineer
- platform/data-contract engineer
- QA owner with accessibility and performance responsibility
- content strategist/editor

People may cover multiple roles, but no role or approval gate should disappear.

## External Quality References

- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [WordPress theme testing guidance](https://developer.wordpress.org/themes/advanced-topics/theme-testing/)
