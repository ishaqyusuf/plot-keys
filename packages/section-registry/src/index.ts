import type { JSX } from "react";
import { getEnabledSections, getTemplatePageInventory } from "./page-inventory";
import {
  type AgentShowcaseConfig,
  AgentShowcaseSection,
  ContactSection,
  type ContactSectionConfig,
  type FAQAccordionConfig,
  FAQAccordionSection,
  type HeroSearchConfig,
  HeroSearchSection,
  type NewsletterConfig,
  NewsletterSection,
  type PropertyGridConfig,
  PropertyGridSection,
  type ServiceHighlightsConfig,
  ServiceHighlightsSection,
  type WhyChooseUsConfig,
  WhyChooseUsSection,
} from "./sections/extended-sections";
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
import type { RenderMode } from "./types";
import {
  innerPageDefaults,
  pageAliasFields,
} from "./register/inner-page-defaults";

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
};

export type LiveListingItem = {
  imageUrl?: string | null;
  id?: string;
  location: string;
  price?: string | null;
  slug?: string;
  specs?: string | null;
  title: string;
};

export type LiveAgentItem = {
  bio?: string | null;
  id: string;
  imageUrl?: string | null;
  name: string;
  slug?: string;
  title?: string | null;
};

export type { RenderMode, TenantResource } from "./types";

// ---------------------------------------------------------------------------
// Plan-based template register
// ---------------------------------------------------------------------------
import {
  getFamilyPlaceholderData as _getFamilyPlaceholderData,
  getPlaceholderContent as _getPlaceholderContent,
  getRegisterTemplate as _getRegisterTemplate,
  resolveFamilySectionComponents as _resolveFamilySectionComponents,
} from "./register/index";

export type {
  FooterConfig,
  FooterLinkGroup,
  NavConfig,
  NavLink,
  SectionComponentOverrides,
} from "./register/index";
export {
  getAccessibleRegisterTemplates,
  getFamilyFooterConfig,
  getFamilyMetaForBusinessType,
  getFamilyNavConfig,
  getFamilyPlaceholderData,
  getPlaceholderContent,
  getRegisterFamily,
  getRegisterTemplate,
  getRegisterTemplateForBusiness,
  registerTemplateCatalog,
  resolveFamilySectionComponents,
  templateFamilyRegistry,
} from "./register/index";

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
      id: listing.id,
      imageHint: listing.imageUrl ?? "Property listing",
      location: listing.location,
      price: listing.price ?? "Price on request",
      slug: listing.slug ?? listing.id,
      specs: listing.specs ?? "",
      title: listing.title,
    }));
  }

  return [
    {
      id: "sample-listing-1",
      imageHint: "Waterfront duplex preview",
      location: "Banana Island",
      price: "NGN 1.85B",
      slug: "sample-listing-1",
      specs: "5 bed • 6 bath • cinema room • private dock access",
      title: "Sunlit waterfront duplex with private family lounge",
    },
    {
      id: "sample-listing-2",
      imageHint: "Minimal tower penthouse preview",
      location: "Ikoyi",
      price: "NGN 980M",
      slug: "sample-listing-2",
      specs: "4 bed • skyline terrace • concierge • smart controls",
      title: "Penthouse residence with skyline-facing entertaining suite",
    },
    {
      id: "sample-listing-3",
      imageHint: "Garden estate preview",
      location: "Lekki Phase 1",
      price: "NGN 620M",
      slug: "sample-listing-3",
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
  pageKey?: string,
  templateKey?: string,
) => HomeSectionDefinition;

type ListingRouteContract = {
  detailHrefBase: string;
  overviewHref: string;
};

const listingOverviewPageKeys = new Set([
  "listings",
  "properties",
  "rentals",
  "portfolio",
  "projects",
]);

const listingOverviewSlugs = new Set([
  "/listings",
  "/properties",
  "/rentals",
  "/portfolio",
  "/projects",
]);

/**
 * Derives the canonical public overview/detail route base for listing-style
 * pages from the active template inventory so shared cards/CTAs follow
 * `/rentals/*`, `/projects/*`, `/portfolio/*`, etc. instead of hardcoding
 * `/listings/*`.
 */
function resolveListingRouteContract(
  templateKey: string | undefined,
  currentPageKey: string | undefined,
): ListingRouteContract {
  if (!templateKey) {
    return {
      detailHrefBase: "/listings",
      overviewHref: "/properties",
    };
  }

  const inventory = getTemplatePageInventory(templateKey);
  const currentPage = currentPageKey
    ? inventory.pages.find((page) => page.pageKey === currentPageKey)
    : undefined;
  const currentPageLooksLikeOverview =
    currentPage &&
    !currentPage.slug.includes("[") &&
    (listingOverviewPageKeys.has(currentPage.pageKey) ||
      listingOverviewSlugs.has(currentPage.slug));

  const overviewPage = currentPageLooksLikeOverview
    ? currentPage
    : inventory.pages.find(
        (page) =>
          !page.slug.includes("[") &&
          (listingOverviewPageKeys.has(page.pageKey) ||
            listingOverviewSlugs.has(page.slug)),
      );

  const overviewHref = overviewPage?.slug ?? "/properties";

  return {
    detailHrefBase: overviewHref,
    overviewHref,
  };
}

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
  ListingSpotlightSection: (
    _content,
    liveListings,
    _liveAgents,
    _subdomain,
    pageKey,
    templateKey,
  ) => {
    const listingRoutes = resolveListingRouteContract(templateKey, pageKey);

    return {
      component: ListingSpotlightSection,
      config: {
        description:
          liveListings && liveListings.length > 0
            ? `${liveListings.length} featured ${liveListings.length === 1 ? "property" : "properties"} available.`
            : "The first template supports promotional inventory cards sourced directly from the platform listing model.",
        detailHrefBase: listingRoutes.detailHrefBase,
        eyebrow: "Featured inventory",
        items: buildListingSpotlightItems(liveListings),
        title: "Featured listings feel editorial, not templated.",
      },
      id: "listing-spotlight",
      type: "listing_spotlight",
    };
  },
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
        slug: a.slug ?? a.id,
      })),
      title: "The people who make it happen.",
    },
    id: "agent-showcase",
    type: "agent_showcase",
  }),
  PropertyGridSection: (
    _content,
    liveListings,
    _liveAgents,
    _subdomain,
    pageKey,
    templateKey,
  ) => {
    const listingRoutes = resolveListingRouteContract(templateKey, pageKey);

    return {
      component: PropertyGridSection,
      config: {
        ctaHref: listingRoutes.overviewHref,
        ctaText: "View all properties",
        detailHrefBase: listingRoutes.detailHrefBase,
        eyebrow: "Active listings",
        items: (liveListings ?? []).map((p, i) => ({
          id: p.id ?? `property-${i}`,
          imageUrl: p.imageUrl ?? undefined,
          location: p.location,
          price: p.price ?? undefined,
          slug: p.slug ?? p.id,
          specs: p.specs ?? undefined,
          title: p.title,
        })),
        title: "Properties available now.",
      },
      id: "property-grid",
      type: "property_grid",
    };
  },
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
  HeroSearchSection: (
    content,
    _liveListings,
    _liveAgents,
    _subdomain,
    pageKey,
    templateKey,
  ) => {
    const listingRoutes = resolveListingRouteContract(templateKey, pageKey);

    return {
      component: HeroSearchSection,
      config: {
        ctaHref: listingRoutes.overviewHref,
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
    };
  },
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
 * Applies per-page content aliasing for non-home pages.
 *
 * When rendering the "about" page, if the tenant (or the inner-page defaults)
 * has set "about.hero.title", that value is copied into "hero.title" so the
 * existing section builders — which always read the base keys — pick up the
 * page-specific content without any builder changes.
 *
 * The priority chain for a given base key on a non-home page is:
 *   page-prefixed tenant content  >  page-prefixed inner-page defaults  >  base key value
 */
function resolvePageContent(
  content: TenantContentRecord,
  pageKey: string,
): TenantContentRecord {
  if (pageKey === "home") return content;
  const resolved: TenantContentRecord = { ...content };
  for (const field of pageAliasFields) {
    const prefixed = `${pageKey}.${field}`;
    if (content[prefixed] !== undefined) {
      resolved[field] = content[prefixed];
    }
  }
  return resolved;
}

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

  // Alias page-prefixed content keys to base keys so builders remain unchanged.
  const resolvedContent = resolvePageContent(content, pageKey);

  const sections: HomeSectionDefinition[] = slots
    .map((slot) => {
      const builder = sectionBuilders[slot.sectionType];
      return builder
        ? builder(
            resolvedContent,
            liveListings,
            liveAgents,
            subdomain,
            pageKey,
            templateKey,
          )
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
        sectionBuilders[type]?.(
          content,
          liveListings,
          liveAgents,
          subdomain,
          "home",
          undefined,
        ),
      )
      .filter((s): s is HomeSectionDefinition => s !== null),
  };
}

// ---------------------------------------------------------------------------
// Template catalog
// ---------------------------------------------------------------------------

export const templateCatalog: TemplateDefinition[] = [
  {
    defaultContent: createDefaultContent(
      "Zara Realty",
      "Lekki, Lagos",
      "Luxury homes and investment addresses",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Zara Realty",
      market: "Lekki, Lagos",
      supportLine: "+234 803 000 1204",
    },
    description:
      "Premium luxury positioning with calm, editorial presentation.",
    editableFields: baseEditableFields,
    key: "template-1",
    marketingTagline:
      "A calm, editorial layout built for luxury and premium residential brands.",
    name: "Zara",
    purchasable: false,
    tier: "starter",
  },
  {
    defaultContent: createDefaultContent(
      "Leila Homes",
      "Ikoyi, Lagos",
      "Modern homes for city-focused buyers",
    ),
    defaultTheme: {
      accentColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Leila Homes",
      market: "Ikoyi, Lagos",
      supportLine: "+234 803 555 0141",
    },
    description: "Sharper city-led positioning for modern urban inventory.",
    editableFields: baseEditableFields,
    key: "template-2",
    marketingTagline:
      "Bold, listing-first layout for urban agencies and commercial portfolios.",
    name: "Leila",
    purchasable: true,
    tier: "plus",
  },
  {
    defaultContent: createDefaultContent(
      "Cedar Properties",
      "Abuja",
      "Trusted family homes and investment-ready spaces",
    ),
    defaultTheme: {
      accentColor: "#b45309",
      backgroundColor: "#fffaf0",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Cedar Properties",
      market: "Abuja",
      supportLine: "+234 809 222 4431",
    },
    description:
      "Warm, trust-led presentation for family and investor audiences.",
    editableFields: baseEditableFields,
    key: "template-3",
    marketingTagline:
      "Warm, trust-driven layout ideal for family buyers and investor audiences.",
    name: "Cedar",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 4: Meridian Estates (residential / clean / listings) ───
  {
    defaultContent: createDefaultContent(
      "Kiran Estates",
      "Port Harcourt",
      "Prime residential and commercial addresses",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Kiran Estates",
      market: "Port Harcourt",
      supportLine: "+234 803 444 7700",
    },
    description:
      "Clean, listing-first layout for high-volume residential markets.",
    editableFields: baseEditableFields,
    key: "template-4",
    marketingTagline:
      "Listing-first, data-backed layout for residential sales agencies.",
    name: "Kiran",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 5: Thornfield (investor / bold / commercial) ───────────
  {
    defaultContent: createDefaultContent(
      "Anbar Capital",
      "Victoria Island, Lagos",
      "Investment-grade commercial and mixed-use assets",
    ),
    defaultTheme: {
      accentColor: "#1e293b",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Anbar Capital",
      market: "Victoria Island, Lagos",
      supportLine: "+234 1 234 5678",
    },
    description:
      "Bold, data-confident presentation for commercial and investor audiences.",
    editableFields: baseEditableFields,
    key: "template-5",
    marketingTagline:
      "High-conviction layout built for commercial and investment-grade mandates.",
    name: "Anbar",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 6: Crestview (family / warm / mid-market) ──────────────
  {
    defaultContent: createDefaultContent(
      "Duha Homes",
      "Abuja",
      "Quality family homes across Abuja's best neighbourhoods",
    ),
    defaultTheme: {
      accentColor: "#16a34a",
      backgroundColor: "#f0fdf4",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Duha Homes",
      market: "Abuja",
      supportLine: "+234 802 100 4321",
    },
    description:
      "Warm, community-led layout for family-focused mid-market agencies.",
    editableFields: baseEditableFields,
    key: "template-6",
    marketingTagline:
      "Welcoming, community-driven layout for family-first residential agencies.",
    name: "Duha",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 7: Vega Lite (starter / clean / volume residential) ─────
  {
    defaultContent: createDefaultContent(
      "Nura Realty",
      "Lagos",
      "Straightforward listings for every budget",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Nura Realty",
      market: "Lagos",
      supportLine: "+234 803 100 0200",
    },
    description:
      "Lightweight, clean starter for high-volume residential agencies.",
    editableFields: baseEditableFields,
    key: "template-7",
    marketingTagline:
      "Simple, clean layout that puts your listings first without the fluff.",
    name: "Nura",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 8: Nova Basic (starter / bold / urban professional) ─────
  {
    defaultContent: createDefaultContent(
      "Siraj Homes",
      "Abuja",
      "Modern properties for urban professionals",
    ),
    defaultTheme: {
      accentColor: "#1e293b",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Siraj Homes",
      market: "Abuja",
      supportLine: "+234 809 000 0301",
    },
    description:
      "Bold, professional starter for urban and commercial-leaning agencies.",
    editableFields: baseEditableFields,
    key: "template-8",
    marketingTagline:
      "Bold and professional — a confident first impression for modern agencies.",
    name: "Siraj",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 9: Lyra Basic (starter / bold / growth) ─────────────────
  {
    defaultContent: createDefaultContent(
      "Saba Properties",
      "Port Harcourt",
      "Growth-focused real estate for ambitious buyers",
    ),
    defaultTheme: {
      accentColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      logo: "Saba Properties",
      market: "Port Harcourt",
      supportLine: "+234 803 200 0401",
    },
    description: "Energetic, lead-focused starter for growing agencies.",
    editableFields: baseEditableFields,
    key: "template-9",
    marketingTagline:
      "High-energy layout built to convert browsers into enquiries.",
    name: "Saba",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 10: Myra Basic (starter / clean / rental & property mgmt) ──
  {
    defaultContent: createDefaultContent(
      "Reem Realty",
      "Lagos",
      "Reliable rentals and managed properties",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f0fdf4",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Reem Realty",
      market: "Lagos",
      supportLine: "+234 803 300 0501",
    },
    description:
      "Clean, trustworthy starter ideal for rental and property management brands.",
    editableFields: baseEditableFields,
    key: "template-10",
    marketingTagline:
      "Calm and credible — built for rental agencies and property managers.",
    name: "Reem",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 11: Maia Growth (plus / editorial / brand + leads) ──────
  {
    defaultContent: createDefaultContent(
      "Mira Living",
      "Lekki, Lagos",
      "Where lifestyle meets real estate",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f4efe7",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Mira Living",
      market: "Lekki, Lagos",
      supportLine: "+234 803 400 0601",
    },
    description: "Editorial, lifestyle-driven layout for brand-first agencies.",
    editableFields: baseEditableFields,
    key: "template-11",
    marketingTagline:
      "Lifestyle-led editorial layout that makes your brand unforgettable.",
    name: "Mira",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 12: Horizon Plus (plus / clean / mixed portfolio) ───────
  {
    defaultContent: createDefaultContent(
      "Rand Realty",
      "Abuja",
      "Diverse property portfolio for every goal",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Rand Realty",
      market: "Abuja",
      supportLine: "+234 803 500 0701",
    },
    description: "Versatile, data-forward layout for mixed-portfolio agencies.",
    editableFields: baseEditableFields,
    key: "template-12",
    marketingTagline:
      "Balanced and data-forward — handles sales, rentals, and commercial with ease.",
    name: "Rand",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 13: Nova Pro (pro / bold / luxury commercial) ──────────
  {
    defaultContent: createDefaultContent(
      "Noor Capital",
      "Victoria Island, Lagos",
      "Premium commercial and luxury residential mandates",
    ),
    defaultTheme: {
      accentColor: "#1e293b",
      backgroundColor: "#0f172a",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Noor Capital",
      market: "Victoria Island, Lagos",
      supportLine: "+234 1 700 0080",
    },
    description:
      "Dark, premium pro layout for luxury and high-end commercial brands.",
    editableFields: baseEditableFields,
    key: "template-13",
    marketingTagline:
      "Dark, high-conviction layout reserved for luxury and commercial leaders.",
    name: "Noor",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 14: Hana (starter / warm / family / Ibadan) ───────────────
  {
    defaultContent: createDefaultContent(
      "Hana Realty",
      "Ibadan",
      "Warm family homes for community-rooted buyers",
    ),
    defaultTheme: {
      accentColor: "#d97706",
      backgroundColor: "#fffbeb",
      fontFamily: "Georgia, serif",
      headingFontFamily: "Georgia, serif",
      logo: "Hana Realty",
      market: "Ibadan",
      supportLine: "+234 803 600 0801",
    },
    description: "Warm, family-friendly starter for community-rooted agencies.",
    editableFields: baseEditableFields,
    key: "template-14",
    marketingTagline:
      "A warm, family-centred starter for agencies rooted in community trust.",
    name: "Hana",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 15: Farah (starter / bold+clean / conversion / Lagos) ──────
  {
    defaultContent: createDefaultContent(
      "Farah Realty",
      "Lagos",
      "Fast, conversion-focused homes for smart buyers",
    ),
    defaultTheme: {
      accentColor: "#7c3aed",
      backgroundColor: "#faf5ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Farah Realty",
      market: "Lagos",
      supportLine: "+234 803 700 0901",
    },
    description:
      "Bright, conversion-optimised starter that drives enquiries fast.",
    editableFields: baseEditableFields,
    key: "template-15",
    marketingTagline:
      "Bright and conversion-focused — built to turn visitors into enquiries.",
    name: "Farah",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 16: Dara (starter / clean / trustworthy / Enugu) ───────────
  {
    defaultContent: createDefaultContent(
      "Dara Properties",
      "Enugu",
      "Honest, straightforward homes for mid-market buyers",
    ),
    defaultTheme: {
      accentColor: "#059669",
      backgroundColor: "#f0fdf4",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      logo: "Dara Properties",
      market: "Enugu",
      supportLine: "+234 803 800 1001",
    },
    description:
      "Trustworthy, no-nonsense starter for honest mid-market agencies.",
    editableFields: baseEditableFields,
    key: "template-16",
    marketingTagline:
      "No-nonsense, trustworthy starter for agencies that put honesty first.",
    name: "Dara",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 17: Layla (starter / editorial+warm / boutique / Port Harcourt) ──
  {
    defaultContent: createDefaultContent(
      "Layla Homes",
      "Port Harcourt",
      "Curated, boutique homes for discerning buyers",
    ),
    defaultTheme: {
      accentColor: "#9f1239",
      backgroundColor: "#fff1f2",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Layla Homes",
      market: "Port Harcourt",
      supportLine: "+234 803 900 1101",
    },
    description:
      "Boutique-elegant starter for curated, high-care residential brands.",
    editableFields: baseEditableFields,
    key: "template-17",
    marketingTagline:
      "Boutique-elegant starter for residential brands with a curated, personal touch.",
    name: "Layla",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 18: Jouri (starter / clean+bold / lifestyle / Lagos) ────────
  {
    defaultContent: createDefaultContent(
      "Jouri Realty",
      "Lagos",
      "Fresh lifestyle homes for young urban buyers",
    ),
    defaultTheme: {
      accentColor: "#0891b2",
      backgroundColor: "#ecfeff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Jouri Realty",
      market: "Lagos",
      supportLine: "+234 804 000 1201",
    },
    description:
      "Fresh, lifestyle-led starter for agencies targeting young urban buyers.",
    editableFields: baseEditableFields,
    key: "template-18",
    marketingTagline:
      "Fresh and lifestyle-led — built for agencies targeting young urban buyers.",
    name: "Jouri",
    purchasable: false,
    tier: "starter",
  },
  // ─── Template 19: Amal (plus / editorial / brand storytelling / Lekki) ───
  {
    defaultContent: createDefaultContent(
      "Amal Living",
      "Lekki, Lagos",
      "Aspirational homes with brand-first storytelling",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f0fdfa",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Amal Living",
      market: "Lekki, Lagos",
      supportLine: "+234 804 100 1301",
    },
    description:
      "Brand storytelling layout for aspirational residential positioning.",
    editableFields: baseEditableFields,
    key: "template-19",
    marketingTagline:
      "Brand storytelling layout for aspirational residential agencies with a clear voice.",
    name: "Amal",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 20: Bayan (plus / clean / data-forward / Abuja) ────────────
  {
    defaultContent: createDefaultContent(
      "Bayan Properties",
      "Abuja",
      "Data-rich market insight for serious buyers",
    ),
    defaultTheme: {
      accentColor: "#2563eb",
      backgroundColor: "#eff6ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Bayan Properties",
      market: "Abuja",
      supportLine: "+234 804 200 1401",
    },
    description:
      "Data-rich, clear layout for agencies with deep market insight.",
    editableFields: baseEditableFields,
    key: "template-20",
    marketingTagline:
      "Data-forward plus layout for agencies with deep market knowledge to share.",
    name: "Bayan",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 21: Yasmin (plus / warm+editorial / boutique / VI Lagos) ───
  {
    defaultContent: createDefaultContent(
      "Yasmin Realty",
      "Victoria Island, Lagos",
      "Warm, boutique homes for lifestyle-led buyers",
    ),
    defaultTheme: {
      accentColor: "#be185d",
      backgroundColor: "#fdf2f8",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Fraunces', Georgia, serif",
      logo: "Yasmin Realty",
      market: "Victoria Island, Lagos",
      supportLine: "+234 804 300 1501",
    },
    description:
      "Warm, elegant plus layout for boutique and lifestyle-driven agencies.",
    editableFields: baseEditableFields,
    key: "template-21",
    marketingTagline:
      "Warm and elegant plus layout for boutique agencies with a lifestyle-first brand.",
    name: "Yasmin",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 22: Sahar (plus / clean+bold / growth story / Abuja) ───────
  {
    defaultContent: createDefaultContent(
      "Sahar Estates",
      "Abuja",
      "Forward-looking homes for agencies with a growth story",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Sahar Estates",
      market: "Abuja",
      supportLine: "+234 804 400 1601",
    },
    description:
      "Fresh, forward-looking layout for agencies with a growth story to tell.",
    editableFields: baseEditableFields,
    key: "template-22",
    marketingTagline:
      "Fresh, growth-oriented plus layout for agencies ready to announce their momentum.",
    name: "Sahar",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 23: Tamar (plus / warm / community trust / Ibadan) ─────────
  {
    defaultContent: createDefaultContent(
      "Tamar Properties",
      "Ibadan",
      "Community-rooted trust for long-term clients",
    ),
    defaultTheme: {
      accentColor: "#15803d",
      backgroundColor: "#f0fdf4",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Tamar Properties",
      market: "Ibadan",
      supportLine: "+234 804 500 1701",
    },
    description:
      "Community-rooted layout for agencies built on long-term client trust.",
    editableFields: baseEditableFields,
    key: "template-23",
    marketingTagline:
      "Community-rooted plus layout for agencies where trust is the real product.",
    name: "Tamar",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 24: Zain (plus / clean+bold / minimal / Lagos) ─────────────
  {
    defaultContent: createDefaultContent(
      "Zain Realty",
      "Lagos",
      "Graceful, minimal homes that let the property speak",
    ),
    defaultTheme: {
      accentColor: "#334155",
      backgroundColor: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Zain Realty",
      market: "Lagos",
      supportLine: "+234 804 600 1801",
    },
    description:
      "Minimal, graceful layout that lets properties and brand speak clearly.",
    editableFields: baseEditableFields,
    key: "template-24",
    marketingTagline:
      "Graceful and minimal — a plus layout that lets your properties do the talking.",
    name: "Zain",
    purchasable: true,
    tier: "plus",
  },
  // ─── Template 25: Shams (pro / warm+editorial / bright luxury / Lekki) ───
  {
    defaultContent: createDefaultContent(
      "Shams Realty",
      "Lekki, Lagos",
      "Sun-lit luxury homes for premium warm-market buyers",
    ),
    defaultTheme: {
      accentColor: "#b45309",
      backgroundColor: "#fffbeb",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Playfair Display', Georgia, serif",
      logo: "Shams Realty",
      market: "Lekki, Lagos",
      supportLine: "+234 804 700 1901",
    },
    description:
      "Sun-lit luxury pro layout for premium warm-market residential mandates.",
    editableFields: baseEditableFields,
    key: "template-25",
    marketingTagline:
      "Warm luxury pro layout for agencies serving the premium residential market.",
    name: "Shams",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 26: Karim (pro / clean+editorial / full-featured / Abuja) ──
  {
    defaultContent: createDefaultContent(
      "Karim Estates",
      "Abuja",
      "Full-service homes for established agencies",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f0fdfa",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      logo: "Karim Estates",
      market: "Abuja",
      supportLine: "+234 804 800 2001",
    },
    description:
      "Full-featured pro layout for established agencies with broad service offerings.",
    editableFields: baseEditableFields,
    key: "template-26",
    marketingTagline:
      "Full-featured pro layout for established agencies with a broad, confident offer.",
    name: "Karim",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 27: Rafiq (pro / editorial+warm / trusted advisor / Lagos) ──
  {
    defaultContent: createDefaultContent(
      "Rafiq Properties",
      "Lagos",
      "Trusted advisor homes where relationships drive everything",
    ),
    defaultTheme: {
      accentColor: "#1e40af",
      backgroundColor: "#f0f9ff",
      fontFamily: "Georgia, serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Rafiq Properties",
      market: "Lagos",
      supportLine: "+234 804 900 2101",
    },
    description:
      "Trusted-advisor pro layout for agencies where relationships drive everything.",
    editableFields: baseEditableFields,
    key: "template-27",
    marketingTagline:
      "Trusted-advisor pro layout for agencies where long-term relationships are the edge.",
    name: "Rafiq",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 28: Amber (pro / warm / rich luxury / VI Lagos) ────────────
  {
    defaultContent: createDefaultContent(
      "Amber Realty",
      "Victoria Island, Lagos",
      "Rich heritage homes for high-value investors",
    ),
    defaultTheme: {
      accentColor: "#92400e",
      backgroundColor: "#fef3c7",
      fontFamily: "Georgia, serif",
      headingFontFamily: "'Fraunces', Georgia, serif",
      logo: "Amber Realty",
      market: "Victoria Island, Lagos",
      supportLine: "+234 805 000 2201",
    },
    description:
      "Rich, warm luxury pro for heritage residential and high-value investor markets.",
    editableFields: baseEditableFields,
    key: "template-28",
    marketingTagline:
      "Rich, warm luxury pro layout for heritage residential and investor-grade mandates.",
    name: "Amber",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 29: Saffron (pro / bold+editorial / exclusive / Ikoyi) ──────
  {
    defaultContent: createDefaultContent(
      "Saffron Realty",
      "Ikoyi, Lagos",
      "Premium homes for exclusive, invitation-only buyers",
    ),
    defaultTheme: {
      accentColor: "#a21caf",
      backgroundColor: "#fdf4ff",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Saffron Realty",
      market: "Ikoyi, Lagos",
      supportLine: "+234 805 100 2301",
    },
    description:
      "Premium pro layout for exclusive, invitation-only or ultra-high-net-worth audiences.",
    editableFields: baseEditableFields,
    key: "template-29",
    marketingTagline:
      "Premium pro layout for exclusive agencies serving ultra-high-net-worth clients.",
    name: "Saffron",
    purchasable: true,
    tier: "pro",
  },
  // ─── Template 30: Coral (pro / bold+clean / coastal / Lagos Island) ───────
  {
    defaultContent: createDefaultContent(
      "Coral Realty",
      "Lagos Island",
      "Coastal, aspirational homes for waterfront and high-rise buyers",
    ),
    defaultTheme: {
      accentColor: "#be123c",
      backgroundColor: "#fff1f2",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Inter, sans-serif",
      logo: "Coral Realty",
      market: "Lagos Island",
      supportLine: "+234 805 200 2401",
    },
    description:
      "Coastal-inspired pro layout for aspirational waterfront and high-rise markets.",
    editableFields: baseEditableFields,
    key: "template-30",
    marketingTagline:
      "Coastal-inspired pro layout for waterfront and high-rise aspirational markets.",
    name: "Coral",
    purchasable: true,
    tier: "pro",
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

export function getTemplateDefinition(templateKey: string): TemplateDefinition {
  return (
    templateCatalog.find((template) => template.key === templateKey) ??
    fallbackTemplate
  );
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
  // For non-home pages, inject per-page default content (e.g. "about.hero.title")
  // between template defaults and tenant-saved content so tenants can override.
  const pageDefaults = pageKey !== "home" ? (innerPageDefaults[pageKey] ?? {}) : {};
  const mergedContent = {
    ...template.defaultContent,
    ...pageDefaults,
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
  const familyOverrides = _resolveFamilySectionComponents(
    registerVariant?.family,
  );

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

// ---------------------------------------------------------------------------
// resolvePage — register-aware page resolver with template mode support
// ---------------------------------------------------------------------------

/**
 * Minimal tenant context needed to render a single page.
 * In "template" render mode all fields are optional — placeholder data
 * is used automatically.
 */
export type TenantSnapshot = {
  companyName?: string;
  companyLogoUrl?: string | null;
  content?: TenantContentRecord;
  liveAgents?: LiveAgentItem[];
  liveListings?: LiveListingItem[];
  market?: string;
  subdomain?: string;
  theme?: TenantThemeRecord;
};

/**
 * Resolved output of a single page — sections with family-branded components
 * already applied, plus the fully merged theme.
 */
export type ResolvedPageConfig = {
  pageKey: string;
  renderMode: RenderMode;
  sections: HomeSectionDefinition[];
  theme: ThemeConfig;
};

/**
 * Resolves a single page from a register template key.
 *
 * Differences from resolveWebsitePresentation:
 * - In "template" render mode, uses placeholderValue content from the
 *   family's content-schema and placeholder listings/agents from
 *   placeholder-data.ts instead of live tenant data.
 * - Returns a flat ResolvedPageConfig rather than a full presentation
 *   object — no editableFields, no template metadata.
 * - Applies family component overrides in the same way as
 *   resolveWebsitePresentation does.
 *
 * @example
 * // Template browse mode — placeholder data, no tenant required
 * const page = resolvePage("noor-starter", "home", {}, "template");
 *
 * // Live rendering
 * const page = resolvePage("noor-starter", "listings", tenant, "live");
 */
export function resolvePage(
  templateKey: string,
  pageKey: string,
  tenant: TenantSnapshot,
  renderMode: RenderMode = "live",
): ResolvedPageConfig {
  const registerVariant = _getRegisterTemplate(templateKey);
  const template = getTemplateDefinition(templateKey);

  // In template mode, substitute placeholder content and data for the family.
  let content: TenantContentRecord;
  let liveListings: LiveListingItem[] | undefined;
  let liveAgents: LiveAgentItem[] | undefined;

  if (renderMode === "template" && registerVariant) {
    content = _getPlaceholderContent(registerVariant.family);
    const phData = _getFamilyPlaceholderData(registerVariant.family);
    liveListings = phData.listings?.map((l) => ({
      id: l.id,
      imageUrl: l.imageUrl ?? null,
      location: l.location,
      price: l.price,
      slug: l.slug,
      specs: l.specs,
      title: l.title,
    }));
    liveAgents = phData.agents?.map((a) => ({
      bio: a.bio,
      id: a.id,
      imageUrl: a.photoUrl ?? null,
      name: a.name,
      slug: a.slug,
      title: a.role,
    }));
  } else {
    const pageDefaults = pageKey !== "home" ? (innerPageDefaults[pageKey] ?? {}) : {};
    content = { ...template.defaultContent, ...pageDefaults, ...tenant.content };
    liveListings = tenant.liveListings;
    liveAgents = tenant.liveAgents;
  }

  const builtPage = buildPageSections(
    content,
    pageKey,
    templateKey,
    liveListings,
    liveAgents,
    tenant.subdomain,
  );

  const familyOverrides = _resolveFamilySectionComponents(
    registerVariant?.family,
  );
  const sections = builtPage.sections.map((s) => ({
    ...s,
    component:
      (familyOverrides[s.type] as typeof s.component | undefined) ??
      s.component,
  })) as HomeSectionDefinition[];

  const theme: ThemeConfig = {
    ...template.defaultTheme,
    ...tenant.theme,
    logo:
      tenant.companyName ??
      (tenant.theme as ThemeConfig | undefined)?.logo ??
      template.defaultTheme.logo,
    logoUrl:
      tenant.companyLogoUrl ??
      (tenant.theme as ThemeConfig | undefined)?.logoUrl ??
      undefined,
    market:
      tenant.market ??
      (tenant.theme as ThemeConfig | undefined)?.market ??
      template.defaultTheme.market,
  };

  return { pageKey: builtPage.pageKey, renderMode, sections, theme };
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

export type {
  ContentNode,
  ContentNodeKind,
  ContentNodeProvenance,
  ContentNodeRecord,
} from "./content-nodes";
export {
  applyAiGeneration,
  applyHumanEdit,
  flattenContentNodes,
  liftFlatContent,
} from "./content-nodes";
export type { FontFallbackMap } from "./fonts";
export {
  fontFallbacks,
  resolveFontStack,
  resolveHeadingFontStack,
  resolveSlotFont,
} from "./fonts";
export type {
  FormAction,
  FormActionKind,
  SectionFormBinding,
} from "./form-registry";
// Form action registry
export {
  getFormAction,
  getFormProcedurePath,
  isSectionFormBound,
  sectionFormBindings,
} from "./form-registry";
export type {
  PageDefinition,
  SectionSlot,
  TemplatePageInventory,
} from "./page-inventory";
export {
  collectContentKeys,
  getEnabledSections,
  getTemplatePageInventory,
} from "./page-inventory";
export type {
  DerivedDesignConfig,
  DerivedPageComposition,
  DerivedProfile,
  OnboardingSnapshot,
  SectionVisibilityMap,
  TemplateRecommendation,
} from "./recommendation";
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
  ClickGuardItem,
  ClickGuardItemType,
} from "./runtime/click-guard";
// Runtime interaction — ClickGuard + InlineOverview
export {
  ClickGuardProvider,
  useClickGuard,
} from "./runtime/click-guard";
export type { InlineOverviewProps } from "./runtime/inline-overview";
export { InlineOverview } from "./runtime/inline-overview";
export { PreviewBanner } from "./runtime/preview-banner";
export type {
  WebsiteRuntimeContextValue,
  WebsiteRuntimeProviderProps,
} from "./runtime-context";
// Runtime context — WebsiteRuntimeProvider + hooks
export {
  useColorSystem,
  useIsDraftMode,
  useRenderMode,
  useResolvedFont,
  useTemplateConfig,
  useTemplateImage,
  useTemplateStylePreset,
  WebsiteRuntimeProvider,
} from "./runtime-context";
export {
  SmartFillProvider,
  useSmartFill,
} from "./runtime/smart-fill-context";
export type { SmartFillFn } from "./runtime/smart-fill-context";
export type {
  EditableImageProps,
  EditableRepeaterProps,
  EditableTextProps,
} from "./sections/editing-primitives";
// Inline editing primitives
export {
  EditableImage,
  EditableRepeater,
  EditableText,
} from "./sections/editing-primitives";
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
  StockImage,
  StockImageCategory,
  StockImageLicenseTier,
} from "./stock-images";
export {
  getFreeStockImages,
  getStockImageById,
  getStockImagesByCategory,
  getStockImagesForSlot,
  stockImageCatalog,
} from "./stock-images";
export type {
  ColorScheme,
  ColorSystem,
  ColorTokenSet,
  StylePreset,
  StylePresetDefinition,
  TemplateConfig,
} from "./template-config";
// Color system
export {
  applyConfigUpdate,
  colorSystems,
  deserializeTemplateConfig,
  fromDerivedDesignConfig,
  resolvePresetConfig,
  serializeTemplateConfig,
  stylePresets,
} from "./template-config";

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
