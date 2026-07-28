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
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type AgentFormRecord = RouterOutputs["agents"]["list"]["data"][number];

type Props =
  | {
      mode: "create";
      agent?: never;
      onCancel?: () => void;
      onSuccess?: () => void;
    }
  | {
      mode: "edit";
      agent: AgentFormRecord;
      onCancel?: () => void;
      onSuccess?: () => void;
    };

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

export function AgentForm(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
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
  const createAgentMutation = useMutation(
    trpc.agents.create.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to create agent.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.agents.list.infiniteQueryKey(),
        });
        props.onSuccess?.();
      },
    }),
  );
  const updateAgentMutation = useMutation(
    trpc.agents.update.mutationOptions({
      onError(error) {
        setError(error.message || "Unable to update agent.");
      },
      async onSuccess(_, input) {
        setError(null);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.agents.list.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.agents.get.queryKey({
              agentId: input.agentId,
            }),
          }),
        ]);
        props.onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: AgentFormValues) {
    setError(null);
    const payload = {
      bio: values.bio?.trim() || null,
      displayOrder: values.displayOrder
        ? Number.parseInt(values.displayOrder, 10)
        : null,
      email: values.email.trim() || null,
      featured: values.featured === "true",
      imageUrl: values.imageUrl.trim() || null,
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
      title: values.title?.trim() || null,
    };

    if (props.mode === "edit") {
      updateAgentMutation.mutate({
        agentId: props.agent.id,
        ...payload,
      });
      return;
    }

    createAgentMutation.mutate(payload);
  }

  const isPending =
    createAgentMutation.isPending || updateAgentMutation.isPending;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
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
              <Controller
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="min-w-28">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </FieldGroup>
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="new-agent"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={props.onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={isPending}>
            {props.mode === "create" ? "Add agent" : "Save changes"}
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
