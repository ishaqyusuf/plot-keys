import type { TenantResource } from "./types";

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
  /**
   * Which live tenant DB resource feeds the dynamic items in this section.
   * Sections with a dataSource render display-only items — never editable
   * inline in the builder. Editable text (contentKeys) is separate.
   */
  dataSource?: TenantResource;
  /** Human-readable label for the section in the builder sidebar. */
  label: string;
  /**
   * Whether this section is enabled by default for new sites on this template.
   * Disabled slots are hidden from visitors but preserved in the schema.
   */
  defaultEnabled: boolean;
  /** Stable identifier — must be unique within the page. */
  id: string;
  /**
   * Section is auto-hidden when any of these resources are empty for the tenant.
   * Prevents empty placeholder sections from going live.
   */
  requiredResources?: TenantResource[];
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

const faqSlot: SectionSlot = {
  contentKeys: [],
  defaultEnabled: true,
  id: "faq",
  label: "FAQ",
  sectionType: "FAQAccordionSection",
  sortOrder: 55,
};

const contactSlot: SectionSlot = {
  contentKeys: [
    "contact.email",
    "contact.phone",
    "contact.address",
    "contact.whatsapp",
  ],
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
  const slot = baseHomeSections.find((s) => s.id === id);
  if (!slot) throw new Error(`Missing base section slot: ${id}`);
  return slot;
}
const heroSlot = requireSlot("hero");
const marketStatsSlot = requireSlot("market-stats");
const featuredListingsSlot = requireSlot("featured-listings");
const storySlot = requireSlot("story");
const testimonialsSlot = {
  ...requireSlot("testimonials"),
  defaultEnabled: true,
};
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
  "template-45": template45Inventory,
};

/**
 * Returns the page inventory for the given template key.
 * Falls back to template-1's inventory for unknown keys.
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
