"use client";

import { Checkbox } from "@plotkeys/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { TagInput } from "@/components/tag-input";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  type OnboardingStepId,
  type SavedOnboardingState,
  StepActions,
  useSaveOnboardingStep,
} from "./onboarding-step-shared";

const propertyTypeOptions = [
  { label: "Apartments", value: "apartments" },
  { label: "Houses", value: "houses" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
  { label: "Luxury", value: "luxury" },
  { label: "Short-let", value: "shortlet" },
];

const marketFocusSchema = z.object({
  market: z.string().trim().min(1, "Primary market is required."),
  locations: z.string(),
  propertyTypes: z.array(z.string()),
  targetAudience: z.array(z.string()),
});

type MarketFocusValues = z.infer<typeof marketFocusSchema>;

export function MarketFocusStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: OnboardingStepId;
  saved: SavedOnboardingState | null;
}) {
  const { pending, saveStep } = useSaveOnboardingStep("market-focus", nextStep);
  const form = useZodForm(marketFocusSchema, {
    defaultValues: {
      market: saved?.market ?? "",
      locations: saved?.locations?.join(", ") ?? "",
      propertyTypes: saved?.propertyTypes ?? [],
      targetAudience: saved?.targetAudience ?? [],
    },
  });

  async function onSubmit(values: MarketFocusValues) {
    await saveStep({
      locations: values.locations
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      market: values.market.trim(),
      propertyTypes: values.propertyTypes,
      targetAudience: values.targetAudience,
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
                {propertyTypeOptions.map((option) => {
                  const checked = field.value.includes(option.value);
                  const checkboxId = `property-type-${option.value}`;
                  const updateOption = (nextChecked: boolean) => {
                    const nextValues = nextChecked
                      ? Array.from(new Set([...field.value, option.value]))
                      : field.value.filter((value) => value !== option.value);

                    field.onChange(nextValues);
                  };

                  return (
                    <label
                      key={option.value}
                      htmlFor={checkboxId}
                      className="flex cursor-pointer items-center gap-2 border border-border bg-background px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={(nextChecked) =>
                          updateOption(nextChecked === true)
                        }
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
        quickFill={
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="onboarding-market-focus"
          />
        }
      />
    </form>
  );
}
