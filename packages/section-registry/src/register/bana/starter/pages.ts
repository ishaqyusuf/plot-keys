/**
 * Page definitions for the Bana Starter plan.
 * Developer project-first layout — Home, Projects, About, Contact.
 */

import type { RegisterPageDefinition } from "../../types";
import { slot, universalPages } from "../../shared-slots";

export const banaStarterPages: RegisterPageDefinition[] = [
  {
    label: "Home",
    pageKey: "home",
    slug: "/",
    sections: [
      { ...slot.heroBanner, id: "hero", sortOrder: 10 },
      { ...slot.story, id: "story", sortOrder: 20 },
      { ...slot.serviceHighlights, id: "service-highlights", sortOrder: 30 },
      { ...slot.whyChooseUs, id: "why-choose-us", sortOrder: 40 },
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
  ...universalPages,
];
