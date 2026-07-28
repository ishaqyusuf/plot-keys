"use client";

import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import { z } from "zod";

import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  type OnboardingStepId,
  type SavedOnboardingState,
  StepActions,
  useSaveOnboardingStep,
} from "./onboarding-step-shared";

const contactOperationsSchema = z.object({
  contactEmail: z
    .string()
    .email("Enter a valid email address.")
    .or(z.literal("")),
  officeAddress: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
});

type ContactOperationsValues = z.infer<typeof contactOperationsSchema>;

export function ContactOperationsStepForm({
  backPath,
  nextStep,
  saved,
}: {
  backPath: string | null;
  nextStep: OnboardingStepId;
  saved: SavedOnboardingState | null;
}) {
  const { pending, saveStep } = useSaveOnboardingStep(
    "contact-operations",
    nextStep,
  );
  const form = useZodForm(contactOperationsSchema, {
    defaultValues: {
      contactEmail: saved?.contactEmail ?? "",
      officeAddress: saved?.officeAddress ?? "",
      phone: saved?.phone ?? "",
      whatsapp: saved?.whatsapp ?? "",
    },
  });

  async function onSubmit(values: ContactOperationsValues) {
    await saveStep({
      contactEmail: values.contactEmail.trim() || null,
      officeAddress: values.officeAddress.trim() || null,
      phone: values.phone.trim() || null,
      whatsapp: values.whatsapp.trim() || null,
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
        quickFill={
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="onboarding-contact-operations"
          />
        }
      />
    </form>
  );
}
