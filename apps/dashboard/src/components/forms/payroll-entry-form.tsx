"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { z } from "zod";
import { createPayrollEntryAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { formatCurrency, monthNames } from "@/components/payroll/payroll-utils";
import { useZodForm } from "@/hooks/use-zod-form";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type EmployeeOption =
  RouterOutputs["workspace"]["listEmployees"]["data"][number];

type PayrollEntryFormProps = {
  employees: EmployeeOption[];
  onCancel?: () => void;
  periodMonth: number;
  periodYear: number;
};

const payrollEntryFormSchema = z.object({
  employeeId: z.string().trim().min(1, "Select an employee."),
  grossAmount: z.string().trim().min(1, "Gross amount is required."),
  netAmount: z.string().trim().min(1, "Net amount is required."),
  notes: z.string().optional(),
  periodMonth: z.string().trim().min(1, "Month is required."),
  periodYear: z.string().trim().min(1, "Year is required."),
});

type PayrollEntryFormValues = z.infer<typeof payrollEntryFormSchema>;

export function PayrollEntryForm({
  employees,
  onCancel,
  periodMonth,
  periodYear,
}: PayrollEntryFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(payrollEntryFormSchema, {
    defaultValues: {
      employeeId: "",
      grossAmount: "",
      netAmount: "",
      notes: "",
      periodMonth: String(periodMonth),
      periodYear: String(periodYear),
    },
  });

  async function handleSubmit(values: PayrollEntryFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("employeeId", values.employeeId);
      formData.set("periodYear", values.periodYear);
      formData.set("periodMonth", values.periodMonth);
      formData.set("grossAmount", values.grossAmount);
      formData.set("netAmount", values.netAmount);
      formData.set("notes", values.notes?.trim() ?? "");
      await createPayrollEntryAction(formData);
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
                  {employee.salaryAmount
                    ? ` (${formatCurrency(employee.salaryAmount)})`
                    : ""}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Year *</FieldLabel>
              <Input
                max={2100}
                min={2020}
                required
                type="number"
                {...form.register("periodYear")}
              />
            </Field>
            <Field>
              <FieldLabel>Month *</FieldLabel>
              <NativeSelect required {...form.register("periodMonth")}>
                {monthNames.map((month, index) => (
                  <NativeSelectOption key={month} value={String(index + 1)}>
                    {month}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Gross amount *</FieldLabel>
              <Input
                placeholder="0"
                required
                type="number"
                {...form.register("grossAmount")}
              />
            </Field>
            <Field>
              <FieldLabel>Net amount *</FieldLabel>
              <Input
                placeholder="0"
                required
                type="number"
                {...form.register("netAmount")}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Input placeholder="Optional notes" {...form.register("notes")} />
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending || !employees.length} type="submit">
            {pending ? "Adding..." : "Add entry"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
