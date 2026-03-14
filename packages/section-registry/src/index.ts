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

export const sampleTheme: ThemeConfig = {
  accentColor: "#0f766e",
  backgroundColor: "#f8fafc",
  fontFamily: "Satoshi, Avenir Next, sans-serif",
  headingFontFamily: 'Georgia, "Times New Roman", serif',
  logo: "Aster Grove Realty",
  market: "Lekki, Lagos",
  supportLine: "+234 803 000 1204",
};

export const sampleHomePage: {
  page: "home";
  sections: HomeSectionDefinition[];
} = {
  page: "home",
  sections: [
    {
      component: HeroBannerSection,
      config: {
        ctaHref: "#featured-listings",
        ctaText: "Browse signature listings",
        eyebrow: "Luxury homes and investment addresses",
        subtitle:
          "A refined real-estate experience for buyers, investors, and families looking for trusted guidance in Lagos' most desirable neighborhoods.",
        title: "Find your next signature property with confidence.",
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
            title: "Penthouse residence with skyline-facing entertaining suite",
          },
          {
            imageHint: "Garden estate preview",
            location: "Lekki Phase 1",
            price: "NGN 620M",
            specs: "4 bed • pool deck • home office • gated community",
            title: "Contemporary family home tucked into a quiet garden estate",
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
        body: "Book a private consultation, request a shortlist, or start a tailored property search with a team that understands premium client expectations.",
        primaryHref: "#",
        primaryText: "Book a consultation",
        secondaryHref: "#featured-listings",
        secondaryText: "View available homes",
        title: "Start your search with a team that knows the market.",
      },
      id: "cta-band",
      type: "cta_band",
    },
  ],
};

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
  MarketStatsSection,
  StoryGridSection,
  TestimonialStripSection,
};
