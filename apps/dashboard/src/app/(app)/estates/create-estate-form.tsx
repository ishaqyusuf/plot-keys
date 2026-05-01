"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { Textarea } from "@plotkeys/ui/textarea";
import { useState } from "react";
import { z } from "zod";
import {
  DashboardSheetBody,
  DashboardSheetFooter,
  DashboardSheetHeader,
} from "../../../components/dashboard/dashboard-sheet-layout";
import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useZodForm } from "../../../hooks/use-zod-form";
import { createEstateAction } from "../../actions";

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

export function CreateEstateForm() {
  const [pending, setPending] = useState(false);
  const form = useZodForm(createEstateFormSchema, {
    defaultValues,
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: CreateEstateFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("title", values.title.trim());
      formData.set("location", values.location?.trim() ?? "");
      formData.set("phaseLabel", values.phaseLabel?.trim() ?? "");
      formData.set("heroImageUrl", values.heroImageUrl.trim());
      formData.set("brochureUrl", values.brochureUrl.trim());
      formData.set("description", values.description?.trim() ?? "");
      formData.set("landmarks", values.landmarks?.trim() ?? "");
      formData.set("amenities", values.amenities?.trim() ?? "");
      formData.set("approvals", values.approvals?.trim() ?? "");
      formData.set(
        "specialPurposeUses",
        values.specialPurposeUses?.trim() ?? "",
      );
      await createEstateAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">Create estate launch</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          title="Create estate launch"
          description="Group land listings into a presale campaign with launch copy, plan import, and purchase pipeline support."
        />

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <DashboardSheetBody>
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
          </DashboardSheetBody>

          <DashboardSheetFooter className="sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={() => quickFill.newEstate()} />
            <Button disabled={pending} type="submit">
              {pending ? "Creating..." : "Create launch"}
            </Button>
          </DashboardSheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
