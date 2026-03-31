/**
 * Page definitions for the Wafi Pro plan.
 * Extends Plus with Landlords, Tenants, Blog, Blog Post pages,
 * and an enriched Home page with Testimonials and Newsletter.
 */

import { savedListingsPage, slot, universalPages } from "../../shared-slots";
import type { RegisterPageDefinition } from "../../types";

export const wafiProPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 30 },
      {
        ...slot.testimonials,
        id: "testimonials",
        defaultEnabled: true,
        requiredResources: ["testimonials"],
        sortOrder: 40,
      },
      {
        ...slot.propertyGrid,
        id: "property-grid",
        dataSource: "listings",
        defaultEnabled: true,
        sortOrder: 45,
      },
      { ...slot.faq, id: "faq", sortOrder: 50 },
      { ...slot.contact, id: "contact", sortOrder: 55 },
      { ...slot.newsletter, id: "newsletter", sortOrder: 57 },
      { ...slot.cta, id: "cta", sortOrder: 60 },
    ],
  },
  {
    label: "Properties",
    pageKey: "properties",
    slug: "/properties",
    sections: [
      { ...slot.heroSearch, id: "hero-search", sortOrder: 10 },
      {
        ...slot.propertyGrid,
        id: "property-grid",
        dataSource: "listings",
        sortOrder: 20,
      },
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
    label: "FAQ",
    pageKey: "faq",
    slug: "/faq",
    minTier: "plus",
    sections: [
      { ...slot.faq, id: "faq", sortOrder: 10 },
      { ...slot.cta, id: "cta", sortOrder: 20 },
    ],
  },
  {
    label: "Landlords",
    pageKey: "landlords",
    slug: "/landlords",
    minTier: "pro",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.cta, id: "cta", sortOrder: 30 },
    ],
  },
  {
    label: "Tenants",
    pageKey: "tenants",
    slug: "/tenants",
    minTier: "pro",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 20 },
      { ...slot.faq, id: "faq", sortOrder: 30 },
      { ...slot.cta, id: "cta", sortOrder: 40 },
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
  ...universalPages,
  { ...savedListingsPage, minTier: "plus" },
];
