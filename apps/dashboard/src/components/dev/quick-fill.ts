"use client";

import { TAG_INPUT_SYSTEM_SUGGESTIONS } from "../tag-input";

export type QuickFillProfile =
  | "generic"
  | "invite-employee"
  | "invite-member"
  | "new-agent"
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
  propertyStatuses: string[];
  propertySubTypes: string[];
  propertyTypes: string[];
  propertyTypeSets: string[][];
  stylePreferences: string[];
  taglines: string[];
  targetAudienceSets: string[][];
  tones: string[];
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
  companyPrefixes: ["Aster", "Harbor", "Cedar", "Summit", "Golden"],
  companySuffixes: ["Grove", "Stone", "Point", "Haven", "Crest"],
  companyTypes: ["Realty", "Properties", "Homes", "Advisory", "Estates"],
  contentReadinessFlags: [
    ["hasLogo", "hasListings", "hasTestimonials"],
    ["hasLogo", "hasAgents", "hasExistingContent"],
    ["hasListings", "hasProjects", "hasBlogContent"],
  ],
  employeeRoles: ["operations", "sales", "marketing", "finance"],
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

function waitForTick() {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
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
  const firstName = pickRandom([
    "Amara",
    "Tunde",
    "Zainab",
    "Chinedu",
    "Mariam",
  ]);
  const lastName = pickRandom([
    "Okafor",
    "Balogun",
    "Adebayo",
    "Nwosu",
    "Bello",
  ]);
  const fullName = `${firstName} ${lastName}`;
  const location = pickRandom(payloads.locations);

  return {
    bio: pickRandom(payloads.bioVariants),
    company,
    description:
      "A polished sample record generated for focused local testing and QA flows.",
    email: `${safeCompanySlug}-${suffix}@plotkeys.test`,
    fullName,
    location,
    market: location,
    officeAddress: `${Math.floor(Math.random() * 40) + 5} Marina Road, ${location}`,
    password: `Plotkeys-${suffix}`,
    phone: `+23480${Math.floor(Math.random() * 90000000 + 10000000)}`,
    price: `₦${(Math.floor(Math.random() * 7) + 3) * 25000000}`,
    slug: `${safeCompanySlug}-${suffix}`,
    tagline: pickRandom(payloads.taglines),
    title: `${pickRandom(["Sample", "Demo", "Premium"])} Listing ${suffix.toUpperCase()}`,
    whatsapp: `+23481${Math.floor(Math.random() * 90000000 + 10000000)}`,
  };
}

export class QuickFill {
  private readonly seed: QuickFillSeed;

  constructor(
    private readonly form: HTMLFormElement,
    private readonly payloads: QuickFillPayloads = DEFAULT_PAYLOADS,
  ) {
    this.seed = createQuickFillSeed(payloads);
  }

  async fill(profile: QuickFillProfile) {
    switch (profile) {
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

  async onboardingBusinessIdentity() {
    await this.setSelect(
      "businessType",
      pickRandom(this.payloads.businessTypes),
    );
    await this.setSelect("primaryGoal", pickRandom(this.payloads.primaryGoals));
    this.setInput("tagline", this.seed.tagline);
  }

  async onboardingMarketFocus() {
    this.setInput(
      "locations",
      [this.seed.location, pickRandom(this.payloads.locations)].join(", "),
    );
    this.setCheckboxGroup(
      "propertyTypes",
      pickRandom(this.payloads.propertyTypeSets),
      "value",
    );
    await this.setTagInputValues(
      "targetAudience",
      pickRandom(this.payloads.targetAudienceSets),
    );
  }

  async onboardingBrandStyle() {
    await this.setSelect("tone", pickRandom(this.payloads.tones));
    await this.setSelect(
      "stylePreference",
      pickRandom(this.payloads.stylePreferences),
    );
    await this.setSelect(
      "preferredColorHint",
      pickRandom(this.payloads.colors),
    );
  }

  async onboardingContactOperations() {
    this.setInput("phone", this.seed.phone);
    this.setInput("contactEmail", this.seed.email);
    this.setInput("whatsapp", this.seed.whatsapp);
    this.setTextarea("officeAddress", this.seed.officeAddress);
  }

  async onboardingContentReadiness() {
    this.setCheckboxGroup(
      null,
      pickRandom(this.payloads.contentReadinessFlags),
      "name",
    );
  }

  async onboardingLaunch() {
    this.setInput("market", this.seed.market);
    await this.setRadioOrSelect("template", "template-1");
  }

  async newAgent() {
    this.setInput("name", this.seed.fullName);
    this.setInput("title", "Senior Property Advisor");
    this.setInput("email", this.seed.email);
    this.setInput("phone", this.seed.phone);
    this.setInput("bio", this.seed.bio);
    this.setInput(
      "imageUrl",
      `https://images.example.com/agents/${this.seed.slug}.jpg`,
    );
    this.setInput("displayOrder", "1");
    this.setNativeSelect("featured", "true");
  }

  async newProperty() {
    this.setInput("title", this.seed.title);
    this.setInput("price", this.seed.price);
    this.setInput("location", this.seed.location);
    this.setInput("bedrooms", "4");
    this.setInput("bathrooms", "3");
    this.setInput("specs", "4 bed · 3 bath · pool · 24/7 power");
    this.setInput(
      "description",
      `${this.seed.description} Contact ${this.seed.fullName} for follow-up.`,
    );
    this.setInput(
      "imageUrl",
      `https://images.example.com/properties/${this.seed.slug}.jpg`,
    );
    this.setNativeSelect("type", pickRandom(this.payloads.propertyTypes));
    this.setInput("subType", pickRandom(this.payloads.propertySubTypes));
    this.setNativeSelect("status", pickRandom(this.payloads.propertyStatuses));
    this.setNativeSelect("featured", "true");
  }

  async inviteMember() {
    this.setInput("email", `team-${this.seed.slug}@plotkeys.test`);
    this.setNativeSelect("role", pickRandom(this.payloads.inviteRoles));
  }

  async inviteEmployee() {
    this.setInput("email", `employee-${this.seed.slug}@plotkeys.test`);
    this.setNativeSelect("workRole", pickRandom(this.payloads.employeeRoles));
  }

  async publishConfiguration() {
    const input =
      this.form.querySelector<HTMLInputElement>(
        'input[placeholder*="March refresh"]',
      ) ?? this.form.querySelector<HTMLInputElement>("input");

    if (input) {
      setNativeValue(input, `Launch ${this.seed.company}`);
    }
  }

  async generic() {
    const textInputs = this.form.querySelectorAll<HTMLInputElement>(
      'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])',
    );
    const firstTextInput = Array.from(textInputs).find(
      (input) => input.type === "text" || input.type === "email",
    );

    if (firstTextInput) {
      setNativeValue(firstTextInput, this.seed.company);
    }
  }

  private setInput(name: string, value: string) {
    const input = this.form.querySelector<HTMLInputElement>(
      `input[name="${name}"]`,
    );
    if (input) {
      setNativeValue(input, value);
    }
  }

  private setTextarea(name: string, value: string) {
    const textarea = this.form.querySelector<HTMLTextAreaElement>(
      `textarea[name="${name}"]`,
    );
    if (textarea) {
      setNativeValue(textarea, value);
    }
  }

  private async setSelect(name: string, value: string) {
    const hiddenInput = this.form.querySelector<HTMLInputElement>(
      `input[name="${name}"]`,
    );
    const trigger =
      hiddenInput?.previousElementSibling instanceof HTMLElement
        ? hiddenInput.previousElementSibling
        : this.form.querySelector<HTMLElement>(`#${CSS.escape(name)}`);

    if (!(trigger instanceof HTMLElement)) {
      this.setNativeSelect(name, value);
      return;
    }

    trigger.click();
    await waitForTick();

    const item = document.querySelector<HTMLElement>(
      `[data-slot="select-item"][data-value="${value}"]`,
    );
    item?.click();
    await waitForTick();
  }

  private setNativeSelect(name: string, value: string) {
    const select = this.form.querySelector<HTMLSelectElement>(
      `select[name="${name}"]`,
    );
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  private async setRadioOrSelect(name: string, value: string) {
    const radio = this.form.querySelector<HTMLInputElement>(
      `input[type="radio"][name="${name}"][value="${value}"]`,
    );

    if (radio && !radio.checked) {
      radio.click();
      return;
    }

    await this.setSelect(name, value);
  }

  private setCheckboxGroup(
    name: string | null,
    values: string[],
    matchBy: "name" | "value",
  ) {
    const selectedValues = new Set(values);
    const selector = name
      ? `input[type="checkbox"][name="${name}"]`
      : 'input[type="checkbox"][name]';
    const checkboxes = this.form.querySelectorAll<HTMLInputElement>(selector);

    checkboxes.forEach((checkbox) => {
      const key = matchBy === "name" ? checkbox.name : checkbox.value;
      const shouldBeChecked = selectedValues.has(key);

      if (checkbox.checked !== shouldBeChecked) {
        checkbox.click();
      }
    });
  }

  private async setTagInputValues(name: string, values: string[]) {
    const selectedValues = new Set(values);
    const selectedTags = this.form.querySelectorAll<HTMLElement>(
      `[data-dev-tag-selected="true"][data-tag-value]`,
    );

    selectedTags.forEach((tag) => {
      const value = tag.dataset.tagValue;

      if (value && !selectedValues.has(value)) {
        tag.click();
      }
    });

    await waitForTick();

    for (const value of values) {
      const hiddenInput = this.form.querySelector<HTMLInputElement>(
        `input[type="hidden"][name="${name}"][value="${value}"]`,
      );

      if (hiddenInput) {
        continue;
      }

      const suggestion = Array.from(
        this.form.querySelectorAll<HTMLElement>(
          `[data-dev-tag-suggestion="true"][data-tag-value]`,
        ),
      ).find((tag) => tag.dataset.tagValue === value);

      suggestion?.click();
      await waitForTick();
    }
  }
}

export function runQuickFill(
  form: HTMLFormElement,
  profile: QuickFillProfile = "generic",
) {
  return new QuickFill(form).fill(profile);
}
