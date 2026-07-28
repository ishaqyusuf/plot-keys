"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";

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

type Props = {
  disabled?: boolean;
};

export function ConnectDomainForm({ disabled }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useZodForm(connectDomainFormSchema, {
    defaultValues: {
      hostname: "",
    },
  });
  const connectDomainMutation = useMutation(
    trpc.domains.connect.mutationOptions({
      onError(error) {
        setError(error.message || "Failed to connect domain.");
      },
      async onSuccess() {
        setError(null);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.domains.status.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.domains.dnsInstructions.queryKey(),
          }),
        ]);
        router.push("/domains");
      },
    }),
  );

  function handleSubmit(values: ConnectDomainFormValues) {
    setError(null);
    connectDomainMutation.mutate({ hostname: values.hostname.trim() });
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
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuickFill
          args={{ form: createQuickFillAdapter(form) }}
          name="connect-domain"
        />
        <div className="flex flex-wrap items-center justify-end gap-3">
          <SubmitButton
            disabled={disabled}
            isSubmitting={connectDomainMutation.isPending}
          >
            Connect domain
          </SubmitButton>
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
