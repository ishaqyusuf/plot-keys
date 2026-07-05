import { z } from "zod";

const TAG_INPUT_SYSTEM_SUGGESTIONS = [
  "First-time buyers",
  "Investors",
  "Diaspora clients",
  "Luxury buyers",
  "Mid-market renters",
  "Commercial tenants",
  "Families",
  "Young professionals",
  "Corporate relocations",
  "HNW individuals",
] as const;

export type QuickFillInterval = "monthly" | "yearly";

export type QuickFillProfile =
  | "auth-sign-up"
  | "connect-domain"
  | "generic"
  | "invite-profile-complete"
  | "invite-sign-up"
  | "invite-employee"
  | "invite-member"
  | "new-agent"
  | "new-estate"
  | "new-project"
  | "new-property"
  | "onboarding-brand-style"
  | "onboarding-business-identity"
  | "onboarding-contact-operations"
  | "onboarding-content-readiness"
  | "onboarding-launch"
  | "onboarding-market-focus"
  | "publish-configuration";

export type QuickFillName = QuickFillProfile | "pricing-plans";

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

export type QuickFillFormAdapter<TValues extends QuickFillValues = any> = {
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

export type PricingPlanQuickFillRow = {
  amount: string;
  id: string;
  initialDepositPercent: string;
  months: string;
};

export type PricingPlanQuickFillTemplate = {
  amount: string;
  count: string;
  initialDepositPercent: string;
  months: string;
};

type QuickFillRowSetter<TRow> = (
  updater: (currentRows: TRow[]) => TRow[],
) => void;
type QuickFillRowPredicate<TRow> = {
  bivarianceHack(row: TRow): boolean;
}["bivarianceHack"];
type QuickFillRowSorter<TRow> = {
  bivarianceHack(a: TRow, b: TRow): number;
}["bivarianceHack"];

export type BaseQuickFillRowsArgs<TRow> = {
  createRow: () => TRow;
  disabled?: boolean;
  hasValue: QuickFillRowPredicate<TRow>;
  rows: TRow[];
  setRows: QuickFillRowSetter<TRow>;
  sortRows: QuickFillRowSorter<TRow>;
};

export type PricingPlanQuickFillArgs<
  TRow extends PricingPlanQuickFillRow = PricingPlanQuickFillRow,
> = BaseQuickFillRowsArgs<TRow>;

type FormQuickFillArgs = {
  disabled?: boolean;
  form: QuickFillFormAdapter<any>;
};

export type QuickFillArgs = {
  [Name in QuickFillProfile]: FormQuickFillArgs;
} & {
  "pricing-plans": PricingPlanQuickFillArgs;
};

export type QuickFillTemplateFor<Name extends QuickFillName> =
  Name extends "pricing-plans" ? PricingPlanQuickFillTemplate : never;

type QuickFillDefinition<TArgs, TTemplate = never> = {
  fill: (input: {
    args: TArgs;
    seed: QuickFillSeed;
    template: TTemplate;
  }) => void;
  initialTemplate?: TTemplate;
  mode: "instant" | "dialog";
  title: string;
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
    "Residential Plot",
    "Commercial Plot",
  ],
  propertyTypes: ["residential", "land"],
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
  const item = items[Math.floor(Math.random() * items.length)];
  if (item !== undefined) return item;

  const [firstItem] = items;
  if (firstItem === undefined) {
    throw new Error(
      "Expected at least one item when generating quick-fill data.",
    );
  }

  return firstItem;
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

function createQuickFillSeed(payloads: QuickFillPayloads = DEFAULT_PAYLOADS) {
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
    price: `${(Math.floor(Math.random() * 7) + 3) * 25000000}`,
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

function mergeFormValues(form: QuickFillFormAdapter, values: QuickFillValues) {
  form.reset({
    ...(form.getValues() as QuickFillValues),
    ...values,
  });
}

function setFirstStringValue(form: QuickFillFormAdapter, value: string) {
  const values = form.getValues();
  const firstStringField = Object.entries(values).find(([, currentValue]) => {
    return typeof currentValue === "string";
  })?.[0];

  if (!firstStringField) return;

  form.setValue(firstStringField, value, {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,
  });
}

function createFormQuickFiller(
  title: string,
  fill: (args: FormQuickFillArgs, seed: QuickFillSeed) => void,
): QuickFillDefinition<FormQuickFillArgs> {
  return {
    fill: ({ args, seed }) => fill(args, seed),
    mode: "instant",
    title,
  };
}

function parseDateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return { day, month, year };
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatDateParts(year: number, month: number, day: number) {
  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function addIntervalDate(
  startDate: string,
  index: number,
  interval: QuickFillInterval,
) {
  const parts = parseDateParts(startDate);

  if (!parts) {
    throw new Error("Start date is invalid.");
  }

  const monthOffset = interval === "monthly" ? index : index * 12;
  const zeroBasedMonth = parts.month - 1 + monthOffset;
  const year = parts.year + Math.floor(zeroBasedMonth / 12);
  const month = (zeroBasedMonth % 12) + 1;
  const day = Math.min(parts.day, daysInMonth(year, month));

  return formatDateParts(year, month, day);
}

export function buildQuickFillDates({
  endDate,
  interval,
  maxDate,
  minDate,
  startDate,
}: {
  endDate: string;
  interval: QuickFillInterval;
  maxDate?: string | null;
  minDate?: string | null;
  startDate: string;
}) {
  if (!startDate || !endDate) {
    throw new Error("Quick fill needs a start date and end date.");
  }

  if (endDate < startDate) {
    throw new Error("Quick fill end date cannot be before the start date.");
  }

  if (minDate && startDate < minDate) {
    throw new Error(`Quick fill start date cannot be before ${minDate}.`);
  }

  if (maxDate && endDate > maxDate) {
    throw new Error(`Quick fill end date cannot be after ${maxDate}.`);
  }

  const dates: string[] = [];

  for (let index = 0; index < 240; index += 1) {
    const nextDate = addIntervalDate(startDate, index, interval);

    if (nextDate > endDate) break;

    dates.push(nextDate);
  }

  if (dates.length === 240) {
    const nextDate = addIntervalDate(startDate, 240, interval);

    if (nextDate <= endDate) {
      throw new Error("Quick fill can generate at most 240 rows at once.");
    }
  }

  return dates;
}

export function mergeRowsByDate<TRow>({
  blankRow,
  dates,
  getDate,
  hasValue,
  rows,
  rowForDate,
  sortRows,
}: {
  blankRow: () => TRow;
  dates: string[];
  getDate: (row: TRow) => string;
  hasValue: (row: TRow) => boolean;
  rows: TRow[];
  rowForDate: (date: string) => TRow;
  sortRows: (a: TRow, b: TRow) => number;
}) {
  const valuedRows = rows.filter(hasValue);
  const existingDates = new Set(valuedRows.map(getDate).filter(Boolean));
  const generatedRows = dates
    .filter((date) => !existingDates.has(date))
    .map(rowForDate);

  return [...valuedRows, ...generatedRows].sort(sortRows).concat(blankRow());
}

function pricingPlanHasValue(row: PricingPlanQuickFillRow) {
  return Boolean(
    row.amount.trim() || row.initialDepositPercent.trim() || row.months.trim(),
  );
}

function fillPricingPlans<TRow extends PricingPlanQuickFillRow>({
  args,
  template,
}: {
  args: PricingPlanQuickFillArgs<TRow>;
  template: PricingPlanQuickFillTemplate;
}) {
  const count = Number(template.count || 0);
  const months = Number(template.months || 0);

  if (!Number.isInteger(count) || count < 1 || count > 12) {
    throw new Error("Quick fill can generate between 1 and 12 pricing rows.");
  }

  if (!template.amount) {
    throw new Error("Set an amount before quick filling pricing plans.");
  }

  if (!Number.isFinite(months) || months < 1) {
    throw new Error("Set a valid payment duration before quick filling.");
  }

  args.setRows((currentRows) => {
    const valuedRows = currentRows.filter(args.hasValue);
    const generatedRows = Array.from({ length: count }, (_, index) => {
      const multiplier = index + 1;
      return {
        ...args.createRow(),
        amount: String(Number(template.amount) * multiplier),
        initialDepositPercent: template.initialDepositPercent,
        months: String(months * multiplier),
      } as TRow;
    });

    return [...valuedRows, ...generatedRows]
      .filter(pricingPlanHasValue)
      .sort(args.sortRows);
  });
}

export const quickFillers = {
  "auth-sign-up": createFormQuickFiller(
    "Quick fill sign up",
    ({ form }, seed) =>
      mergeFormValues(form, {
        company: seed.company,
        email: seed.signUpEmail,
        name: seed.fullName,
        password: seed.signUpPassword,
        phoneNumber: seed.phone,
        subdomain: seed.signUpSubdomain,
      }),
  ),
  "connect-domain": createFormQuickFiller(
    "Quick fill domain",
    ({ form }, seed) =>
      mergeFormValues(form, {
        hostname: `${seed.slug}.com.ng`,
      }),
  ),
  generic: createFormQuickFiller("Quick fill", ({ form }, seed) =>
    setFirstStringValue(form, seed.company),
  ),
  "invite-profile-complete": createFormQuickFiller(
    "Quick fill profile",
    ({ form }, seed) =>
      mergeFormValues(form, {
        bio: seed.bio,
        imageUrl: `https://images.example.com/agents/${seed.slug}.jpg`,
        name: seed.fullName,
        phone: seed.phone,
      }),
  ),
  "invite-sign-up": createFormQuickFiller(
    "Quick fill invite sign up",
    ({ form }, seed) =>
      mergeFormValues(form, {
        name: seed.fullName,
        password: seed.signUpPassword,
      }),
  ),
  "invite-employee": createFormQuickFiller(
    "Quick fill employee invite",
    ({ form }, seed) =>
      mergeFormValues(form, {
        email: `employee-${seed.slug}@plotkeys.test`,
        workRole: pickRandom(DEFAULT_PAYLOADS.employeeRoles),
      }),
  ),
  "invite-member": createFormQuickFiller(
    "Quick fill member invite",
    ({ form }, seed) =>
      mergeFormValues(form, {
        email: `team-${seed.slug}@plotkeys.test`,
        role: pickRandom(DEFAULT_PAYLOADS.inviteRoles),
      }),
  ),
  "new-agent": createFormQuickFiller("Quick fill agent", ({ form }, seed) =>
    mergeFormValues(form, {
      bio: seed.bio,
      displayOrder: "1",
      email: seed.email,
      featured: "true",
      imageUrl: `https://images.example.com/agents/${seed.slug}.jpg`,
      name: seed.fullName,
      phone: seed.phone,
      title: "Senior Property Advisor",
    }),
  ),
  "new-estate": createFormQuickFiller("Quick fill estate", ({ form }, seed) => {
    const title = `${seed.company} ${pickRandom([
      "Gardens",
      "Heights",
      "Court",
      "Terraces",
    ])} Phase ${Math.floor(Math.random() * 4) + 1}`;

    mergeFormValues(form, {
      amenities:
        "Golf course, artificial lake, clubhouse, medical centre, sports centre, swimming pool, green areas, solar streetlights, underground wiring",
      approvals: "FCDA approved, C of O in progress",
      brochureUrl: `https://images.example.com/estates/${seed.slug}-brochure.pdf`,
      description: [
        `${title} is a land presale launch in ${seed.location}.`,
        "Early buyers get introductory pricing, flexible payment terms, and priority allocation before the public release.",
        "Ideal for residential buyers and investors looking for titled, accessible land in a growing corridor.",
      ].join(" "),
      heroImageUrl: `https://images.example.com/estates/${seed.slug}.jpg`,
      landmarks: "Airport Road, Centenary City, major filling station",
      location: seed.location,
      phaseLabel: "Phase 1 presale",
      specialPurposeUses: "Schools, clinics, worship centres, gas stations",
      title,
    });
  }),
  "new-project": createFormQuickFiller(
    "Quick fill project",
    ({ form }, seed) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);

      const targetCompletionDate = new Date(startDate);
      targetCompletionDate.setMonth(targetCompletionDate.getMonth() + 14);

      mergeFormValues(form, {
        code: seed.projectCode,
        description: `${seed.description} Site mobilization and planning are already underway.`,
        location: seed.location,
        name: seed.projectName,
        startDate: formatDateInput(startDate),
        targetCompletionDate: formatDateInput(targetCompletionDate),
        type: seed.projectType,
      });
    },
  ),
  "new-property": createFormQuickFiller(
    "Quick fill listing",
    ({ form }, seed) => {
      const type = pickRandom(DEFAULT_PAYLOADS.propertyTypes);
      const isLand = type === "land";

      mergeFormValues(form, {
        bathrooms: isLand ? "" : "3",
        bedrooms: isLand ? "" : "4",
        description: `${seed.description} Contact ${seed.fullName} for follow-up.`,
        featured: "true",
        imageUrl: `https://images.example.com/properties/${seed.slug}.jpg`,
        location: seed.location,
        paymentPlanAmount: "45000000",
        paymentPlanInitialDepositPercent: "20",
        paymentPlanMonths: "12",
        price: seed.price,
        quantityAvailable: isLand ? "12" : "1",
        specs: isLand
          ? "500sqm, dry land, C of O, good road access"
          : "4 bed, 3 bath, pool, 24/7 power",
        status: pickRandom(DEFAULT_PAYLOADS.propertyStatuses),
        subType: pickRandom(DEFAULT_PAYLOADS.propertySubTypes),
        title: seed.title,
        type,
      });
    },
  ),
  "onboarding-brand-style": createFormQuickFiller(
    "Quick fill brand style",
    ({ form }) =>
      mergeFormValues(form, {
        preferredColorHint: pickRandom(DEFAULT_PAYLOADS.colors),
        stylePreference: pickRandom(DEFAULT_PAYLOADS.stylePreferences),
        tone: pickRandom(DEFAULT_PAYLOADS.tones),
      }),
  ),
  "onboarding-business-identity": createFormQuickFiller(
    "Quick fill business identity",
    ({ form }, seed) =>
      mergeFormValues(form, {
        businessType: pickRandom(DEFAULT_PAYLOADS.businessTypes),
        primaryGoal: pickRandom(DEFAULT_PAYLOADS.primaryGoals),
        tagline: seed.tagline,
      }),
  ),
  "onboarding-contact-operations": createFormQuickFiller(
    "Quick fill contact",
    ({ form }, seed) =>
      mergeFormValues(form, {
        contactEmail: seed.email,
        officeAddress: seed.officeAddress,
        phone: seed.phone,
        whatsapp: seed.whatsapp,
      }),
  ),
  "onboarding-content-readiness": createFormQuickFiller(
    "Quick fill content readiness",
    ({ form }) => {
      const selected = new Set(
        pickRandom(DEFAULT_PAYLOADS.contentReadinessFlags),
      );

      mergeFormValues(form, {
        hasAgents: selected.has("hasAgents"),
        hasBlogContent: selected.has("hasBlogContent"),
        hasExistingContent: selected.has("hasExistingContent"),
        hasListings: selected.has("hasListings"),
        hasLogo: selected.has("hasLogo"),
        hasProjects: selected.has("hasProjects"),
        hasTestimonials: selected.has("hasTestimonials"),
      });
    },
  ),
  "onboarding-launch": createFormQuickFiller("Quick fill launch", ({ form }) =>
    mergeFormValues(form, {
      templateKey: "template-1",
    }),
  ),
  "onboarding-market-focus": createFormQuickFiller(
    "Quick fill market focus",
    ({ form }, seed) =>
      mergeFormValues(form, {
        locations: [seed.location, pickRandom(DEFAULT_PAYLOADS.locations)].join(
          ", ",
        ),
        market: seed.market,
        propertyTypes: pickRandom(DEFAULT_PAYLOADS.propertyTypeSets),
        targetAudience: pickRandom(DEFAULT_PAYLOADS.targetAudienceSets),
      }),
  ),
  "pricing-plans": {
    fill: ({ args, template }) =>
      fillPricingPlans({
        args,
        template,
      }),
    initialTemplate: {
      amount: "45000000",
      count: "3",
      initialDepositPercent: "20",
      months: "6",
    },
    mode: "dialog",
    title: "Quick fill pricing plans",
  } satisfies QuickFillDefinition<
    PricingPlanQuickFillArgs,
    PricingPlanQuickFillTemplate
  >,
  "publish-configuration": createFormQuickFiller(
    "Quick fill publish configuration",
    ({ form }, seed) =>
      mergeFormValues(form, {
        nextName: `Launch ${seed.company}`,
      }),
  ),
} satisfies {
  [Name in QuickFillName]: QuickFillDefinition<
    QuickFillArgs[Name],
    QuickFillTemplateFor<Name>
  >;
};

function functionSchema<TFunction>() {
  return z.custom<TFunction>((value) => typeof value === "function");
}

function rowsSchema<TRow>() {
  return z.custom<TRow[]>((value) => Array.isArray(value));
}

function formAdapterSchema() {
  return z.custom<QuickFillFormAdapter>((value) => {
    if (!value || typeof value !== "object") return false;
    const adapter = value as Partial<QuickFillFormAdapter>;
    return (
      typeof adapter.getValues === "function" &&
      typeof adapter.reset === "function" &&
      typeof adapter.setValue === "function"
    );
  });
}

function createFormQuickFillArgsSchema<TName extends QuickFillProfile>(
  name: TName,
) {
  return z.object({
    disabled: z.boolean().optional(),
    form: formAdapterSchema(),
    name: z.literal(name),
  });
}

const quickFillProfiles = [
  "auth-sign-up",
  "connect-domain",
  "generic",
  "invite-profile-complete",
  "invite-sign-up",
  "invite-employee",
  "invite-member",
  "new-agent",
  "new-estate",
  "new-project",
  "new-property",
  "onboarding-brand-style",
  "onboarding-business-identity",
  "onboarding-contact-operations",
  "onboarding-content-readiness",
  "onboarding-launch",
  "onboarding-market-focus",
  "publish-configuration",
] as const satisfies readonly QuickFillProfile[];

export const quickFillArgsSchema = z.discriminatedUnion("name", [
  ...quickFillProfiles.map((profile) => createFormQuickFillArgsSchema(profile)),
  z.object({
    createRow: functionSchema<() => PricingPlanQuickFillRow>(),
    disabled: z.boolean().optional(),
    hasValue: functionSchema<QuickFillRowPredicate<PricingPlanQuickFillRow>>(),
    name: z.literal("pricing-plans"),
    rows: rowsSchema<PricingPlanQuickFillRow>(),
    setRows: functionSchema<QuickFillRowSetter<PricingPlanQuickFillRow>>(),
    sortRows: functionSchema<QuickFillRowSorter<PricingPlanQuickFillRow>>(),
  }),
] as unknown as [
  z.ZodDiscriminatedUnionOption<"name">,
  ...z.ZodDiscriminatedUnionOption<"name">[],
]);

export type QuickFillArgsInput = z.infer<typeof quickFillArgsSchema>;
export type QuickFillArgsFor<Name extends QuickFillName> = Extract<
  QuickFillArgsInput,
  { name: Name }
>;

export function parseQuickFillArgs<Name extends QuickFillName>(
  input: QuickFillArgsFor<Name>,
) {
  return quickFillArgsSchema.parse(input) as QuickFillArgsFor<Name>;
}

export function fillQuickFillProfile<Name extends QuickFillName>({
  args,
  name,
  template,
}: {
  args: QuickFillArgs[Name];
  name: Name;
  template?: QuickFillTemplateFor<Name>;
}) {
  const parsedArgs = parseQuickFillArgs({
    name,
    ...args,
  } as QuickFillArgsFor<Name>) as unknown as QuickFillArgs[Name];
  const filler = quickFillers[name] as unknown as QuickFillDefinition<
    QuickFillArgs[Name],
    QuickFillTemplateFor<Name>
  >;

  filler.fill({
    args: parsedArgs,
    seed: createQuickFillSeed(),
    template: (template ??
      (filler.initialTemplate as QuickFillTemplateFor<Name> | undefined) ??
      undefined) as unknown as QuickFillTemplateFor<Name>,
  });
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
  return fillQuickFillProfile({
    args: { form } as QuickFillArgs[TProfile],
    name: profile,
  });
}
