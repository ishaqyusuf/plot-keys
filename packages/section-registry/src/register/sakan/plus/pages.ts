/**
 * Page definitions for the Sakan Plus plan.
 * Extends Starter with Services, How It Works, and FAQ pages.
 * Home shifts toward a renter-conversion flow with FAQ and Contact sections.
 */

import {
  inquiryBasketPage,
  savedListingsPage,
  slot,
  universalPages,
} from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const sakanPlusPages: RegisterPageDefinition[] = [
  // Home — adds ServiceHighlights(25), FAQ(50), Contact(55)
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
      { ...slot.faq, id: "faq", sortOrder: 30 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 40 },
      { ...slot.contact, id: "contact", sortOrder: 55 },
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

  // Universal + account pages
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
