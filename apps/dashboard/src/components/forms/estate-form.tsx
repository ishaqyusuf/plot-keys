"use client";

import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const createEstateFormSchema = z.object({
  amenities: z.string().optional(),
  approvals: z.string().optional(),
  brochureUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  description: z.string().optional(),
  heroImageUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  landmarks: z.string().optional(),
  location: z.string().optional(),
  phaseLabel: z.string().optional(),
  specialPurposeUses: z.string().optional(),
  title: z.string().trim().min(1, "Estate name is required."),
});

type CreateEstateFormValues = z.infer<typeof createEstateFormSchema>;

const defaultValues: CreateEstateFormValues = {
  amenities: "",
  approvals: "",
  brochureUrl: "",
  description: "",
  heroImageUrl: "",
  landmarks: "",
  location: "",
  phaseLabel: "",
  specialPurposeUses: "",
  title: "",
};

type Props = {
  onSuccess?: () => void;
};

export function CreateEstateForm({ onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(createEstateFormSchema, {
    defaultValues,
  });
  const createEstateMutation = useMutation(
    trpc.estates.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to create estate launch.");
      },
      async onSuccess() {
        setError(null);
        form.reset(defaultValues);
        await queryClient.invalidateQueries({
          queryKey: trpc.estates.list.queryKey(),
        });
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: CreateEstateFormValues) {
    setError(null);
    createEstateMutation.mutate({
      amenities: values.amenities?.trim() || null,
      approvals: values.approvals?.trim() || null,
      brochureUrl: values.brochureUrl.trim() || null,
      description: values.description?.trim() || null,
      heroImageUrl: values.heroImageUrl.trim() || null,
      landmarks: values.landmarks?.trim() || null,
      location: values.location?.trim() || null,
      phaseLabel: values.phaseLabel?.trim() || null,
      publishState: "draft",
      specialPurposeUses: values.specialPurposeUses?.trim() || null,
      title: values.title.trim(),
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Estate name *</FieldLabel>
            <Input
              placeholder="e.g. Oakfield Gardens Phase 2"
              required
              {...form.register("title")}
            />
          </Field>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input
              placeholder="e.g. Hutu Abuja, Airport Road, Abuja"
              {...form.register("location")}
            />
          </Field>

          <Field>
            <FieldLabel>Landmarks</FieldLabel>
            <Input
              placeholder="e.g. Airport Road, Centenary City, NIPCO Filling Station"
              {...form.register("landmarks")}
            />
          </Field>

          <Field>
            <FieldLabel>Phase label</FieldLabel>
            <Input
              placeholder="e.g. Phase 2 presale"
              {...form.register("phaseLabel")}
            />
          </Field>

          <Field>
            <FieldLabel>Hero image URL</FieldLabel>
            <Input
              placeholder="https://..."
              type="url"
              {...form.register("heroImageUrl")}
            />
          </Field>

          <Field>
            <FieldLabel>Brochure / flyer URL</FieldLabel>
            <Input
              placeholder="https://..."
              type="url"
              {...form.register("brochureUrl")}
            />
          </Field>

          <Field>
            <FieldLabel>Presale description</FieldLabel>
            <Textarea
              placeholder="Summarize the estate, presale deal, payment plan, title, and buyer promise."
              rows={5}
              {...form.register("description")}
            />
          </Field>

          <Field>
            <FieldLabel>Amenities</FieldLabel>
            <Textarea
              placeholder="e.g. Golf course, artificial lakes, clubhouse, medical centre, solar streetlights"
              rows={3}
              {...form.register("amenities")}
            />
          </Field>

          <Field>
            <FieldLabel>Approvals / title</FieldLabel>
            <Input
              placeholder="e.g. FCDA approved, C of O, governor's consent"
              {...form.register("approvals")}
            />
          </Field>

          <Field>
            <FieldLabel>Special-purpose land</FieldLabel>
            <Textarea
              placeholder="e.g. Schools, clinics, worship centres, gas stations"
              rows={3}
              {...form.register("specialPurposeUses")}
            />
          </Field>
        </FieldGroup>
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="new-estate"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <SubmitButton isSubmitting={createEstateMutation.isPending}>
          Create launch
        </SubmitButton>
      </FormFooter>
    </form>
  );
}
