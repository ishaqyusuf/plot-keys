import type { ContentFieldDef } from "../../types";

export const thurayaContentSchema: ContentFieldDef[] = [
  // Hero
  {
    contentKey: "hero.eyebrow",
    label: "Hero Eyebrow",
    defaultValue: "Thuraya Luxury Properties",
    placeholderValue: "Your Luxury Brand",
    aiEnabled: true,
  },
  {
    contentKey: "hero.title",
    label: "Hero Title",
    defaultValue: "Rare addresses for those who expect the extraordinary.",
    placeholderValue: "Headline for Your Luxury Portfolio",
    aiEnabled: true,
  },
  {
    contentKey: "hero.subtitle",
    label: "Hero Subtitle",
    defaultValue:
      "Thuraya Luxury Properties — curated addresses for discerning buyers across Ikoyi, Banana Island, and Maitama.",
    placeholderValue: "A brief statement about your prestige properties.",
    aiEnabled: true,
  },
  {
    contentKey: "hero.ctaText",
    label: "Hero CTA Text",
    defaultValue: "Explore the Portfolio",
    placeholderValue: "View Portfolio",
    aiEnabled: true,
  },

  // Story
  {
    contentKey: "story.eyebrow",
    label: "Story Eyebrow",
    defaultValue: "Our Ethos",
    placeholderValue: "About Us",
    aiEnabled: true,
  },
  {
    contentKey: "story.heading",
    label: "Story Heading",
    defaultValue: "Uncompromising standards at every address.",
    placeholderValue: "What Sets Your Firm Apart",
    aiEnabled: true,
  },
  {
    contentKey: "story.body",
    label: "Story Body",
    defaultValue:
      "Founded on a belief that exceptional homes deserve exceptional representation, Thuraya Luxury Properties serves clients who value privacy, precision, and unparalleled market intelligence. From Banana Island waterfront estates to Maitama diplomatic residences, we curate only the most singular addresses in Nigeria.",
    placeholderValue:
      "Tell the story of your luxury firm — your heritage, market expertise, and client commitment.",
    aiEnabled: true,
  },
  {
    contentKey: "story.ctaLabel",
    label: "Story CTA Label",
    defaultValue: "Our Story",
    placeholderValue: "Learn More",
    aiEnabled: true,
  },

  // Listings
  {
    contentKey: "listings.heading",
    label: "Listings Heading",
    defaultValue: "Selected Residences",
    placeholderValue: "Featured Properties",
    aiEnabled: true,
  },
  {
    contentKey: "listings.subheading",
    label: "Listings Subheading",
    defaultValue: "A curated selection from our current portfolio.",
    placeholderValue: "A brief introduction to your featured listings.",
    aiEnabled: true,
  },
  {
    contentKey: "listings.ctaLabel",
    label: "Listings CTA Label",
    defaultValue: "View Full Portfolio",
    placeholderValue: "Browse All Properties",
    aiEnabled: true,
  },

  // Testimonials
  {
    contentKey: "testimonials.heading",
    label: "Testimonials Heading",
    defaultValue: "Client Perspectives",
    placeholderValue: "What Our Clients Say",
    aiEnabled: true,
  },

  // CTA
  {
    contentKey: "cta.heading",
    label: "CTA Heading",
    defaultValue: "Begin a private conversation.",
    placeholderValue: "Your CTA Heading",
    aiEnabled: true,
  },
  {
    contentKey: "cta.subheading",
    label: "CTA Subheading",
    defaultValue:
      "Our advisors are available for discreet consultations at a time that suits you.",
    placeholderValue: "A supporting line for your call to action.",
    aiEnabled: true,
  },
  {
    contentKey: "cta.ctaLabel",
    label: "CTA Button Label",
    defaultValue: "Request a Consultation",
    placeholderValue: "Get in Touch",
    aiEnabled: true,
  },

  // Contact
  {
    contentKey: "contact.email",
    label: "Contact Email",
    defaultValue: "enquiries@thurayaluxury.com",
    placeholderValue: "your@email.com",
    aiEnabled: false,
  },
  {
    contentKey: "contact.phone",
    label: "Contact Phone",
    defaultValue: "+234 1 000 0000",
    placeholderValue: "+234 1 000 0000",
    aiEnabled: false,
  },
  {
    contentKey: "contact.address",
    label: "Contact Address",
    defaultValue: "4 Bourdillon Road, Ikoyi, Lagos",
    placeholderValue: "Your Office Address",
    aiEnabled: false,
  },
  {
    contentKey: "contact.whatsapp",
    label: "Contact WhatsApp",
    defaultValue: "+2348000000000",
    placeholderValue: "+2348000000000",
    aiEnabled: false,
  },

  // Property Grid
  {
    contentKey: "propertyGrid.eyebrow",
    label: "Property Grid Eyebrow",
    defaultValue: "The Portfolio",
    placeholderValue: "All Properties",
    aiEnabled: true,
  },
  {
    contentKey: "propertyGrid.title",
    label: "Property Grid Title",
    defaultValue: "Every property, individually curated.",
    placeholderValue: "Browse the Full Collection",
    aiEnabled: true,
  },
];
