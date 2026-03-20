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
import { createAgentAction, updateAgentAction } from "../../actions";

type Agent = {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number | null;
};

type AgentFormProps =
  | { mode: "create" }
  | { mode: "edit"; agent: Agent };

export function AgentForm(props: AgentFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const agent = props.mode === "edit" ? props.agent : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (props.mode === "edit") {
        await updateAgentAction(formData);
      } else {
        await createAgentAction(formData);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant={props.mode === "create" ? "default" : "outline"}>
          {props.mode === "create" ? "Add agent" : "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add agent" : "Edit agent"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {agent && (
            <input name="agentId" type="hidden" value={agent.id} />
          )}

          <FieldGroup>
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <Input
                defaultValue={agent?.name ?? ""}
                name="name"
                placeholder="e.g. Amara Okafor"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Job title</FieldLabel>
              <Input
                defaultValue={agent?.title ?? ""}
                name="title"
                placeholder="e.g. Senior Sales Agent"
              />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                defaultValue={agent?.email ?? ""}
                name="email"
                placeholder="amara@agency.com"
                type="email"
              />
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input
                defaultValue={agent?.phone ?? ""}
                name="phone"
                placeholder="+234 801 234 5678"
              />
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Input
                defaultValue={agent?.bio ?? ""}
                name="bio"
                placeholder="Short bio…"
              />
            </Field>

            <Field>
              <FieldLabel>Photo URL</FieldLabel>
              <Input
                defaultValue={agent?.imageUrl ?? ""}
                name="imageUrl"
                placeholder="https://…"
                type="url"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Display order</FieldLabel>
                <Input
                  defaultValue={agent?.displayOrder ?? ""}
                  min={0}
                  name="displayOrder"
                  placeholder="0"
                  type="number"
                />
              </Field>
              <Field>
                <FieldLabel>Featured</FieldLabel>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={agent?.featured ? "true" : "false"}
                  name="featured"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>
            </div>
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setOpen(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={pending} type="submit">
              {pending
                ? props.mode === "create"
                  ? "Adding…"
                  : "Saving…"
                : props.mode === "create"
                  ? "Add agent"
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
