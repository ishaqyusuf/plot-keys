/**
 * Page definitions for the Thuraya Pro plan.
 * Extends Plus with Private Sales, Insights, Insights Post, and Press.
 * Home gains ServiceHighlights and Newsletter sections.
 */

import type { RegisterPageDefinition } from "../../types";
import {
  slot,
  universalPages,
  savedListingsPage,
  inquiryBasketPage,
} from "../../shared-slots";

export const thurayaProPages: RegisterPageDefinition[] = [
  // Home — adds ServiceHighlights(55) and Newsletter(57)
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.story, sortOrder: 20 },
      { ...slot.featuredListings, sortOrder: 30 },
      {
        ...slot.testimonials,
        sortOrder: 40,
        defaultEnabled: true,
        requiredResources: ["testimonials"],
      },
      {
        ...slot.agentShowcase,
        sortOrder: 50,
        requiredResources: ["agents"],
      },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 55 },
      { ...slot.newsletter, id: "newsletter", sortOrder: 57 },
      { ...slot.cta, sortOrder: 60 },
    ],
  },

  // Portfolio
  {
    label: "Portfolio",
    pageKey: "portfolio",
    slug: "/portfolio",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.propertyGrid, sortOrder: 20 },
      { ...slot.cta, sortOrder: 30 },
    ],
  },

  // Property Detail
  {
    label: "Property Detail",
    pageKey: "portfolio-detail",
    slug: "/portfolio/[slug]",
    sections: [],
  },

  // About
  {
    label: "About",
    pageKey: "about",
    slug: "/about",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.story, sortOrder: 20 },
      { ...slot.marketStats, sortOrder: 30 },
      { ...slot.cta, sortOrder: 40 },
    ],
  },

  // Contact
  {
    label: "Contact",
    pageKey: "contact",
    slug: "/contact",
    sections: [
      { ...slot.contact, sortOrder: 10 },
      { ...slot.cta, sortOrder: 20 },
    ],
  },

  // Services (Plus)
  {
    label: "Services",
    pageKey: "services",
    slug: "/services",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.serviceHighlights, sortOrder: 20 },
      { ...slot.cta, sortOrder: 30 },
    ],
  },

  // Area Guides (Plus)
  {
    label: "Area Guides",
    pageKey: "areas",
    slug: "/areas",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.cta, sortOrder: 20 },
    ],
  },

  // Private Sales (Pro)
  {
    label: "Private Sales",
    pageKey: "private-sales",
    slug: "/private-sales",
    minTier: "pro",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.story, id: "story-private", sortOrder: 20 },
      { ...slot.cta, sortOrder: 30 },
    ],
  },

  // Insights (Pro)
  {
    label: "Insights",
    pageKey: "insights",
    slug: "/insights",
    minTier: "pro",
    sections: [],
  },

  // Insights Post (Pro)
  {
    label: "Insights Post",
    pageKey: "insights-post",
    slug: "/insights/[slug]",
    minTier: "pro",
    sections: [],
  },

  // Press (Pro)
  {
    label: "Press",
    pageKey: "press",
    slug: "/press",
    minTier: "pro",
    sections: [],
  },

  // Universal + account pages
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
