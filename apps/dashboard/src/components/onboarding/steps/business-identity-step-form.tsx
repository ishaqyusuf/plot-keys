"use client";

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
import { Controller } from "react-hook-form";
import { z } from "zod";

import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  type OnboardingStepId,
  type SavedOnboardingState,
  StepActions,
  useSaveOnboardingStep,
} from "./onboarding-step-shared";

const businessIdentitySchema = z.object({
  businessType: z.string(),
  primaryGoal: z.string(),
  tagline: z.string(),
});

type BusinessIdentityValues = z.infer<typeof businessIdentitySchema>;

export function BusinessIdentityStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: OnboardingStepId;
  saved: SavedOnboardingState | null;
}) {
  const { pending, saveStep } = useSaveOnboardingStep(
    "business-identity",
    nextStep,
  );
  const form = useZodForm(businessIdentitySchema, {
    defaultValues: {
      businessType: saved?.businessType ?? "",
      primaryGoal: saved?.primaryGoal ?? "",
      tagline: saved?.tagline ?? "",
    },
  });

  async function onSubmit(values: BusinessIdentityValues) {
    await saveStep({
      businessType: values.businessType || null,
      primaryGoal: values.primaryGoal || null,
      tagline: values.tagline.trim() || null,
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
        quickFill={
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="onboarding-business-identity"
          />
        }
      />
    </form>
  );
}
