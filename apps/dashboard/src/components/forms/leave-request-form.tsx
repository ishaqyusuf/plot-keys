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
import { leaveTypeLabels } from "@/components/leave-requests/leave-request-utils";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type EmployeeOption = RouterOutputs["employees"]["list"]["data"][number];

type Props = {
  employees: EmployeeOption[];
  onCancel?: () => void;
  onSuccess?: () => void;
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

const emptyEmployeeValue = "none";

export function LeaveRequestForm({ employees, onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(leaveRequestFormSchema, {
    defaultValues: {
      employeeId: "",
      endDate: "",
      leaveType: "annual",
      reason: "",
      startDate: "",
    },
  });
  const createLeaveRequestMutation = useMutation(
    trpc.leaveRequests.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to submit leave request.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.leaveRequests.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.leaveRequests.stats.queryKey(),
          }),
        ]);
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: LeaveRequestFormValues) {
    setError(null);
    createLeaveRequestMutation.mutate({
      employeeId: values.employeeId,
      endDate: values.endDate,
      leaveType: values.leaveType,
      reason: values.reason?.trim() || null,
      startDate: values.startDate,
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
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <FieldLabel>Leave type *</FieldLabel>
            <Controller
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypeValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {leaveTypeLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
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
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={createLeaveRequestMutation.isPending}
            disabled={!employees.length}
          >
            Submit request
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
