/**
 * Page definitions for the Sakan Starter plan.
 * Rental-first layout — Home, Rentals, About, Contact.
 */

import type { RegisterPageDefinition } from "../../types";
import {
  slot,
  universalPages,
  savedListingsPage,
  inquiryBasketPage,
} from "../../shared-slots";

export const sakanStarterPages: RegisterPageDefinition[] = [
  // Home
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      { ...slot.propertyGrid, id: "property-grid", dataSource: "listings", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
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

  // Universal + account pages
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
