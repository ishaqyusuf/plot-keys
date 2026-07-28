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

const brandStyleSchema = z.object({
  preferredColorHint: z.string(),
  stylePreference: z.string(),
  tone: z.string(),
});

type BrandStyleValues = z.infer<typeof brandStyleSchema>;

export function BrandStyleStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: OnboardingStepId;
  saved: SavedOnboardingState | null;
}) {
  const { pending, saveStep } = useSaveOnboardingStep("brand-style", nextStep);
  const form = useZodForm(brandStyleSchema, {
    defaultValues: {
      preferredColorHint: saved?.preferredColorHint ?? "",
      stylePreference: saved?.stylePreference ?? "",
      tone: saved?.tone ?? "",
    },
  });

  async function onSubmit(values: BrandStyleValues) {
    await saveStep({
      preferredColorHint: values.preferredColorHint.trim() || null,
      stylePreference: values.stylePreference || null,
      tone: values.tone || null,
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
        quickFill={
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="onboarding-brand-style"
          />
        }
      />
    </form>
  );
}
