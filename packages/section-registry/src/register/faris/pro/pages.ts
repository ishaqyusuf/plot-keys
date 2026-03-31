/**
 * Page definitions for the Faris Pro plan.
 * Extends Plus with Blog, Blog Post, Resources pages,
 * and a Newsletter section on the Home page.
 */

import { savedListingsPage, slot, universalPages } from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const farisProPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      {
        ...slot.agentShowcase,
        id: "agent-showcase",
        defaultEnabled: true,
        requiredResources: ["agents"],
        sortOrder: 20,
      },
      { ...slot.story, id: "story", sortOrder: 30 },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 40,
      },
      { ...slot.featuredListings, id: "featured-listings", sortOrder: 50 },
      { ...slot.newsletter, id: "newsletter", sortOrder: 57 },
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
  {
    label: "Resources",
    pageKey: "resources",
    slug: "/resources",
    minTier: "pro",
    sections: [],
  },
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
];
