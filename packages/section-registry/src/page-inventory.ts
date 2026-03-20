/**
 * Page inventory and section-matrix definitions.
 *
 * Each template ships with a canonical set of pages and, for each page, an
 * ordered list of sections that are "on" by default. Templates can override
 * the base matrix (add, remove, or reorder sections) without changing the
 * shared section components.
 *
 * This module is intentionally free of React so it can be consumed in both
 * server and client contexts.
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/** A section slot within a page. */
export type SectionSlot = {
  /** Content keys this section reads. Helps the builder highlight relevant fields. */
  contentKeys: string[];
  /** Human-readable label for the section in the builder sidebar. */
  label: string;
  /**
   * Whether this section is enabled by default for new sites on this template.
   * Disabled slots are hidden from visitors but preserved in the schema.
   */
  defaultEnabled: boolean;
  /** Stable identifier — must be unique within the page. */
  id: string;
  /** Section component type key (maps to the section registry). */
  sectionType: string;
  /** Display order in the page (lower = higher on page). */
  sortOrder: number;
};

/** A page definition within a template. */
export type PageDefinition = {
  /** Human-readable display name. */
  label: string;
  /** Stable page identifier (e.g. "home", "listings", "contact"). */
  pageKey: string;
  /** Ordered list of section slots for this page. */
  sections: SectionSlot[];
  /** The page slug served at this path (e.g. "/" for home, "/listings"). */
  slug: string;
};

/** Full page inventory for a template. */
export type TemplatePageInventory = {
  pages: PageDefinition[];
  templateKey: string;
};

// ---------------------------------------------------------------------------
// Base / shared section slots
// ---------------------------------------------------------------------------

const baseHomeSections: SectionSlot[] = [
  {
    contentKeys: ["hero.eyebrow", "hero.title", "hero.subtitle", "hero.cta"],
    defaultEnabled: true,
    id: "hero",
    label: "Hero Banner",
    sectionType: "HeroBannerSection",
    sortOrder: 10,
  },
  {
    contentKeys: [
      "marketStats.label",
      "marketStats.stat1Label",
      "marketStats.stat1Value",
      "marketStats.stat2Label",
      "marketStats.stat2Value",
      "marketStats.stat3Label",
      "marketStats.stat3Value",
    ],
    defaultEnabled: true,
    id: "market-stats",
    label: "Market Stats",
    sectionType: "MarketStatsSection",
    sortOrder: 20,
  },
  {
    contentKeys: [
      "listings.heading",
      "listings.subheading",
      "listings.ctaLabel",
    ],
    defaultEnabled: true,
    id: "featured-listings",
    label: "Featured Listings",
    sectionType: "ListingSpotlightSection",
    sortOrder: 30,
  },
  {
    contentKeys: [
      "story.eyebrow",
      "story.heading",
      "story.body",
      "story.ctaLabel",
    ],
    defaultEnabled: true,
    id: "story",
    label: "About / Story",
    sectionType: "StoryGridSection",
    sortOrder: 40,
  },
  {
    contentKeys: [
      "testimonials.heading",
      "testimonials.quote1",
      "testimonials.author1",
      "testimonials.quote2",
      "testimonials.author2",
    ],
    defaultEnabled: false,
    id: "testimonials",
    label: "Testimonials",
    sectionType: "TestimonialStripSection",
    sortOrder: 50,
  },
  {
    contentKeys: ["cta.heading", "cta.subheading", "cta.ctaLabel"],
    defaultEnabled: true,
    id: "cta",
    label: "CTA Band",
    sectionType: "CtaBandSection",
    sortOrder: 60,
  },
];

// ---------------------------------------------------------------------------
// Additional section slots for templates 31–45
// ---------------------------------------------------------------------------

const heroSearchSlot: SectionSlot = {
  contentKeys: ["hero.title", "hero.subtitle", "hero.ctaText"],
  defaultEnabled: true,
  id: "hero-search",
  label: "Hero Search",
  sectionType: "HeroSearchSection",
  sortOrder: 10,
};

const whyChooseUsSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "why-choose-us",
  label: "Why Choose Us",
  sectionType: "WhyChooseUsSection",
  sortOrder: 35,
};

const serviceHighlightsSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "service-highlights",
  label: "Service Highlights",
  sectionType: "ServiceHighlightsSection",
  sortOrder: 37,
};

const faqSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "faq",
  label: "FAQ",
  sectionType: "FAQAccordionSection",
  sortOrder: 55,
};

const newsletterSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "newsletter",
  label: "Newsletter",
  sectionType: "NewsletterSection",
  sortOrder: 57,
};

const contactSlot: SectionSlot = {
  contentKeys: ["contact.email", "contact.phone", "contact.address", "contact.whatsapp"],
  defaultEnabled: true,
  id: "contact",
  label: "Contact",
  sectionType: "ContactSection",
  sortOrder: 58,
};

const agentShowcaseSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "agent-showcase",
  label: "Agent Showcase",
  sectionType: "AgentShowcaseSection",
  sortOrder: 45,
};

const propertyGridSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "property-grid",
  label: "Property Grid",
  sectionType: "PropertyGridSection",
  sortOrder: 32,
};

// Helpers to extract base slots for composition.
// These are guaranteed to exist — they are defined in the `baseHomeSections` literal above.
function requireSlot(id: string): SectionSlot {
  const slot = baseHomeSections.find(s => s.id === id);
  if (!slot) throw new Error(`Missing base section slot: ${id}`);
  return slot;
}
const heroSlot = requireSlot("hero");
const marketStatsSlot = requireSlot("market-stats");
const featuredListingsSlot = requireSlot("featured-listings");
const storySlot = requireSlot("story");
const testimonialsSlot = { ...requireSlot("testimonials"), defaultEnabled: true };
const ctaSlot = requireSlot("cta");

// ---------------------------------------------------------------------------
// Base page compositions for non-home pages
// Shared across all templates unless a template supplies its own override.
// ---------------------------------------------------------------------------

/** About page — company story, differentiators, team, and social proof. */
const baseAboutSections: SectionSlot[] = [
  { ...heroSlot, id: "about-hero", sortOrder: 10 },
  { ...storySlot, id: "about-story", sortOrder: 20 },
  { ...whyChooseUsSlot, id: "about-why-choose-us", sortOrder: 30 },
  { ...marketStatsSlot, id: "about-market-stats", sortOrder: 40 },
  { ...agentShowcaseSlot, id: "about-agents", sortOrder: 50 },
  { ...testimonialsSlot, id: "about-testimonials", sortOrder: 60 },
  { ...ctaSlot, id: "about-cta", sortOrder: 70 },
];

/** Listings page — search, property grid, and call-to-action. */
const baseListingsSections: SectionSlot[] = [
  { ...heroSearchSlot, id: "listings-hero-search", sortOrder: 10 },
  { ...propertyGridSlot, id: "listings-grid", sortOrder: 20 },
  { ...ctaSlot, id: "listings-cta", sortOrder: 30 },
];

/** Contact page — contact form, FAQ, and CTA. */
const baseContactSections: SectionSlot[] = [
  { ...contactSlot, id: "contact-form", sortOrder: 10 },
  { ...faqSlot, id: "contact-faq", sortOrder: 20 },
  { ...ctaSlot, id: "contact-cta", sortOrder: 30 },
];

// ---------------------------------------------------------------------------
// Template-specific page inventories
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helper — compose a full page set from a home page definition.
// Every template gets the same About / Listings / Contact pages by default.
// Individual templates may override any page by replacing the entry.
// ---------------------------------------------------------------------------

/**
 * Composes the full page inventory for a template from its home page definition
 * plus the shared About, Listings, and Contact pages.
 *
 * @param homePage - The template-specific home page definition.
 * @returns An ordered array of all pages: Home, About, Listings, Contact.
 */
function withBasePages(homePage: PageDefinition): PageDefinition[] {
  return [
    homePage,
    {
      label: "About",
      pageKey: "about",
      sections: baseAboutSections,
      slug: "/about",
    },
    {
      label: "Listings",
      pageKey: "listings",
      sections: baseListingsSections,
      slug: "/listings",
    },
    {
      label: "Contact",
      pageKey: "contact",
      sections: baseContactSections,
      slug: "/contact",
    },
  ];
}

/** template-1 "Aster Grove" — clean residential starter */
const template1Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: baseHomeSections,
    slug: "/",
  }),
  templateKey: "template-1",
};

/** template-2 "Atlas Urban" — bold commercial plus */
const template2Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: baseHomeSections.map((s) =>
      s.id === "testimonials" ? { ...s, defaultEnabled: true } : s,
    ),
    slug: "/",
  }),
  templateKey: "template-2",
};

/** template-3 "Palmstone" — warm family pro */
const template3Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: baseHomeSections,
    slug: "/",
  }),
  templateKey: "template-3",
};

/** template-4 "Meridian" — clean residential plus */
const template4Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    // Meridian leads with listings — bump featured-listings to top
    sections: baseHomeSections
      .map((s) =>
        s.id === "featured-listings" ? { ...s, sortOrder: 5 } : s,
      )
      .sort((a, b) => a.sortOrder - b.sortOrder),
    slug: "/",
  }),
  templateKey: "template-4",
};

/** template-5 "Thornfield" — bold commercial pro */
const template5Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: baseHomeSections.map((s) =>
      s.id === "testimonials" ? { ...s, defaultEnabled: true } : s,
    ),
    slug: "/",
  }),
  templateKey: "template-5",
};

/** template-6 "Crestview" — warm family pro */
const template6Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: baseHomeSections,
    slug: "/",
  }),
  templateKey: "template-6",
};

/** template-31 "Sama" — HeroSearch → FeaturedListings → WhyChooseUs → CTA */
const template31Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSearchSlot, sortOrder: 10 },
      { ...featuredListingsSlot, sortOrder: 20, defaultEnabled: true },
      { ...whyChooseUsSlot, sortOrder: 30 },
      { ...ctaSlot, sortOrder: 40 },
    ],
    slug: "/",
  }),
  templateKey: "template-31",
};

/** template-32 "Rania" — Hero → AgentShowcase → Testimonials → Listings → CTA */
const template32Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...agentShowcaseSlot, sortOrder: 20 },
      { ...testimonialsSlot, sortOrder: 30 },
      { ...featuredListingsSlot, sortOrder: 40, defaultEnabled: true },
      { ...ctaSlot, sortOrder: 50 },
    ],
    slug: "/",
  }),
  templateKey: "template-32",
};

/** template-33 "Jihan" — Hero → PropertyGrid → CTA */
const template33Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...propertyGridSlot, sortOrder: 20 },
      { ...ctaSlot, sortOrder: 30 },
    ],
    slug: "/",
  }),
  templateKey: "template-33",
};

/** template-34 "Nadia" — Hero → Story → Testimonials → ServiceHighlights → CTA */
const template34Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...storySlot, sortOrder: 20 },
      { ...testimonialsSlot, sortOrder: 30 },
      { ...serviceHighlightsSlot, sortOrder: 40 },
      { ...ctaSlot, sortOrder: 50 },
    ],
    slug: "/",
  }),
  templateKey: "template-34",
};

/** template-35 "Walid" — Hero → MarketStats → FeaturedListings → MarketStats(2) → CTA */
const template35Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...marketStatsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...marketStatsSlot, id: "market-stats-2", sortOrder: 40 },
      { ...ctaSlot, sortOrder: 50 },
    ],
    slug: "/",
  }),
  templateKey: "template-35",
};

/** template-36 "Tariq" — HeroSearch → MarketStats → FeaturedListings → Story → WhyChooseUs → Testimonials → CTA */
const template36Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSearchSlot, sortOrder: 10 },
      { ...marketStatsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...storySlot, sortOrder: 40 },
      { ...whyChooseUsSlot, sortOrder: 50 },
      { ...testimonialsSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-36",
};

/** template-37 "Soraya" — Hero → Story → FeaturedListings → AgentShowcase → Testimonials → Newsletter → CTA */
const template37Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...storySlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...agentShowcaseSlot, sortOrder: 40 },
      { ...testimonialsSlot, sortOrder: 50 },
      { ...newsletterSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-37",
};

/** template-38 "Rashid" — Hero → MarketStats → PropertyGrid → WhyChooseUs → FAQ → CTA */
const template38Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...marketStatsSlot, sortOrder: 20 },
      { ...propertyGridSlot, sortOrder: 30 },
      { ...whyChooseUsSlot, sortOrder: 40 },
      { ...faqSlot, sortOrder: 50 },
      { ...ctaSlot, sortOrder: 60 },
    ],
    slug: "/",
  }),
  templateKey: "template-38",
};

/** template-39 "Dalal" — Hero → ServiceHighlights → FeaturedListings → Story → Testimonials → Contact → CTA */
const template39Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...serviceHighlightsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...storySlot, sortOrder: 40 },
      { ...testimonialsSlot, sortOrder: 50 },
      { ...contactSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-39",
};

/** template-40 "Imran" — Hero → WhyChooseUs → FeaturedListings → AgentShowcase → Testimonials → Newsletter → CTA */
const template40Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...whyChooseUsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...agentShowcaseSlot, sortOrder: 40 },
      { ...testimonialsSlot, sortOrder: 50 },
      { ...newsletterSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-40",
};

/** template-41 "Khalid" — HeroSearch → MarketStats → FeaturedListings → WhyChooseUs → AgentShowcase → Testimonials → FAQ → Contact → CTA */
const template41Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSearchSlot, sortOrder: 10 },
      { ...marketStatsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...whyChooseUsSlot, sortOrder: 40 },
      { ...agentShowcaseSlot, sortOrder: 50 },
      { ...testimonialsSlot, sortOrder: 60 },
      { ...faqSlot, sortOrder: 70 },
      { ...contactSlot, sortOrder: 80 },
      { ...ctaSlot, sortOrder: 90 },
    ],
    slug: "/",
  }),
  templateKey: "template-41",
};

/** template-42 "Salma" — Hero → FeaturedListings → Story → Testimonials → PropertyGrid → AgentShowcase → CTA */
const template42Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...featuredListingsSlot, sortOrder: 20, defaultEnabled: true },
      { ...storySlot, sortOrder: 30 },
      { ...testimonialsSlot, sortOrder: 40 },
      { ...propertyGridSlot, sortOrder: 50 },
      { ...agentShowcaseSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-42",
};

/** template-43 "Faisal" — Hero → MarketStats → PropertyGrid → WhyChooseUs → FAQ → ServiceHighlights → Contact → CTA */
const template43Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...marketStatsSlot, sortOrder: 20 },
      { ...propertyGridSlot, sortOrder: 30 },
      { ...whyChooseUsSlot, sortOrder: 40 },
      { ...faqSlot, sortOrder: 50 },
      { ...serviceHighlightsSlot, sortOrder: 60 },
      { ...contactSlot, sortOrder: 70 },
      { ...ctaSlot, sortOrder: 80 },
    ],
    slug: "/",
  }),
  templateKey: "template-43",
};

/** template-44 "Dina" — Hero → ServiceHighlights → FeaturedListings → Story → WhyChooseUs → Testimonials → AgentShowcase → Newsletter → Contact → CTA */
const template44Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSlot, sortOrder: 10 },
      { ...serviceHighlightsSlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...storySlot, sortOrder: 40 },
      { ...whyChooseUsSlot, sortOrder: 50 },
      { ...testimonialsSlot, sortOrder: 60 },
      { ...agentShowcaseSlot, sortOrder: 70 },
      { ...newsletterSlot, sortOrder: 80 },
      { ...contactSlot, sortOrder: 90 },
      { ...ctaSlot, sortOrder: 100 },
    ],
    slug: "/",
  }),
  templateKey: "template-44",
};

/** template-45 "Omar" — HeroSearch → Story → FeaturedListings → AgentShowcase → Testimonials → FAQ → CTA */
const template45Inventory: TemplatePageInventory = {
  pages: withBasePages({
    label: "Home",
    pageKey: "home",
    sections: [
      { ...heroSearchSlot, sortOrder: 10 },
      { ...storySlot, sortOrder: 20 },
      { ...featuredListingsSlot, sortOrder: 30, defaultEnabled: true },
      { ...agentShowcaseSlot, sortOrder: 40 },
      { ...testimonialsSlot, sortOrder: 50 },
      { ...faqSlot, sortOrder: 60 },
      { ...ctaSlot, sortOrder: 70 },
    ],
    slug: "/",
  }),
  templateKey: "template-45",
};

// ---------------------------------------------------------------------------
// Registry and lookup
// ---------------------------------------------------------------------------

const pageInventoryRegistry: Record<string, TemplatePageInventory> = {
  "template-1": template1Inventory,
  "template-2": template2Inventory,
  "template-3": template3Inventory,
  "template-4": template4Inventory,
  "template-5": template5Inventory,
  "template-6": template6Inventory,
  "template-31": template31Inventory,
  "template-32": template32Inventory,
  "template-33": template33Inventory,
  "template-34": template34Inventory,
  "template-35": template35Inventory,
  "template-36": template36Inventory,
  "template-37": template37Inventory,
  "template-38": template38Inventory,
  "template-39": template39Inventory,
  "template-40": template40Inventory,
  "template-41": template41Inventory,
  "template-42": template42Inventory,
  "template-43": template43Inventory,
  "template-44": template44Inventory,
  "template-45": template45Inventory,
};

/**
 * Returns the page inventory for the given template key.
 * Falls back to template-1's inventory if the key is unknown.
 */
export function getTemplatePageInventory(
  templateKey: string,
): TemplatePageInventory {
  return pageInventoryRegistry[templateKey] ?? template1Inventory;
}

/**
 * Returns the enabled sections for the given page within a template,
 * sorted by `sortOrder`.
 */
export function getEnabledSections(
  templateKey: string,
  pageKey: string,
): SectionSlot[] {
  const inventory = getTemplatePageInventory(templateKey);
  const page = inventory.pages.find((p) => p.pageKey === pageKey);
  if (!page) return [];
  return page.sections
    .filter((s) => s.defaultEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Returns all content keys that a given template page touches.
 * Useful for initializing the content record with all expected keys.
 */
export function collectContentKeys(
  templateKey: string,
  pageKey = "home",
): string[] {
  const inventory = getTemplatePageInventory(templateKey);
  const page = inventory.pages.find((p) => p.pageKey === pageKey);
  if (!page) return [];
  return [...new Set(page.sections.flatMap((s) => s.contentKeys))];
}
