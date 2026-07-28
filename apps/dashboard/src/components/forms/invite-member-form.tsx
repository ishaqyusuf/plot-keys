"use client";

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
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const roleOptions = [
  { value: "admin", label: "Admin", description: "Full access except billing" },
  {
    value: "agent",
    label: "Agent",
    description: "Listings, leads & appointments",
  },
  { value: "staff", label: "Staff", description: "Read-only access" },
] as const;

const inviteMemberFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  role: z.enum(["admin", "agent", "staff"]),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function InviteMemberForm({ onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(inviteMemberFormSchema, {
    defaultValues: {
      email: "",
      role: "staff",
    },
  });
  const inviteMemberMutation = useMutation(
    trpc.team.inviteMember.mutationOptions({
      onError(error) {
        setError(error.message || "Failed to send invite.");
      },
      async onSuccess() {
        setError(null);
        form.reset();
        await queryClient.invalidateQueries({
          queryKey: trpc.team.listInvites.queryKey(),
        });
        onSuccess?.();
      },
    }),
  );

  function handleSubmit(values: InviteMemberFormValues) {
    setError(null);
    inviteMemberMutation.mutate({
      email: values.email.trim(),
      role: values.role,
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Email address *</FieldLabel>
            <Input
              placeholder="colleague@company.com"
              required
              type="email"
              {...form.register("email")}
            />
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </FieldGroup>
      </FormBody>

      <FormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="invite-member"
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <SubmitButton isSubmitting={inviteMemberMutation.isPending}>
            Send invite
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
