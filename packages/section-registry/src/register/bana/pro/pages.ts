/**
 * Page definitions for the Bana Pro plan.
 * Extends Plus with Investors, Blog, and Blog Post pages.
 * Home gains a Newsletter section.
 */

import type { RegisterPageDefinition } from "../../types";
import { slot, universalPages } from "../../shared-slots";

export const banaProPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 30 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 40 },
      {
        ...slot.propertyGrid,
        id: "project-grid",
        label: "Project Grid",
        sectionType: "PropertyGridSection",
        defaultEnabled: true,
        sortOrder: 25,
      },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        sortOrder: 50,
      },
      { ...slot.newsletter, id: "newsletter", sortOrder: 57 },
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
  {
    label: "Investors",
    pageKey: "investors",
    slug: "/investors",
    minTier: "pro",
    sections: [],
  },
  {
    label: "Blog",
    pageKey: "blog",
    slug: "/blog",
    minTier: "pro",
    sections: [],
  },
  {
    label: "Blog Post",
    pageKey: "blog-post",
    slug: "/blog/[slug]",
    minTier: "pro",
    sections: [],
  },
  ...universalPages,
];
