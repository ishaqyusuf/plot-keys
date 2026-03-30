"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { EMPLOYEE_WORK_ROLE_VALUES, WORK_ROLE_LABELS } from "@plotkeys/utils";
import { useState } from "react";
import { z } from "zod";

import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useZodForm } from "../../../hooks/use-zod-form";
import { inviteEmployeeAction } from "../../actions";

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

export function EmployeeInviteForm() {
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
    <form
      className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem_auto]"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div>
        <Label htmlFor="employee-email">Email address</Label>
        <Input
          id="employee-email"
          placeholder="employee@company.com"
          required
          type="email"
          {...form.register("email")}
        />
      </div>
      <div>
        <Label htmlFor="employee-work-role">Role</Label>
        <select
          id="employee-work-role"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          {...form.register("workRole")}
        >
          {employeeWorkRoleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <div className="flex gap-2">
          <DevFormQuickFillButton onFill={() => quickFill.inviteEmployee()} />
          <Button disabled={pending} type="submit">
            {pending ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </div>
    </form>
  );
}
