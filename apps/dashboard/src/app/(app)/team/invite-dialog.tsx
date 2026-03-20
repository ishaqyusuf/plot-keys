"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState, useTransition } from "react";
import { inviteMemberAction } from "../../actions";

const roleOptions = [
  { value: "admin", label: "Admin", description: "Full access except billing" },
  { value: "agent", label: "Agent", description: "Listings, leads & appointments" },
  { value: "staff", label: "Staff", description: "Read-only access" },
] as const;

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await inviteMemberAction(formData);
      setOpen(false);
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">Invite member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Email address *</FieldLabel>
              <Input
                name="email"
                type="email"
                placeholder="colleague@company.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                name="role"
                defaultValue="staff"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.description}
                  </option>
                ))}
              </select>
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setOpen(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={pending} type="submit">
              {pending ? "Sending…" : "Send invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
