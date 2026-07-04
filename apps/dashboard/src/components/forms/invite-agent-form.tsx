"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState } from "react";
import { z } from "zod";
import { inviteAgentAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { useZodForm } from "@/hooks/use-zod-form";

const inviteAgentFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type InviteAgentFormValues = z.infer<typeof inviteAgentFormSchema>;

type InviteAgentFormProps = {
  onCancel?: () => void;
};

export function InviteAgentForm({ onCancel }: InviteAgentFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(inviteAgentFormSchema, {
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: InviteAgentFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("email", values.email.trim());
      await inviteAgentAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <DashboardFormBody>
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
      </DashboardFormBody>

      <DashboardFormFooter>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="ghost">
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </DashboardFormFooter>
    </form>
  );
}
