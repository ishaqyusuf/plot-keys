/**
 * Content field definitions for the Faris (Solo) template family.
 * Independent agent — personal brand/story-first, warm + editorial style.
 */

import type { ContentFieldDef } from "../../types";

export const farisContentSchema: ContentFieldDef[] = [
  // --- Hero (HeroBanner — has eyebrow) ---
  {
    contentKey: "hero.eyebrow",
    label: "Hero Eyebrow",
    defaultValue: "Real Estate Consultant — Lagos",
    placeholderValue: "Your Title — Your City",
    aiEnabled: true,
  },
  {
    contentKey: "hero.title",
    label: "Hero Title",
    defaultValue: "Faris Adeyemi — Helping Families Find Homes They Love",
    placeholderValue: "Your Name — Your Personal Brand Headline",
    aiEnabled: true,
  },
  {
    contentKey: "hero.subtitle",
    label: "Hero Subtitle",
    defaultValue:
      "I specialise in residential sales and lettings across Lagos Island and the mainland. With eight years in the market, I put your goals first — every step of the way.",
    placeholderValue:
      "A short personal introduction — who you are and who you help.",
    aiEnabled: true,
  },
  {
    contentKey: "hero.ctaText",
    label: "Hero CTA Text",
    defaultValue: "Book a Consultation",
    placeholderValue: "Primary call-to-action label",
    aiEnabled: true,
  },

  // --- Story ---
  {
    contentKey: "story.eyebrow",
    label: "Story Eyebrow",
    defaultValue: "My Story",
    placeholderValue: "Section label above heading",
    aiEnabled: true,
  },
  {
    contentKey: "story.heading",
    label: "Story Heading",
    defaultValue: "Real Estate Is Personal — So Am I",
    placeholderValue: "Your about section heading",
    aiEnabled: true,
  },
  {
    contentKey: "story.body",
    label: "Story Body",
    defaultValue:
      "I started in real estate because I believe a home is more than bricks and mortar — it's the foundation of a family's future. After eight years working with first-time buyers, seasoned investors, and growing families across Lagos, I still take every search personally. My approach is simple: listen first, advise honestly, and never stop until we find the right fit.",
    placeholderValue:
      "Tell your personal story — your background, your values, and why you do this work.",
    aiEnabled: true,
  },
  {
    contentKey: "story.ctaLabel",
    label: "Story CTA Label",
    defaultValue: "Learn More About Me",
    placeholderValue: "CTA label for the about section",
    aiEnabled: true,
  },

  // --- Testimonials ---
  {
    contentKey: "testimonials.heading",
    label: "Testimonials Heading",
    defaultValue: "What My Clients Say",
    placeholderValue: "Client testimonials section heading",
    aiEnabled: true,
  },

  // --- CTA Band ---
  {
    contentKey: "cta.heading",
    label: "CTA Heading",
    defaultValue: "Ready to Take the Next Step?",
    placeholderValue: "Call-to-action section heading",
    aiEnabled: true,
  },
  {
    contentKey: "cta.subheading",
    label: "CTA Subheading",
    defaultValue:
      "Whether you're buying, selling, or just exploring your options — I'm happy to have an honest conversation with no obligation.",
    placeholderValue: "Supporting text for the call-to-action section",
    aiEnabled: true,
  },
  {
    contentKey: "cta.ctaLabel",
    label: "CTA Button Label",
    defaultValue: "Book a Free Consultation",
    placeholderValue: "CTA button label",
    aiEnabled: true,
  },

  // --- Contact (aiEnabled false — real contact details) ---
  {
    contentKey: "contact.email",
    label: "Contact Email",
    defaultValue: "faris@farisadeyemi.com",
    placeholderValue: "your@email.com",
    aiEnabled: false,
  },
  {
    contentKey: "contact.phone",
    label: "Contact Phone",
    defaultValue: "+234 800 000 0002",
    placeholderValue: "+234 800 000 0000",
    aiEnabled: false,
  },
  {
    contentKey: "contact.address",
    label: "Contact Address",
    defaultValue: "3 Kofo Abayomi Street, Victoria Island, Lagos",
    placeholderValue: "Your office or meeting address",
    aiEnabled: false,
  },
  {
    contentKey: "contact.whatsapp",
    label: "WhatsApp Number",
    defaultValue: "+234 800 000 0002",
    placeholderValue: "+234 800 000 0000",
    aiEnabled: false,
  },

  // --- Listings ---
  {
    contentKey: "listings.heading",
    label: "Listings Heading",
    defaultValue: "Properties I'm Working On",
    placeholderValue: "Your listings section heading",
    aiEnabled: true,
  },
  {
    contentKey: "listings.subheading",
    label: "Listings Subheading",
    defaultValue:
      "A selection of homes I'm currently marketing across Lagos. Each one personally vetted and ready for viewing.",
    placeholderValue: "A short description of your current property portfolio.",
    aiEnabled: true,
  },
  {
    contentKey: "listings.ctaLabel",
    label: "Listings CTA Label",
    defaultValue: "View All Listings",
    placeholderValue: "CTA label for listings section",
    aiEnabled: true,
  },
];
