/**
 * Tenant profile derivation and template recommendation engine.
 *
 * All logic is deterministic — no AI calls, no external dependencies.
 * Runs server-side after each onboarding step save.
 */

import type { TemplateDefinition } from "./index";
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
  reason: string;
  score: number;
  template: TemplateDefinition;
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

  parts.push(snap.companyName ? `${snap.companyName} is a ${type} business` : `A ${type} business`);

  const locs = (snap.locations ?? []).filter(Boolean);
  if (locs.length > 0) {
    parts.push(
      `operating in ${locs.length === 1 ? locs[0] : `${locs.slice(0, -1).join(", ")} and ${locs[locs.length - 1]}`}`,
    );
  }

  const types = (snap.propertyTypes ?? []).filter(Boolean);
  if (types.length > 0) {
    parts.push(`specialising in ${types.join(", ")}`);
  }

  const goal = snap.primaryGoal ? (goalLabel[snap.primaryGoal] ?? snap.primaryGoal) : null;
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

    const mediumSignals = [snap.hasListings, snap.hasExistingContent].filter(Boolean).length;

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
    recommendations[0]?.template.key ?? templateCatalog[0]?.key ?? "template-1";

  return {
    complexity,
    conversionFocus,
    designIntent,
    recommendedTemplateKey,
    segment,
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
};

type PartialProfile = Omit<DerivedProfile, "complexity" | "recommendedTemplateKey">;

function scoreTemplate(profile: PartialProfile, template: TemplateDefinition): number {
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
): TemplateRecommendation[] {
  return catalog
    .map((template) => {
      const score = scoreTemplate(profile, template);
      const tags = templateTags[template.key];
      const reason = buildRecommendationReason(profile, template, tags);
      return { reason, score, template };
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
