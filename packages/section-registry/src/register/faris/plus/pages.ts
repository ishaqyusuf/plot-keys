/**
 * Page definitions for the Faris Plus plan.
 * Extends Starter with Services, Testimonials pages, and an enriched Home page.
 */

import type { RegisterPageDefinition } from "../../types";
import { slot, universalPages, savedListingsPage } from "../../shared-slots";

export const farisPlusPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 25 },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 30,
      },
      { ...slot.featuredListings, id: "featured-listings", sortOrder: 35 },
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
  {
    label: "Services",
    pageKey: "services",
    slug: "/services",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },
  {
    label: "Testimonials",
    pageKey: "testimonials",
    slug: "/testimonials",
    minTier: "plus",
    sections: [
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 10,
      },
      { ...slot.cta, id: "cta", sortOrder: 20 },
    ],
  },
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
];
