"use client";

import type { AppRouter } from "@plotkeys/api/router";
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
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { formatCurrency, monthNames } from "@/components/payroll/payroll-utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type EmployeeOption = RouterOutputs["employees"]["list"]["data"][number];

type Props = {
  employees: EmployeeOption[];
  onCancel?: () => void;
  onSuccess?: () => void;
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

const emptyEmployeeValue = "none";

export function PayrollEntryForm({
  employees,
  onCancel,
  onSuccess,
  periodMonth,
  periodYear,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
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
  const createPayrollEntryMutation = useMutation(
    trpc.payroll.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to add payroll entry.");
      },
      async onSuccess(_, input) {
        setError(null);
        form.reset({
          employeeId: "",
          grossAmount: "",
          netAmount: "",
          notes: "",
          periodMonth: String(input.periodMonth),
          periodYear: String(input.periodYear),
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.payroll.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.payroll.summary.queryKey({
              periodMonth: input.periodMonth,
              periodYear: input.periodYear,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.payroll.periods.queryKey(),
          }),
        ]);
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: PayrollEntryFormValues) {
    setError(null);
    createPayrollEntryMutation.mutate({
      employeeId: values.employeeId,
      grossAmount: Number.parseInt(values.grossAmount, 10),
      netAmount: Number.parseInt(values.netAmount, 10),
      notes: values.notes?.trim() || null,
      periodMonth: Number.parseInt(values.periodMonth, 10),
      periodYear: Number.parseInt(values.periodYear, 10),
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Employee *</FieldLabel>
            <Controller
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === emptyEmployeeValue ? "" : value)
                  }
                  value={field.value || emptyEmployeeValue}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={emptyEmployeeValue}>
                      Select employee
                    </SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                        {employee.salaryAmount
                          ? ` (${formatCurrency(employee.salaryAmount)})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
              <Controller
                control={form.control}
                name="periodMonth"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((month, index) => (
                        <SelectItem key={month} value={String(index + 1)}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={createPayrollEntryMutation.isPending}
            disabled={!employees.length}
          >
            Add entry
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
