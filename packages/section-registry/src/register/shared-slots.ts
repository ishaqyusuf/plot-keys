/**
 * Shared section slot definitions used across all template families.
 *
 * These are the canonical section slot shapes. Each family's pages.ts
 * spreads and overrides these as needed (id, sortOrder, defaultEnabled).
 * Do not mutate — always spread a copy.
 */

import type { RegisterSectionSlot } from "./types";

export const slot = {
  heroBanner: {
    contentKeys: ["hero.eyebrow", "hero.title", "hero.subtitle", "hero.ctaText"],
    dataSource: undefined,
    defaultEnabled: true,
    id: "hero",
    label: "Hero Banner",
    sectionType: "HeroBannerSection",
    sortOrder: 10,
  } satisfies RegisterSectionSlot,

  heroSearch: {
    contentKeys: ["hero.title", "hero.subtitle", "hero.ctaText"],
    dataSource: undefined,
    defaultEnabled: true,
    id: "hero-search",
    label: "Hero Search",
    sectionType: "HeroSearchSection",
    sortOrder: 10,
  } satisfies RegisterSectionSlot,

  marketStats: {
    contentKeys: [
      "marketStats.stat1Label", "marketStats.stat1Value",
      "marketStats.stat2Label", "marketStats.stat2Value",
      "marketStats.stat3Label", "marketStats.stat3Value",
    ],
    dataSource: undefined,
    defaultEnabled: true,
    id: "market-stats",
    label: "Market Stats",
    sectionType: "MarketStatsSection",
    sortOrder: 20,
  } satisfies RegisterSectionSlot,

  featuredListings: {
    contentKeys: ["listings.heading", "listings.subheading", "listings.ctaLabel"],
    dataSource: "listings" as const,
    defaultEnabled: true,
    id: "featured-listings",
    label: "Featured Listings",
    sectionType: "ListingSpotlightSection",
    sortOrder: 30,
  } satisfies RegisterSectionSlot,

  propertyGrid: {
    contentKeys: ["propertyGrid.eyebrow", "propertyGrid.title"],
    dataSource: "listings" as const,
    defaultEnabled: true,
    id: "property-grid",
    label: "Property Grid",
    sectionType: "PropertyGridSection",
    sortOrder: 32,
  } satisfies RegisterSectionSlot,

  story: {
    contentKeys: ["story.eyebrow", "story.heading", "story.body", "story.ctaLabel"],
    dataSource: undefined,
    defaultEnabled: true,
    id: "story",
    label: "About / Story",
    sectionType: "StoryGridSection",
    sortOrder: 40,
  } satisfies RegisterSectionSlot,

  whyChooseUs: {
    contentKeys: [],
    dataSource: undefined,
    defaultEnabled: true,
    id: "why-choose-us",
    label: "Why Choose Us",
    sectionType: "WhyChooseUsSection",
    sortOrder: 35,
  } satisfies RegisterSectionSlot,

  serviceHighlights: {
    contentKeys: [],
    dataSource: "services" as const,
    defaultEnabled: true,
    id: "service-highlights",
    label: "Service Highlights",
    sectionType: "ServiceHighlightsSection",
    sortOrder: 37,
  } satisfies RegisterSectionSlot,

  agentShowcase: {
    contentKeys: [],
    dataSource: "agents" as const,
    defaultEnabled: true,
    id: "agent-showcase",
    label: "Agent Showcase",
    requiredResources: ["agents" as const],
    sectionType: "AgentShowcaseSection",
    sortOrder: 45,
  } satisfies RegisterSectionSlot,

  testimonials: {
    contentKeys: ["testimonials.heading"],
    dataSource: "testimonials" as const,
    defaultEnabled: false,
    id: "testimonials",
    label: "Testimonials",
    requiredResources: ["testimonials" as const],
    sectionType: "TestimonialStripSection",
    sortOrder: 50,
  } satisfies RegisterSectionSlot,

  faq: {
    contentKeys: [],
    dataSource: undefined,
    defaultEnabled: true,
    id: "faq",
    label: "FAQ",
    sectionType: "FAQAccordionSection",
    sortOrder: 55,
  } satisfies RegisterSectionSlot,

  newsletter: {
    contentKeys: [],
    dataSource: undefined,
    defaultEnabled: true,
    id: "newsletter",
    label: "Newsletter",
    sectionType: "NewsletterSection",
    sortOrder: 57,
  } satisfies RegisterSectionSlot,

  contact: {
    contentKeys: ["contact.email", "contact.phone", "contact.address", "contact.whatsapp"],
    dataSource: "contact" as const,
    defaultEnabled: true,
    id: "contact",
    label: "Contact",
    sectionType: "ContactSection",
    sortOrder: 58,
  } satisfies RegisterSectionSlot,

  cta: {
    contentKeys: ["cta.heading", "cta.subheading", "cta.ctaLabel"],
    dataSource: undefined,
    defaultEnabled: true,
    id: "cta",
    label: "CTA Band",
    sectionType: "CtaBandSection",
    sortOrder: 60,
  } satisfies RegisterSectionSlot,
} as const;

// ---------------------------------------------------------------------------
// Universal pages shared by all families and all plans
// ---------------------------------------------------------------------------

export const universalPages = [
  { label: "Login", pageKey: "login", slug: "/login", sections: [] },
  { label: "Sign Up", pageKey: "signup", slug: "/signup", sections: [] },
  { label: "404", pageKey: "not-found", slug: "/404", sections: [] },
  { label: "Privacy Policy", pageKey: "privacy", slug: "/privacy", sections: [] },
  { label: "Terms of Service", pageKey: "terms", slug: "/terms", sections: [] },
] as const;

// ---------------------------------------------------------------------------
// Saved listings + inquiry basket (Plus+ user account pages)
// ---------------------------------------------------------------------------

export const savedListingsPage = {
  label: "Saved Listings",
  pageKey: "saved",
  sections: [],
  slug: "/saved",
  minTier: "plus" as const,
} as const;

export const inquiryBasketPage = {
  label: "Inquiry Basket",
  pageKey: "inquire",
  sections: [],
  slug: "/inquire",
  minTier: "plus" as const,
} as const;
