"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

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

const emptyProjectTypeValue = "none";

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function ProjectForm({ onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
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
  const createProjectMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to create project.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.projects.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.projects.stats.queryKey(),
          }),
        ]);
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: ProjectFormValues) {
    setError(null);
    createProjectMutation.mutate({
      code: values.code?.trim() || null,
      description: values.description?.trim() || null,
      location: values.location?.trim() || null,
      name: values.name.trim(),
      startDate: values.startDate?.trim() || null,
      targetCompletionDate: values.targetCompletionDate?.trim() || null,
      type: values.type || null,
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
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
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === emptyProjectTypeValue ? "" : value)
                  }
                  value={field.value || emptyProjectTypeValue}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={emptyProjectTypeValue}>
                      Select type
                    </SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="estate">Estate</SelectItem>
                    <SelectItem value="fit_out">Fit-out</SelectItem>
                    <SelectItem value="infrastructure">
                      Infrastructure
                    </SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="new-project"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={createProjectMutation.isPending}>
            Create project
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
