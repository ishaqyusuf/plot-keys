"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { cn } from "@plotkeys/utils/cn";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { requestEarlyAccess } from "../app/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <Icon.Loader data-icon="inline-start" className="animate-spin" />
      ) : (
        <Icon.Sparkles data-icon="inline-start" />
      )}
      {pending ? "Submitting..." : "Request early access"}
    </Button>
  );
}

export function EarlyAccessForm({ className }: { className?: string }) {
  const [state, action] = useActionState(requestEarlyAccess, null);

  if (state?.success) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm",
          className,
        )}
      >
        <Icon.CheckCircle className="size-8 text-primary" />
        <p className="text-base font-medium text-foreground">
          {state.message}
        </p>
        <p className="text-sm text-muted-foreground">
          We will follow up with setup details if your team is a fit.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={cn(
        "flex flex-col gap-5 rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div>
        <p className="text-sm font-medium uppercase text-primary">
          Early access
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Request an invite for your company.
        </p>
      </div>

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="early-access-name">Name</FieldLabel>
          <Input
            id="early-access-name"
            name="name"
            placeholder="Your name"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="early-access-email">Work email</FieldLabel>
          <Input
            id="early-access-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
          <FieldDescription>
            Use the email you want tied to your workspace.
          </FieldDescription>
        </Field>
      </FieldGroup>

      {state?.message && !state.success && (
        <FieldError>{state.message}</FieldError>
      )}

      <SubmitBtn />
    </form>
  );
}
