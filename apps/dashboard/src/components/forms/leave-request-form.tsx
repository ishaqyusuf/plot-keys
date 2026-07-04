"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { z } from "zod";
import { createLeaveRequestAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { leaveTypeLabels } from "@/components/leave-requests/leave-request-utils";
import { useZodForm } from "@/hooks/use-zod-form";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type EmployeeOption =
  RouterOutputs["workspace"]["listEmployees"]["data"][number];

type LeaveRequestFormProps = {
  employees: EmployeeOption[];
  onCancel?: () => void;
};

const leaveTypeValues = [
  "annual",
  "compassionate",
  "maternity",
  "paternity",
  "sick",
  "unpaid",
] as const;

const leaveRequestFormSchema = z.object({
  employeeId: z.string().trim().min(1, "Select an employee."),
  endDate: z.string().trim().min(1, "End date is required."),
  leaveType: z.enum(leaveTypeValues),
  reason: z.string().optional(),
  startDate: z.string().trim().min(1, "Start date is required."),
});

type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema>;

export function LeaveRequestForm({
  employees,
  onCancel,
}: LeaveRequestFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(leaveRequestFormSchema, {
    defaultValues: {
      employeeId: "",
      endDate: "",
      leaveType: "annual",
      reason: "",
      startDate: "",
    },
  });

  async function handleSubmit(values: LeaveRequestFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("employeeId", values.employeeId);
      formData.set("leaveType", values.leaveType);
      formData.set("startDate", values.startDate);
      formData.set("endDate", values.endDate);
      formData.set("reason", values.reason?.trim() ?? "");
      await createLeaveRequestAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Employee *</FieldLabel>
            <NativeSelect required {...form.register("employeeId")}>
              <NativeSelectOption value="">Select employee</NativeSelectOption>
              {employees.map((employee) => (
                <NativeSelectOption key={employee.id} value={employee.id}>
                  {employee.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel>Leave type *</FieldLabel>
            <NativeSelect required {...form.register("leaveType")}>
              {leaveTypeValues.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {leaveTypeLabels[value]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Start date *</FieldLabel>
              <Input required type="date" {...form.register("startDate")} />
            </Field>
            <Field>
              <FieldLabel>End date *</FieldLabel>
              <Input required type="date" {...form.register("endDate")} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Reason</FieldLabel>
            <Input
              placeholder="Optional reason for leave"
              {...form.register("reason")}
            />
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending || !employees.length} type="submit">
            {pending ? "Submitting..." : "Submit request"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
