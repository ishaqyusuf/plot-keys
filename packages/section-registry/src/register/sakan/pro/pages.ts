/**
 * Page definitions for the Sakan Pro plan.
 * Extends Plus with Landlords, Tenant Resources, Blog, and Blog Post pages.
 * Home gains Testimonials and Newsletter sections.
 */

import {
  inquiryBasketPage,
  savedListingsPage,
  slot,
  universalPages,
} from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const sakanProPages: RegisterPageDefinition[] = [
  // Home — adds Testimonials(45) and Newsletter(57)
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      {
        ...slot.propertyGrid,
        id: "property-grid",
        dataSource: "listings",
        sortOrder: 20,
      },
      {
        ...slot.testimonials,
        id: "testimonials",
        sortOrder: 30,
        defaultEnabled: true,
        requiredResources: ["testimonials"],
      },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 40 },
      { ...slot.faq, id: "faq", sortOrder: 50 },
      { ...slot.contact, id: "contact", sortOrder: 55 },
      { ...slot.newsletter, id: "newsletter", sortOrder: 57 },
      { ...slot.cta, id: "cta", sortOrder: 60 },
    ],
  },

  // Rentals
  {
    label: "Rentals",
    pageKey: "rentals",
    slug: "/rentals",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      { ...slot.propertyGrid, id: "property-grid", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },

  // Property Detail
  {
    label: "Property Detail",
    pageKey: "rental-detail",
    slug: "/rentals/[slug]",
    sections: [],
  },

  // About
  {
    label: "About",
    pageKey: "about",
    slug: "/about",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.cta, id: "cta", sortOrder: 40 },
    ],
  },

  // Contact
  {
    label: "Contact",
    pageKey: "contact",
    slug: "/contact",
    sections: [
      { ...slot.contact, id: "contact", sortOrder: 10 },
      { ...slot.faq, id: "faq", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },

  // Services (Plus)
  {
    label: "Services",
    pageKey: "services",
    slug: "/services",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.cta, id: "cta", sortOrder: 40 },
    ],
  },

  // How It Works (Plus)
  {
    label: "How It Works",
    pageKey: "how-it-works",
    slug: "/how-it-works",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },

  // FAQ (Plus)
  {
    label: "FAQ",
    pageKey: "faq",
    slug: "/faq",
    minTier: "plus",
    sections: [
      { ...slot.faq, id: "faq", sortOrder: 10 },
      { ...slot.cta, id: "cta", sortOrder: 20 },
    ],
  },

  // Landlords (Pro)
  {
    label: "Landlords",
    pageKey: "landlords",
    slug: "/landlords",
    minTier: "pro",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.cta, id: "cta", sortOrder: 40 },
    ],
  },

  // Tenant Resources (Pro)
  {
    label: "Tenant Resources",
    pageKey: "tenant-resources",
    slug: "/tenant-resources",
    minTier: "pro",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.faq, id: "faq", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },

  // Blog (Pro)
  {
    label: "Blog",
    pageKey: "blog",
    slug: "/blog",
    minTier: "pro",
    sections: [],
  },

  // Blog Post (Pro)
  {
    label: "Blog Post",
    pageKey: "blog-post",
    slug: "/blog/[slug]",
    minTier: "pro",
    sections: [],
  },

  // Universal + account pages
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
