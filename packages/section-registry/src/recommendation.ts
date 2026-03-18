/**
 * Tenant profile derivation and template recommendation engine.
 *
 * All logic is deterministic — no AI calls, no external dependencies.
 * Runs server-side after each onboarding step save.
 */

import type { TenantContentRecord, TemplateDefinition } from "./index";
import { templateCatalog } from "./index";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OnboardingSnapshot = {
  businessType?: string | null;
  companyName?: string | null;
  hasBlogContent?: boolean | null;
  hasAgents?: boolean | null;
  hasExistingContent?: boolean | null;
  hasListings?: boolean | null;
  hasLogo?: boolean | null;
  hasProjects?: boolean | null;
  hasTestimonials?: boolean | null;
  locations?: string[] | null;
  primaryGoal?: string | null;
  propertyTypes?: string[] | null;
  stylePreference?: string | null;
  tagline?: string | null;
  targetAudience?: string | null;
  tone?: string | null;
};

export type DerivedProfile = {
  /** How content-rich the tenant expects their site to be. */
  complexity: "low" | "medium" | "high";
  /** What conversion action the site should optimise for. */
  conversionFocus: "leads" | "listings" | "brand" | "balanced";
  /** Visual and tonal intent that maps to a design system. */
  designIntent: "editorial" | "bold" | "warm" | "clean";
  /** Best-fit template key derived from scoring. */
  recommendedTemplateKey: string;
  /** Broad market segment for scoring templates. */
  segment: "luxury" | "commercial" | "residential" | "rental" | "mixed";
};

export type TemplateRecommendation = {
  /** Whether this template requires a paid plan upgrade. */
  upgradeRequired: boolean;
  /** Best accessible fallback key when this template requires an upgrade. */
  fallbackKey?: string;
  reason: string;
  score: number;
  template: TemplateDefinition;
};

/** Derived visual design system from onboarding inputs. */
export type DerivedDesignConfig = {
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFontFamily: string;
  stylePreset: "editorial" | "bold" | "warm" | "clean";
};

/** Which page sections to render and in what logical order. */
export type DerivedPageComposition = {
  /** Ordered list of section type IDs to include. */
  sections: string[];
  /** Whether to lead with listings or with story/brand content. */
  leadWith: "listings" | "story";
  /** Whether to emphasise the stats section. */
  showStats: boolean;
};

/** Per-module visibility flags driven by onboarding content-readiness answers. */
export type SectionVisibilityMap = {
  agents: boolean;
  blog: boolean;
  listings: boolean;
  projects: boolean;
  testimonials: boolean;
};

// ---------------------------------------------------------------------------
// Business summary
// ---------------------------------------------------------------------------

export function buildBusinessSummary(snap: OnboardingSnapshot): string {
  const parts: string[] = [];

  const businessTypeLabel: Record<string, string> = {
    "commercial": "commercial real estate",
    "luxury": "luxury real estate",
    "mixed": "full-service real estate",
    "residential-rentals": "residential rental",
    "residential-sales": "residential sales",
  };

  const goalLabel: Record<string, string> = {
    "all-of-above": "all-round online presence",
    "build-brand": "brand authority",
    "generate-leads": "lead generation",
    "showcase-listings": "listing showcase",
  };

  const type = snap.businessType
    ? (businessTypeLabel[snap.businessType] ?? snap.businessType)
    : "real estate";

  parts.push(
    snap.companyName
      ? `${snap.companyName} is a ${type} business`
      : `A ${type} business`,
  );

  const locs = (snap.locations ?? []).filter(Boolean);
  if (locs.length > 0) {
    parts.push(
      `operating in ${
        locs.length === 1
          ? locs[0]
          : `${locs.slice(0, -1).join(", ")} and ${locs[locs.length - 1]}`
      }`,
    );
  }

  const types = (snap.propertyTypes ?? []).filter(Boolean);
  if (types.length > 0) {
    parts.push(`specialising in ${types.join(", ")}`);
  }

  const goal = snap.primaryGoal
    ? (goalLabel[snap.primaryGoal] ?? snap.primaryGoal)
    : null;
  if (goal) {
    parts.push(`with a focus on ${goal}`);
  }

  if (snap.tagline) {
    parts.push(`— "${snap.tagline}"`);
  }

  return parts.join(", ") + ".";
}

// ---------------------------------------------------------------------------
// Profile derivation
// ---------------------------------------------------------------------------

export function deriveProfile(snap: OnboardingSnapshot): DerivedProfile {
  // --- segment ---
  const segment = ((): DerivedProfile["segment"] => {
    switch (snap.businessType) {
      case "luxury":
        return "luxury";
      case "commercial":
        return "commercial";
      case "residential-sales":
        return "residential";
      case "residential-rentals":
        return "rental";
      default:
        return "mixed";
    }
  })();

  // --- designIntent ---
  const designIntent = ((): DerivedProfile["designIntent"] => {
    if (snap.stylePreference === "minimal") return "editorial";
    if (snap.stylePreference === "bold") return "bold";
    if (snap.stylePreference === "classic") return "warm";
    if (snap.stylePreference === "modern") return "clean";
    // fall back to tone
    if (snap.tone === "luxury") return "editorial";
    if (snap.tone === "friendly") return "warm";
    if (snap.tone === "modern") return "clean";
    if (snap.tone === "professional") return "editorial";
    return "editorial";
  })();

  // --- conversionFocus ---
  const conversionFocus = ((): DerivedProfile["conversionFocus"] => {
    switch (snap.primaryGoal) {
      case "generate-leads":
        return "leads";
      case "showcase-listings":
        return "listings";
      case "build-brand":
        return "brand";
      case "all-of-above":
        return "balanced";
      default:
        return "leads";
    }
  })();

  // --- complexity ---
  const complexity = ((): DerivedProfile["complexity"] => {
    const richSignals = [
      snap.hasAgents,
      snap.hasProjects,
      snap.hasTestimonials,
      snap.hasBlogContent,
    ].filter(Boolean).length;

    const mediumSignals = [snap.hasListings, snap.hasExistingContent].filter(
      Boolean,
    ).length;

    if (richSignals >= 2) return "high";
    if (richSignals >= 1 || mediumSignals >= 1) return "medium";
    return "low";
  })();

  // --- template recommendation ---
  const recommendations = scoreTemplates(
    { complexity, conversionFocus, designIntent, segment },
    templateCatalog,
  );
  const recommendedTemplateKey =
    recommendations[0]?.template.key ??
    templateCatalog[0]?.key ??
    "template-1";

  return {
    complexity,
    conversionFocus,
    designIntent,
    recommendedTemplateKey,
    segment,
  };
}

// ---------------------------------------------------------------------------
// Derived design config (font, color, style preset)
// ---------------------------------------------------------------------------

export function deriveDesignConfig(
  profile: Pick<DerivedProfile, "designIntent" | "segment">,
  snap: Pick<OnboardingSnapshot, "tone" | "stylePreference">,
): DerivedDesignConfig {
  type DesignPreset = {
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    headingFontFamily: string;
    stylePreset: DerivedDesignConfig["stylePreset"];
  };

  const presets: Record<DerivedProfile["designIntent"], DesignPreset> = {
    editorial: {
      accentColor: "#0f766e",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      stylePreset: "editorial",
    },
    bold: {
      accentColor: "#1d4ed8",
      backgroundColor: "#f8fafc",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: "Satoshi, Avenir Next, sans-serif",
      stylePreset: "bold",
    },
    warm: {
      accentColor: "#b45309",
      backgroundColor: "#fffaf0",
      fontFamily: "Satoshi, Avenir Next, sans-serif",
      headingFontFamily: 'Georgia, "Times New Roman", serif',
      stylePreset: "warm",
    },
    clean: {
      accentColor: "#334155",
      backgroundColor: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif",
      headingFontFamily: "Inter, system-ui, sans-serif",
      stylePreset: "clean",
    },
  };

  // Luxury segment always gets the editorial preset regardless of stated preference
  const intent =
    profile.segment === "luxury" ? "editorial" : profile.designIntent;

  return presets[intent];
}

// ---------------------------------------------------------------------------
// Derived page composition
// ---------------------------------------------------------------------------

export function derivePageComposition(
  profile: Pick<DerivedProfile, "conversionFocus" | "segment">,
  snap: Pick<OnboardingSnapshot, "hasListings" | "hasTestimonials">,
): DerivedPageComposition {
  const listingLed =
    profile.conversionFocus === "listings" ||
    profile.conversionFocus === "balanced";

  const sections: string[] = [
    "hero_banner",
    "market_stats",
    ...(!listingLed ? ["story_grid"] : []),
    "listing_spotlight",
    ...(listingLed ? ["story_grid"] : []),
    ...(snap.hasTestimonials ? ["testimonial_strip"] : []),
    "cta_band",
  ];

  return {
    leadWith: listingLed ? "listings" : "story",
    sections,
    showStats: profile.segment !== "commercial",
  };
}

// ---------------------------------------------------------------------------
// Derived section visibility
// ---------------------------------------------------------------------------

export function deriveSectionVisibility(
  snap: Pick<
    OnboardingSnapshot,
    | "hasAgents"
    | "hasBlogContent"
    | "hasListings"
    | "hasProjects"
    | "hasTestimonials"
  >,
): SectionVisibilityMap {
  return {
    agents: snap.hasAgents === true,
    blog: snap.hasBlogContent === true,
    listings: snap.hasListings !== false, // default visible
    projects: snap.hasProjects === true,
    testimonials: snap.hasTestimonials === true,
  };
}

// ---------------------------------------------------------------------------
// Personalized content generation
// ---------------------------------------------------------------------------

/** Derives personalized site copy from onboarding data without any AI calls. */
export function derivePersonalizedContent(
  snap: OnboardingSnapshot,
  profile: DerivedProfile,
): TenantContentRecord {
  const company = snap.companyName ?? "Our Agency";

  const primaryLocation = (snap.locations ?? []).filter(Boolean)[0] ?? "your area";

  const market =
    (snap.locations ?? []).filter(Boolean).join(" and ") || primaryLocation;

  // Eyebrow — short premium label
  const eyebrowMap: Record<DerivedProfile["segment"], string> = {
    luxury: "Luxury homes and investment addresses",
    commercial: "Premium commercial spaces for ambitious businesses",
    residential: "Trusted homes for families and buyers",
    rental: "Quality rental homes and managed spaces",
    mixed: "Homes, investments, and spaces you can trust",
  };
  const eyebrow = eyebrowMap[profile.segment];

  // Hero title — tone-adjusted
  const toneAdjective: Record<DerivedProfile["designIntent"], string> = {
    editorial: "signature",
    bold: "next",
    warm: "perfect",
    clean: "ideal",
  };
  const adj = toneAdjective[profile.designIntent];
  const heroTitle = `Find your ${adj} property in ${primaryLocation}.`;

  // Hero subtitle — from tagline if available, otherwise derived
  const heroSubtitle = snap.tagline
    ? `${snap.tagline} — explore trusted properties across ${market} with ${company}.`
    : `${company} helps buyers, investors, and families discover trusted homes and high-conviction opportunities across ${market}.`;

  // CTA text — goal-adjusted
  const ctaMap: Record<DerivedProfile["conversionFocus"], string> = {
    leads: "Book a consultation",
    listings: "Browse listings",
    brand: "Meet our team",
    balanced: "Browse listings",
  };
  const ctaText = ctaMap[profile.conversionFocus];

  // Story section
  const storyTitleMap: Record<DerivedProfile["designIntent"], string> = {
    editorial: `${company} turns trust into momentum.`,
    bold: `${company} moves fast and gets results.`,
    warm: `${company} puts your family first.`,
    clean: `${company} makes every step clear.`,
  };
  const storyTitle = storyTitleMap[profile.designIntent];

  const storyDescMap: Record<DerivedProfile["segment"], string> = {
    luxury: `We bring unrivalled market knowledge and discretion to every premium mandate — so you always feel one step ahead.`,
    commercial: `Our team combines deep market insight with sharp negotiation to deliver commercial outcomes that grow businesses.`,
    residential: `From first viewing to final handover, ${company} guides every family toward a decision they can feel confident in.`,
    rental: `${company} matches quality tenants with well-managed properties and handles every detail with professionalism.`,
    mixed: `Whether you're buying, investing, or renting, ${company} brings the same rigour and care to every engagement.`,
  };
  const storyDescription = storyDescMap[profile.segment];

  // Final CTA section
  const ctaFinalTitle = `Start your ${primaryLocation} search with ${company}.`;
  const ctaFinalBody =
    profile.conversionFocus === "leads"
      ? `Book a private consultation or request a tailored shortlist — our team responds within one business day.`
      : `Browse our latest inventory or reach out for a personalised walkthrough of available properties in ${market}.`;

  return {
    "cta.body": ctaFinalBody,
    "cta.title": ctaFinalTitle,
    "hero.ctaText": ctaText,
    "hero.eyebrow": eyebrow,
    "hero.subtitle": heroSubtitle,
    "hero.title": heroTitle,
    "story.description": storyDescription,
    "story.title": storyTitle,
  };
}

// ---------------------------------------------------------------------------
// Template scoring
// ---------------------------------------------------------------------------

/**
 * Each template carries scoring tags. The scorer awards points when a tag
 * matches a profile attribute. Weights are intentionally simple integers.
 */

type TemplateScoringTags = {
  conversionFocusTags: DerivedProfile["conversionFocus"][];
  designIntentTags: DerivedProfile["designIntent"][];
  segmentTags: DerivedProfile["segment"][];
};

const templateTags: Record<string, TemplateScoringTags> = {
  "template-1": {
    // Aster Grove — luxury, editorial, premium
    conversionFocusTags: ["brand", "leads"],
    designIntentTags: ["editorial"],
    segmentTags: ["luxury", "residential"],
  },
  "template-2": {
    // Atlas Urban — modern, clean, urban/commercial
    conversionFocusTags: ["listings", "balanced"],
    designIntentTags: ["clean", "bold"],
    segmentTags: ["commercial", "mixed", "residential"],
  },
  "template-3": {
    // Palmstone — warm, trust-led, family/investor
    conversionFocusTags: ["leads", "balanced"],
    designIntentTags: ["warm", "editorial"],
    segmentTags: ["mixed", "residential", "rental"],
  },
  "template-4": {
    // Meridian — clean, listing-first, residential volume
    conversionFocusTags: ["listings", "balanced"],
    designIntentTags: ["clean"],
    segmentTags: ["residential", "rental", "mixed"],
  },
  "template-5": {
    // Thornfield — bold, investor, commercial
    conversionFocusTags: ["brand", "balanced"],
    designIntentTags: ["bold"],
    segmentTags: ["commercial", "mixed"],
  },
  "template-6": {
    // Crestview — warm, family, mid-market
    conversionFocusTags: ["leads", "balanced"],
    designIntentTags: ["warm"],
    segmentTags: ["residential", "rental"],
  },
};

type PartialProfile = Omit<DerivedProfile, "complexity" | "recommendedTemplateKey">;

function scoreTemplate(
  profile: PartialProfile,
  template: TemplateDefinition,
): number {
  const tags = templateTags[template.key];
  if (!tags) return 0;

  let score = 0;

  if (tags.segmentTags.includes(profile.segment)) score += 3;
  if (tags.designIntentTags.includes(profile.designIntent)) score += 2;
  if (tags.conversionFocusTags.includes(profile.conversionFocus)) score += 1;

  return score;
}

export function scoreTemplates(
  profile: PartialProfile,
  catalog: TemplateDefinition[],
  /** Tiers the caller can access — defaults to all accessible if omitted */
  accessibleTiers?: Set<string>,
): TemplateRecommendation[] {
  const fallbackKey = catalog.find(
    (t) => !accessibleTiers || accessibleTiers.has(t.tier),
  )?.key;

  return catalog
    .map((template) => {
      const score = scoreTemplate(profile, template);
      const tags = templateTags[template.key];
      const reason = buildRecommendationReason(profile, template, tags);
      const upgradeRequired = accessibleTiers
        ? !accessibleTiers.has(template.tier)
        : false;
      return {
        fallbackKey: upgradeRequired ? fallbackKey : undefined,
        reason,
        score,
        template,
        upgradeRequired,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function buildRecommendationReason(
  profile: PartialProfile,
  template: TemplateDefinition,
  tags: TemplateScoringTags | undefined,
): string {
  if (!tags) return template.description;

  const matches: string[] = [];

  if (tags.segmentTags.includes(profile.segment)) {
    matches.push(`designed for ${profile.segment} businesses`);
  }
  if (tags.designIntentTags.includes(profile.designIntent)) {
    matches.push(`matches your ${profile.designIntent} visual preference`);
  }
  if (tags.conversionFocusTags.includes(profile.conversionFocus)) {
    matches.push(`optimised for ${profile.conversionFocus}`);
  }

  if (matches.length === 0) return template.description;
  return `${template.name} is ${matches.join(" and ")}.`;
}
