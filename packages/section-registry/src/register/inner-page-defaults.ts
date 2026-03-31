/**
 * Default content for inner pages across all register-family templates.
 *
 * Keys use page-prefixed dot-notation (e.g. "about.hero.title") so they
 * don't collide with the home-page keys ("hero.title"). The content aliasing
 * in buildPageSections maps these to the base keys before passing to
 * section builders.
 *
 * Tenants override these by saving page-prefixed keys to their contentJson.
 * These defaults apply when no tenant override exists for the page.
 */

export const innerPageDefaults: Record<string, Record<string, string>> = {
  about: {
    "about.hero.eyebrow": "Our Story",
    "about.hero.title": "About Our Agency",
    "about.hero.subtitle":
      "We are dedicated to helping you find the perfect property. Learn who we are, what we stand for, and why clients trust us.",
    "about.hero.ctaText": "Meet Our Team",
  },

  listings: {
    "listings.hero.title": "Browse Our Listings",
    "listings.hero.subtitle":
      "Find your ideal property from our curated selection of verified listings across prime locations.",
    "listings.hero.ctaText": "Search listings",
  },

  properties: {
    "properties.hero.title": "Our Properties",
    "properties.hero.subtitle":
      "Explore our range of available properties. Every listing is verified and presented with full details.",
    "properties.hero.ctaText": "Browse properties",
  },

  projects: {
    "projects.hero.eyebrow": "Our Portfolio",
    "projects.hero.title": "Explore Our Projects",
    "projects.hero.subtitle":
      "Landmark developments and carefully planned communities built to the highest standards.",
    "projects.hero.ctaText": "View all projects",
  },

  portfolio: {
    "portfolio.hero.eyebrow": "Our Portfolio",
    "portfolio.hero.title": "Exclusive Properties",
    "portfolio.hero.subtitle":
      "A curated collection of exceptional properties for discerning buyers and investors who expect the best.",
    "portfolio.hero.ctaText": "View portfolio",
  },

  rentals: {
    "rentals.hero.title": "Available Rentals",
    "rentals.hero.subtitle":
      "Find your next home from our verified rental listings. Transparent terms, flexible options.",
    "rentals.hero.ctaText": "Browse rentals",
  },

  contact: {
    "contact.hero.eyebrow": "Let's Talk",
    "contact.hero.title": "Get in Touch",
    "contact.hero.subtitle":
      "We'd love to hear from you. Reach out and we'll get back to you shortly.",
    "contact.hero.ctaText": "Send a message",
  },

  agents: {
    "agents.hero.eyebrow": "Our Team",
    "agents.hero.title": "Meet Our Agents",
    "agents.hero.subtitle":
      "Our experienced agents are here to guide you through every step of your property journey.",
    "agents.hero.ctaText": "Contact an agent",
  },

  services: {
    "services.hero.eyebrow": "What We Offer",
    "services.hero.title": "Our Services",
    "services.hero.subtitle":
      "Comprehensive real estate services tailored to your goals, from search to settlement.",
    "services.hero.ctaText": "Learn more",
  },

  "how-it-works": {
    "how-it-works.hero.eyebrow": "The Process",
    "how-it-works.hero.title": "How It Works",
    "how-it-works.hero.subtitle":
      "Simple, transparent, and stress-free. Here's how we help you find your perfect rental.",
    "how-it-works.hero.ctaText": "Get started",
  },

  landlords: {
    "landlords.hero.eyebrow": "For Property Owners",
    "landlords.hero.title": "Landlord Services",
    "landlords.hero.subtitle":
      "Professional property management you can trust. We handle everything so you don't have to.",
    "landlords.hero.ctaText": "Learn more",
  },

  tenants: {
    "tenants.hero.eyebrow": "For Renters",
    "tenants.hero.title": "Finding Your Home",
    "tenants.hero.subtitle":
      "We make the rental process simple and transparent, from first search to move-in day.",
    "tenants.hero.ctaText": "Browse rentals",
  },

  areas: {
    "areas.hero.eyebrow": "Explore Locations",
    "areas.hero.title": "Areas We Serve",
    "areas.hero.subtitle":
      "We operate across the most sought-after neighbourhoods and emerging growth markets.",
    "areas.hero.ctaText": "Find your area",
  },

  "private-sales": {
    "private-sales.hero.eyebrow": "Exclusive Transactions",
    "private-sales.hero.title": "Private Sales",
    "private-sales.hero.subtitle":
      "Discreet, expert-guided property transactions for those who value confidentiality and precision.",
    "private-sales.hero.ctaText": "Enquire privately",
  },

  faq: {
    "faq.hero.eyebrow": "Common Questions",
    "faq.hero.title": "Frequently Asked Questions",
    "faq.hero.subtitle":
      "Find answers to common questions about our services, processes, and what to expect.",
    "faq.hero.ctaText": "Contact us",
  },

  insights: {
    "insights.hero.eyebrow": "Market Intelligence",
    "insights.hero.title": "Property Insights",
    "insights.hero.subtitle":
      "Stay informed with the latest market trends, investment analysis, and property news.",
    "insights.hero.ctaText": "Read more",
  },

  blog: {
    "blog.hero.eyebrow": "Latest Articles",
    "blog.hero.title": "Our Blog",
    "blog.hero.subtitle":
      "Expert advice, market updates, and guides to help you navigate the property market.",
    "blog.hero.ctaText": "Read articles",
  },

  resources: {
    "resources.hero.eyebrow": "Helpful Guides",
    "resources.hero.title": "Resources",
    "resources.hero.subtitle":
      "Guides, checklists, and tools to help you buy, sell, or rent with confidence.",
    "resources.hero.ctaText": "Explore resources",
  },
};

/**
 * The hero content key fields that are aliased per page.
 * When building non-home pages, these base keys are overridden with
 * the page-prefixed equivalents when present in the merged content.
 */
export const pageAliasFields = [
  "hero.eyebrow",
  "hero.title",
  "hero.subtitle",
  "hero.ctaText",
] as const;
