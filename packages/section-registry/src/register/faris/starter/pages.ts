/**
 * Page definitions for the Faris Starter plan.
 * Personal agent — story-first with testimonials on home and about pages.
 */

import { savedListingsPage, slot, universalPages } from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const farisStarterPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 30,
      },
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
    pageKey: "listing-detail",
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
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 40,
      },
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
];
