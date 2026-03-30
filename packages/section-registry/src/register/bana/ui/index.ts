import type { SectionComponentOverrides } from "../../ui-types";
import {
  BanaAgentShowcaseSection,
  BanaCtaBandSection,
  BanaHeroBannerSection,
  BanaListingSpotlightSection,
  BanaMarketStatsSection,
  BanaPropertyGridSection,
  BanaServiceHighlightsSection,
  BanaStoryGridSection,
  BanaTestimonialStripSection,
  BanaWhyChooseUsSection,
} from "./bana-sections";

/**
 * Bana (Developer) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const banaSectionComponents: SectionComponentOverrides = {
  hero_banner: BanaHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: BanaListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: BanaMarketStatsSection as SectionComponentOverrides[string],
  story_grid: BanaStoryGridSection as SectionComponentOverrides[string],
  cta_band: BanaCtaBandSection as SectionComponentOverrides[string],
  agent_showcase: BanaAgentShowcaseSection as SectionComponentOverrides[string],
  why_choose_us: BanaWhyChooseUsSection as SectionComponentOverrides[string],
  property_grid: BanaPropertyGridSection as SectionComponentOverrides[string],
  testimonial_strip: BanaTestimonialStripSection as SectionComponentOverrides[string],
  service_highlights: BanaServiceHighlightsSection as SectionComponentOverrides[string],
};
