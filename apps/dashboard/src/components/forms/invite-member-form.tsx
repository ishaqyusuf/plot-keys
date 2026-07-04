"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { NativeSelect, NativeSelectOption } from "@plotkeys/ui/native-select";
import { useState } from "react";
import { z } from "zod";
import { inviteMemberAction } from "@/app/actions";
import {
  DashboardFormBody,
  DashboardFormFooter,
} from "@/components/forms/form-layout";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";

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

type InviteMemberFormProps = {
  onCancel?: () => void;
};

export function InviteMemberForm({ onCancel }: InviteMemberFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(inviteMemberFormSchema, {
    defaultValues: {
      email: "",
      role: "staff",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: InviteMemberFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("email", values.email.trim());
      formData.set("role", values.role);
      await inviteMemberAction(formData);
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
              placeholder="colleague@company.com"
              required
              type="email"
              {...form.register("email")}
            />
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <NativeSelect className="w-full" {...form.register("role")}>
              {roleOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
        </FieldGroup>
      </DashboardFormBody>

      <DashboardFormFooter className="sm:flex-row sm:items-center sm:justify-between">
        <DevFormQuickFillButton onFill={() => quickFill.inviteMember()} />
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
