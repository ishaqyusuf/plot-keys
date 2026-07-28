const builderSectionLabels: Record<string, string> = {
  agent_showcase: "Agent showcase",
  blog_list: "Blog list",
  contact_section: "Contact",
  cta_band: "CTA band",
  faq_accordion: "FAQ",
  hero_banner: "Hero banner",
  hero_search: "Hero search",
  listing_spotlight: "Listings spotlight",
  market_stats: "Market stats",
  newsletter: "Newsletter",
  property_grid: "Property grid",
  service_highlights: "Service highlights",
  story_grid: "Story grid",
  testimonial_strip: "Testimonials",
  why_choose_us: "Why choose us",
};

export function getBuilderSectionLabel(type: string): string {
  return builderSectionLabels[type] ?? type;
}
