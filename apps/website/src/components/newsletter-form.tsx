"use client";

import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { cn } from "@plotkeys/utils/cn";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { subscribeNewsletter } from "../app/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? (
        <Icon.Loader data-icon="inline-start" className="animate-spin" />
      ) : (
        <Icon.Mail data-icon="inline-start" />
      )}
      {pending ? "Subscribing..." : "Stay updated"}
    </Button>
  );
}

export function NewsletterForm({ className }: { className?: string }) {
  const [state, action] = useActionState(subscribeNewsletter, null);

  if (state?.success) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm",
          className,
        )}
      >
        <Icon.CheckCircle className="size-8 text-primary" />
        <p className="text-sm font-medium text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <div>
        <p className="text-sm font-medium uppercase text-muted-foreground">
          Newsletter
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Product updates and launch announcements.
        </p>
      </div>

      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="newsletter-email" className="sr-only">
            Email
          </FieldLabel>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="flex-1"
            />
            <SubmitBtn />
          </div>
        </Field>
      </FieldGroup>

      {state?.message && !state.success && (
        <FieldError>{state.message}</FieldError>
      )}
    </form>
  );
}
