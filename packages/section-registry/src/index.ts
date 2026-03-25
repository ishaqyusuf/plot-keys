import type { JSX } from "react";
import type { RenderMode } from "./types";
import {
  type CtaBandConfig,
  CtaBandSection,
  type HeroBannerConfig,
  HeroBannerSection,
  type ListingSpotlightConfig,
  type ListingSpotlightItem,
  ListingSpotlightSection,
  type MarketStatsConfig,
  MarketStatsSection,
  type StoryGridConfig,
  StoryGridSection,
  type TestimonialStripConfig,
  TestimonialStripSection,
  type ThemeConfig,
} from "./sections/home-page";
import {
  AgentShowcaseSection,
  type AgentShowcaseConfig,
  PropertyGridSection,
  type PropertyGridConfig,
  ContactSection,
  type ContactSectionConfig,
  FAQAccordionSection,
  type FAQAccordionConfig,
  NewsletterSection,
  type NewsletterConfig,
  HeroSearchSection,
  type HeroSearchConfig,
  WhyChooseUsSection,
  type WhyChooseUsConfig,
  ServiceHighlightsSection,
  type ServiceHighlightsConfig,
} from "./sections/extended-sections";
import { getEnabledSections } from "./page-inventory";

export type TemplateTier = "starter" | "plus" | "pro";

export type SectionDefinition<TConfig> = {
  component: (props: { config: TConfig; theme: ThemeConfig }) => JSX.Element;
  config: TConfig;
  id: string;
  type: string;
};

export type HomeSectionDefinition =
  | SectionDefinition<HeroBannerConfig>
  | SectionDefinition<MarketStatsConfig>
  | SectionDefinition<StoryGridConfig>
  | SectionDefinition<ListingSpotlightConfig>
  | SectionDefinition<TestimonialStripConfig>
  | SectionDefinition<CtaBandConfig>
  | SectionDefinition<AgentShowcaseConfig>
  | SectionDefinition<PropertyGridConfig>
  | SectionDefinition<ContactSectionConfig>
  | SectionDefinition<FAQAccordionConfig>
  | SectionDefinition<NewsletterConfig>
  | SectionDefinition<HeroSearchConfig>
  | SectionDefinition<WhyChooseUsConfig>
  | SectionDefinition<ServiceHighlightsConfig>;

export type EditableFieldDefinition = {
  aiEnabled?: boolean;
  contentKey: string;
  fieldType: "text" | "textarea";
  label: string;
  longDetail: string;
  placeholder?: string;
  preferredLength?: string;
  shortDetail: string;
};

export type TenantContentRecord = Record<string, string>;

export type TenantThemeRecord = Partial<
  Pick<
    ThemeConfig,
    | "accentColor"
    | "backgroundColor"
    | "fontFamily"
    | "headingFontFamily"
    | "logo"
    | "logoUrl"
    | "market"
    | "supportLine"
  >
>;

/**
 * A colour/typography variation of a template that shares the same page
 * structure as the parent template. Variation keys double as the stored
 * `templateKey` in the DB for backward compatibility.
 *
 * The parent template's page inventory and section layout are shared;
 * only the theme values (accent, background, fonts) differ.
 */
export type TemplateVariation = {
  /** Accent colour hex, e.g. "#0f766e". */
  accentColor: string;
  /** Background colour hex, e.g. "#f8fafc". */
  backgroundColor: string;
  /** Short description of the visual character of this variation. */
  description: string;
  /** Body font family string. */
  fontFamily: string;
  /** Heading font family string. */
  headingFontFamily: string;
  /**
   * Unique key — stored as `templateKey` in the DB.
   * Allows backward compat: existing tenants keep their variation key and the
   * system resolves the parent template automatically.
   */
  key: string;
  /** Human-readable variation name shown in the style picker. */
  name: string;
  /** Whether this variation requires a paid plan purchase to unlock. */
  purchasable: boolean;
  /** Plan tier gate for this variation. */
  tier: TemplateTier;
};

export type TemplateDefinition = {
  defaultContent: TenantContentRecord;
  defaultTheme: ThemeConfig;
  description: string;
  editableFields: EditableFieldDefinition[];
  key: string;
  /** Human-readable marketing tagline shown in the template picker. */
  marketingTagline: string;
  name: string;
  /** Named image defaults exposed to the builder for URL replacement. */
  namedImageSlots?: Record<string, string>;
  /** Whether this template can be individually purchased without a plan upgrade. */
  purchasable: boolean;
  /** URL of the preview thumbnail used in template cards. */
  previewImageUrl?: string;
  tier: TemplateTier;
  /**
   * When present, this template supports colour/typography variations.
   * Each variation shares the same page structure but has its own theme.
   * The variation `key` is what gets stored in the DB as `templateKey`.
   */
  variations?: TemplateVariation[];
};

export type LiveListingItem = {
  imageUrl?: string | null;
  id?: string;
  location: string;
  price?: string | null;
  specs?: string | null;
  title: string;
};

export type LiveAgentItem = {
  bio?: string | null;
  id: string;
  imageUrl?: string | null;
  name: string;
  title?: string | null;
};

export type { RenderMode, TenantResource } from "./types";

// ---------------------------------------------------------------------------
// Plan-based template register
// ---------------------------------------------------------------------------
import {
  getRegisterTemplate as _getRegisterTemplate,
  resolveFamilySectionComponents as _resolveFamilySectionComponents,
} from "./register/index";

export {
  templateFamilyRegistry,
  registerTemplateCatalog,
  getRegisterTemplate,
  getRegisterFamily,
  getRegisterTemplateForBusiness,
  getAccessibleRegisterTemplates,
  getFamilyMetaForBusinessType,
  resolveFamilySectionComponents,
} from "./register/index";
export type { SectionComponentOverrides } from "./register/index";

export type ResolvedWebsitePresentation = {
  editableFields: EditableFieldDefinition[];
  page: {
    pageKey: string;
    sections: HomeSectionDefinition[];
  };
  renderMode: RenderMode;
  template: TemplateDefinition;
  theme: ThemeConfig;
};

type ResolveTemplateOptions = {
  companyName?: string;
  /** Public URL of the company logo image, if uploaded. */
  companyLogoUrl?: string | null;
  content?: TenantContentRecord;
  liveAgents?: LiveAgentItem[];
  liveListings?: LiveListingItem[];
  market?: string;
  /** Which page to render. Defaults to "home" when omitted. */
  pageKey?: string;
  /** Defaults to "live" when omitted. */
  renderMode?: RenderMode;
  subdomain?: string;
  templateKey: string;
  theme?: TenantThemeRecord;
};

const baseEditableFields: EditableFieldDefinition[] = [
  {
    aiEnabled: true,
    contentKey: "hero.eyebrow",
    fieldType: "text",
    label: "Hero eyebrow",
    longDetail:
      "Write a short premium eyebrow for a real-estate homepage. Keep it aspirational and under 6 words.",
    preferredLength: "2-6 words",
    shortDetail: "Small hero label above the main headline.",
  },
  {
    aiEnabled: true,
    contentKey: "hero.title",
    fieldType: "text",
    label: "Hero title",
    longDetail:
      "Write a homepage headline for a premium real-estate company. Keep it confident, trustworthy, and under 10 words.",
    preferredLength: "4-10 words",
    shortDetail: "Main homepage headline.",
  },
  {
    aiEnabled: true,
    contentKey: "hero.subtitle",
    fieldType: "textarea",
    label: "Hero subtitle",
    longDetail:
      "Write a supporting hero paragraph for a real-estate homepage. Keep it polished, informative, and under 28 words.",
    preferredLength: "16-28 words",
    shortDetail: "Supporting sentence below the main headline.",
  },
  {
    aiEnabled: true,
    contentKey: "hero.ctaText",
    fieldType: "text",
    label: "Primary CTA",
    longDetail:
      "Write a concise call to action for a real-estate website homepage button. Keep it direct and under 4 words.",
    preferredLength: "2-4 words",
    shortDetail: "Primary button label in the hero.",
  },
  {
    aiEnabled: true,
    contentKey: "story.title",
    fieldType: "text",
    label: "Story section title",
    longDetail:
      "Write a credibility-building section title explaining why this real-estate company stands out. Keep it premium and under 12 words.",
    preferredLength: "6-12 words",
    shortDetail: "Section title for the trust/positioning block.",
  },
  {
    aiEnabled: true,
    contentKey: "story.description",
    fieldType: "textarea",
    label: "Story section description",
    longDetail:
      "Write a concise paragraph about why this real-estate company offers a strong experience. Keep it specific and under 35 words.",
    preferredLength: "18-35 words",
    shortDetail: "Intro paragraph for the trust/positioning block.",
  },
  {
    aiEnabled: true,
    contentKey: "cta.title",
    fieldType: "text",
    label: "Final CTA title",
    longDetail:
      "Write a final conversion-focused call-to-action heading for a real-estate website. Keep it under 12 words and confident.",
    preferredLength: "5-12 words",
    shortDetail: "Closing section headline before the final buttons.",
  },
  {
    aiEnabled: true,
    contentKey: "cta.body",
    fieldType: "textarea",
    label: "Final CTA body",
    longDetail:
      "Write a final conversion paragraph encouraging the visitor to enquire or book a viewing. Keep it polished and under 30 words.",
    preferredLength: "16-30 words",
    shortDetail: "Closing support text for the final CTA block.",
  },
];

function createDefaultContent(
  companyName: string,
  market: string,
  emphasis: string,
): TenantContentRecord {
  return {
    "cta.body":
      "Book a private consultation, request a shortlist, or start a tailored property search with a team that understands premium client expectations.",
    "cta.title": `Start your ${market} search with ${companyName}.`,
    "hero.ctaText": "Browse listings",
    "hero.eyebrow": emphasis,
    "hero.subtitle": `${companyName} helps buyers, investors, and families discover trusted homes and high-conviction opportunities across ${market}.`,
    "hero.title": `Find your next signature property in ${market}.`,
    "story.description":
      "This structured template helps ambitious real-estate companies launch a polished public presence fast, without losing clarity or conversion focus.",
    "story.title": `${companyName} turns trust into momentum.`,
  };
}

function buildListingSpotlightItems(
  liveListings: LiveListingItem[] | undefined,
): ListingSpotlightItem[] {
  if (liveListings && liveListings.length > 0) {
    return liveListings.slice(0, 3).map((listing) => ({
      imageHint: listing.imageUrl ?? "Property listing",
      location: listing.location,
      price: listing.price ?? "Price on request",
      specs: listing.specs ?? "",
      title: listing.title,
    }));
  }

  return [
    {
      imageHint: "Waterfront duplex preview",
      location: "Banana Island",
      price: "NGN 1.85B",
      specs: "5 bed • 6 bath • cinema room • private dock access",
      title: "Sunlit waterfront duplex with private family lounge",
    },
    {
      imageHint: "Minimal tower penthouse preview",
      location: "Ikoyi",
      price: "NGN 980M",
      specs: "4 bed • skyline terrace • concierge • smart controls",
      title: "Penthouse residence with skyline-facing entertaining suite",
    },
    {
      imageHint: "Garden estate preview",
      location: "Lekki Phase 1",
      price: "NGN 620M",
      specs: "4 bed • pool deck • home office • gated community",
      title: "Contemporary family home tucked into a quiet garden estate",
    },
  ];
}

// ---------------------------------------------------------------------------
// Section builder map — maps page-inventory sectionType → HomeSectionDefinition
// ---------------------------------------------------------------------------

type SectionBuilder = (
  content: TenantContentRecord,
  liveListings?: LiveListingItem[],
  liveAgents?: LiveAgentItem[],
  subdomain?: string,
) => HomeSectionDefinition;

const sectionBuilders: Record<string, SectionBuilder> = {
  HeroBannerSection: (content) => ({
    component: HeroBannerSection,
    config: {
      ctaHref: "#featured-listings",
      ctaText: content["hero.ctaText"] ?? "Browse listings",
      eyebrow:
        content["hero.eyebrow"] ?? "Luxury homes and investment addresses",
      subtitle:
        content["hero.subtitle"] ??
        "A refined real-estate experience for buyers, investors, and families looking for trusted guidance.",
      title:
        content["hero.title"] ??
        "Find your next signature property with confidence.",
    },
    id: "hero-banner",
    type: "hero_banner",
  }),
  MarketStatsSection: () => ({
    component: MarketStatsSection,
    config: {
      items: [
        { label: "Homes sold last year", value: "128" },
        { label: "Average closing timeline", value: "21 days" },
        { label: "Verified buyer inquiries", value: "94%" },
      ],
    },
    id: "market-stats",
    type: "market_stats",
  }),
  ListingSpotlightSection: (content, liveListings) => ({
    component: ListingSpotlightSection,
    config: {
      description:
        liveListings && liveListings.length > 0
          ? `${liveListings.length} featured ${liveListings.length === 1 ? "property" : "properties"} available.`
          : "The first template supports promotional inventory cards sourced directly from the platform listing model.",
      eyebrow: "Featured inventory",
      items: buildListingSpotlightItems(liveListings),
      title: "Featured listings feel editorial, not templated.",
    },
    id: "listing-spotlight",
    type: "listing_spotlight",
  }),
  StoryGridSection: (content) => ({
    component: StoryGridSection,
    config: {
      description:
        content["story.description"] ??
        "The first tenant template balances premium presentation with clear information architecture so every public page can convert interest into real conversations.",
      eyebrow: "Why this template works",
      items: [
        {
          body: "Organize your offer around neighborhoods, trust signals, and high-value inventory without rebuilding each landing page from scratch.",
          title: "Premium positioning",
        },
        {
          body: "Structured sections give every property, team story, and CTA a clean place in the page, so content stays usable on mobile and desktop.",
          title: "Disciplined layout system",
        },
        {
          body: "Every section is designed to support lead capture and future CMS-driven editing rather than static one-off pages.",
          title: "Built for conversion",
        },
      ],
      title:
        content["story.title"] ??
        "A polished website system for agencies that need credibility fast.",
    },
    id: "story-grid",
    type: "story_grid",
  }),
  TestimonialStripSection: () => ({
    component: TestimonialStripSection,
    config: {
      items: [
        {
          quote:
            "They made the shortlist feel effortless and handled every detail with a calm level of professionalism.",
          role: "Buyer, Ikoyi relocation",
          speaker: "M. Adebayo",
        },
        {
          quote:
            "The property presentation felt thoughtful from first click to first viewing, which immediately built trust with our family.",
          role: "Home buyer, Lekki",
          speaker: "R. Okonkwo",
        },
        {
          quote:
            "Our inquiries improved because the website finally reflected the quality of the homes we represent.",
          role: "Managing partner, luxury brokerage",
          speaker: "T. Hassan",
        },
      ],
    },
    id: "testimonial-strip",
    type: "testimonial_strip",
  }),
  CtaBandSection: (content) => ({
    component: CtaBandSection,
    config: {
      body:
        content["cta.body"] ??
        "Book a private consultation, request a shortlist, or start a tailored property search with a team that understands premium client expectations.",
      primaryHref: "#",
      primaryText: "Book a consultation",
      secondaryHref: "#featured-listings",
      secondaryText: "View available homes",
      title:
        content["cta.title"] ??
        "Start your search with a team that knows the market.",
    },
    id: "cta-band",
    type: "cta_band",
  }),
  AgentShowcaseSection: (_content, _listings, liveAgents) => ({
    component: AgentShowcaseSection,
    config: {
      description: "Meet the team behind every successful deal.",
      eyebrow: "Our team",
      items: (liveAgents ?? []).map((a) => ({
        bio: a.bio ?? undefined,
        id: a.id,
        name: a.name,
        photoUrl: a.imageUrl ?? undefined,
        role: a.title ?? "Agent",
      })),
      title: "The people who make it happen.",
    },
    id: "agent-showcase",
    type: "agent_showcase",
  }),
  PropertyGridSection: (_content, liveListings) => ({
    component: PropertyGridSection,
    config: {
      ctaHref: "/properties",
      ctaText: "View all properties",
      eyebrow: "Active listings",
      items: (liveListings ?? []).map((p, i) => ({
        id: p.id ?? `property-${i}`,
        imageUrl: p.imageUrl ?? undefined,
        location: p.location,
        price: p.price ?? undefined,
        slug: p.id,
        specs: p.specs ?? undefined,
        title: p.title,
      })),
      title: "Properties available now.",
    },
    id: "property-grid",
    type: "property_grid",
  }),
  ContactSection: (content, _listings, _agents, subdomain) => ({
    component: ContactSection,
    config: {
      address: content["contact.address"] ?? undefined,
      ctaText: "Send message",
      email: content["contact.email"] ?? undefined,
      formEndpoint: "/api/contact",
      phone: content["contact.phone"] ?? undefined,
      subdomain: subdomain ?? "",
      subtitle:
        "Have a question about a listing, or ready to start your search? Get in touch and we'll get back to you within 24 hours.",
      title: "Get in touch.",
      whatsapp: content["contact.whatsapp"] ?? undefined,
    },
    id: "contact-section",
    type: "contact_section",
  }),
  FAQAccordionSection: () => ({
    component: FAQAccordionSection,
    config: {
      eyebrow: "Common questions",
      items: [
        {
          id: "faq-1",
          question: "How do I schedule a viewing?",
          answer:
            "Contact us through the form or call our support line to arrange a private viewing at your convenience.",
        },
        {
          id: "faq-2",
          question: "What areas do you cover?",
          answer:
            "We cover all major residential and commercial districts. Check our listings page for current availability by location.",
        },
        {
          id: "faq-3",
          question: "Do you help with financing?",
          answer:
            "We partner with trusted mortgage advisors and can connect you with financing options suited to your budget.",
        },
        {
          id: "faq-4",
          question: "How long does the buying process take?",
          answer:
            "Typical timelines range from 30 to 90 days depending on the property type, financing, and legal requirements.",
        },
      ],
      title: "Frequently asked questions.",
    },
    id: "faq-accordion",
    type: "faq_accordion",
  }),
  NewsletterSection: () => ({
    component: NewsletterSection,
    config: {
      disclaimer: "No spam. Unsubscribe anytime.",
      placeholder: "Enter your email",
      submitText: "Subscribe",
      subtitle:
        "Get market updates, new listings, and expert insights delivered weekly.",
      title: "Stay ahead of the market.",
    },
    id: "newsletter-strip",
    type: "newsletter_strip",
  }),
  HeroSearchSection: (content) => ({
    component: HeroSearchSection,
    config: {
      ctaHref: "/properties",
      ctaText: content["hero.ctaText"] ?? "Search now",
      locationOptions: [
        "All locations",
        "Lekki",
        "Ikoyi",
        "Victoria Island",
        "Abuja",
        "Port Harcourt",
      ],
      subtitle:
        content["hero.subtitle"] ??
        "Search thousands of verified listings across premium locations.",
      title: content["hero.title"] ?? "Find Your Dream Home",
    },
    id: "hero-search",
    type: "hero_search",
  }),
  WhyChooseUsSection: () => ({
    component: WhyChooseUsSection,
    config: {
      eyebrow: "Why choose us",
      items: [
        {
          icon: "🏠",
          stat: "500+",
          title: "Properties Sold",
          description:
            "Trusted by hundreds of families and investors across the country.",
        },
        {
          icon: "⭐",
          stat: "98%",
          title: "Client Satisfaction",
          description:
            "Consistently rated excellent by buyers and sellers alike.",
        },
        {
          icon: "📍",
          stat: "25+",
          title: "Neighborhoods",
          description:
            "Deep local expertise across the most sought-after locations.",
        },
        {
          icon: "🤝",
          stat: "15+",
          title: "Years Experience",
          description:
            "A proven track record built on relationships and results.",
        },
      ],
      title: "Numbers that speak for themselves.",
    },
    id: "why-choose-us",
    type: "why_choose_us",
  }),
  ServiceHighlightsSection: () => ({
    component: ServiceHighlightsSection,
    config: {
      description:
        "From first viewing to final signature, we handle every detail.",
      eyebrow: "Our services",
      items: [
        {
          icon: "🔍",
          title: "Property Search",
          description:
            "Curated shortlists matched to your lifestyle, budget, and investment goals.",
        },
        {
          icon: "📋",
          title: "Transaction Management",
          description:
            "End-to-end support through legal, financial, and closing processes.",
        },
        {
          icon: "📈",
          title: "Market Advisory",
          description:
            "Data-driven insights on pricing, timing, and high-growth neighborhoods.",
        },
      ],
      title: "Full-service real estate, simplified.",
    },
    id: "service-highlights",
    type: "service_highlights",
  }),
};

/**
 * Client-safe registry mapping section type keys to their React components.
 * Use this in client components instead of reading `section.component` from
 * a `HomeSectionDefinition` (which cannot cross the server/client boundary as
 * a prop).
 */
export const sectionComponents: Record<
  string,
  (props: { config: unknown; theme: ThemeConfig }) => JSX.Element
> = {
  hero_banner: HeroBannerSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  market_stats: MarketStatsSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  story_grid: StoryGridSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  listing_spotlight: ListingSpotlightSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  testimonial_strip: TestimonialStripSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  cta_band: CtaBandSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  agent_showcase: AgentShowcaseSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  property_grid: PropertyGridSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  contact_section: ContactSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  faq_accordion: FAQAccordionSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  newsletter_strip: NewsletterSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  hero_search: HeroSearchSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  why_choose_us: WhyChooseUsSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  service_highlights: ServiceHighlightsSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
};

/**
 * Serializable section data — safe to pass across the server/client boundary.
 * Strip the `component` field from `HomeSectionDefinition` before sending to
 * a Client Component and use `sectionComponents` to render.
 */
export type SerializableSectionData = {
  config: unknown;
  id: string;
  type: string;
};

/**
 * Builds the section list for the given page, driven by the page-inventory for
 * the given template. Per-template overrides (e.g. Meridian leads with listings)
 * are respected automatically. Falls back to the default home section set when
 * the home page has no enabled slots. Non-home pages return an empty section
 * list when no slots are defined (treated as a blank page by the caller).
 */
function buildPageSections(
  content: TenantContentRecord,
  pageKey: string,
  templateKey: string,
  liveListings?: LiveListingItem[],
  liveAgents?: LiveAgentItem[],
  subdomain?: string,
): {
  pageKey: string;
  sections: HomeSectionDefinition[];
} {
  const slots = getEnabledSections(templateKey, pageKey);

  const sections: HomeSectionDefinition[] = slots
    .map((slot) => {
      const builder = sectionBuilders[slot.sectionType];
      return builder
        ? builder(content, liveListings, liveAgents, subdomain)
        : null;
    })
    .filter((s): s is HomeSectionDefinition => s !== null);

  // Fallback: if no inventory slots matched and we asked for home, render the default set.
  // Non-home pages intentionally return an empty section list when the template has not
  // defined any slots for that page — the caller treats an empty page as a blank canvas.
  if (sections.length === 0 && pageKey === "home") {
    return buildDefaultHomePage(content, liveListings, liveAgents, subdomain);
  }

  return { pageKey, sections };
}

/** Fallback for unknown template keys — renders the standard 5-section home. */
function buildDefaultHomePage(
  content: TenantContentRecord,
  liveListings?: LiveListingItem[],
  liveAgents?: LiveAgentItem[],
  subdomain?: string,
): { pageKey: string; sections: HomeSectionDefinition[] } {
  const defaultOrder = [
    "HeroBannerSection",
    "MarketStatsSection",
    "StoryGridSection",
    "ListingSpotlightSection",
    "TestimonialStripSection",
    "CtaBandSection",
  ];
  return {
    pageKey: "home",
    sections: defaultOrder
      .map((type) =>
        sectionBuilders[type]?.(content, liveListings, liveAgents, subdomain),
      )
      .filter((s): s is HomeSectionDefinition => s !== null),
  };
}

// ---------------------------------------------------------------------------
// Template catalog
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Classic template — 30 colour/typography variations sharing the same
// baseHomeSections page structure. Each variation key (template-1 … template-30)
// maps directly to what is stored as `templateKey` in the DB, preserving full
// backward compatibility for existing tenants.
// ---------------------------------------------------------------------------

const classicVariations: TemplateVariation[] = [
  // ── Starter variations ────────────────────────────────────────────────────
  {
    accentColor: "#0f766e",
    backgroundColor: "#f8fafc",
    description: "Premium luxury positioning with calm, editorial presentation.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-1",
    name: "Zara",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#0369a1",
    backgroundColor: "#f0f9ff",
    description: "Lightweight, clean starter for high-volume residential agencies.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Inter, system-ui, sans-serif",
    key: "template-7",
    name: "Nura",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#1e293b",
    backgroundColor: "#f8fafc",
    description: "Bold, professional starter for urban and commercial-leaning agencies.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-8",
    name: "Siraj",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#1d4ed8",
    backgroundColor: "#f8fafc",
    description: "Energetic, lead-focused starter for growing agencies.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "Satoshi, Avenir Next, sans-serif",
    key: "template-9",
    name: "Saba",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#0f766e",
    backgroundColor: "#f0fdf4",
    description: "Clean, trustworthy starter ideal for rental and property management brands.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Inter, system-ui, sans-serif",
    key: "template-10",
    name: "Reem",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#d97706",
    backgroundColor: "#fffbeb",
    description: "Warm, family-friendly starter for community-rooted agencies.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "Georgia, serif",
    key: "template-14",
    name: "Hana",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#7c3aed",
    backgroundColor: "#faf5ff",
    description: "Bright, conversion-optimised starter that drives enquiries fast.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Epilogue, Inter, sans-serif",
    key: "template-15",
    name: "Farah",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#059669",
    backgroundColor: "#f0fdf4",
    description: "Trustworthy, no-nonsense starter for honest mid-market agencies.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "Satoshi, Avenir Next, sans-serif",
    key: "template-16",
    name: "Dara",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#9f1239",
    backgroundColor: "#fff1f2",
    description: "Boutique-elegant starter for curated, high-care residential brands.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    key: "template-17",
    name: "Layla",
    purchasable: false,
    tier: "starter",
  },
  {
    accentColor: "#0891b2",
    backgroundColor: "#ecfeff",
    description: "Fresh, lifestyle-led starter for agencies targeting young urban buyers.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Inter, system-ui, sans-serif",
    key: "template-18",
    name: "Jouri",
    purchasable: false,
    tier: "starter",
  },
  // ── Plus variations ───────────────────────────────────────────────────────
  {
    accentColor: "#1d4ed8",
    backgroundColor: "#f8fafc",
    description: "Sharper city-led positioning for modern urban inventory.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-2",
    name: "Leila",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#0369a1",
    backgroundColor: "#f0f9ff",
    description: "Clean, listing-first layout for high-volume residential markets.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Inter, system-ui, sans-serif",
    key: "template-4",
    name: "Kiran",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#0f766e",
    backgroundColor: "#f4efe7",
    description: "Editorial, lifestyle-driven layout for brand-first agencies.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    key: "template-11",
    name: "Mira",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#0369a1",
    backgroundColor: "#f0f9ff",
    description: "Versatile, data-forward layout for mixed-portfolio agencies.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Epilogue, Inter, sans-serif",
    key: "template-12",
    name: "Rand",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#0f766e",
    backgroundColor: "#f0fdfa",
    description: "Brand storytelling layout for aspirational residential positioning.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    key: "template-19",
    name: "Amal",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#2563eb",
    backgroundColor: "#eff6ff",
    description: "Data-rich, clear layout for agencies with deep market insight.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Epilogue, Inter, sans-serif",
    key: "template-20",
    name: "Bayan",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#be185d",
    backgroundColor: "#fdf2f8",
    description: "Warm, elegant plus layout for boutique and lifestyle-driven agencies.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Fraunces', Georgia, serif",
    key: "template-21",
    name: "Yasmin",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#0369a1",
    backgroundColor: "#f0f9ff",
    description: "Fresh, forward-looking layout for agencies with a growth story to tell.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-22",
    name: "Sahar",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#15803d",
    backgroundColor: "#f0fdf4",
    description: "Community-rooted layout for agencies built on long-term client trust.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-23",
    name: "Tamar",
    purchasable: true,
    tier: "plus",
  },
  {
    accentColor: "#334155",
    backgroundColor: "#f8fafc",
    description: "Minimal, graceful layout that lets properties and brand speak clearly.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-24",
    name: "Zain",
    purchasable: true,
    tier: "plus",
  },
  // ── Pro variations ────────────────────────────────────────────────────────
  {
    accentColor: "#b45309",
    backgroundColor: "#fffaf0",
    description: "Warm, trust-led presentation for family and investor audiences.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-3",
    name: "Cedar",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#1e293b",
    backgroundColor: "#f8fafc",
    description: "Bold, data-confident presentation for commercial and investor audiences.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-5",
    name: "Anbar",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#16a34a",
    backgroundColor: "#f0fdf4",
    description: "Warm, community-led layout for family-focused mid-market agencies.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-6",
    name: "Duha",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#1e293b",
    backgroundColor: "#0f172a",
    description: "Dark, premium pro layout for luxury and high-end commercial brands.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-13",
    name: "Noor",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#b45309",
    backgroundColor: "#fffbeb",
    description: "Sun-lit luxury pro layout for premium warm-market residential mandates.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Playfair Display', Georgia, serif",
    key: "template-25",
    name: "Shams",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#0f766e",
    backgroundColor: "#f0fdfa",
    description: "Full-featured pro layout for established agencies with broad service offerings.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "Satoshi, Avenir Next, sans-serif",
    key: "template-26",
    name: "Karim",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#1e40af",
    backgroundColor: "#f0f9ff",
    description: "Trusted-advisor pro layout for agencies where relationships drive everything.",
    fontFamily: "Georgia, serif",
    headingFontFamily: 'Georgia, "Times New Roman", serif',
    key: "template-27",
    name: "Rafiq",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#92400e",
    backgroundColor: "#fef3c7",
    description: "Rich, warm luxury pro for heritage residential and high-value investor markets.",
    fontFamily: "Georgia, serif",
    headingFontFamily: "'Fraunces', Georgia, serif",
    key: "template-28",
    name: "Amber",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#a21caf",
    backgroundColor: "#fdf4ff",
    description: "Premium pro layout for exclusive, invitation-only or ultra-high-net-worth audiences.",
    fontFamily: "Satoshi, Avenir Next, sans-serif",
    headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
    key: "template-29",
    name: "Saffron",
    purchasable: true,
    tier: "pro",
  },
  {
    accentColor: "#be123c",
    backgroundColor: "#fff1f2",
    description: "Coastal-inspired pro layout for aspirational waterfront and high-rise markets.",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Epilogue, Inter, sans-serif",
    key: "template-30",
    name: "Coral",
    purchasable: true,
    tier: "pro",
  },
];

export const templateCatalog: TemplateDefinition[] = [
  // ─── Classic — 30 colour/typography variations, same baseHomeSections layout ──
  {
    defaultContent: createDefaultContent(
      "Your Company",
      "Lagos",
      "Luxury homes and investment addresses",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Your Company",
      market: "Lagos",
      supportLine: "",
    },
    description:
      "The original PlotKeys layout — Hero, Market Stats, Listings, Story, and CTA. Choose from 30 colour and typography variations.",
    editableFields: baseEditableFields,
    key: "template-classic",
    marketingTagline:
      "The original PlotKeys layout — 30 colour and font variations to match your brand.",
    name: "Classic",
    purchasable: false,
    tier: "starter",
    variations: classicVariations,
  },
  // ─── Template 31: Sama (starter / search-first / Lekki) ──────────────────
  {
    defaultContent: createDefaultContent(
      "Sama Estates",
      "Lekki, Lagos",
      "Search. Discover. Move in.",
    ),
    defaultTheme: {
      accentColor: "#0d9488",
      backgroundColor: "#f0fdfa",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Sama Estates",
      market: "Lekki, Lagos",
      supportLine: "+234 806 100 3101",
    },
    description:
      "Clean, search-driven starter that puts the property search bar front and center.",
    editableFields: baseEditableFields,
    key: "template-31",
    marketingTagline:
      "Search-first residential starter with prominent property search hero.",
    name: "Sama",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 32: Rania (starter / agent-first / Abuja) ──────────────────
  {
    defaultContent: createDefaultContent(
      "Rania Realty",
      "Abuja",
      "Meet the team behind every key",
    ),
    defaultTheme: {
      accentColor: "#6366f1",
      backgroundColor: "#eef2ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Rania Realty",
      market: "Abuja",
      supportLine: "+234 806 200 3201",
    },
    description:
      "Boutique starter layout that puts your agents and team front and center.",
    editableFields: baseEditableFields,
    key: "template-32",
    marketingTagline: "Agent-first boutique starter that leads with your team.",
    name: "Rania",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 33: Jihan (starter / minimal / Port Harcourt) ──────────────
  {
    defaultContent: createDefaultContent(
      "Jihan Properties",
      "Port Harcourt",
      "Pure listings, zero noise",
    ),
    defaultTheme: {
      accentColor: "#475569",
      backgroundColor: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Jihan Properties",
      market: "Port Harcourt",
      supportLine: "+234 806 300 3301",
    },
    description:
      "Ultra-clean starter that strips away everything except hero and listings.",
    editableFields: baseEditableFields,
    key: "template-33",
    marketingTagline: "Minimal, listings-only starter with maximum clarity.",
    name: "Jihan",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 34: Nadia (starter / narrative / Ikoyi) ────────────────────
  {
    defaultContent: createDefaultContent(
      "Nadia Living",
      "Ikoyi, Lagos",
      "Your story, beautifully told",
    ),
    defaultTheme: {
      accentColor: "#c026d3",
      backgroundColor: "#fdf4ff",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Nadia Living",
      market: "Ikoyi, Lagos",
      supportLine: "+234 806 400 3401",
    },
    description:
      "Narrative-first starter for agencies that lead with their brand story.",
    editableFields: baseEditableFields,
    key: "template-34",
    marketingTagline:
      "Story-driven starter focused on brand narrative over listings.",
    name: "Nadia",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 35: Walid (starter / stats / Victoria Island) ──────────────
  {
    defaultContent: createDefaultContent(
      "Walid Capital",
      "Victoria Island, Lagos",
      "Data-driven confidence",
    ),
    defaultTheme: {
      accentColor: "#1d4ed8",
      backgroundColor: "#eff6ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      logo: "Walid Capital",
      market: "Victoria Island, Lagos",
      supportLine: "+234 806 500 3501",
    },
    description:
      "Statistics-forward starter that leads with market data and numbers.",
    editableFields: baseEditableFields,
    key: "template-35",
    marketingTagline: "Stats-heavy starter for data-confident agencies.",
    name: "Walid",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 36: Tariq (plus / search+stats / Lagos) ────────────────────
  {
    defaultContent: createDefaultContent(
      "Tariq Realty",
      "Lagos",
      "Search smarter. Live better.",
    ),
    defaultTheme: {
      accentColor: "#0891b2",
      backgroundColor: "#ecfeff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Tariq Realty",
      market: "Lagos",
      supportLine: "+234 807 100 3601",
    },
    description:
      "Complete search-centric plus layout combining search hero with full content sections.",
    editableFields: baseEditableFields,
    key: "template-36",
    marketingTagline:
      "Full-featured search layout with stats, stories, and social proof.",
    name: "Tariq",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 37: Soraya (plus / editorial / Lekki) ──────────────────────
  {
    defaultContent: createDefaultContent(
      "Soraya Living",
      "Lekki, Lagos",
      "Where editorial meets real estate",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f4efe7",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Fraunces', Georgia, serif",
      logo: "Soraya Living",
      market: "Lekki, Lagos",
      supportLine: "+234 807 200 3701",
    },
    description:
      "Editorial plus layout blending story, listings, and agent showcase in a magazine format.",
    editableFields: baseEditableFields,
    key: "template-37",
    marketingTagline:
      "Magazine-style editorial layout for content-rich brands.",
    name: "Soraya",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 38: Rashid (plus / investor / Abuja) ───────────────────────
  {
    defaultContent: createDefaultContent(
      "Rashid Investments",
      "Abuja",
      "Invest with clarity",
    ),
    defaultTheme: {
      accentColor: "#1e40af",
      backgroundColor: "#f0f9ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Rashid Investments",
      market: "Abuja",
      supportLine: "+234 807 300 3801",
    },
    description:
      "Investor-focused plus layout leading with market data and a browseable property grid.",
    editableFields: baseEditableFields,
    key: "template-38",
    marketingTagline:
      "Data-driven investor layout with analytics and property grid.",
    name: "Rashid",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 39: Dalal (plus / lifestyle / Ikoyi) ───────────────────────
  {
    defaultContent: createDefaultContent(
      "Dalal Homes",
      "Ikoyi, Lagos",
      "Lifestyle-led living",
    ),
    defaultTheme: {
      accentColor: "#be185d",
      backgroundColor: "#fdf2f8",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Dalal Homes",
      market: "Ikoyi, Lagos",
      supportLine: "+234 807 400 3901",
    },
    description:
      "Service-oriented plus layout that blends lifestyle branding with lead capture.",
    editableFields: baseEditableFields,
    key: "template-39",
    marketingTagline:
      "Lifestyle showcase with service highlights and brand storytelling.",
    name: "Dalal",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 40: Imran (plus / community / Ibadan) ──────────────────────
  {
    defaultContent: createDefaultContent(
      "Imran Properties",
      "Ibadan",
      "Built on community trust",
    ),
    defaultTheme: {
      accentColor: "#15803d",
      backgroundColor: "#f0fdf4",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Imran Properties",
      market: "Ibadan",
      supportLine: "+234 807 500 4001",
    },
    description:
      "Community-trust plus layout combining social proof with agent prominence.",
    editableFields: baseEditableFields,
    key: "template-40",
    marketingTagline:
      "Community-focused layout with trust signals and team showcase.",
    name: "Imran",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 41: Khalid (pro / enterprise / Lagos) ──────────────────────
  {
    defaultContent: createDefaultContent(
      "Khalid Group",
      "Lagos",
      "Enterprise-grade real estate",
    ),
    defaultTheme: {
      accentColor: "#1e293b",
      backgroundColor: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Khalid Group",
      market: "Lagos",
      supportLine: "+234 808 100 4101",
    },
    description:
      "Maximum-section pro layout with search hero, stats, listings, agents, FAQ, contact, and more.",
    editableFields: baseEditableFields,
    key: "template-41",
    marketingTagline:
      "Enterprise search portal with maximum sections and full conversion funnel.",
    name: "Khalid",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 42: Salma (pro / luxury / Banana Island) ───────────────────
  {
    defaultContent: createDefaultContent(
      "Salma Realty",
      "Banana Island, Lagos",
      "Luxury, curated and delivered",
    ),
    defaultTheme: {
      accentColor: "#92400e",
      backgroundColor: "#fffbeb",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Salma Realty",
      market: "Banana Island, Lagos",
      supportLine: "+234 808 200 4201",
    },
    description:
      "Visual-first luxury pro layout showcasing properties through editorial presentation.",
    editableFields: baseEditableFields,
    key: "template-42",
    marketingTagline:
      "Luxury gallery layout with visual-heavy property showcase.",
    name: "Salma",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 43: Faisal (pro / investor / Abuja) ────────────────────────
  {
    defaultContent: createDefaultContent(
      "Faisal Capital",
      "Abuja",
      "Serious investments, serious returns",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      logo: "Faisal Capital",
      market: "Abuja",
      supportLine: "+234 808 300 4301",
    },
    description:
      "Data-heavy investor pro with market stats, property grid, FAQ, and service highlights.",
    editableFields: baseEditableFields,
    key: "template-43",
    marketingTagline:
      "Investor pro layout with deep data, FAQ, and service focus.",
    name: "Faisal",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 44: Dina (pro / full-funnel / Victoria Island) ─────────────
  {
    defaultContent: createDefaultContent(
      "Dina Realty",
      "Victoria Island, Lagos",
      "Every step, handled",
    ),
    defaultTheme: {
      accentColor: "#7c3aed",
      backgroundColor: "#faf5ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Dina Realty",
      market: "Victoria Island, Lagos",
      supportLine: "+234 808 400 4401",
    },
    description:
      "Complete conversion funnel pro layout with services, listings, stories, agents, newsletter, and contact.",
    editableFields: baseEditableFields,
    key: "template-44",
    marketingTagline:
      "Full marketing funnel with every section for complete conversion.",
    name: "Dina",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 45: Omar (pro / concierge / Lekki) ─────────────────────────
  {
    defaultContent: createDefaultContent(
      "Omar Realty",
      "Lekki, Lagos",
      "Premium concierge experience",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#0f172a",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Omar Realty",
      market: "Lekki, Lagos",
      supportLine: "+234 808 500 4501",
    },
    description:
      "Dark premium pro combining search hero with story and personal agent service.",
    editableFields: baseEditableFields,
    key: "template-45",
    marketingTagline:
      "Premium concierge layout with search hero and personal service focus.",
    name: "Omar",
    purchasable: true,
    tier: "pro",
  },
];

const fallbackTemplate = templateCatalog[0] as TemplateDefinition;

/**
 * Returns the TemplateVariation for a given key, or undefined when the key is
 * not a variation key (i.e. it maps directly to a top-level template).
 */
export function getVariationForTemplateKey(
  key: string,
): TemplateVariation | undefined {
  for (const template of templateCatalog) {
    if (!template.variations) continue;
    const variation = template.variations.find((v) => v.key === key);
    if (variation) return variation;
  }
  return undefined;
}

/**
 * Returns the parent TemplateDefinition for a given variation key, or undefined
 * when the key is not a variation key.
 */
export function getParentTemplateForVariationKey(
  key: string,
): TemplateDefinition | undefined {
  for (const template of templateCatalog) {
    if (!template.variations) continue;
    if (template.variations.some((v) => v.key === key)) return template;
  }
  return undefined;
}

/**
 * Resolves a `TemplateDefinition` for the given key.
 *
 * - Direct match: returns the template as-is.
 * - Variation key (e.g. "template-1"…"template-30"): returns the parent
 *   template with `defaultTheme` overridden by the variation's theme values,
 *   and `key`/`name`/`tier`/`purchasable` reflecting the variation. This
 *   preserves full backward compatibility — existing tenants that stored a
 *   variation key as their `templateKey` continue to resolve correctly.
 * - Unknown key: falls back to the first template in the catalog.
 */
export function getTemplateDefinition(templateKey: string): TemplateDefinition {
  const direct = templateCatalog.find((t) => t.key === templateKey);
  if (direct) return direct;

  // Check if it is a variation key
  for (const template of templateCatalog) {
    if (!template.variations) continue;
    const variation = template.variations.find((v) => v.key === templateKey);
    if (variation) {
      return {
        ...template,
        defaultTheme: {
          ...template.defaultTheme,
          accentColor: variation.accentColor,
          backgroundColor: variation.backgroundColor,
          fontFamily: variation.fontFamily,
          headingFontFamily: variation.headingFontFamily,
        },
        description: variation.description,
        key: variation.key,
        name: variation.name,
        purchasable: variation.purchasable,
        tier: variation.tier,
        // Strip variations from the resolved definition so callers
        // that check for variations don't get confused.
        variations: undefined,
      };
    }
  }

  return fallbackTemplate;
}

export function createInitialSiteConfigurationInput({
  companyName,
  market,
  subdomain,
  templateKey,
}: {
  companyName: string;
  market: string;
  subdomain: string;
  templateKey: string;
}) {
  const template = getTemplateDefinition(templateKey);

  return {
    contentJson: createDefaultContent(
      companyName,
      market,
      template.defaultContent["hero.eyebrow"] ?? "Premium homes",
    ),
    name: `${template.name} Draft`,
    subdomain,
    templateKey: template.key,
    themeJson: {
      ...template.defaultTheme,
      logo: companyName,
      market,
    },
  };
}

export function resolveWebsitePresentation({
  companyName,
  companyLogoUrl,
  content,
  liveAgents,
  liveListings,
  market,
  pageKey = "home",
  renderMode = "live",
  subdomain,
  templateKey,
  theme,
}: ResolveTemplateOptions): ResolvedWebsitePresentation {
  const template = getTemplateDefinition(templateKey);
  const mergedContent = {
    ...template.defaultContent,
    ...content,
  };

  const builtPage = buildPageSections(
    mergedContent,
    pageKey,
    templateKey,
    liveListings,
    liveAgents,
    subdomain,
  );

  // Apply family-specific component overrides when the templateKey maps to a
  // register family (e.g. "noor-starter" → family "agency"). Old template keys
  // (e.g. "template-1") return undefined family → no overrides, generic fallback.
  const registerVariant = _getRegisterTemplate(templateKey);
  const familyOverrides = _resolveFamilySectionComponents(registerVariant?.family);

  // Swap in family-branded components where the override map provides one.
  // When familyOverrides is empty (stub or old template key) this is a no-op.
  const page = {
    ...builtPage,
    sections: builtPage.sections.map((s) => ({
      ...s,
      component:
        (familyOverrides[s.type] as typeof s.component | undefined) ??
        s.component,
    })) as HomeSectionDefinition[],
  };

  return {
    editableFields: template.editableFields,
    page,
    renderMode,
    template,
    theme: {
      ...template.defaultTheme,
      ...theme,
      logo: companyName ?? theme?.logo ?? template.defaultTheme.logo,
      logoUrl: companyLogoUrl ?? theme?.logoUrl ?? undefined,
      market: market ?? theme?.market ?? template.defaultTheme.market,
      supportLine:
        theme?.supportLine ??
        `${subdomain ?? companyName?.toLowerCase().replace(/\s+/g, "") ?? "company"}.plotkeys.app`,
    },
  };
}

/**
 * Returns true when a content field value should be treated as empty/missing
 * and should show a placeholder outline in draft rendering mode.
 */
export function isContentFieldEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Returns the CSS class string to apply to a content field wrapper when in
 * draft mode and the field has no user-supplied value.
 */
export function draftPlaceholderClass(
  renderMode: RenderMode,
  value: string | undefined | null,
): string {
  if (renderMode !== "draft") return "";
  return isContentFieldEmpty(value)
    ? "outline-dashed outline-2 outline-offset-2 outline-amber-400/60 rounded"
    : "";
}

export const sampleTheme = fallbackTemplate.defaultTheme;
export const sampleHomePage = buildPageSections(
  fallbackTemplate.defaultContent,
  "home",
  fallbackTemplate.key,
);

export {
  applyAiGeneration,
  applyHumanEdit,
  flattenContentNodes,
  liftFlatContent,
} from "./content-nodes";
export {
  applyConfigUpdate,
  deserializeTemplateConfig,
  fromDerivedDesignConfig,
  resolvePresetConfig,
  serializeTemplateConfig,
  stylePresets,
} from "./template-config";
export {
  getFreeStockImages,
  getStockImageById,
  getStockImagesByCategory,
  getStockImagesForSlot,
  stockImageCatalog,
} from "./stock-images";
export type {
  StockImage,
  StockImageCategory,
  StockImageLicenseTier,
} from "./stock-images";
export type {
  ColorScheme,
  StylePreset,
  StylePresetDefinition,
  TemplateConfig,
} from "./template-config";
export type {
  ContentNode,
  ContentNodeKind,
  ContentNodeProvenance,
  ContentNodeRecord,
} from "./content-nodes";
export {
  resolveFontStack,
  resolveHeadingFontStack,
  resolveSlotFont,
  fontFallbacks,
} from "./fonts";
export type { FontFallbackMap } from "./fonts";
export {
  collectContentKeys,
  getEnabledSections,
  getTemplatePageInventory,
} from "./page-inventory";
export type {
  PageDefinition,
  SectionSlot,
  TemplatePageInventory,
} from "./page-inventory";
export {
  buildBusinessSummary,
  deriveDesignConfig,
  derivePageComposition,
  derivePersonalizedContent,
  deriveProfile,
  deriveSectionVisibility,
  scoreTemplates,
} from "./recommendation";
export type {
  DerivedDesignConfig,
  DerivedPageComposition,
  DerivedProfile,
  OnboardingSnapshot,
  SectionVisibilityMap,
  TemplateRecommendation,
} from "./recommendation";

// Runtime context — WebsiteRuntimeProvider + hooks
export {
  WebsiteRuntimeProvider,
  useColorSystem,
  useIsDraftMode,
  useRenderMode,
  useResolvedFont,
  useTemplateConfig,
  useTemplateImage,
  useTemplateStylePreset,
} from "./runtime-context";
export type {
  WebsiteRuntimeContextValue,
  WebsiteRuntimeProviderProps,
} from "./runtime-context";

// Form action registry
export {
  getFormAction,
  getFormProcedurePath,
  isSectionFormBound,
  sectionFormBindings,
} from "./form-registry";
export type {
  FormAction,
  FormActionKind,
  SectionFormBinding,
} from "./form-registry";

// Color system
export { colorSystems } from "./template-config";
export type { ColorSystem, ColorTokenSet } from "./template-config";

// Inline editing primitives
export {
  EditableImage,
  EditableRepeater,
  EditableText,
} from "./sections/editing-primitives";
export type {
  EditableImageProps,
  EditableRepeaterProps,
  EditableTextProps,
} from "./sections/editing-primitives";

// Extended sections
export {
  AgentShowcaseSection,
  ContactSection,
  FAQAccordionSection,
  HeroSearchSection,
  NewsletterSection,
  PropertyGridSection,
  ServiceHighlightsSection,
  WhyChooseUsSection,
} from "./sections/extended-sections";
export type {
  AgentShowcaseConfig,
  ContactSectionConfig,
  FAQAccordionConfig,
  HeroSearchConfig,
  NewsletterConfig,
  PropertyGridConfig,
  ServiceHighlightsConfig,
  WhyChooseUsConfig,
} from "./sections/extended-sections";

export type {
  CtaBandConfig,
  HeroBannerConfig,
  ListingSpotlightConfig,
  MarketStatsConfig,
  StoryGridConfig,
  TestimonialStripConfig,
  ThemeConfig,
};
export {
  CtaBandSection,
  HeroBannerSection,
  ListingSpotlightSection,
  ListingSpotlightSection as FeaturedListingsSection,
  MarketStatsSection,
  StoryGridSection,
  TestimonialStripSection,
};
