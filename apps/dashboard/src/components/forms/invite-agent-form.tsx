"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { FormBody, FormFooter } from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

const inviteAgentFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type InviteAgentFormValues = z.infer<typeof inviteAgentFormSchema>;

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function InviteAgentForm({ onCancel, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(inviteAgentFormSchema, {
    defaultValues: {
      email: "",
    },
  });
  const inviteAgentMutation = useMutation(
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

  function handleSubmit(values: InviteAgentFormValues) {
    setError(null);
    inviteAgentMutation.mutate({
      email: values.email.trim(),
      role: "agent",
    });
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FormBody>
        <FieldGroup>
          <Field>
            <FieldLabel>Email address *</FieldLabel>
            <Input
              placeholder="agent@company.com"
              required
              type="email"
              {...form.register("email")}
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
          <SubmitButton isSubmitting={inviteAgentMutation.isPending}>
            Send invite
          </SubmitButton>
        </div>
      </FormFooter>
    </form>
  );
}
