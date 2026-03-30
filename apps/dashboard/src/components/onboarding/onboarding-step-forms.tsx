"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { Textarea } from "@plotkeys/ui/textarea";
import Link from "next/link";
import { useTransition } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";

import {
  completeOnboardingAction,
  saveOnboardingStepAction,
} from "../../app/actions";
import { useZodForm } from "../../hooks/use-zod-form";
import { DevOnboardingQuickFillButton } from "../dev/dev-onboarding-quick-fill-button";
import { createQuickFillAdapter, QuickFill } from "../dev/quick-fill";
import { TagInput } from "../tag-input";

type StepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness";

export type SavedOnboardingState = {
  businessSummary?: string | null;
  businessType?: string | null;
  companyName?: string | null;
  contactEmail?: string | null;
  currentStep?: string | null;
  hasAgents?: boolean;
  hasBlogContent?: boolean;
  hasExistingContent?: boolean;
  hasListings?: boolean;
  hasLogo?: boolean;
  hasProjects?: boolean;
  hasTestimonials?: boolean;
  locations?: string[] | null;
  market?: string | null;
  officeAddress?: string | null;
  phone?: string | null;
  preferredColorHint?: string | null;
  primaryGoal?: string | null;
  propertyTypes?: string[] | null;
  recommendedTemplateKey?: string | null;
  stylePreference?: string | null;
  subdomain?: string | null;
  tagline?: string | null;
  targetAudience?: string[] | null;
  templateKey?: string | null;
  tone?: string | null;
  whatsapp?: string | null;
};

const PROPERTY_TYPE_OPTIONS = [
  { label: "Apartments", value: "apartments" },
  { label: "Houses", value: "houses" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
  { label: "Luxury", value: "luxury" },
  { label: "Short-let", value: "shortlet" },
];

const CONTENT_FLAGS = [
  {
    description: "You have a logo file ready to upload.",
    label: "I have a logo",
    name: "hasLogo",
  },
  {
    description: "You have active property listings to add.",
    label: "I have listings ready",
    name: "hasListings",
  },
  {
    description: "You have written content such as an about section.",
    label: "I have existing written content",
    name: "hasExistingContent",
  },
  {
    description: "You have agent profiles to add to the site.",
    label: "I have agents to feature",
    name: "hasAgents",
  },
  {
    description: "You have completed projects or case studies.",
    label: "I have project case studies",
    name: "hasProjects",
  },
  {
    description: "You have client reviews or recommendations.",
    label: "I have testimonials",
    name: "hasTestimonials",
  },
  {
    description: "You plan to publish blog or market insight articles.",
    label: "I plan to publish blog content",
    name: "hasBlogContent",
  },
] as const;

const businessIdentitySchema = z.object({
  businessType: z.string(),
  primaryGoal: z.string(),
  tagline: z.string(),
});

const marketFocusSchema = z.object({
  market: z.string().trim().min(1, "Primary market is required."),
  locations: z.string(),
  propertyTypes: z.array(z.string()),
  targetAudience: z.array(z.string()),
});

const brandStyleSchema = z.object({
  preferredColorHint: z.string(),
  stylePreference: z.string(),
  tone: z.string(),
});

const contactOperationsSchema = z.object({
  contactEmail: z
    .string()
    .email("Enter a valid email address.")
    .or(z.literal("")),
  officeAddress: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
});

const contentReadinessSchema = z.object({
  hasAgents: z.boolean(),
  hasBlogContent: z.boolean(),
  hasExistingContent: z.boolean(),
  hasListings: z.boolean(),
  hasLogo: z.boolean(),
  hasProjects: z.boolean(),
  hasTestimonials: z.boolean(),
});

type BusinessIdentityValues = z.infer<typeof businessIdentitySchema>;
type MarketFocusValues = z.infer<typeof marketFocusSchema>;
type BrandStyleValues = z.infer<typeof brandStyleSchema>;
type ContactOperationsValues = z.infer<typeof contactOperationsSchema>;
type ContentReadinessValues = z.infer<typeof contentReadinessSchema>;

function StepActions({
  backPath,
  pending,
  quickFill,
  submitLabel = "Continue",
}: {
  backPath: string | null;
  pending: boolean;
  quickFill: () => void | Promise<void>;
  submitLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <DevOnboardingQuickFillButton onFill={quickFill} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={pending} type="submit">
          {pending ? "Saving..." : submitLabel}
        </Button>
        {backPath ? (
          <Button asChild variant="secondary">
            <Link href={backPath}>Back</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/sign-out">Cancel</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function saveStep(
  step: Exclude<StepId, "template-configuration">,
  nextStep: StepId,
  payload: Record<string, string | boolean | string[] | null>,
) {
  const formData = new FormData();
  formData.set("currentStep", step);
  formData.set("nextStep", nextStep);

  for (const [key, value] of Object.entries(payload)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
      continue;
    }

    if (typeof value === "boolean") {
      if (value) {
        formData.set(key, "on");
      }
      continue;
    }

    formData.set(key, value ?? "");
  }

  return saveOnboardingStepAction(formData);
}

export function BusinessIdentityStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboardingState | null;
}) {
  const [pending, startTransition] = useTransition();
  const form = useZodForm(businessIdentitySchema, {
    defaultValues: {
      businessType: saved?.businessType ?? "",
      primaryGoal: saved?.primaryGoal ?? "",
      tagline: saved?.tagline ?? "",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function onSubmit(values: BusinessIdentityValues) {
    startTransition(async () => {
      await saveStep("business-identity", nextStep, {
        businessType: values.businessType || null,
        primaryGoal: values.primaryGoal || null,
        tagline: values.tagline.trim() || null,
      });
    });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="businessType">Business type</FieldLabel>
          <Controller
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="businessType">
                  <SelectValue placeholder="Choose business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="residential-sales">
                      Residential Sales
                    </SelectItem>
                    <SelectItem value="residential-rentals">
                      Residential Rentals
                    </SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="mixed">Mixed / General</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldDescription>
            The primary category that best describes your real estate business.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="primaryGoal">Primary goal</FieldLabel>
          <Controller
            control={form.control}
            name="primaryGoal"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="primaryGoal">
                  <SelectValue placeholder="What do you want most from your site?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="generate-leads">
                      Generate leads
                    </SelectItem>
                    <SelectItem value="showcase-listings">
                      Showcase listings
                    </SelectItem>
                    <SelectItem value="build-brand">
                      Build brand authority
                    </SelectItem>
                    <SelectItem value="all-of-above">
                      All of the above
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="tagline">Tagline (optional)</FieldLabel>
          <Input
            id="tagline"
            placeholder="Your trusted real estate partner"
            {...form.register("tagline")}
          />
          <FieldDescription>
            A short phrase that will appear under your company name in hero
            sections.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={() => quickFill.onboardingBusinessIdentity()}
      />
    </form>
  );
}

export function MarketFocusStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboardingState | null;
}) {
  const [pending, startTransition] = useTransition();
  const form = useZodForm(marketFocusSchema, {
    defaultValues: {
      market: saved?.market ?? "",
      locations: saved?.locations?.join(", ") ?? "",
      propertyTypes: saved?.propertyTypes ?? [],
      targetAudience: saved?.targetAudience ?? [],
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function onSubmit(values: MarketFocusValues) {
    startTransition(async () => {
      await saveStep("market-focus", nextStep, {
        market: values.market.trim(),
        locations: values.locations.trim(),
        propertyTypes: values.propertyTypes,
        targetAudience: values.targetAudience,
      });
    });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="market">Primary market</FieldLabel>
          <Input
            id="market"
            placeholder="Lekki, Lagos"
            required
            {...form.register("market")}
          />
          <FieldDescription>
            The city or region you serve most. We use this in your website
            messaging and local SEO defaults.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="locations">Locations you serve</FieldLabel>
          <Input
            id="locations"
            placeholder="Lekki, Victoria Island, Ikoyi"
            {...form.register("locations")}
          />
          <FieldDescription>
            Comma-separated list of cities, neighbourhoods, or regions.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Property types</FieldLabel>
          <Controller
            control={form.control}
            name="propertyTypes"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PROPERTY_TYPE_OPTIONS.map((option) => {
                  const checked = field.value.includes(option.value);
                  const toggleOption = () => {
                    const nextValues = checked
                      ? field.value.filter((value) => value !== option.value)
                      : [...field.value, option.value];

                    field.onChange(nextValues);
                  };

                  return (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <input
                        checked={checked}
                        className="size-4 shrink-0 accent-primary"
                        onChange={toggleOption}
                        type="checkbox"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            )}
          />
          <FieldDescription>
            Select all property categories you handle. These guide which listing
            sections appear.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Target audience (optional)</FieldLabel>
          <Controller
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <TagInput onChange={field.onChange} value={field.value} />
            )}
          />
          <FieldDescription>
            Select from suggestions or type your own and press Enter.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={() => quickFill.onboardingMarketFocus()}
      />
    </form>
  );
}

export function BrandStyleStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboardingState | null;
}) {
  const [pending, startTransition] = useTransition();
  const form = useZodForm(brandStyleSchema, {
    defaultValues: {
      preferredColorHint: saved?.preferredColorHint ?? "",
      stylePreference: saved?.stylePreference ?? "",
      tone: saved?.tone ?? "",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function onSubmit(values: BrandStyleValues) {
    startTransition(async () => {
      await saveStep("brand-style", nextStep, {
        preferredColorHint: values.preferredColorHint.trim() || null,
        stylePreference: values.stylePreference || null,
        tone: values.tone || null,
      });
    });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="tone">Brand tone</FieldLabel>
          <Controller
            control={form.control}
            name="tone"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="tone">
                  <SelectValue placeholder="Choose a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">
                      Friendly & approachable
                    </SelectItem>
                    <SelectItem value="luxury">Luxury & exclusive</SelectItem>
                    <SelectItem value="modern">Modern & bold</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldDescription>
            Shapes the language and voice used in AI-generated copy.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="stylePreference">Visual style</FieldLabel>
          <Controller
            control={form.control}
            name="stylePreference"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" id="stylePreference">
                  <SelectValue placeholder="Choose a visual style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="minimal">Minimal & clean</SelectItem>
                    <SelectItem value="bold">Bold & expressive</SelectItem>
                    <SelectItem value="classic">Classic & timeless</SelectItem>
                    <SelectItem value="modern">Modern & geometric</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldDescription>
            Guides the spacing, typography weight, and layout density of your
            site.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="preferredColorHint">
            Colour preference (optional)
          </FieldLabel>
          <Input
            id="preferredColorHint"
            placeholder="Deep navy, warm gold, forest green..."
            {...form.register("preferredColorHint")}
          />
          <FieldDescription>
            A colour name or feeling — we&apos;ll translate it into a palette.
          </FieldDescription>
        </Field>
      </FieldGroup>
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={() => quickFill.onboardingBrandStyle()}
      />
    </form>
  );
}

export function ContactOperationsStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: StepId;
  saved: SavedOnboardingState | null;
}) {
  const [pending, startTransition] = useTransition();
  const form = useZodForm(contactOperationsSchema, {
    defaultValues: {
      contactEmail: saved?.contactEmail ?? "",
      officeAddress: saved?.officeAddress ?? "",
      phone: saved?.phone ?? "",
      whatsapp: saved?.whatsapp ?? "",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function onSubmit(values: ContactOperationsValues) {
    startTransition(async () => {
      await saveStep("contact-operations", nextStep, {
        contactEmail: values.contactEmail.trim() || null,
        officeAddress: values.officeAddress.trim() || null,
        phone: values.phone.trim() || null,
        whatsapp: values.whatsapp.trim() || null,
      });
    });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <Input
            id="phone"
            placeholder="+234 801 234 5678"
            type="tel"
            {...form.register("phone")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contactEmail">Business email</FieldLabel>
          <Input
            id="contactEmail"
            placeholder="hello@yourcompany.com"
            type="email"
            {...form.register("contactEmail")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="whatsapp">WhatsApp number (optional)</FieldLabel>
          <Input
            id="whatsapp"
            placeholder="+234 801 234 5678"
            type="tel"
            {...form.register("whatsapp")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="officeAddress">
            Office address (optional)
          </FieldLabel>
          <Textarea
            id="officeAddress"
            placeholder="5 Marina Road, Victoria Island, Lagos"
            rows={3}
            {...form.register("officeAddress")}
          />
        </Field>
      </FieldGroup>
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={() => quickFill.onboardingContactOperations()}
      />
    </form>
  );
}

export function ContentReadinessStepForm({
  companyName,
  backPath,
  saved,
  subdomain,
}: {
  companyName: string;
  backPath: string | null;
  saved: SavedOnboardingState | null;
  subdomain: string;
}) {
  const [pending, startTransition] = useTransition();
  const form = useZodForm(contentReadinessSchema, {
    defaultValues: {
      hasAgents: Boolean(saved?.hasAgents),
      hasBlogContent: Boolean(saved?.hasBlogContent),
      hasExistingContent: Boolean(saved?.hasExistingContent),
      hasListings: Boolean(saved?.hasListings),
      hasLogo: Boolean(saved?.hasLogo),
      hasProjects: Boolean(saved?.hasProjects),
      hasTestimonials: Boolean(saved?.hasTestimonials),
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function onSubmit(values: ContentReadinessValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("companyName", companyName);
      formData.set("subdomain", subdomain);

      for (const [key, value] of Object.entries(values)) {
        if (value) {
          formData.set(key, "on");
        }
      }

      await completeOnboardingAction(formData);
    });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-3">
        {CONTENT_FLAGS.map((flag) => (
          <Controller
            key={flag.name}
            control={form.control}
            name={flag.name}
            render={({ field }) => {
              const toggleFlag = () => field.onChange(!field.value);

              return (
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-4 py-3 text-left text-sm transition hover:border-primary">
                  <input
                    checked={field.value}
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                    onChange={toggleFlag}
                    type="checkbox"
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      {flag.label}
                    </span>
                    <span className="block text-muted-foreground">
                      {flag.description}
                    </span>
                  </span>
                </label>
              );
            }}
          />
        ))}
      </div>
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={() => quickFill.onboardingContentReadiness()}
        submitLabel="Open builder"
      />
    </form>
  );
}
