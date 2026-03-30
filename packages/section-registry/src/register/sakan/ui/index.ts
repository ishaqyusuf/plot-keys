import type { SectionComponentOverrides } from "../../ui-types";
import {
  SakanCtaBandSection,
  SakanHeroBannerSection,
  SakanHeroSearchSection,
  SakanListingSpotlightSection,
  SakanMarketStatsSection,
  SakanPropertyGridSection,
  SakanServiceHighlightsSection,
  SakanStoryGridSection,
  SakanTestimonialStripSection,
  SakanWhyChooseUsSection,
} from "./sakan-sections";

/**
 * Sakan (Rental) family section component overrides.
 * Keys are the snake_case section type strings from sectionBuilders
 * (e.g. "hero_banner", "listing_spotlight").
 */
export const sakanSectionComponents: SectionComponentOverrides = {
  hero_banner: SakanHeroBannerSection as SectionComponentOverrides[string],
  listing_spotlight: SakanListingSpotlightSection as SectionComponentOverrides[string],
  market_stats: SakanMarketStatsSection as SectionComponentOverrides[string],
  story_grid: SakanStoryGridSection as SectionComponentOverrides[string],
  cta_band: SakanCtaBandSection as SectionComponentOverrides[string],
  service_highlights: SakanServiceHighlightsSection as SectionComponentOverrides[string],
  why_choose_us: SakanWhyChooseUsSection as SectionComponentOverrides[string],
  property_grid: SakanPropertyGridSection as SectionComponentOverrides[string],
  testimonial_strip: SakanTestimonialStripSection as SectionComponentOverrides[string],
  hero_search: SakanHeroSearchSection as SectionComponentOverrides[string],
};
