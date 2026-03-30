"use client";

import { TAG_INPUT_SYSTEM_SUGGESTIONS } from "../tag-input";

export type QuickFillProfile =
  | "auth-sign-up"
  | "generic"
  | "invite-employee"
  | "invite-member"
  | "new-agent"
  | "new-project"
  | "new-property"
  | "onboarding-brand-style"
  | "onboarding-business-identity"
  | "onboarding-contact-operations"
  | "onboarding-content-readiness"
  | "onboarding-launch"
  | "onboarding-market-focus"
  | "publish-configuration";

type QuickFillPayloads = {
  bioVariants: string[];
  businessTypes: string[];
  colors: string[];
  companyPrefixes: string[];
  companySuffixes: string[];
  companyTypes: string[];
  contentReadinessFlags: string[][];
  employeeRoles: string[];
  inviteRoles: string[];
  locations: string[];
  primaryGoals: string[];
  projectTypes: string[];
  propertyStatuses: string[];
  propertySubTypes: string[];
  propertyTypes: string[];
  propertyTypeSets: string[][];
  stylePreferences: string[];
  taglines: string[];
  targetAudienceSets: string[][];
  tones: string[];
};

type QuickFillValues = Record<string, unknown>;

export type QuickFillFormAdapter<
  TValues extends QuickFillValues = QuickFillValues,
> = {
  getValues: () => TValues;
  reset: (values: TValues | QuickFillValues) => void;
  setValue: (
    name: string,
    value: unknown,
    options?: {
      shouldDirty?: boolean;
      shouldTouch?: boolean;
      shouldValidate?: boolean;
    },
  ) => void;
};

const DEFAULT_PAYLOADS: QuickFillPayloads = {
  bioVariants: [
    "Trusted real-estate professional serving families, operators, and investors.",
    "Experienced property advisor focused on smooth transactions and reliable follow-up.",
    "Hands-on real-estate consultant helping clients move quickly with clarity.",
  ],
  businessTypes: [
    "residential-sales",
    "residential-rentals",
    "commercial",
    "luxury",
    "mixed",
  ],
  colors: ["Deep navy", "Forest green", "Warm sand", "Charcoal and gold"],
  companyPrefixes: [
    "Aster",
    "Atlas",
    "Blue",
    "Cedar",
    "Crown",
    "Emerald",
    "Golden",
    "Grand",
    "Harbor",
    "Key",
    "Maple",
    "Oak",
    "Prime",
    "Royal",
    "Silver",
    "Skyline",
    "Sterling",
    "Summit",
    "Urban",
    "Victory",
  ],
  companySuffixes: [
    "Bay",
    "Bridge",
    "Crest",
    "Court",
    "Edge",
    "Field",
    "Garden",
    "Gate",
    "Grove",
    "Heights",
    "Haven",
    "Hill",
    "View",
    "Park",
    "Place",
    "Point",
    "Square",
    "Stone",
    "Terrace",
    "Vale",
  ],
  companyTypes: [
    "Advisory",
    "Assets",
    "Estates",
    "Homes",
    "Holdings",
    "Living",
    "Properties",
    "Realty",
    "Residences",
    "Spaces",
  ],
  contentReadinessFlags: [
    ["hasLogo", "hasListings", "hasTestimonials"],
    ["hasLogo", "hasAgents", "hasExistingContent"],
    ["hasListings", "hasProjects", "hasBlogContent"],
  ],
  employeeRoles: ["operations", "sales_agent", "marketing", "finance"],
  inviteRoles: ["admin", "agent", "staff"],
  locations: [
    "Lekki, Lagos",
    "Victoria Island, Lagos",
    "Ikoyi, Lagos",
    "Maitama, Abuja",
    "Wuse 2, Abuja",
  ],
  primaryGoals: [
    "generate-leads",
    "showcase-listings",
    "build-brand",
    "all-of-above",
  ],
  projectTypes: [
    "building",
    "estate",
    "fit_out",
    "infrastructure",
    "renovation",
  ],
  propertyStatuses: ["active", "sold", "rented", "off_market"],
  propertySubTypes: [
    "Detached Duplex",
    "Serviced Apartment",
    "Office Suite",
    "Mixed-use Development",
  ],
  propertyTypes: [
    "residential",
    "commercial",
    "land",
    "industrial",
    "mixed_use",
  ],
  propertyTypeSets: [
    ["apartments", "houses"],
    ["luxury", "apartments"],
    ["commercial", "land"],
  ],
  stylePreferences: ["minimal", "bold", "classic", "modern"],
  taglines: [
    "Real estate, made effortless.",
    "Trusted guidance for every move.",
    "Find the right space with confidence.",
    "Premium property service without the noise.",
  ],
  targetAudienceSets: [
    [TAG_INPUT_SYSTEM_SUGGESTIONS[0]!, TAG_INPUT_SYSTEM_SUGGESTIONS[6]!],
    [TAG_INPUT_SYSTEM_SUGGESTIONS[1]!, TAG_INPUT_SYSTEM_SUGGESTIONS[2]!],
    [TAG_INPUT_SYSTEM_SUGGESTIONS[3]!, TAG_INPUT_SYSTEM_SUGGESTIONS[9]!],
    [TAG_INPUT_SYSTEM_SUGGESTIONS[5]!, TAG_INPUT_SYSTEM_SUGGESTIONS[8]!],
  ],
  tones: ["professional", "friendly", "luxury", "modern"],
};

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function randomId() {
  return Math.random().toString(36).slice(2, 7);
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toSlugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

type QuickFillSeed = ReturnType<typeof createQuickFillSeed>;

function createQuickFillSeed(payloads: QuickFillPayloads) {
  const suffix = randomId();
  const company = `${pickRandom(payloads.companyPrefixes)} ${pickRandom(
    payloads.companySuffixes,
  )} ${pickRandom(payloads.companyTypes)}`;
  const safeCompanySlug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const companyParts = company.split(/\s+/);
  const brandSlug =
    companyParts.slice(0, 2).map(toSlugPart).filter(Boolean).join("") ||
    safeCompanySlug.replace(/-/g, "");
  const firstName = pickRandom([
    "Amira",
    "Layla",
    "Noor",
    "Yasmin",
    "Mariam",
    "Omar",
    "Khalid",
    "Zayd",
    "Tariq",
    "Samir",
  ]);
  const lastName = pickRandom([
    "Haddad",
    "Khalil",
    "Nasser",
    "Farouk",
    "Rahman",
    "Malik",
    "Saleh",
    "Karim",
    "Hamdan",
    "Mansour",
  ]);
  const fullName = `${firstName} ${lastName}`;
  const location = pickRandom(payloads.locations);
  const projectType = pickRandom(payloads.projectTypes);
  const projectName = `${company} ${pickRandom([
    "Residences",
    "Gardens",
    "Heights",
    "Court",
    "Terraces",
  ])} Phase ${Math.floor(Math.random() * 4) + 1}`;

  return {
    bio: pickRandom(payloads.bioVariants),
    company,
    description:
      "A polished sample record generated for focused local testing and QA flows.",
    email: `${toSlugPart(firstName)}+${suffix}@${brandSlug}.test`,
    fullName,
    location,
    market: location,
    officeAddress: `${Math.floor(Math.random() * 40) + 5} Marina Road, ${location}`,
    phone: `+23480${Math.floor(Math.random() * 90000000 + 10000000)}`,
    price: `₦${(Math.floor(Math.random() * 7) + 3) * 25000000}`,
    projectCode: `${projectType.slice(0, 3).toUpperCase()}-${suffix.toUpperCase()}`,
    projectName,
    projectType,
    signUpEmail: `hello@${brandSlug}.test`,
    signUpPassword: `Plotkeys-${suffix}`,
    signUpSubdomain: brandSlug,
    slug: `${brandSlug}-${suffix}`,
    tagline: pickRandom(payloads.taglines),
    title: `${pickRandom(["Sample", "Demo", "Premium"])} Listing ${suffix.toUpperCase()}`,
    whatsapp: `+23481${Math.floor(Math.random() * 90000000 + 10000000)}`,
  };
}

export class QuickFill<
  TValues extends QuickFillValues = QuickFillValues,
  TProfile extends QuickFillProfile = QuickFillProfile,
> {
  private readonly seed: QuickFillSeed;

  constructor(
    private readonly form: QuickFillFormAdapter<TValues>,
    private readonly payloads: QuickFillPayloads = DEFAULT_PAYLOADS,
  ) {
    this.seed = createQuickFillSeed(payloads);
  }

  fill(profile: TProfile) {
    switch (profile) {
      case "auth-sign-up":
        return this.authSignUp();
      case "onboarding-business-identity":
        return this.onboardingBusinessIdentity();
      case "onboarding-market-focus":
        return this.onboardingMarketFocus();
      case "onboarding-brand-style":
        return this.onboardingBrandStyle();
      case "onboarding-contact-operations":
        return this.onboardingContactOperations();
      case "onboarding-content-readiness":
        return this.onboardingContentReadiness();
      case "onboarding-launch":
        return this.onboardingLaunch();
      case "new-agent":
        return this.newAgent();
      case "new-project":
        return this.newProject();
      case "new-property":
        return this.newProperty();
      case "invite-member":
        return this.inviteMember();
      case "invite-employee":
        return this.inviteEmployee();
      case "publish-configuration":
        return this.publishConfiguration();
      default:
        return this.generic();
    }
  }

  onboardingBusinessIdentity() {
    this.merge({
      businessType: pickRandom(this.payloads.businessTypes),
      primaryGoal: pickRandom(this.payloads.primaryGoals),
      tagline: this.seed.tagline,
    });
  }

  authSignUp() {
    this.merge({
      company: this.seed.company,
      email: this.seed.signUpEmail,
      name: this.seed.fullName,
      password: this.seed.signUpPassword,
      phoneNumber: this.seed.phone,
      subdomain: this.seed.signUpSubdomain,
    });
  }

  onboardingMarketFocus() {
    this.merge({
      locations: [this.seed.location, pickRandom(this.payloads.locations)].join(
        ", ",
      ),
      market: this.seed.market,
      propertyTypes: pickRandom(this.payloads.propertyTypeSets),
      targetAudience: pickRandom(this.payloads.targetAudienceSets),
    });
  }

  onboardingBrandStyle() {
    this.merge({
      preferredColorHint: pickRandom(this.payloads.colors),
      stylePreference: pickRandom(this.payloads.stylePreferences),
      tone: pickRandom(this.payloads.tones),
    });
  }

  onboardingContactOperations() {
    this.merge({
      contactEmail: this.seed.email,
      officeAddress: this.seed.officeAddress,
      phone: this.seed.phone,
      whatsapp: this.seed.whatsapp,
    });
  }

  onboardingContentReadiness() {
    const selected = new Set(pickRandom(this.payloads.contentReadinessFlags));

    this.merge({
      hasAgents: selected.has("hasAgents"),
      hasBlogContent: selected.has("hasBlogContent"),
      hasExistingContent: selected.has("hasExistingContent"),
      hasListings: selected.has("hasListings"),
      hasLogo: selected.has("hasLogo"),
      hasProjects: selected.has("hasProjects"),
      hasTestimonials: selected.has("hasTestimonials"),
    });
  }

  onboardingLaunch() {
    this.merge({
      templateKey: "template-1",
    });
  }

  newAgent() {
    this.merge({
      bio: this.seed.bio,
      displayOrder: "1",
      email: this.seed.email,
      featured: "true",
      imageUrl: `https://images.example.com/agents/${this.seed.slug}.jpg`,
      name: this.seed.fullName,
      phone: this.seed.phone,
      title: "Senior Property Advisor",
    });
  }

  newProperty() {
    this.merge({
      bathrooms: "3",
      bedrooms: "4",
      description: `${this.seed.description} Contact ${this.seed.fullName} for follow-up.`,
      featured: "true",
      imageUrl: `https://images.example.com/properties/${this.seed.slug}.jpg`,
      location: this.seed.location,
      price: this.seed.price,
      specs: "4 bed · 3 bath · pool · 24/7 power",
      status: pickRandom(this.payloads.propertyStatuses),
      subType: pickRandom(this.payloads.propertySubTypes),
      title: this.seed.title,
      type: pickRandom(this.payloads.propertyTypes),
    });
  }

  newProject() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);

    const targetCompletionDate = new Date(startDate);
    targetCompletionDate.setMonth(targetCompletionDate.getMonth() + 14);

    this.merge({
      code: this.seed.projectCode,
      description: `${this.seed.description} Site mobilization and planning are already underway.`,
      location: this.seed.location,
      name: this.seed.projectName,
      startDate: formatDateInput(startDate),
      targetCompletionDate: formatDateInput(targetCompletionDate),
      type: this.seed.projectType,
    });
  }

  inviteMember() {
    this.merge({
      email: `team-${this.seed.slug}@plotkeys.test`,
      role: pickRandom(this.payloads.inviteRoles),
    });
  }

  inviteEmployee() {
    this.merge({
      email: `employee-${this.seed.slug}@plotkeys.test`,
      workRole: pickRandom(this.payloads.employeeRoles),
    });
  }

  publishConfiguration() {
    this.merge({
      nextName: `Launch ${this.seed.company}`,
    });
  }

  generic() {
    const values = this.form.getValues();
    const firstStringField = Object.entries(values).find(([, value]) => {
      return typeof value === "string";
    })?.[0];

    if (!firstStringField) {
      return;
    }

    this.set(firstStringField, this.seed.company);
  }

  private merge(values: QuickFillValues) {
    this.form.reset({
      ...(this.form.getValues() as QuickFillValues),
      ...values,
    });
  }

  private set(name: string, value: unknown) {
    this.form.setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }
}

export function createQuickFillAdapter<
  TValues extends QuickFillValues = QuickFillValues,
>(form: {
  getValues: () => TValues;
  reset: (values: TValues | QuickFillValues) => void;
  setValue: (name: any, value: any, options?: any) => void;
}): QuickFillFormAdapter<TValues> {
  return {
    getValues: () => form.getValues(),
    reset: (values) => form.reset(values as TValues),
    setValue: (name, value, options) =>
      form.setValue(name as never, value as never, options),
  };
}

export function runQuickFill<
  TValues extends QuickFillValues = QuickFillValues,
  TProfile extends QuickFillProfile = QuickFillProfile,
>(
  form: QuickFillFormAdapter<TValues>,
  profile: TProfile = "generic" as TProfile,
) {
  return new QuickFill<TValues, TProfile>(form).fill(profile);
}
