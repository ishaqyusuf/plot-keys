"use client";

import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { useState } from "react";
import { z } from "zod";
import {
  DashboardSheetBody,
  DashboardSheetFooter,
  DashboardSheetHeader,
} from "../../../components/dashboard/dashboard-sheet-layout";
import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useZodForm } from "../../../hooks/use-zod-form";
import { inviteMemberAction } from "../../actions";

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

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const form = useZodForm(inviteMemberFormSchema, {
    defaultValues: {
      email: "",
      role: "staff",
    },
  });

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

  const quickFill = new QuickFill(createQuickFillAdapter(form));

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">Invite member</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Invite a teammate into the workspace with the right operational access level."
          title="Invite team member"
        />
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <DashboardSheetBody>
            <FieldGroup>
              <Field>
                <FieldLabel>Email address *</FieldLabel>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  required
                  {...form.register("email")}
                />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("role")}
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.description}
                    </option>
                  ))}
                </select>
              </Field>
            </FieldGroup>
          </DashboardSheetBody>
          <DashboardSheetFooter className="sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={() => quickFill.inviteMember()} />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button disabled={pending} type="submit">
                {pending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </DashboardSheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
