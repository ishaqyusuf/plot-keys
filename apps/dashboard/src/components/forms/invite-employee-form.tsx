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
import { EMPLOYEE_WORK_ROLE_VALUES, WORK_ROLE_LABELS } from "@plotkeys/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const employeeWorkRoleOptions = EMPLOYEE_WORK_ROLE_VALUES.map((value) => ({
  label: WORK_ROLE_LABELS[value],
  value,
}));

const inviteEmployeeFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  workRole: z
    .string()
    .refine((value) => EMPLOYEE_WORK_ROLE_VALUES.includes(value as never), {
      message: "Choose a valid role.",
    }),
});

type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeFormSchema>;
type EmployeeWorkRole = (typeof EMPLOYEE_WORK_ROLE_VALUES)[number];

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function InviteEmployeeForm({ onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(inviteEmployeeFormSchema, {
    defaultValues: {
      email: "",
      workRole: "operations",
    },
  });
  const inviteEmployeeMutation = useMutation(
    trpc.team.inviteMember.mutationOptions({
      onError(error) {
        setError(error.message || "Failed to send invite.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.team.listInvites.queryKey(),
        });
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: InviteEmployeeFormValues) {
    setError(null);
    inviteEmployeeMutation.mutate({
      email: values.email.trim(),
      role: "staff",
      workRole: values.workRole as EmployeeWorkRole,
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Email address *</FieldLabel>
            <Input
              placeholder="employee@company.com"
              required
              type="email"
              {...form.register("email")}
            />
          </Field>

          <Field>
            <FieldLabel>Role *</FieldLabel>
            <Controller
              control={form.control}
              name="workRole"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeWorkRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </FieldGroup>
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="invite-employee"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={inviteEmployeeMutation.isPending}>
            Send invite
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
