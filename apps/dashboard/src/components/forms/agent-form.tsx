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
import { createAgentAction, updateAgentAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type AgentFormRecord =
  RouterOutputs["workspace"]["listAgents"]["data"][number];

type AgentFormProps =
  | { mode: "create"; agent?: never; onCancel?: () => void }
  | { mode: "edit"; agent: AgentFormRecord; onCancel?: () => void };

const agentFormSchema = z.object({
  bio: z.string().optional(),
  displayOrder: z.string().optional(),
  email: z.string().email("Enter a valid email address.").or(z.literal("")),
  featured: z.enum(["false", "true"]),
  imageUrl: z.string().url("Enter a valid URL.").or(z.literal("")),
  name: z.string().trim().min(1, "Name is required."),
  phone: z.string().optional(),
  title: z.string().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentForm(props: AgentFormProps) {
  const [pending, setPending] = useState(false);
  const agent = props.mode === "edit" ? props.agent : null;
  const form = useZodForm(agentFormSchema, {
    defaultValues: {
      bio: agent?.bio ?? "",
      displayOrder: agent?.displayOrder?.toString() ?? "",
      email: agent?.email ?? "",
      featured: agent?.featured ? "true" : "false",
      imageUrl: agent?.imageUrl ?? "",
      name: agent?.name ?? "",
      phone: agent?.phone ?? "",
      title: agent?.title ?? "",
    },
  });

  async function handleSubmit(values: AgentFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("name", values.name.trim());
      formData.set("title", values.title?.trim() ?? "");
      formData.set("bio", values.bio?.trim() ?? "");
      formData.set("email", values.email.trim());
      formData.set("phone", values.phone?.trim() ?? "");
      formData.set("imageUrl", values.imageUrl.trim());
      formData.set("featured", values.featured);
      formData.set("displayOrder", values.displayOrder?.trim() ?? "");

      if (props.mode === "edit") {
        formData.set("agentId", props.agent.id);
        await updateAgentAction(formData);
      } else {
        await createAgentAction(formData);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <Input
              placeholder="e.g. Amara Okafor"
              required
              {...form.register("name")}
            />
          </Field>

          <Field>
            <FieldLabel>Job title</FieldLabel>
            <Input
              placeholder="e.g. Senior Sales Agent"
              {...form.register("title")}
            />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              placeholder="amara@agency.com"
              type="email"
              {...form.register("email")}
            />
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input
              placeholder="+234 801 234 5678"
              {...form.register("phone")}
            />
          </Field>

          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea
              placeholder="Short bio..."
              rows={4}
              {...form.register("bio")}
            />
          </Field>

          <Field>
            <FieldLabel>Photo URL</FieldLabel>
            <Input
              placeholder="https://..."
              type="url"
              {...form.register("imageUrl")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Display order</FieldLabel>
              <Input
                min={0}
                placeholder="0"
                type="number"
                {...form.register("displayOrder")}
              />
            </Field>
            <Field>
              <FieldLabel>Featured</FieldLabel>
              <NativeSelect className="min-w-28" {...form.register("featured")}>
                <NativeSelectOption value="false">No</NativeSelectOption>
                <NativeSelectOption value="true">Yes</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <QuickFill
          args={{ form: createQuickFillAdapter(form) }}
          name="new-agent"
        />
        <div className="flex justify-end gap-3">
          <Button onClick={props.onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending
              ? props.mode === "create"
                ? "Adding..."
                : "Saving..."
              : props.mode === "create"
                ? "Add agent"
                : "Save changes"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
