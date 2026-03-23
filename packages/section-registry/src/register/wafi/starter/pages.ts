/**
 * Page definitions for the Wafi Starter plan.
 */

import type { RegisterPageDefinition } from "../../types";
import { slot, universalPages, savedListingsPage } from "../../shared-slots";

export const wafiStarterPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.faq, id: "faq", sortOrder: 40 },
      { ...slot.cta, id: "cta", sortOrder: 60 },
    ],
  },
  {
    label: "Properties",
    pageKey: "properties",
    slug: "/properties",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      { ...slot.propertyGrid, id: "property-grid", dataSource: "listings", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },
  {
    label: "Property Detail",
    pageKey: "property-detail",
    slug: "/properties/[slug]",
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
      { ...slot.cta, id: "cta", sortOrder: 40 },
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
];
