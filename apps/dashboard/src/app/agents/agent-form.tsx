"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@plotkeys/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { Textarea } from "@plotkeys/ui/textarea";
import { type ReactNode, useState } from "react";

type AgentData = {
  bio?: string | null;
  displayOrder?: number;
  email?: string | null;
  id?: string;
  imageUrl?: string | null;
  name: string;
  phone?: string | null;
  title?: string | null;
};

type AgentFormProps = {
  initialData?: AgentData | null;
  onSave: (formData: FormData) => Promise<void>;
  trigger?: ReactNode;
};

export function AgentForm({ initialData, onSave, trigger }: AgentFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (initialData?.id) fd.set("agentId", initialData.id);
      await onSave(fd);
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">Add agent</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit agent" : "Add agent"}</DialogTitle>
          <DialogDescription>
            Agents are shown in the team section of your website.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {isEdit && <input type="hidden" name="_method" value="update" />}
          <FieldGroup className="space-y-4 py-2">
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <Input
                defaultValue={initialData?.name ?? ""}
                name="name"
                placeholder="Jane Okonkwo"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Title / Role</FieldLabel>
              <Input
                defaultValue={initialData?.title ?? ""}
                name="title"
                placeholder="Senior Sales Agent"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  defaultValue={initialData?.email ?? ""}
                  name="email"
                  placeholder="jane@example.com"
                  type="email"
                />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input
                  defaultValue={initialData?.phone ?? ""}
                  name="phone"
                  placeholder="+234 800 000 0000"
                  type="tel"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea
                defaultValue={initialData?.bio ?? ""}
                name="bio"
                placeholder="A brief introduction…"
                rows={3}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Photo URL</FieldLabel>
                <Input
                  defaultValue={initialData?.imageUrl ?? ""}
                  name="imageUrl"
                  placeholder="https://..."
                  type="url"
                />
              </Field>
              <Field>
                <FieldLabel>Display order</FieldLabel>
                <Input
                  defaultValue={initialData?.displayOrder ?? 0}
                  min="0"
                  name="displayOrder"
                  placeholder="0"
                  type="number"
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
