import type { SectionComponentOverrides } from "../../ui-types";
import {
  WafiAgentShowcaseSection,
  WafiCtaBandSection,
  WafiHeroBannerSection,
  WafiListingSpotlightSection,
  WafiMarketStatsSection,
  WafiPropertyGridSection,
  WafiServiceHighlightsSection,
  WafiStoryGridSection,
  WafiTestimonialStripSection,
  WafiWhyChooseUsSection,
} from "./wafi-sections";

/**
 * Wafi (Manager) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const wafiSectionComponents: SectionComponentOverrides = {
  hero_banner: WafiHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: WafiListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: WafiMarketStatsSection as SectionComponentOverrides[string],
  story_grid: WafiStoryGridSection as SectionComponentOverrides[string],
  cta_band: WafiCtaBandSection as SectionComponentOverrides[string],
  service_highlights: WafiServiceHighlightsSection as SectionComponentOverrides[string],
  why_choose_us: WafiWhyChooseUsSection as SectionComponentOverrides[string],
  property_grid: WafiPropertyGridSection as SectionComponentOverrides[string],
  testimonial_strip: WafiTestimonialStripSection as SectionComponentOverrides[string],
  agent_showcase: WafiAgentShowcaseSection as SectionComponentOverrides[string],
};
