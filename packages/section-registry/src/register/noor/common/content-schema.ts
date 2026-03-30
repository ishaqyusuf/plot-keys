import type { ContentFieldDef } from "../../types";

export const noorContentSchema: ContentFieldDef[] = [
  // Hero
  {
    aiEnabled: true,
    contentKey: "hero.eyebrow",
    defaultValue: "Lagos Premier Real Estate Agency",
    label: "Hero Eyebrow",
    placeholderValue: "Your Tagline Here",
  },
  {
    aiEnabled: true,
    contentKey: "hero.title",
    defaultValue: "Find Your Perfect Home Across Nigeria",
    label: "Hero Title",
    placeholderValue: "Bold Headline Goes Here",
  },
  {
    aiEnabled: true,
    contentKey: "hero.subtitle",
    defaultValue:
      "Noor Properties connects buyers, sellers, and investors with the right property. From Lekki to Abuja, we make real estate simple.",
    label: "Hero Subtitle",
    placeholderValue: "A short sentence describing your agency and the value you offer.",
  },
  {
    aiEnabled: false,
    contentKey: "hero.ctaText",
    defaultValue: "Browse Listings",
    label: "Hero CTA Text",
    placeholderValue: "Call to Action",
  },

  // Listings
  {
    aiEnabled: true,
    contentKey: "listings.heading",
    defaultValue: "Featured Properties",
    label: "Listings Heading",
    placeholderValue: "Your Listings Heading",
  },
  {
    aiEnabled: true,
    contentKey: "listings.subheading",
    defaultValue:
      "Hand-picked properties across Lagos, Abuja, and Port Harcourt. Updated daily by our team of expert agents.",
    label: "Listings Subheading",
    placeholderValue: "A short description of your property inventory.",
  },
  {
    aiEnabled: false,
    contentKey: "listings.ctaLabel",
    defaultValue: "View All Listings",
    label: "Listings CTA Label",
    placeholderValue: "CTA Label",
  },

  // Story
  {
    aiEnabled: true,
    contentKey: "story.eyebrow",
    defaultValue: "Our Story",
    label: "Story Eyebrow",
    placeholderValue: "Section Label",
  },
  {
    aiEnabled: true,
    contentKey: "story.heading",
    defaultValue: "A Decade of Connecting Families with Great Homes",
    label: "Story Heading",
    placeholderValue: "Your About Section Heading",
  },
  {
    aiEnabled: true,
    contentKey: "story.body",
    defaultValue:
      "Founded in Lagos in 2014, Noor Properties has grown into one of Nigeria's most trusted real estate agencies. We believe every family deserves a home they love, and every investor deserves transparent, data-driven guidance. Our team of 30+ licensed agents operates across five states, bringing local expertise and national reach to every transaction.",
    label: "Story Body",
    placeholderValue: "Tell your brand story here. Share your history, values, and what sets you apart.",
  },
  {
    aiEnabled: false,
    contentKey: "story.ctaLabel",
    defaultValue: "Meet Our Team",
    label: "Story CTA Label",
    placeholderValue: "CTA Label",
  },

  // Market Stats
  {
    aiEnabled: true,
    contentKey: "marketStats.stat1Label",
    defaultValue: "Properties Sold",
    label: "Stat 1 Label",
    placeholderValue: "Stat Label",
  },
  {
    aiEnabled: false,
    contentKey: "marketStats.stat1Value",
    defaultValue: "1,200+",
    label: "Stat 1 Value",
    placeholderValue: "0",
  },
  {
    aiEnabled: true,
    contentKey: "marketStats.stat2Label",
    defaultValue: "Active Agents",
    label: "Stat 2 Label",
    placeholderValue: "Stat Label",
  },
  {
    aiEnabled: false,
    contentKey: "marketStats.stat2Value",
    defaultValue: "35",
    label: "Stat 2 Value",
    placeholderValue: "0",
  },
  {
    aiEnabled: true,
    contentKey: "marketStats.stat3Label",
    defaultValue: "Years in Business",
    label: "Stat 3 Label",
    placeholderValue: "Stat Label",
  },
  {
    aiEnabled: false,
    contentKey: "marketStats.stat3Value",
    defaultValue: "10+",
    label: "Stat 3 Value",
    placeholderValue: "0",
  },

  // Testimonials
  {
    aiEnabled: true,
    contentKey: "testimonials.heading",
    defaultValue: "What Our Clients Say",
    label: "Testimonials Heading",
    placeholderValue: "Client Testimonials Heading",
  },

  // CTA
  {
    aiEnabled: true,
    contentKey: "cta.heading",
    defaultValue: "Ready to Find Your Next Property?",
    label: "CTA Heading",
    placeholderValue: "Your CTA Heading",
  },
  {
    aiEnabled: true,
    contentKey: "cta.subheading",
    defaultValue:
      "Book a viewing today and let one of our expert agents guide you through the process — from search to completion.",
    label: "CTA Subheading",
    placeholderValue: "Supporting text for your call to action.",
  },
  {
    aiEnabled: false,
    contentKey: "cta.ctaLabel",
    defaultValue: "Book a Viewing",
    label: "CTA Button Label",
    placeholderValue: "Button Label",
  },

  // Contact
  {
    aiEnabled: false,
    contentKey: "contact.email",
    defaultValue: "hello@noorproperties.ng",
    label: "Contact Email",
    placeholderValue: "your@email.com",
  },
  {
    aiEnabled: false,
    contentKey: "contact.phone",
    defaultValue: "+234 801 234 5678",
    label: "Contact Phone",
    placeholderValue: "+234 000 000 0000",
  },
  {
    aiEnabled: false,
    contentKey: "contact.address",
    defaultValue: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    label: "Contact Address",
    placeholderValue: "Your office address",
  },
  {
    aiEnabled: false,
    contentKey: "contact.whatsapp",
    defaultValue: "+234 801 234 5678",
    label: "WhatsApp Number",
    placeholderValue: "+234 000 000 0000",
  },

  // Property Grid
  {
    aiEnabled: true,
    contentKey: "propertyGrid.eyebrow",
    defaultValue: "All Properties",
    label: "Property Grid Eyebrow",
    placeholderValue: "Section Label",
  },
  {
    aiEnabled: true,
    contentKey: "propertyGrid.title",
    defaultValue: "Browse Our Full Listing Inventory",
    label: "Property Grid Title",
    placeholderValue: "Listings Grid Title",
  },
];
