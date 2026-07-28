"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const departmentFormSchema = z.object({
  description: z.string().optional(),
  name: z.string().trim().min(1, "Department name is required."),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function DepartmentForm({ onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(departmentFormSchema, {
    defaultValues: {
      description: "",
      name: "",
    },
  });
  const createDepartmentMutation = useMutation(
    trpc.departments.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to add department.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.departments.list.infiniteQueryKey(),
        });
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: DepartmentFormValues) {
    setError(null);
    createDepartmentMutation.mutate({
      description: values.description?.trim() || null,
      name: values.name.trim(),
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
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
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={createDepartmentMutation.isPending}>
            Add department
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
