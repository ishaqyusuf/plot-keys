"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { cn } from "@plotkeys/utils/cn";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { requestEarlyAccess } from "../app/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full px-6 py-3">
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
          "rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur-md",
          className,
        )}
      >
        <div className="mb-2 text-2xl">&#10003;</div>
        <p className="font-serif text-lg text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md",
        className,
      )}
    >
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Early access
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be among the first to try PlotKeys.
        </p>
      </div>

      <Input name="name" placeholder="Your name" required />
      <Input name="email" type="email" placeholder="you@company.com" required />

      {state?.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <SubmitBtn />
    </form>
  );
}
