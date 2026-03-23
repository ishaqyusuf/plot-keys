/**
 * Content schema for the Sakan (Rental) template family.
 * Rental-first — tenant acquisition and landlord services.
 * HeroSearch (no eyebrow), practical and friendly tone throughout.
 */

import type { ContentFieldDef } from "../../types";

export const sakanContentSchema: ContentFieldDef[] = [
  // Hero (HeroSearch — no eyebrow)
  {
    contentKey: "hero.title",
    label: "Hero Title",
    defaultValue: "Find your next rental home across Nigeria.",
    placeholderValue: "Your Rental Search Headline",
    aiEnabled: true,
  },
  {
    contentKey: "hero.subtitle",
    label: "Hero Subtitle",
    defaultValue:
      "Sakan Rentals — quality rental homes across Lagos, Abuja, and beyond. Browse verified listings and move in with confidence.",
    placeholderValue: "A short description of your rental platform.",
    aiEnabled: true,
  },
  {
    contentKey: "hero.ctaText",
    label: "Hero CTA Text",
    defaultValue: "Search Rentals",
    placeholderValue: "Find a Rental",
    aiEnabled: true,
  },

  // Story
  {
    contentKey: "story.eyebrow",
    label: "Story Eyebrow",
    defaultValue: "Who We Are",
    placeholderValue: "About Us",
    aiEnabled: true,
  },
  {
    contentKey: "story.heading",
    label: "Story Heading",
    defaultValue: "Renting made simple — for tenants and landlords alike.",
    placeholderValue: "What Your Rental Business Stands For",
    aiEnabled: true,
  },
  {
    contentKey: "story.body",
    label: "Story Body",
    defaultValue:
      "Sakan was built to remove the stress from renting in Nigeria. Whether you are a tenant looking for a well-managed flat or a landlord seeking reliable occupancy, our team handles the details — from tenant placement to ongoing maintenance — so the process works for everyone.",
    placeholderValue:
      "Tell the story of your rental business — your values, your market, and how you make renting better.",
    aiEnabled: true,
  },
  {
    contentKey: "story.ctaLabel",
    label: "Story CTA Label",
    defaultValue: "Learn More About Us",
    placeholderValue: "Learn More",
    aiEnabled: true,
  },

  // CTA
  {
    contentKey: "cta.heading",
    label: "CTA Heading",
    defaultValue: "Ready to find your next home?",
    placeholderValue: "Your CTA Heading",
    aiEnabled: true,
  },
  {
    contentKey: "cta.subheading",
    label: "CTA Subheading",
    defaultValue:
      "Browse our verified rental listings and speak to our team today. Moving is easier when you have the right people helping you.",
    placeholderValue: "A supporting line for your call to action.",
    aiEnabled: true,
  },
  {
    contentKey: "cta.ctaLabel",
    label: "CTA Button Label",
    defaultValue: "Find a Rental",
    placeholderValue: "Get Started",
    aiEnabled: true,
  },

  // Contact
  {
    contentKey: "contact.email",
    label: "Contact Email",
    defaultValue: "hello@sakanrentals.ng",
    placeholderValue: "your@email.com",
    aiEnabled: false,
  },
  {
    contentKey: "contact.phone",
    label: "Contact Phone",
    defaultValue: "+234 800 000 0002",
    placeholderValue: "+234 000 000 0000",
    aiEnabled: false,
  },
  {
    contentKey: "contact.address",
    label: "Contact Address",
    defaultValue: "22 Herbert Macaulay Way, Yaba, Lagos",
    placeholderValue: "Your office address",
    aiEnabled: false,
  },
  {
    contentKey: "contact.whatsapp",
    label: "WhatsApp Number",
    defaultValue: "+234 800 000 0002",
    placeholderValue: "+234 000 000 0000",
    aiEnabled: false,
  },

  // Property Grid
  {
    contentKey: "propertyGrid.eyebrow",
    label: "Property Grid Eyebrow",
    defaultValue: "Available Now",
    placeholderValue: "Section Label",
    aiEnabled: true,
  },
  {
    contentKey: "propertyGrid.title",
    label: "Property Grid Title",
    defaultValue: "Rental homes ready to move into",
    placeholderValue: "Your Listings Grid Title",
    aiEnabled: true,
  },

  // Testimonials
  {
    contentKey: "testimonials.heading",
    label: "Testimonials Heading",
    defaultValue: "What tenants and landlords say",
    placeholderValue: "Testimonials Heading",
    aiEnabled: true,
  },
];
