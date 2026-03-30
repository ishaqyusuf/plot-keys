import type { RegisterPageDefinition } from "../../types";
import {
  slot,
  universalPages,
  savedListingsPage,
  inquiryBasketPage,
} from "../../shared-slots";

export const thurayaStarterPages: RegisterPageDefinition[] = [
  // Home
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, sortOrder: 10 },
      { ...slot.story, sortOrder: 20 },
      { ...slot.featuredListings, sortOrder: 30 },
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

  // Universal + account pages
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
  { ...inquiryBasketPage, minTier: "plus" },
];
