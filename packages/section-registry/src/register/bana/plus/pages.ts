/**
 * Page definitions for the Bana Plus plan.
 * Extends Starter with Gallery, Services, and Service Detail pages.
 * Home gains a PropertyGrid and Testimonials section.
 */

import { slot, universalPages } from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const banaPlusPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      {
        ...slot.propertyGrid,
        id: "project-grid",
        label: "Project Grid",
        sectionType: "PropertyGridSection",
        defaultEnabled: true,
        sortOrder: 20,
      },
      { ...slot.marketStats, id: "market-stats", sortOrder: 30 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 40 },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        sortOrder: 50,
      },
      { ...slot.cta, id: "cta", sortOrder: 60 },
    ],
  },
  {
    label: "Projects",
    pageKey: "projects",
    slug: "/projects",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      {
        ...slot.propertyGrid,
        id: "project-grid",
        label: "Project Grid",
        sectionType: "PropertyGridSection",
        sortOrder: 20,
      },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },
  {
    label: "Project Detail",
    pageKey: "project-detail",
    slug: "/projects/[slug]",
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
  {
    label: "Gallery",
    pageKey: "gallery",
    slug: "/gallery",
    minTier: "plus",
    sections: [],
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
    label: "Service Detail",
    pageKey: "service-detail",
    slug: "/services/[slug]",
    minTier: "plus",
    sections: [],
  },
  ...universalPages,
];
