import type { JSX } from "react";

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
  name: string;
};

export type ResolvedWebsitePresentation = {
  editableFields: EditableFieldDefinition[];
  page: {
    page: "home";
    sections: HomeSectionDefinition[];
  };
  template: TemplateDefinition;
  theme: ThemeConfig;
};

type ResolveTemplateOptions = {
  companyName?: string;
  content?: TenantContentRecord;
  market?: string;
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

function buildHomePage(content: TenantContentRecord): {
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
            "The first template supports promotional inventory cards that can later be sourced directly from the platform listing model.",
          eyebrow: "Featured inventory",
          items: [
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
              title:
                "Penthouse residence with skyline-facing entertaining suite",
            },
            {
              imageHint: "Garden estate preview",
              location: "Lekki Phase 1",
              price: "NGN 620M",
              specs: "4 bed • pool deck • home office • gated community",
              title:
                "Contemporary family home tucked into a quiet garden estate",
            },
          ],
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

export const templateCatalog: TemplateDefinition[] = [
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
    name: "Template 1",
  },
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
    name: "Template 2",
  },
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
    name: "Template 3",
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
  market,
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
    page: buildHomePage(mergedContent),
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
