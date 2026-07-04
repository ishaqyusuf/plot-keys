"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { Textarea } from "@plotkeys/ui/textarea";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { z } from "zod";
import { createAppointmentAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";

type RouterOutputs = inferRouterOutputs<AppRouter>;

type AgentOption = RouterOutputs["workspace"]["listAgents"]["data"][number];

type AppointmentFormProps = {
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

export function AppointmentForm({ agents, onCancel }: AppointmentFormProps) {
  const [pending, setPending] = useState(false);
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

  async function handleSubmit(values: AppointmentFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("name", values.name.trim());
      formData.set("email", values.email.trim());
      formData.set("phone", values.phone?.trim() ?? "");
      formData.set("scheduledAt", values.scheduledAt);
      formData.set("location", values.location?.trim() ?? "");
      formData.set("agentId", values.agentId ?? "");
      formData.set("notes", values.notes?.trim() ?? "");
      await createAppointmentAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
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
            <Input
              placeholder="Phone (optional)"
              {...form.register("phone")}
            />
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
              <NativeSelect {...form.register("agentId")}>
                <NativeSelectOption value="">
                  Assign agent (optional)
                </NativeSelectOption>
                {agents.map((agent) => (
                  <NativeSelectOption key={agent.id} value={agent.id}>
                    {agent.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
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
      </DashboardFormBody>

      <DashboardFormFooter>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
