"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { useState } from "react";
import { z } from "zod";
import { createProjectAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";

const projectFormSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  name: z.string().trim().min(1, "Project name is required."),
  startDate: z.string().optional(),
  targetCompletionDate: z.string().optional(),
  type: z.enum([
    "",
    "building",
    "estate",
    "fit_out",
    "infrastructure",
    "renovation",
  ]),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  onCancel?: () => void;
};

export function ProjectForm({ onCancel }: ProjectFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(projectFormSchema, {
    defaultValues: {
      code: "",
      description: "",
      location: "",
      name: "",
      startDate: "",
      targetCompletionDate: "",
      type: "",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: ProjectFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("name", values.name.trim());
      formData.set("code", values.code?.trim() ?? "");
      formData.set("description", values.description?.trim() ?? "");
      formData.set("location", values.location?.trim() ?? "");
      formData.set("startDate", values.startDate?.trim() ?? "");
      formData.set(
        "targetCompletionDate",
        values.targetCompletionDate?.trim() ?? "",
      );
      formData.set("type", values.type);
      await createProjectAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Project name *</FieldLabel>
            <Input
              placeholder="e.g. Lekki Phase 2 Estate"
              required
              {...form.register("name")}
            />
          </Field>

          <Field>
            <FieldLabel>Project code</FieldLabel>
            <Input placeholder="e.g. LK-P2-001" {...form.register("code")} />
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <NativeSelect {...form.register("type")}>
              <NativeSelectOption value="">Select type</NativeSelectOption>
              <NativeSelectOption value="building">Building</NativeSelectOption>
              <NativeSelectOption value="estate">Estate</NativeSelectOption>
              <NativeSelectOption value="fit_out">Fit-out</NativeSelectOption>
              <NativeSelectOption value="infrastructure">
                Infrastructure
              </NativeSelectOption>
              <NativeSelectOption value="renovation">
                Renovation
              </NativeSelectOption>
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input
              placeholder="e.g. Lekki, Lagos"
              {...form.register("location")}
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Start date</FieldLabel>
              <Input type="date" {...form.register("startDate")} />
            </Field>

            <Field>
              <FieldLabel>Target completion</FieldLabel>
              <Input type="date" {...form.register("targetCompletionDate")} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input
              placeholder="Brief description"
              {...form.register("description")}
            />
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={() => quickFill.newProject()} />
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Creating..." : "Create project"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
