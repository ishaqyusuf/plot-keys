export type BusinessType =
  | "agency"
  | "developer"
  | "property_manager"
  | "independent_agent"
  | "luxury_firm"
  | "rental_business";

export type PrimaryGoal =
  | "sell"
  | "rent"
  | "both"
  | "generate_leads"
  | "promote_projects";

export type PropertyType =
  | "apartment"
  | "duplex"
  | "land"
  | "commercial"
  | "office"
  | "shortlet"
  | "luxury";

// Free-form string tags (system suggestions + custom user input)
export type TargetAudience = string;

export type Tone =
  | "professional"
  | "luxury"
  | "friendly"
  | "modern"
  | "corporate";

export type StylePreference =
  | "minimal"
  | "bold"
  | "elegant"
  | "corporate"
  | "premium";

export type TenantOnboardingInput = {
  tenantId: string;
  businessName: string;
  tagline?: string;
  businessType: BusinessType;
  primaryGoal: PrimaryGoal;

  locations: string[];
  propertyTypes: PropertyType[];
  targetAudience?: TargetAudience;

  tone: Tone;
  stylePreference: StylePreference;
  preferredColorHint?: string;

  phone?: string;
  email?: string;
  whatsapp?: string;
  officeAddress?: string;

  hasLogo: boolean;
  hasListings: boolean;
  hasExistingContent: boolean;
  hasAgents?: boolean;
  hasProjects?: boolean;
  hasTestimonials?: boolean;
  hasBlogContent?: boolean;
};

export type TenantProfile = {
  segment:
    | "agency_general"
    | "agency_luxury"
    | "developer"
    | "rental_business"
    | "independent_agent"
    | "property_management";

  complexity: "simple" | "standard" | "advanced";
  designIntent: "minimal" | "luxury" | "corporate" | "modern" | "premium";
  conversionFocus: "lead" | "inventory" | "mixed" | "projects";
};

export type ThemeDefaults = {
  selectedFont: "inter" | "roboto" | "manrope" | "lora" | "plus-jakarta";
  selectedColorSystem:
    | "vega-slate"
    | "nova-gold"
    | "maia-blue"
    | "myra-emerald"
    | "lyra-stone";
  selectedStylePreset: "vega" | "nova" | "maia" | "myra" | "lyra";
};

export type SectionVisibilityRules = {
  showAgents: boolean;
  showProjects: boolean;
  showTestimonials: boolean;
  showBlog: boolean;
};

export type OnboardingEngineResult = {
  profile: TenantProfile;
  themeDefaults: ThemeDefaults;
  visibility: SectionVisibilityRules;
};

export function buildTenantProfile(
  input: TenantOnboardingInput,
): TenantProfile {
  let segment: TenantProfile["segment"] = "agency_general";

  if (input.businessType === "developer") {
    segment = "developer";
  } else if (input.businessType === "property_manager") {
    segment = "property_management";
  } else if (input.businessType === "independent_agent") {
    segment = "independent_agent";
  } else if (input.businessType === "rental_business") {
    segment = "rental_business";
  } else if (
    input.businessType === "luxury_firm" ||
    input.targetAudience === "high_end" ||
    input.propertyTypes.includes("luxury")
  ) {
    segment = "agency_luxury";
  }

  let complexity: TenantProfile["complexity"] = "simple";

  const inventorySignals =
    Number(input.hasListings) + Number(input.hasProjects);
  if (inventorySignals >= 2) complexity = "advanced";
  else if (inventorySignals >= 1) complexity = "standard";

  let conversionFocus: TenantProfile["conversionFocus"] = "lead";

  if (input.primaryGoal === "sell" || input.primaryGoal === "rent") {
    conversionFocus = "inventory";
  } else if (input.primaryGoal === "both") {
    conversionFocus = "mixed";
  } else if (input.primaryGoal === "promote_projects") {
    conversionFocus = "projects";
  }

  let designIntent: TenantProfile["designIntent"] = "modern";

  if (input.tone === "luxury" || input.stylePreference === "premium") {
    designIntent = "luxury";
  } else if (input.stylePreference === "minimal") {
    designIntent = "minimal";
  } else if (
    input.stylePreference === "corporate" ||
    input.tone === "corporate"
  ) {
    designIntent = "corporate";
  } else if (input.stylePreference === "premium") {
    designIntent = "premium";
  }

  return {
    segment,
    complexity,
    designIntent,
    conversionFocus,
  };
}

export function getThemeDefaults(profile: TenantProfile): ThemeDefaults {
  switch (profile.designIntent) {
    case "luxury":
      return {
        selectedFont: "lora",
        selectedColorSystem: "nova-gold",
        selectedStylePreset: "nova",
      };

    case "minimal":
      return {
        selectedFont: "inter",
        selectedColorSystem: "vega-slate",
        selectedStylePreset: "vega",
      };

    case "corporate":
      return {
        selectedFont: "roboto",
        selectedColorSystem: "lyra-stone",
        selectedStylePreset: "lyra",
      };

    case "premium":
      return {
        selectedFont: "plus-jakarta",
        selectedColorSystem: "nova-gold",
        selectedStylePreset: "myra",
      };

    case "modern":
    default:
      return {
        selectedFont: "manrope",
        selectedColorSystem: "maia-blue",
        selectedStylePreset: "maia",
      };
  }
}

export function getSectionVisibility(
  input: TenantOnboardingInput,
): SectionVisibilityRules {
  return {
    showAgents: Boolean(input.hasAgents),
    showProjects: Boolean(input.hasProjects),
    showTestimonials: Boolean(input.hasTestimonials),
    showBlog: Boolean(input.hasBlogContent),
  };
}

export function runOnboardingEngine(
  input: TenantOnboardingInput,
): OnboardingEngineResult {
  const profile = buildTenantProfile(input);
  const themeDefaults = getThemeDefaults(profile);
  const visibility = getSectionVisibility(input);

  return {
    profile,
    themeDefaults,
    visibility,
  };
}
