import type { JSX } from "react";

export type TemplateTier = "starter" | "plus" | "pro";

import {
  type CtaBandConfig,
  CtaBandSection,
  type HeroBannerConfig,
  HeroBannerSection,
  type ListingSpotlightConfig,
  ListingSpotlightSection,
  type MarketStatsConfig,
  MarketStatsSection,
  type StoryGridConfig,
  StoryGridSection,
  type TestimonialStripConfig,
  TestimonialStripSection,
  type ThemeConfig,
} from "./sections/home-page";

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
  | SectionDefinition<CtaBandConfig>;

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
  /**
   * Default named image slot assignments for this template.
   * Keys are slot names (heroImage, aboutImage, ctaBackground, teamPhoto).
   * Values are default stock image URLs shown before the tenant uploads their own.
   */
  namedImageSlots?: Record<string, string>;
  /** Whether this template can be individually purchased without a plan upgrade. */
  purchasable: boolean;
  /** URL of the preview thumbnail used in template cards. */
  previewImageUrl?: string;
  tier: TemplateTier;
};

export type LiveListingItem = {
  imageUrl?: string | null;
  location: string;
  price?: string | null;
  specs?: string | null;
  title: string;
};

export type { RenderMode } from "./types";

export type ResolvedWebsitePresentation = {
  editableFields: EditableFieldDefinition[];
  page: {
    page: "home";
    sections: HomeSectionDefinition[];
  };
  renderMode: RenderMode;
  template: TemplateDefinition;
  theme: ThemeConfig;
};

type ResolveTemplateOptions = {
  companyName?: string;
  content?: TenantContentRecord;
  liveListings?: LiveListingItem[];
  market?: string;
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

function buildHomePage(
  content: TenantContentRecord,
  liveListings?: LiveListingItem[],
): {
  page: "home";
  sections: HomeSectionDefinition[];
} {
  return {
    page: "home",
    sections: [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Template catalog
// ---------------------------------------------------------------------------

export const templateCatalog: TemplateDefinition[] = [
  // ─── Starter templates ────────────────────────────────────────────────
  {
    defaultContent: createDefaultContent(
      "Aster Grove Realty",
      "Lekki, Lagos",
      "Luxury homes and investment addresses",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Aster Grove Realty",
      market: "Lekki, Lagos",
      supportLine: "+234 803 000 1204",
    },
    description:
      "Premium luxury positioning with calm, editorial presentation.",
    editableFields: baseEditableFields,
    key: "template-1",
    marketingTagline:
      "A calm, editorial layout built for luxury and premium residential brands.",
    name: "Aster Grove",
    namedImageSlots: {
      aboutImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      ctaBackground: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600",
    },
    purchasable: false,
    tier: "starter",
  },
  {
    defaultContent: createDefaultContent(
      "Vega Realty",
      "Lagos Island",
      "Smart homes for the modern buyer",
    ),
    defaultTheme: {
      accentColor: "#7c3aed",
      backgroundColor: "#faf5ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Vega Realty",
      market: "Lagos Island",
      supportLine: "+234 802 700 1111",
    },
    description: "Minimal, tech-forward layout for urban lifestyle brands.",
    editableFields: baseEditableFields,
    key: "template-7",
    marketingTagline: "Clean and minimal — built for tech-forward urban agencies.",
    name: "Vega Lite",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600",
    },
    purchasable: false,
    tier: "starter",
  },
  {
    defaultContent: createDefaultContent(
      "Nova Homes",
      "Enugu",
      "Trusted homes for growing families",
    ),
    defaultTheme: {
      accentColor: "#0284c7",
      backgroundColor: "#f0f9ff",
      fontFamily: "Manrope, system-ui, sans-serif",
      headingFontFamily: "Manrope, system-ui, sans-serif",
      logo: "Nova Homes",
      market: "Enugu",
      supportLine: "+234 803 100 2200",
    },
    description: "Bright, trustworthy layout for family-first residential agencies.",
    editableFields: baseEditableFields,
    key: "template-8",
    marketingTagline: "Bright and trustworthy — ideal for family-first residential agencies.",
    name: "Nova Basic",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600",
    },
    purchasable: false,
    tier: "starter",
  },
  {
    defaultContent: createDefaultContent(
      "Lyra Properties",
      "Ibadan",
      "Quality homes at every price point",
    ),
    defaultTheme: {
      accentColor: "#dc2626",
      backgroundColor: "#fff7f7",
      fontFamily: "Lato, Helvetica, sans-serif",
      headingFontFamily: "Lato, Helvetica, sans-serif",
      logo: "Lyra Properties",
      market: "Ibadan",
      supportLine: "+234 811 000 4455",
    },
    description: "Bold, energetic layout for high-volume sales teams.",
    editableFields: baseEditableFields,
    key: "template-9",
    marketingTagline: "Bold and energetic — for high-volume residential sales teams.",
    name: "Lyra Basic",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600",
    },
    purchasable: false,
    tier: "starter",
  },
  {
    defaultContent: createDefaultContent(
      "Myra Real Estate",
      "Kano",
      "Professional homes for ambitious buyers",
    ),
    defaultTheme: {
      accentColor: "#059669",
      backgroundColor: "#f0fdf4",
      fontFamily: "Roboto, Arial, sans-serif",
      headingFontFamily: "Roboto, Arial, sans-serif",
      logo: "Myra Real Estate",
      market: "Kano",
      supportLine: "+234 807 333 5566",
    },
    description: "Clean, professional layout for growth-focused agencies.",
    editableFields: baseEditableFields,
    key: "template-10",
    marketingTagline: "Professional and approachable — for growth-focused real estate agencies.",
    name: "Myra Basic",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600",
    },
    purchasable: false,
    tier: "starter",
  },
  // ─── Plus templates ───────────────────────────────────────────────────
  {
    defaultContent: createDefaultContent(
      "Atlas Urban Homes",
      "Ikoyi, Lagos",
      "Modern homes for city-focused buyers",
    ),
    defaultTheme: {
      accentColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Atlas Urban Homes",
      market: "Ikoyi, Lagos",
      supportLine: "+234 803 555 0141",
    },
    description: "Sharper city-led positioning for modern urban inventory.",
    editableFields: baseEditableFields,
    key: "template-2",
    marketingTagline:
      "Bold, listing-first layout for urban agencies and commercial portfolios.",
    name: "Atlas Urban",
    namedImageSlots: {
      aboutImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600",
    },
    purchasable: true,
    tier: "plus",
  },
  {
    defaultContent: createDefaultContent(
      "Meridian Estates",
      "Port Harcourt",
      "Prime residential and commercial addresses",
    ),
    defaultTheme: {
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      logo: "Meridian Estates",
      market: "Port Harcourt",
      supportLine: "+234 803 444 7700",
    },
    description: "Clean, listing-first layout for high-volume residential markets.",
    editableFields: baseEditableFields,
    key: "template-4",
    marketingTagline: "Listing-first, data-backed layout for residential sales agencies.",
    name: "Meridian",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600",
    },
    purchasable: true,
    tier: "plus",
  },
  {
    defaultContent: createDefaultContent(
      "Maia Rentals",
      "Abuja",
      "Premium rentals for every lifestyle",
    ),
    defaultTheme: {
      accentColor: "#d97706",
      backgroundColor: "#fffbeb",
      fontFamily: "Manrope, system-ui, sans-serif",
      headingFontFamily: "Fraunces, Georgia, serif",
      logo: "Maia Rentals",
      market: "Abuja",
      supportLine: "+234 810 600 7788",
    },
    description: "Warm editorial layout tailored for premium rental agencies.",
    editableFields: baseEditableFields,
    key: "template-11",
    marketingTagline: "Editorial warmth for rental agencies and property management brands.",
    name: "Maia Growth",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600",
    },
    purchasable: true,
    tier: "plus",
  },
  {
    defaultContent: createDefaultContent(
      "Horizon Agents",
      "Lagos Mainland",
      "Your neighbourhood experts",
    ),
    defaultTheme: {
      accentColor: "#0891b2",
      backgroundColor: "#f0fdfa",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Epilogue, Helvetica, sans-serif",
      logo: "Horizon Agents",
      market: "Lagos Mainland",
      supportLine: "+234 802 888 3344",
    },
    description: "Agent-centric layout highlighting team credentials and local expertise.",
    editableFields: baseEditableFields,
    key: "template-12",
    marketingTagline: "Agent-forward layout for area specialists and team-driven agencies.",
    name: "Horizon Plus",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600",
    },
    purchasable: true,
    tier: "plus",
  },
  // ─── Pro templates ────────────────────────────────────────────────────
  {
    defaultContent: createDefaultContent(
      "Palmstone Properties",
      "Abuja",
      "Trusted family homes and investment-ready spaces",
    ),
    defaultTheme: {
      accentColor: "#b45309",
      backgroundColor: "#fffaf0",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Palmstone Properties",
      market: "Abuja",
      supportLine: "+234 809 222 4431",
    },
    description:
      "Warm, trust-led presentation for family and investor audiences.",
    editableFields: baseEditableFields,
    key: "template-3",
    marketingTagline:
      "Warm, trust-driven layout ideal for family buyers and investor audiences.",
    name: "Palmstone",
    namedImageSlots: {
      aboutImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      ctaBackground: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200",
      heroImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600",
    },
    purchasable: true,
    tier: "pro",
  },
  {
    defaultContent: createDefaultContent(
      "Thornfield Capital",
      "Victoria Island, Lagos",
      "Investment-grade commercial and mixed-use assets",
    ),
    defaultTheme: {
      accentColor: "#1e293b",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Thornfield Capital",
      market: "Victoria Island, Lagos",
      supportLine: "+234 1 234 5678",
    },
    description: "Bold, data-confident presentation for commercial and investor audiences.",
    editableFields: baseEditableFields,
    key: "template-5",
    marketingTagline: "High-conviction layout built for commercial and investment-grade mandates.",
    name: "Thornfield",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600",
    },
    purchasable: true,
    tier: "pro",
  },
  {
    defaultContent: createDefaultContent(
      "Crestview Homes",
      "Abuja",
      "Quality family homes across Abuja's best neighbourhoods",
    ),
    defaultTheme: {
      accentColor: "#16a34a",
      backgroundColor: "#f0fdf4",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Crestview Homes",
      market: "Abuja",
      supportLine: "+234 802 100 4321",
    },
    description: "Warm, community-led layout for family-focused mid-market agencies.",
    editableFields: baseEditableFields,
    key: "template-6",
    marketingTagline: "Welcoming, community-driven layout for family-first residential agencies.",
    name: "Crestview",
    namedImageSlots: {
      heroImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600",
    },
    purchasable: true,
    tier: "pro",
  },
  {
    defaultContent: createDefaultContent(
      "Nova Luxury Estate",
      "Banana Island, Lagos",
      "Ultra-luxury residential and private estate addresses",
    ),
    defaultTheme: {
      accentColor: "#92400e",
      backgroundColor: "#1c1917",
      fontFamily: "Playfair Display, Georgia, serif",
      headingFontFamily: "Playfair Display, Georgia, serif",
      logo: "Nova Luxury Estate",
      market: "Banana Island",
      supportLine: "+234 1 700 8800",
    },
    description: "Dark, ultra-luxury layout for exclusive private estate brands.",
    editableFields: baseEditableFields,
    key: "template-13",
    marketingTagline: "Dark editorial luxury for private estate and ultra-high-net-worth agencies.",
    name: "Nova Pro",
    namedImageSlots: {
      ctaBackground: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200",
      heroImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600",
    },
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
  content,
  liveListings,
  market,
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

  return {
    editableFields: template.editableFields,
    page: buildHomePage(mergedContent, liveListings),
    renderMode,
    template,
    theme: {
      ...template.defaultTheme,
      ...theme,
      logo: companyName ?? theme?.logo ?? template.defaultTheme.logo,
      market: market ?? theme?.market ?? template.defaultTheme.market,
      supportLine:
        theme?.supportLine ??
        `${subdomain ?? companyName?.toLowerCase().replace(/\s+/g, "") ?? "company"}.plotkeys.app`,
    },
  };
}


export const sampleTheme = fallbackTemplate.defaultTheme;
export const sampleHomePage = buildHomePage(fallbackTemplate.defaultContent);

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
export type { WebsiteRuntimeProviderProps } from "./runtime-context";

export {
  applyAiGeneration,
  applyHumanEdit,
  flattenContentNodes,
  liftFlatContent,
} from "./content-nodes";
export {
  applyConfigUpdate,
  colorSystems,
  deserializeTemplateConfig,
  fontFallbacks,
  fromDerivedDesignConfig,
  resolvePresetConfig,
  resolveSlotFont,
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
  ColorSystem,
  ColorTokenSet,
  FontFallbackMap,
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
export { resolveFontStack, resolveHeadingFontStack } from "./fonts";
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
export {
  AgentShowcaseSection,
  ContactSection,
  FAQAccordionSection,
  NewsletterSection,
  PropertyGridSection,
} from "./sections/extended-sections";
export type {
  AgentCardItem,
  AgentShowcaseConfig,
  ContactSectionConfig,
  FAQAccordionConfig,
  FAQItem,
  NewsletterConfig,
  PropertyGridConfig,
  PropertyGridItem,
} from "./sections/extended-sections";
export {
  draftEditableClass,
  draftPlaceholderClass,
  isContentFieldEmpty,
} from "./sections/section-utils";
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
