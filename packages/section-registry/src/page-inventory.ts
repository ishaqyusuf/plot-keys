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
// Template-specific page inventories
// ---------------------------------------------------------------------------

/** template-1 "Aster Grove" — clean residential starter */
const template1Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      sections: baseHomeSections,
      slug: "/",
    },
  ],
  templateKey: "template-1",
};

/** template-2 "Atlas Urban" — bold commercial plus */
const template2Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      sections: baseHomeSections.map((s) =>
        s.id === "testimonials" ? { ...s, defaultEnabled: true } : s,
      ),
      slug: "/",
    },
  ],
  templateKey: "template-2",
};

/** template-3 "Palmstone" — warm family pro */
const template3Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      sections: baseHomeSections,
      slug: "/",
    },
  ],
  templateKey: "template-3",
};

/** template-4 "Meridian" — clean residential plus */
const template4Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      // Meridian leads with listings — bump featured-listings to top
      sections: baseHomeSections
        .map((s) =>
          s.id === "featured-listings" ? { ...s, sortOrder: 5 } : s,
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
      slug: "/",
    },
  ],
  templateKey: "template-4",
};

/** template-5 "Thornfield" — bold commercial pro */
const template5Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      sections: baseHomeSections.map((s) =>
        s.id === "testimonials" ? { ...s, defaultEnabled: true } : s,
      ),
      slug: "/",
    },
  ],
  templateKey: "template-5",
};

/** template-6 "Crestview" — warm family pro */
const template6Inventory: TemplatePageInventory = {
  pages: [
    {
      label: "Home",
      pageKey: "home",
      sections: baseHomeSections,
      slug: "/",
    },
  ],
  templateKey: "template-6",
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
