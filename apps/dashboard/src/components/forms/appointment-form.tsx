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
import { Textarea } from "@plotkeys/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type AgentOption = RouterOutputs["agents"]["list"]["data"][number];

type Props = {
  agents: AgentOption[];
  onCancel?: () => void;
};

const appointmentFormSchema = z.object({
  agentId: z.string().optional(),
  email: z.string().email("Enter a valid email address."),
  location: z.string().optional(),
  name: z.string().trim().min(1, "Visitor name is required."),
  notes: z.string().optional(),
  phone: z.string().optional(),
  scheduledAt: z.string().trim().min(1, "Scheduled time is required."),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const emptyAgentValue = "none";

export function AppointmentForm({ agents, onCancel }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(appointmentFormSchema, {
    defaultValues: {
      agentId: "",
      email: "",
      location: "",
      name: "",
      notes: "",
      phone: "",
      scheduledAt: "",
    },
  });
  const createAppointmentMutation = useMutation(
    trpc.appointments.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to schedule appointment.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.appointments.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.appointments.stats.queryKey(),
          }),
        ]);
        onCancel?.();
      },
    }),
  );

  function handleSubmit(values: AppointmentFormValues) {
    setError(null);
    createAppointmentMutation.mutate({
      agentId: values.agentId || undefined,
      email: values.email.trim(),
      location: values.location?.trim() || undefined,
      name: values.name.trim(),
      notes: values.notes?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Visitor name *</FieldLabel>
            <Input
              placeholder="Visitor name"
              required
              {...form.register("name")}
            />
          </Field>

          <Field>
            <FieldLabel>Email *</FieldLabel>
            <Input
              placeholder="visitor@example.com"
              required
              type="email"
              {...form.register("email")}
            />
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input placeholder="Phone (optional)" {...form.register("phone")} />
          </Field>

          <Field>
            <FieldLabel>Scheduled time *</FieldLabel>
            <Input
              required
              type="datetime-local"
              {...form.register("scheduledAt")}
            />
          </Field>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input
              placeholder="Location (optional)"
              {...form.register("location")}
            />
          </Field>

          {agents.length ? (
            <Field>
              <FieldLabel>Assign agent</FieldLabel>
              <Controller
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === emptyAgentValue ? "" : value)
                    }
                    value={field.value || emptyAgentValue}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Assign agent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={emptyAgentValue}>
                        Assign agent (optional)
                      </SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              placeholder="Notes (optional)"
              rows={3}
              {...form.register("notes")}
            />
          </Field>
        </FieldGroup>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </FormBody>

      <FormFooter>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={createAppointmentMutation.isPending}>
            Schedule
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
