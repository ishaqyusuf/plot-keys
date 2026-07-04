"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState } from "react";
import { z } from "zod";
import { createDepartmentAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";

const departmentFormSchema = z.object({
  description: z.string().optional(),
  name: z.string().trim().min(1, "Department name is required."),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

type DepartmentFormProps = {
  onCancel?: () => void;
};

export function DepartmentForm({ onCancel }: DepartmentFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(departmentFormSchema, {
    defaultValues: {
      description: "",
      name: "",
    },
  });

  async function handleSubmit(values: DepartmentFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("name", values.name.trim());
      formData.set("description", values.description?.trim() ?? "");
      await createDepartmentAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Department name *</FieldLabel>
            <Input
              placeholder="e.g. Sales"
              required
              {...form.register("name")}
            />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input
              placeholder="Optional description"
              {...form.register("description")}
            />
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Adding..." : "Add department"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
