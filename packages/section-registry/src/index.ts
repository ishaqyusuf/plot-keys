import type { JSX } from "react";
import { getTemplatePageInventory } from "./page-inventory";
import {
  innerPageDefaults,
  pageAliasFields,
} from "./register/inner-page-defaults";
import {
  type RiwaqRoadmapTimelineConfig,
  RiwaqRoadmapTimelineSection,
} from "./register/starter/riwaq/sections/roadmap-timeline";
import { RiwaqBlogPage } from "./register/starter/riwaq/pages/blog";
import { RiwaqContactPage } from "./register/starter/riwaq/pages/contact";
import { RiwaqLandingPage } from "./register/starter/riwaq/pages/landing";
import { RiwaqRoadmapPage } from "./register/starter/riwaq/pages/roadmap";
import {
  type BlogListConfig,
  BlogListSection,
  type BlogPostConfig,
  BlogPostSection,
} from "./sections/blog-sections";
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
import {
  createTemplateManifestRegistry,
  getTemplateManifest as getManifestFromRegistry,
  manifestToPageInventory,
  resolveTemplateManifestRoute,
  type TemplateManifest,
  templateManifestToDefinition,
} from "./template-manifest";
import type { RegistryPageInfo } from "./runtime-context";
import {
  createTemplatePageRegistry,
  type TemplatePageContext,
  type TemplatePageHandle,
  type TemplatePageRegistryOptions,
} from "./template-pages";
import type {
  EditableFieldDefinition,
  RenderMode,
  TemplateDefinition,
  TemplateTier,
  TenantContentRecord,
  TenantThemeRecord,
} from "./types";

export type {
  EditableFieldDefinition,
  TemplateDefinition,
  TemplateTier,
  TenantContentRecord,
  TenantThemeRecord,
} from "./types";

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
  | SectionDefinition<ServiceHighlightsConfig>
  | SectionDefinition<BlogListConfig>
  | SectionDefinition<BlogPostConfig>
  | SectionDefinition<RiwaqRoadmapTimelineConfig>;

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

export type LiveBlogPostItem = {
  content?: string | null;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  id: string;
  publishedAt?: string | null;
  slug: string;
  title: string;
};

export type {
  RegistryDataMode,
  RegistryDataResolver,
  RegistryMutationEndpoint,
  RegistryQueryEndpoint,
  RegistryQueryScope,
  RegistryScopedQueryKey,
} from "./registry-data";
export {
  createRegistryMutationOptions,
  createRegistryQueryKey,
  createRegistryQueryOptions,
  createRegistryQueryScope,
  RegistryMutationDisabledError,
} from "./registry-data";
export type { TemplateManifest, TemplateRouteMatch } from "./template-manifest";
export {
  createTemplateManifestRegistry,
  defineTemplateManifest,
  getTemplateAllowedContentKeys,
  getTemplateManifest as getTemplateManifestFromRegistry,
  isTemplateContentKeyAllowed,
  isTemplateThemeKeyAllowed,
  manifestToPageInventory,
  normalizeTemplateContentFieldUpdate,
  normalizeTemplateThemeFieldUpdate,
  resolveTemplateManifestRoute,
  templateManifestToDefinition,
} from "./template-manifest";
export type {
  EmptyTemplatePageProps,
  RouteSlugTemplatePageProps,
  TemplatePageComponent,
  TemplatePageContext,
  TemplatePageHandle,
  TemplatePageInfo,
  TemplatePageRegistration,
  TemplatePageRegistry,
  TemplatePageRegistryOptions,
  TemplatePageResolution,
  TemplatePageSlot,
} from "./template-pages";
export {
  createTemplatePageRegistry,
  createTemplatePageSlot,
} from "./template-pages";
export type {
  TemplateUiIntent,
  TemplateUiResolver,
  TemplateUiSize,
  TemplateUiVariantOptions,
} from "./template-ui";
export {
  createTemplateUiResolver,
  resolveTemplateStylePreset,
  templateButtonVariants,
  templateInputVariants,
  templateSurfaceVariants,
} from "./template-ui";
export type { RenderMode, TenantResource } from "./types";

// ---------------------------------------------------------------------------
// Plan-based template register
// ---------------------------------------------------------------------------
import {
  getPlaceholderContent as _getPlaceholderContent,
  getRegisterContentSchema as _getRegisterContentSchema,
  getRegisterPlaceholderData as _getRegisterPlaceholderData,
  getRegisterTemplate as _getRegisterTemplate,
  registerTemplateCatalog as _registerTemplateCatalog,
  resolveRegisterSectionComponents as _resolveRegisterSectionComponents,
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
  getPlaceholderContent,
  getRegisterFooterConfig,
  getRegisterNavConfig,
  getRegisterPlaceholderData,
  getRegisterContentSchema,
  getRegisterTemplate,
  getRegisterTemplateForBusiness,
  getRegisterTemplatesForPlan,
  riwaqStarterTemplate,
  registerTemplateCatalog,
  registerTemplatesByPlan,
  resolveRegisterSectionComponents,
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
  liveBlogPosts?: LiveBlogPostItem[];
  liveListings?: LiveListingItem[];
  market?: string;
  currentBlogPost?: LiveBlogPostItem | null;
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
  _renderMode: RenderMode,
): ListingSpotlightItem[] {
  if (liveListings && liveListings.length > 0) {
    return liveListings.slice(0, 3).map((listing) => ({
      id: listing.id,
      imageHint: "Property listing",
      imageUrl: listing.imageUrl,
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
  liveBlogPosts?: LiveBlogPostItem[],
  currentBlogPost?: LiveBlogPostItem | null,
  renderMode?: RenderMode,
) => HomeSectionDefinition | null;

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

  const inventory = getTemplatePageInventoryStrict(templateKey);
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
    _liveBlogPosts,
    _currentBlogPost,
    renderMode = "live",
  ) => {
    const listingCount = liveListings?.length ?? 0;
    const hasLiveListings = listingCount > 0;

    const listingRoutes = resolveListingRouteContract(templateKey, pageKey);

    return {
      component: ListingSpotlightSection,
      config: {
        description: hasLiveListings
          ? `${listingCount} featured ${listingCount === 1 ? "property" : "properties"} available.`
          : "Publish listings from your dashboard to show available properties here.",
        detailHrefBase: listingRoutes.detailHrefBase,
        eyebrow: "Featured listings",
        items: buildListingSpotlightItems(liveListings, renderMode),
        title: "Available properties",
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
  BlogListSection: (
    _content,
    _liveListings,
    _liveAgents,
    _subdomain,
    _pageKey,
    _templateKey,
    liveBlogPosts,
  ) => ({
    component: BlogListSection,
    config: {
      description:
        liveBlogPosts && liveBlogPosts.length > 0
          ? "Expert advice, market updates, and practical guidance from our team."
          : "Fresh property insights and market commentary will appear here as new articles are published.",
      eyebrow: "Latest articles",
      items:
        liveBlogPosts && liveBlogPosts.length > 0
          ? liveBlogPosts.map((post) => ({
              excerpt: post.excerpt ?? undefined,
              featuredImageUrl: post.featuredImageUrl ?? undefined,
              id: post.id,
              publishedAt: post.publishedAt ?? undefined,
              slug: post.slug,
              title: post.title,
            }))
          : [
              {
                excerpt:
                  "Follow our latest updates for buying tips, market movement, and neighborhood guides.",
                id: "sample-blog-post",
                publishedAt: new Date().toISOString(),
                slug: "coming-soon",
                title: "The blog will be live soon.",
              },
            ],
      title: "Insights for smarter property decisions.",
    },
    id: "blog-list",
    type: "blog_list",
  }),
  BlogPostSection: (
    _content,
    _liveListings,
    _liveAgents,
    _subdomain,
    _pageKey,
    _templateKey,
    liveBlogPosts,
    currentBlogPost,
  ) => {
    const post = currentBlogPost ?? liveBlogPosts?.[0] ?? null;

    return {
      component: BlogPostSection,
      config: {
        backHref: "/blog",
        content:
          post?.content ??
          "# Blog post preview\n\nYour published article will appear here once a post is available.",
        excerpt: post?.excerpt ?? undefined,
        featuredImageUrl: post?.featuredImageUrl ?? undefined,
        publishedAt: post?.publishedAt ?? undefined,
        title: post?.title ?? "Blog post preview",
      },
      id: "blog-post",
      type: "blog_post",
    };
  },
  RiwaqRoadmapTimelineSection: (content) => ({
    component: RiwaqRoadmapTimelineSection,
    config: {
      description:
        content["roadmap.subtitle"] ??
        "Use the roadmap to show what has been launched, improved, handed over, or planned across time.",
      eyebrow: content["roadmap.eyebrow"] ?? "Project history",
      items: [
        {
          body:
            content["roadmap.item1.body"] ??
            "Started with a focused portfolio and a commitment to transparent communication.",
          title:
            content["roadmap.item1.title"] ?? "First documented milestone",
          year: content["roadmap.item1.year"] ?? "2016",
        },
        {
          body:
            content["roadmap.item2.body"] ??
            "Expanded into new communities and documented progress for customers and partners.",
          title: content["roadmap.item2.title"] ?? "Market expansion",
          year: content["roadmap.item2.year"] ?? "2019",
        },
        {
          body:
            content["roadmap.item3.body"] ??
            "Moved project updates and enquiry paths into one public tenant website.",
          title: content["roadmap.item3.title"] ?? "Digital trust layer",
          year: content["roadmap.item3.year"] ?? "2024",
        },
      ],
      title: content["roadmap.title"] ?? "A visible record of delivery.",
    },
    id: "roadmap-timeline",
    type: "riwaq_roadmap_timeline",
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
  blog_list: BlogListSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  blog_post: BlogPostSection as (props: {
    config: unknown;
    theme: ThemeConfig;
  }) => JSX.Element,
  riwaq_roadmap_timeline: RiwaqRoadmapTimelineSection as (props: {
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
  liveBlogPosts?: LiveBlogPostItem[],
  currentBlogPost?: LiveBlogPostItem | null,
  renderMode: RenderMode = "live",
): {
  pageKey: string;
  sections: HomeSectionDefinition[];
} {
  const inventory = getTemplatePageInventoryStrict(templateKey);
  const slots =
    inventory.pages
      .find((page) => page.pageKey === pageKey)
      ?.sections.filter((section) => section.defaultEnabled)
      .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

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
            liveBlogPosts,
            currentBlogPost,
            renderMode,
          )
        : null;
    })
    .filter((s): s is HomeSectionDefinition => s !== null);

  // Fallback: if no inventory slots matched and we asked for home, render the default set.
  // Non-home pages intentionally return an empty section list when the template has not
  // defined any slots for that page — the caller treats an empty page as a blank canvas.
  if (sections.length === 0 && pageKey === "home") {
    return buildDefaultHomePage(
      content,
      liveListings,
      liveAgents,
      subdomain,
      renderMode,
    );
  }

  return { pageKey, sections };
}

/** Fallback for unknown template keys — renders the standard 5-section home. */
function buildDefaultHomePage(
  content: TenantContentRecord,
  liveListings?: LiveListingItem[],
  liveAgents?: LiveAgentItem[],
  subdomain?: string,
  renderMode: RenderMode = "live",
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
          undefined,
          undefined,
          renderMode,
        ),
      )
      .filter((s): s is HomeSectionDefinition => s !== null),
  };
}

// ---------------------------------------------------------------------------
// Template manifest catalog
// ---------------------------------------------------------------------------

function supportedPlansForTier(tier: TemplateTier): TemplateTier[] {
  switch (tier) {
    case "starter":
      return ["starter", "plus", "pro"];
    case "plus":
      return ["plus", "pro"];
    case "pro":
      return ["pro"];
  }
}

function registerVariantToManifest(
  variant: (typeof _registerTemplateCatalog)[number],
): TemplateManifest {
  const dataRequirements = Array.from(
    new Set(
      variant.pages.flatMap((page) =>
        page.sections.flatMap((section) => [
          ...(section.dataSource ? [section.dataSource] : []),
          ...(section.requiredResources ?? []),
        ]),
      ),
    ),
  );
  return {
    dataRequirements,
    defaultContent: variant.defaultContent,
    defaultTheme: {
      accentColor: variant.defaultAccentColor,
      backgroundColor: variant.defaultBackgroundColor,
      ...(variant.defaultChartColor
        ? { chartColor: variant.defaultChartColor }
        : {}),
      colorSystem: variant.defaultColorSystem,
      fontFamily: variant.defaultFontFamily,
      headingFontFamily: variant.defaultHeadingFontFamily,
      ...(variant.defaultIconLibrary
        ? { iconLibrary: variant.defaultIconLibrary }
        : {}),
      logo: variant.name,
      market: "Nigeria",
      ...(variant.defaultMenuAccent
        ? { menuAccent: variant.defaultMenuAccent }
        : {}),
      ...(variant.defaultMenuStyle ? { menuStyle: variant.defaultMenuStyle } : {}),
      ...(variant.defaultRadius ? { radius: variant.defaultRadius } : {}),
      stylePreset: variant.defaultStylePreset,
      supportLine: "hello@plotkeys.com",
    },
    description: variant.description,
    editableFields: _getRegisterContentSchema(variant.key).map((field) => ({
      aiEnabled: field.aiEnabled,
      contentKey: field.contentKey,
      fieldType:
        field.contentKey.includes("body") ||
        field.contentKey.includes("description") ||
        field.contentKey.includes("subtitle") ||
        field.contentKey.includes("address")
          ? "textarea"
          : "text",
      label: field.label,
      longDetail: `Write ${field.label.toLowerCase()} for the ${variant.name} real-estate website template.`,
      placeholder: field.placeholderValue,
      shortDetail: field.label,
    })),
    features: [
      "multi-page",
      variant.tier,
      ...variant.features,
      ...dataRequirements,
    ],
    key: variant.key,
    marketingTagline: variant.marketingTagline,
    name: variant.name,
    pages: variant.pages,
    purchasable: variant.purchasable,
    supportedPlans: variant.supportedPlans,
    tags: ["register-template", variant.tier, ...variant.tags],
    tier: variant.tier,
    version: 1,
  };
}

const templateManifestDefinitions: TemplateManifest[] = [
  {
    dataRequirements: ["listings", "agents", "contact"],
    defaultContent: createDefaultContent(
      "Zara Realty",
      "Lekki, Lagos",
      "Luxury homes and investment addresses",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#f8fafc",
      colorSystem: "forest",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Zara Realty",
      market: "Lekki, Lagos",
      stylePreset: "maia",
      supportLine: "+234 803 000 1204",
    },
    description:
      "Premium luxury positioning with calm, editorial presentation.",
    editableFields: baseEditableFields,
    features: ["multi-page", "listings", "agents", "contact"],
    key: "template-1",
    marketingTagline:
      "A calm, editorial layout built for luxury and premium residential brands.",
    name: "Zara",
    pages: getTemplatePageInventory("template-1").pages,
    purchasable: false,
    supportedPlans: supportedPlansForTier("starter"),
    tags: ["luxury", "editorial", "residential", "brand", "leads", "starter"],
    tier: "starter",
    version: 1,
  },
  {
    dataRequirements: ["listings", "agents", "contact"],
    defaultContent: createDefaultContent(
      "Leila Homes",
      "Ikoyi, Lagos",
      "Modern homes for city-focused buyers",
    ),
    defaultTheme: {
      accentColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      colorSystem: "slate",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Leila Homes",
      market: "Ikoyi, Lagos",
      stylePreset: "lyra",
      supportLine: "+234 803 555 0141",
    },
    description: "Sharper city-led positioning for modern urban inventory.",
    editableFields: baseEditableFields,
    features: ["multi-page", "listings", "testimonials", "contact"],
    key: "template-2",
    marketingTagline:
      "Bold, listing-first layout for urban agencies and commercial portfolios.",
    name: "Leila",
    pages: getTemplatePageInventory("template-2").pages,
    purchasable: true,
    supportedPlans: supportedPlansForTier("plus"),
    tags: [
      "urban",
      "commercial",
      "mixed",
      "clean",
      "bold",
      "listings",
      "balanced",
      "plus",
    ],
    tier: "plus",
    version: 1,
  },
  {
    dataRequirements: ["listings", "agents", "contact"],
    defaultContent: createDefaultContent(
      "Cedar Properties",
      "Abuja",
      "Trusted family homes and investment-ready spaces",
    ),
    defaultTheme: {
      accentColor: "#b45309",
      backgroundColor: "#fffaf0",
      colorSystem: "forest",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      logo: "Cedar Properties",
      market: "Abuja",
      stylePreset: "maia",
      supportLine: "+234 809 222 4431",
    },
    description:
      "Warm, trust-led presentation for family and investor audiences.",
    editableFields: baseEditableFields,
    features: ["multi-page", "listings", "agents", "contact"],
    key: "template-3",
    marketingTagline:
      "Warm, trust-driven layout ideal for family buyers and investor audiences.",
    name: "Cedar",
    pages: getTemplatePageInventory("template-3").pages,
    purchasable: true,
    supportedPlans: supportedPlansForTier("pro"),
    tags: [
      "warm",
      "editorial",
      "residential",
      "rental",
      "investor",
      "leads",
      "balanced",
      "pro",
    ],
    tier: "pro",
    version: 1,
  },
  {
    dataRequirements: ["listings", "agents", "contact"],
    defaultContent: createDefaultContent(
      "Omar Realty",
      "Lekki, Lagos",
      "Premium concierge experience",
    ),
    defaultTheme: {
      accentColor: "#0f766e",
      backgroundColor: "#0f172a",
      colorSystem: "slate",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "'Space Grotesk', Helvetica, sans-serif",
      logo: "Omar Realty",
      market: "Lekki, Lagos",
      stylePreset: "nova",
      supportLine: "+234 808 500 4501",
    },
    description:
      "Dark premium pro combining search hero with story and personal agent service.",
    editableFields: baseEditableFields,
    features: ["multi-page", "search", "listings", "agents", "faq"],
    key: "template-45",
    marketingTagline:
      "Premium concierge layout with search hero and personal service focus.",
    name: "Omar",
    pages: getTemplatePageInventory("template-45").pages,
    purchasable: true,
    supportedPlans: supportedPlansForTier("pro"),
    tags: [
      "premium",
      "concierge",
      "search",
      "luxury",
      "residential",
      "mixed",
      "bold",
      "clean",
      "brand",
      "balanced",
      "pro",
    ],
    tier: "pro",
    version: 1,
  },
  ..._registerTemplateCatalog.map(registerVariantToManifest),
];

export const templateManifestRegistry = createTemplateManifestRegistry(
  templateManifestDefinitions,
);

export const templateManifestCatalog: TemplateManifest[] = Array.from(
  templateManifestRegistry.values(),
);

// Compatibility catalog for existing dashboard/API consumers.
export const templateCatalog: TemplateDefinition[] =
  templateManifestCatalog.map(templateManifestToDefinition);

const fallbackTemplate = templateCatalog[0] as TemplateDefinition;

export function getTemplateManifest(templateKey: string): TemplateManifest {
  return getManifestFromRegistry(templateManifestRegistry, templateKey);
}

export function getTemplateDefinition(templateKey: string): TemplateDefinition {
  return templateManifestToDefinition(getTemplateManifest(templateKey));
}

export function getTemplatePageInventoryStrict(
  templateKey: string,
): ReturnType<typeof manifestToPageInventory> {
  return manifestToPageInventory(getTemplateManifest(templateKey));
}

export function resolveTemplateRoute(
  templateKey: string,
  pathname: string,
): ReturnType<typeof resolveTemplateManifestRoute> {
  return resolveTemplateManifestRoute(
    getTemplateManifest(templateKey),
    pathname,
  );
}

const templatePageRegistrations: NonNullable<
  TemplatePageRegistryOptions["registrations"]
> = {
  "riwaq-starter": {
    blog: { Page: RiwaqBlogPage },
    contact: { Page: RiwaqContactPage },
    home: { Page: RiwaqLandingPage },
    roadmap: { Page: RiwaqRoadmapPage },
  },
};

export const templatePages = createTemplatePageRegistry({
  registrations: templatePageRegistrations,
  resolveTemplatePage(templateKey, pageKey) {
    const manifest = getTemplateManifest(templateKey);
    const page = manifest.pages.find(
      (candidate) => candidate.pageKey === pageKey,
    );

    if (!page) return undefined;

    return {
      page,
      supportedPlans: manifest.supportedPlans,
      templateKey: manifest.key,
      templateName: manifest.name,
    };
  },
});

export const templates = templatePages;

type AnyTemplatePageHandle = TemplatePageHandle<
  Record<string, never> | { slug: string }
>;
type AnyTemplatePageSlot = {
  resolve(ctx: TemplatePageContext): AnyTemplatePageHandle;
};

const templatePageSlotByPageKey: Record<string, AnyTemplatePageSlot> = {
  about: templatePages.aboutPage as unknown as AnyTemplatePageSlot,
  agents: templatePages.agentsPage as unknown as AnyTemplatePageSlot,
  areas: templatePages.areasPage as unknown as AnyTemplatePageSlot,
  blog: templatePages.blogPage as unknown as AnyTemplatePageSlot,
  "blog-post": templatePages.blogContentPage as unknown as AnyTemplatePageSlot,
  careers: templatePages.careersPage as unknown as AnyTemplatePageSlot,
  contact: templatePages.contactPage as unknown as AnyTemplatePageSlot,
  events: templatePages.eventsPage as unknown as AnyTemplatePageSlot,
  faq: templatePages.faqPage as unknown as AnyTemplatePageSlot,
  gallery: templatePages.galleryPage as unknown as AnyTemplatePageSlot,
  "how-it-works":
    templatePages.howItWorksPage as unknown as AnyTemplatePageSlot,
  home: templatePages.homePage as unknown as AnyTemplatePageSlot,
  inquire: templatePages.inquirePage as unknown as AnyTemplatePageSlot,
  insights: templatePages.insightsPage as unknown as AnyTemplatePageSlot,
  investors: templatePages.investorsPage as unknown as AnyTemplatePageSlot,
  landlords: templatePages.landlordsPage as unknown as AnyTemplatePageSlot,
  "listing-detail":
    templatePages.listingDetailPage as unknown as AnyTemplatePageSlot,
  listings: templatePages.listingsPage as unknown as AnyTemplatePageSlot,
  "portfolio-detail":
    templatePages.portfolioDetailPage as unknown as AnyTemplatePageSlot,
  portfolio: templatePages.portfolioPage as unknown as AnyTemplatePageSlot,
  press: templatePages.pressPage as unknown as AnyTemplatePageSlot,
  "private-sales":
    templatePages.privateSalesPage as unknown as AnyTemplatePageSlot,
  "project-detail":
    templatePages.projectDetailPage as unknown as AnyTemplatePageSlot,
  projects: templatePages.projectsPage as unknown as AnyTemplatePageSlot,
  properties: templatePages.propertiesPage as unknown as AnyTemplatePageSlot,
  "property-detail":
    templatePages.propertyDetailPage as unknown as AnyTemplatePageSlot,
  rentals: templatePages.rentalsPage as unknown as AnyTemplatePageSlot,
  "rental-detail":
    templatePages.rentalDetailPage as unknown as AnyTemplatePageSlot,
  resources: templatePages.resourcesPage as unknown as AnyTemplatePageSlot,
  roadmap: templatePages.roadmapPage as unknown as AnyTemplatePageSlot,
  services: templatePages.servicesPage as unknown as AnyTemplatePageSlot,
  "tenant-resources":
    templatePages.tenantResourcesPage as unknown as AnyTemplatePageSlot,
  tenants: templatePages.tenantsPage as unknown as AnyTemplatePageSlot,
  terms: templatePages.termsPage as unknown as AnyTemplatePageSlot,
  testimonials: templatePages.testimonialsPage as unknown as AnyTemplatePageSlot,
  privacy: templatePages.privacyPage as unknown as AnyTemplatePageSlot,
};

export function resolveTemplatePageHandle<Props = Record<string, never>>({
  pageInfo,
  pageKey,
  templateKey,
}: {
  pageInfo?: Partial<RegistryPageInfo>;
  pageKey: string;
  templateKey: string;
}): TemplatePageHandle<Props> | undefined {
  if (!templatePageRegistrations[templateKey]?.[pageKey]) return undefined;

  const slot = templatePageSlotByPageKey[pageKey];
  if (!slot) return undefined;

  return slot.resolve({
    page: {
      pageDisabled: false,
      pageKey,
      pageNotSupported: false,
      routeSlug: null,
      ...pageInfo,
    },
    templateKey,
  }) as TemplatePageHandle<Props>;
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
  liveBlogPosts,
  liveListings,
  market,
  currentBlogPost,
  pageKey = "home",
  renderMode = "live",
  subdomain,
  templateKey,
  theme,
}: ResolveTemplateOptions): ResolvedWebsitePresentation {
  const template = getTemplateDefinition(templateKey);
  // For non-home pages, inject per-page default content (e.g. "about.hero.title")
  // between template defaults and tenant-saved content so tenants can override.
  const pageDefaults =
    pageKey !== "home" ? (innerPageDefaults[pageKey] ?? {}) : {};
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
    liveBlogPosts,
    currentBlogPost,
    renderMode,
  );

  // Apply template-specific component overrides when the template key maps to a
  // register template. Old template keys return no overrides.
  const registerVariant = _getRegisterTemplate(templateKey);
  const templateOverrides = _resolveRegisterSectionComponents(
    registerVariant?.key,
  );

  // Swap in template-owned components where the override map provides one.
  // When templateOverrides is empty this is a no-op.
  const page = {
    ...builtPage,
    sections: builtPage.sections.map((s) => ({
      ...s,
      component:
        (templateOverrides[s.type] as typeof s.component | undefined) ??
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
  liveBlogPosts?: LiveBlogPostItem[];
  liveListings?: LiveListingItem[];
  market?: string;
  currentBlogPost?: LiveBlogPostItem | null;
  subdomain?: string;
  theme?: TenantThemeRecord;
};

/**
 * Resolved output of a single page — sections with template-owned components
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
 * - In "template" render mode, uses placeholderValue content and placeholder
 *   data from the concrete register template instead of live tenant data.
 * - Returns a flat ResolvedPageConfig rather than a full presentation
 *   object — no editableFields, no template metadata.
 * - Applies template component overrides in the same way as
 *   resolveWebsitePresentation does.
 *
 * @example
 * // Template browse mode — placeholder data, no tenant required
 * const page = resolvePage("riwaq-starter", "home", {}, "template");
 *
 * // Live rendering
 * const page = resolvePage("riwaq-starter", "roadmap", tenant, "live");
 */
export function resolvePage(
  templateKey: string,
  pageKey: string,
  tenant: TenantSnapshot,
  renderMode: RenderMode = "live",
): ResolvedPageConfig {
  const registerVariant = _getRegisterTemplate(templateKey);
  const template = getTemplateDefinition(templateKey);

  // In template mode, substitute placeholder content and data for the template.
  let content: TenantContentRecord;
  let liveListings: LiveListingItem[] | undefined;
  let liveAgents: LiveAgentItem[] | undefined;
  let liveBlogPosts: LiveBlogPostItem[] | undefined;

  if (renderMode === "template" && registerVariant) {
    content = _getPlaceholderContent(registerVariant.key);
    const phData = _getRegisterPlaceholderData(registerVariant.key);
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
    liveBlogPosts = phData.blogPosts?.map((post) => ({
      content: post.content,
      excerpt: post.excerpt,
      featuredImageUrl: post.featuredImageUrl ?? null,
      id: post.id,
      publishedAt: post.publishedAt,
      slug: post.slug,
      title: post.title,
    }));
  } else {
    const pageDefaults =
      pageKey !== "home" ? (innerPageDefaults[pageKey] ?? {}) : {};
    content = {
      ...template.defaultContent,
      ...pageDefaults,
      ...tenant.content,
    };
    liveListings = tenant.liveListings;
    liveAgents = tenant.liveAgents;
    liveBlogPosts = tenant.liveBlogPosts;
  }

  const builtPage = buildPageSections(
    content,
    pageKey,
    templateKey,
    liveListings,
    liveAgents,
    tenant.subdomain,
    liveBlogPosts,
    tenant.currentBlogPost,
    renderMode,
  );

  const templateOverrides = _resolveRegisterSectionComponents(
    registerVariant?.key,
  );
  const sections = builtPage.sections.map((s) => ({
    ...s,
    component:
      (templateOverrides[s.type] as typeof s.component | undefined) ??
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
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "template",
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
export type { RegistryTemplateLinkProps } from "./components/Link";
export { Link } from "./components/Link";
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
export type { SmartFillFn } from "./runtime/smart-fill-context";
export {
  SmartFillProvider,
  useSmartFill,
} from "./runtime/smart-fill-context";
export type {
  RegistryContextValue,
  RegistryLinkComponent,
  RegistryLinkComponentProps,
  RegistryPageInfo,
  RegistryProviderProps,
  RegistryTenantInfo,
  WebsiteRuntimeContextValue,
  WebsiteRuntimeProviderProps,
} from "./runtime-context";
// Runtime context — WebsiteRuntimeProvider + hooks
export {
  RegistryProvider,
  useColorSystem,
  useIsDraftMode,
  useRegistry,
  useRegistryLinkComponent,
  useRenderMode,
  useResolvedFont,
  useTemplateConfig,
  useTemplateImage,
  useTemplateStylePreset,
  WebsiteRuntimeProvider,
} from "./runtime-context";
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
