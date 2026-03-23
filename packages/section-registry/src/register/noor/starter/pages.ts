/**
 * Page definitions for the Noor Starter plan.
 * Agency listings-first layout — Home, Listings, About, Contact.
 */

import type { RegisterPageDefinition } from "../../types";
import {
  slot,
  universalPages,
  savedListingsPage,
  inquiryBasketPage,
} from "../../shared-slots";

export const noorStarterPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.featuredListings, id: "featured-listings", sortOrder: 20 },
      { ...slot.marketStats, id: "market-stats", sortOrder: 30 },
      { ...slot.story, id: "story", sortOrder: 40 },
      { ...slot.cta, id: "cta", sortOrder: 60 },
    ],
  },
  {
    label: "Listings",
    pageKey: "listings",
    slug: "/listings",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      { ...slot.propertyGrid, id: "property-grid", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },
  {
    label: "Property Detail",
    pageKey: "property-detail",
    slug: "/listings/[slug]",
    sections: [],
  },
  {
    label: "About",
    pageKey: "about",
    slug: "/about",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.marketStats, id: "market-stats", sortOrder: 40 },
      { ...slot.cta, id: "cta", sortOrder: 50 },
    ],
  },
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
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
