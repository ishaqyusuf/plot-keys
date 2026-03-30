import type { SectionComponentOverrides } from "../../ui-types";
import {
  FarisCtaBandSection,
  FarisHeroBannerSection,
  FarisListingSpotlightSection,
  FarisMarketStatsSection,
  FarisPropertyGridSection,
  FarisServiceHighlightsSection,
  FarisStoryGridSection,
  FarisTestimonialStripSection,
  FarisWhyChooseUsSection,
} from "./faris-sections";

/**
 * Faris (Solo) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const farisSectionComponents: SectionComponentOverrides = {
  hero_banner: FarisHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: FarisListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: FarisMarketStatsSection as SectionComponentOverrides[string],
  story_grid: FarisStoryGridSection as SectionComponentOverrides[string],
  cta_band: FarisCtaBandSection as SectionComponentOverrides[string],
  testimonial_strip: FarisTestimonialStripSection as SectionComponentOverrides[string],
  why_choose_us: FarisWhyChooseUsSection as SectionComponentOverrides[string],
  property_grid: FarisPropertyGridSection as SectionComponentOverrides[string],
  service_highlights: FarisServiceHighlightsSection as SectionComponentOverrides[string],
};
