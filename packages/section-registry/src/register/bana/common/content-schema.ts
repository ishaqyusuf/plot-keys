/**
 * Content field definitions for the Bana (Developer) template family.
 * Property developer / construction-led brand — project-first, investor-facing.
 */

import type { ContentFieldDef } from "../../types";

export const banaContentSchema: ContentFieldDef[] = [
  // Hero
  {
    aiEnabled: true,
    contentKey: "hero.eyebrow",
    defaultValue: "Award-Winning Property Developer — Nigeria",
    label: "Hero Eyebrow",
    placeholderValue: "Your Tagline Here",
  },
  {
    aiEnabled: true,
    contentKey: "hero.title",
    defaultValue: "Bana Developments — Building Landmarks Across Nigeria",
    label: "Hero Title",
    placeholderValue: "Bold Headline Goes Here",
  },
  {
    aiEnabled: true,
    contentKey: "hero.subtitle",
    defaultValue:
      "Bana Developments delivers landmark residential and commercial projects across Lagos, Abuja, and Port Harcourt. Built to last. Designed to inspire.",
    label: "Hero Subtitle",
    placeholderValue: "A short sentence describing your development company and the projects you deliver.",
  },
  {
    aiEnabled: false,
    contentKey: "hero.ctaText",
    defaultValue: "View Our Projects",
    label: "Hero CTA Text",
    placeholderValue: "Call to Action",
  },

  // Story
  {
    aiEnabled: true,
    contentKey: "story.eyebrow",
    defaultValue: "Who We Are",
    label: "Story Eyebrow",
    placeholderValue: "Section Label",
  },
  {
    aiEnabled: true,
    contentKey: "story.heading",
    defaultValue: "Building Nigeria's Future, One Landmark at a Time",
    label: "Story Heading",
    placeholderValue: "Your About Section Heading",
  },
  {
    aiEnabled: true,
    contentKey: "story.body",
    defaultValue:
      "Founded in Lagos in 2010, Bana Developments has delivered over 40 residential and commercial projects across Nigeria. We combine rigorous construction standards with bold architectural vision — creating buildings that stand apart in every skyline. Our projects span off-plan apartments, luxury duplexes, mixed-use developments, and commercial office parks.",
    label: "Story Body",
    placeholderValue:
      "Tell your development story here. Share your history, completed projects, and what sets your construction quality apart.",
  },
  {
    aiEnabled: false,
    contentKey: "story.ctaLabel",
    defaultValue: "Our Track Record",
    label: "Story CTA Label",
    placeholderValue: "CTA Label",
  },

  // CTA
  {
    aiEnabled: true,
    contentKey: "cta.heading",
    defaultValue: "Invest in a Bana Development Today",
    label: "CTA Heading",
    placeholderValue: "Your CTA Heading",
  },
  {
    aiEnabled: true,
    contentKey: "cta.subheading",
    defaultValue:
      "Explore off-plan opportunities and secure your unit at pre-launch pricing. Our team is ready to walk you through every available project.",
    label: "CTA Subheading",
    placeholderValue: "Supporting text for your call to action.",
  },
  {
    aiEnabled: false,
    contentKey: "cta.ctaLabel",
    defaultValue: "View Projects",
    label: "CTA Button Label",
    placeholderValue: "Button Label",
  },

  // Contact
  {
    aiEnabled: false,
    contentKey: "contact.email",
    defaultValue: "hello@banadevelopments.ng",
    label: "Contact Email",
    placeholderValue: "your@email.com",
  },
  {
    aiEnabled: false,
    contentKey: "contact.phone",
    defaultValue: "+234 802 345 6789",
    label: "Contact Phone",
    placeholderValue: "+234 000 000 0000",
  },
  {
    aiEnabled: false,
    contentKey: "contact.address",
    defaultValue: "Plot 7, Eko Atlantic City, Victoria Island, Lagos, Nigeria",
    label: "Contact Address",
    placeholderValue: "Your office address",
  },
  {
    aiEnabled: false,
    contentKey: "contact.whatsapp",
    defaultValue: "+234 802 345 6789",
    label: "WhatsApp Number",
    placeholderValue: "+234 000 000 0000",
  },

  // Property Grid (used as project grid)
  {
    aiEnabled: true,
    contentKey: "propertyGrid.eyebrow",
    defaultValue: "Our Projects",
    label: "Project Grid Eyebrow",
    placeholderValue: "Section Label",
  },
  {
    aiEnabled: true,
    contentKey: "propertyGrid.title",
    defaultValue: "Explore the Full Bana Portfolio",
    label: "Project Grid Title",
    placeholderValue: "Projects Grid Title",
  },
];
