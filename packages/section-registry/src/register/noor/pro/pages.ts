/**
 * Page definitions for the Noor Pro plan.
 * Extends Plus with Blog, Events, and Resources pages.
 * Home gains a Newsletter section.
 */

import {
  inquiryBasketPage,
  savedListingsPage,
  slot,
  universalPages,
} from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const noorProPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.featuredListings, id: "featured-listings", sortOrder: 20 },
      { ...slot.marketStats, id: "market-stats", sortOrder: 30 },
      {
        ...slot.agentShowcase,
        id: "agent-showcase",
        defaultEnabled: true,
        sortOrder: 40,
        requiredResources: ["agents"],
      },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        sortOrder: 50,
        requiredResources: ["testimonials"],
      },
      { ...slot.story, id: "story", sortOrder: 55 },
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
  {
    label: "Agents",
    pageKey: "agents",
    slug: "/agents",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      {
        ...slot.agentShowcase,
        id: "agent-showcase",
        defaultEnabled: true,
        sortOrder: 20,
      },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        sortOrder: 30,
      },
      { ...slot.cta, id: "cta", sortOrder: 40 },
    ],
  },
  {
    label: "Agent Detail",
    pageKey: "agent-detail",
    slug: "/agents/[slug]",
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
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      { ...slot.cta, id: "cta", sortOrder: 40 },
    ],
  },
  {
    label: "Area Guides",
    pageKey: "areas",
    slug: "/areas",
    minTier: "plus",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.cta, id: "cta", sortOrder: 20 },
    ],
  },
  {
    label: "Blog",
    pageKey: "blog",
    slug: "/blog",
    minTier: "pro",
    sections: [{ ...slot.blogList, id: "blog-list", sortOrder: 10 }],
  },
  {
    label: "Blog Post",
    pageKey: "blog-post",
    slug: "/blog/[slug]",
    minTier: "pro",
    sections: [{ ...slot.blogPost, id: "blog-post", sortOrder: 10 }],
  },
  {
    label: "Events",
    pageKey: "events",
    slug: "/events",
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
  { ...inquiryBasketPage, minTier: "plus" },
];
