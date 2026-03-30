import type { SectionComponentOverrides } from "../../ui-types";
import {
  NoorAgentShowcaseSection,
  NoorCtaBandSection,
  NoorHeroBannerSection,
  NoorHeroSearchSection,
  NoorListingSpotlightSection,
  NoorMarketStatsSection,
  NoorPropertyGridSection,
  NoorStoryGridSection,
  NoorTestimonialStripSection,
  NoorWhyChooseUsSection,
} from "./noor-sections";

/**
 * Noor (Agency) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const noorSectionComponents: SectionComponentOverrides = {
  hero_banner: NoorHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: NoorListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: NoorMarketStatsSection as SectionComponentOverrides[string],
  story_grid: NoorStoryGridSection as SectionComponentOverrides[string],
  cta_band: NoorCtaBandSection as SectionComponentOverrides[string],
  agent_showcase: NoorAgentShowcaseSection as SectionComponentOverrides[string],
  testimonial_strip: NoorTestimonialStripSection as SectionComponentOverrides[string],
  hero_search: NoorHeroSearchSection as SectionComponentOverrides[string],
  property_grid: NoorPropertyGridSection as SectionComponentOverrides[string],
  why_choose_us: NoorWhyChooseUsSection as SectionComponentOverrides[string],
};
