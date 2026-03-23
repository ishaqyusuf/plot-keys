/**
 * Placeholder data for the Bana (Developer) template family.
 * Shown in template browse mode only — never stored to the database.
 */

import type { PlaceholderData } from "../../types";

export const banaPlaceholderData: PlaceholderData = {
  projects: [
    {
      id: "project-1",
      imageUrl: undefined,
      location: "Lekki Phase 1, Lagos",
      slug: "bana-heights-lekki",
      status: "Under Construction",
      title: "Bana Heights — Lekki Phase 1",
    },
    {
      id: "project-2",
      imageUrl: undefined,
      location: "Maitama, Abuja",
      slug: "bana-residences-maitama",
      status: "Completed",
      title: "Bana Residences — Maitama",
    },
    {
      id: "project-3",
      imageUrl: undefined,
      location: "Eko Atlantic City, Victoria Island, Lagos",
      slug: "bana-tower-eko-atlantic",
      status: "Off-Plan",
      title: "Bana Tower — Eko Atlantic",
    },
  ],

  services: [
    {
      description:
        "Purchase directly from Bana Developments at transparent pricing — residential, commercial, and mixed-use units available across all active project sites.",
      id: "service-1",
      title: "Project Sales",
    },
    {
      description:
        "Secure your unit before groundbreaking and benefit from pre-launch pricing, flexible payment structures, and capital growth potential on off-plan developments.",
      id: "service-2",
      title: "Off-Plan Investment",
    },
    {
      description:
        "Stay informed at every stage of your investment. Our dedicated portal provides real-time construction milestones, photo updates, and completion timelines.",
      id: "service-3",
      title: "Construction Updates",
    },
  ],

  testimonials: [
    {
      author: "Babatunde Fashola",
      id: "testimonial-1",
      quote:
        "I purchased off-plan at Bana Heights and watched it go from foundation to completion. The build quality is exceptional — every detail was delivered exactly as promised.",
      role: "Off-Plan Investor, Lagos",
    },
    {
      author: "Aisha Mohammed",
      id: "testimonial-2",
      quote:
        "Bana Developments handled our commercial office acquisition in Maitama seamlessly. Their team understood exactly what we needed and delivered on time and on budget.",
      role: "Commercial Buyer, Abuja",
    },
    {
      author: "Chukwuemeka Obi",
      id: "testimonial-3",
      quote:
        "As a diaspora investor, I needed a developer I could trust completely. Bana's construction updates portal gave me full visibility throughout the build — outstanding transparency.",
      role: "Diaspora Investor",
    },
  ],
};
