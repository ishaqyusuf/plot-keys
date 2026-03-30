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
import { useState } from "react";
import { z } from "zod";
import { DevFormQuickFillButton } from "../../../components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "../../../components/dev/quick-fill";
import { useZodForm } from "../../../hooks/use-zod-form";
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

type AgentFormProps = { mode: "create" } | { mode: "edit"; agent: Agent };

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
  const [open, setOpen] = useState(false);
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
        formData.set("agentId", agent!.id);
        await updateAgentAction(formData);
      } else {
        await createAgentAction(formData);
      }
    } finally {
      setPending(false);
    }
  }

  const quickFill = new QuickFill(createQuickFillAdapter(form));

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={props.mode === "create" ? "default" : "outline"}
        >
          {props.mode === "create" ? "Add agent" : "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add agent" : "Edit agent"}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
              <Input placeholder="Short bio…" {...form.register("bio")} />
            </Field>

            <Field>
              <FieldLabel>Photo URL</FieldLabel>
              <Input
                placeholder="https://…"
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
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("featured")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>
            </div>
          </FieldGroup>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <DevFormQuickFillButton onFill={() => quickFill.newAgent()} />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
              >
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
