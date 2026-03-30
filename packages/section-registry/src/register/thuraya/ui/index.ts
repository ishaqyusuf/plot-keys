import type { SectionComponentOverrides } from "../../ui-types";
import {
  ThurayaAgentShowcaseSection,
  ThurayaCtaBandSection,
  ThurayaHeroBannerSection,
  ThurayaListingSpotlightSection,
  ThurayaMarketStatsSection,
  ThurayaPropertyGridSection,
  ThurayaStoryGridSection,
  ThurayaTestimonialStripSection,
  ThurayaWhyChooseUsSection,
} from "./thuraya-sections";

/**
 * Thuraya (Luxury) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const thurayaSectionComponents: SectionComponentOverrides = {
  hero_banner: ThurayaHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: ThurayaListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: ThurayaMarketStatsSection as SectionComponentOverrides[string],
  story_grid: ThurayaStoryGridSection as SectionComponentOverrides[string],
  cta_band: ThurayaCtaBandSection as SectionComponentOverrides[string],
  agent_showcase: ThurayaAgentShowcaseSection as SectionComponentOverrides[string],
  testimonial_strip: ThurayaTestimonialStripSection as SectionComponentOverrides[string],
  property_grid: ThurayaPropertyGridSection as SectionComponentOverrides[string],
  why_choose_us: ThurayaWhyChooseUsSection as SectionComponentOverrides[string],
};
