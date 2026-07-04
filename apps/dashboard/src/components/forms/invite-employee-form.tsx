"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { EMPLOYEE_WORK_ROLE_VALUES, WORK_ROLE_LABELS } from "@plotkeys/utils";
import { useState } from "react";
import { z } from "zod";
import { inviteEmployeeAction } from "@/app/actions";
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

type InviteEmployeeFormProps = {
  onCancel?: () => void;
};

export function InviteEmployeeForm({ onCancel }: InviteEmployeeFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(inviteEmployeeFormSchema, {
    defaultValues: {
      email: "",
      workRole: "operations",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: InviteEmployeeFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("email", values.email.trim());
      formData.set("workRole", values.workRole);
      await inviteEmployeeAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
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
            <NativeSelect required {...form.register("workRole")}>
              {employeeWorkRoleOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={() => quickFill.inviteEmployee()} />
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
