"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState } from "react";
import { z } from "zod";
import { createProjectAction } from "../../app/actions";
import { useZodForm } from "../../hooks/use-zod-form";
import { DevFormQuickFillButton } from "../dev/dev-form-quick-fill-button";
import { createQuickFillAdapter, QuickFill } from "../dev/quick-fill";

const createProjectFormSchema = z.object({
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

type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>;

const defaultValues: CreateProjectFormValues = {
  code: "",
  description: "",
  location: "",
  name: "",
  startDate: "",
  targetCompletionDate: "",
  type: "",
};

export function CreateProjectForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useZodForm(createProjectFormSchema, {
    defaultValues,
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: CreateProjectFormValues) {
    setError(null);
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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Project Name *</FieldLabel>
          <Input
            placeholder="e.g. Lekki Phase 2 Estate"
            required
            {...form.register("name")}
          />
        </Field>

        <Field>
          <FieldLabel>Project Code</FieldLabel>
          <Input placeholder="e.g. LK-P2-001" {...form.register("code")} />
        </Field>

        <Field>
          <FieldLabel>Type</FieldLabel>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...form.register("type")}
          >
            <option value="">Select type</option>
            <option value="building">Building</option>
            <option value="estate">Estate</option>
            <option value="fit_out">Fit-out</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="renovation">Renovation</option>
          </select>
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
          <Input
            placeholder="e.g. Lekki, Lagos"
            {...form.register("location")}
          />
        </Field>

        <Field>
          <FieldLabel>Start Date</FieldLabel>
          <Input type="date" {...form.register("startDate")} />
        </Field>

        <Field>
          <FieldLabel>Target Completion Date</FieldLabel>
          <Input type="date" {...form.register("targetCompletionDate")} />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Description</FieldLabel>
          <Input
            placeholder="Brief description of the project"
            {...form.register("description")}
          />
        </Field>
      </FieldGroup>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={() => quickFill.newProject()} />
        <div className="flex justify-end gap-3">
          <Button disabled={pending} type="submit">
            {pending ? "Creating…" : "Create Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
