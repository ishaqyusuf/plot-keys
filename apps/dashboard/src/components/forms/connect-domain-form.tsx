"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useState } from "react";
import { z } from "zod";

import { connectCustomDomainAction } from "@/app/actions";
import { DevFormQuickFillButton } from "@/components/dev/dev-form-quick-fill-button";
import {
  createQuickFillAdapter,
  QuickFill,
} from "@/components/dev/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";

const connectDomainFormSchema = z.object({
  hostname: z
    .string()
    .trim()
    .min(4, "Enter a full domain name.")
    .max(253, "Domain names must be 253 characters or fewer.")
    .refine((value) => !/^https?:\/\//i.test(value), {
      message: "Enter the hostname without http:// or https://.",
    })
    .refine((value) => !value.toLowerCase().startsWith("www."), {
      message: "Enter the root hostname without www.",
    }),
});

type ConnectDomainFormValues = z.infer<typeof connectDomainFormSchema>;

type ConnectDomainFormProps = {
  disabled?: boolean;
};

export function ConnectDomainForm({ disabled }: ConnectDomainFormProps) {
  const [pending, setPending] = useState(false);
  const form = useZodForm(connectDomainFormSchema, {
    defaultValues: {
      hostname: "",
    },
  });
  const quickFill = new QuickFill(createQuickFillAdapter(form));

  async function handleSubmit(values: ConnectDomainFormValues) {
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("hostname", values.hostname.trim());
      await connectCustomDomainAction(formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="hostname">Hostname</FieldLabel>
          <Input
            autoFocus
            id="hostname"
            placeholder="example.com or example.com.ng"
            required
            {...form.register("hostname")}
          />
          <FieldDescription>
            Enter the full domain name without <code>http://</code> or{" "}
            <code>www</code>. Example: <code>myrealestate.com.ng</code>.
          </FieldDescription>
          {form.formState.errors.hostname?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.hostname.message}
            </p>
          ) : null}
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <DevFormQuickFillButton
          onFill={() => quickFill.fill("connect-domain")}
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button disabled={disabled || pending} type="submit">
            {pending ? "Connecting..." : "Connect domain"}
          </Button>
          {disabled ? (
            <p className="text-xs text-muted-foreground">
              Vercel integration must be configured before domain provisioning
              can start.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
