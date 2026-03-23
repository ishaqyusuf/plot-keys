/**
 * Content field definitions for the Wafi (Manager) template family.
 * Property management company — service/trust-first, landlord and tenant-facing.
 */

import type { ContentFieldDef } from "../../types";

export const wafiContentSchema: ContentFieldDef[] = [
  // --- Hero (HeroSearch — no eyebrow) ---
  {
    contentKey: "hero.title",
    label: "Hero Title",
    defaultValue: "Wafi Property Management — Trusted Landlord and Tenant Services",
    placeholderValue: "Your Property Management Headline",
    aiEnabled: true,
  },
  {
    contentKey: "hero.subtitle",
    label: "Hero Subtitle",
    defaultValue:
      "We manage properties across Lagos and Abuja so landlords earn more and tenants live better.",
    placeholderValue: "A short description of your property management services.",
    aiEnabled: true,
  },
  {
    contentKey: "hero.ctaText",
    label: "Hero CTA Text",
    defaultValue: "List Your Property",
    placeholderValue: "Primary call-to-action label",
    aiEnabled: true,
  },

  // --- Story ---
  {
    contentKey: "story.eyebrow",
    label: "Story Eyebrow",
    defaultValue: "Who We Are",
    placeholderValue: "Section label above heading",
    aiEnabled: true,
  },
  {
    contentKey: "story.heading",
    label: "Story Heading",
    defaultValue: "Property Management Built on Trust",
    placeholderValue: "About section main heading",
    aiEnabled: true,
  },
  {
    contentKey: "story.body",
    label: "Story Body",
    defaultValue:
      "Wafi was founded on a simple belief: landlords deserve reliable income and tenants deserve a home they can count on. With over a decade serving the Nigerian property market, our team handles everything from tenant screening to maintenance coordination — so you never have to worry.",
    placeholderValue:
      "Share your company story, values, and what makes you the right choice for landlords and tenants.",
    aiEnabled: true,
  },
  {
    contentKey: "story.ctaLabel",
    label: "Story CTA Label",
    defaultValue: "Meet Our Team",
    placeholderValue: "CTA label for the about section",
    aiEnabled: true,
  },

  // --- CTA Band ---
  {
    contentKey: "cta.heading",
    label: "CTA Heading",
    defaultValue: "Ready to Hand Over the Keys?",
    placeholderValue: "Call-to-action section heading",
    aiEnabled: true,
  },
  {
    contentKey: "cta.subheading",
    label: "CTA Subheading",
    defaultValue:
      "Let Wafi manage your property while you focus on what matters. We handle rent collection, maintenance, and tenant relations.",
    placeholderValue: "Supporting text for the call-to-action section",
    aiEnabled: true,
  },
  {
    contentKey: "cta.ctaLabel",
    label: "CTA Button Label",
    defaultValue: "Get Started Today",
    placeholderValue: "CTA button label",
    aiEnabled: true,
  },

  // --- Contact (aiEnabled false — these are real contact details) ---
  {
    contentKey: "contact.email",
    label: "Contact Email",
    defaultValue: "hello@wafipm.com.ng",
    placeholderValue: "your@email.com",
    aiEnabled: false,
  },
  {
    contentKey: "contact.phone",
    label: "Contact Phone",
    defaultValue: "+234 800 000 0001",
    placeholderValue: "+234 800 000 0000",
    aiEnabled: false,
  },
  {
    contentKey: "contact.address",
    label: "Contact Address",
    defaultValue: "14 Adeola Odeku Street, Victoria Island, Lagos",
    placeholderValue: "Your office address",
    aiEnabled: false,
  },
  {
    contentKey: "contact.whatsapp",
    label: "WhatsApp Number",
    defaultValue: "+234 800 000 0001",
    placeholderValue: "+234 800 000 0000",
    aiEnabled: false,
  },

  // --- Property Grid ---
  {
    contentKey: "propertyGrid.eyebrow",
    label: "Property Grid Eyebrow",
    defaultValue: "Available Now",
    placeholderValue: "Section label above property grid heading",
    aiEnabled: true,
  },
  {
    contentKey: "propertyGrid.title",
    label: "Property Grid Title",
    defaultValue: "Managed Properties for Rent",
    placeholderValue: "Property grid section heading",
    aiEnabled: true,
  },
];
