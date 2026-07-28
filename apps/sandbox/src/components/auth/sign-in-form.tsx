"use client";

import {
  type SignInInput,
  signInInputSchema,
} from "@plotkeys/api/schemas/auth";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { useTRPC } from "@/trpc/client";

export function SignInForm({ initialError }: { initialError?: string }) {
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const signIn = useMutation(
    trpc.auth.signIn.mutationOptions({
      onError: (mutationError) => setError(mutationError.message),
      onSuccess: async (result) => {
        const response = await fetch("/api/session", {
          body: JSON.stringify({ sessionToken: result.sessionToken }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          setError(body?.error ?? "Unable to persist the session.");
          return;
        }

        const redirectTo = searchParams.get("redirect");
        window.location.assign(redirectTo?.startsWith("/") ? redirectTo : "/");
      },
    }),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const parsed = signInInputSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter valid credentials.");
      return;
    }

    signIn.mutate(parsed.data satisfies SignInInput);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            required
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            required
            type="password"
          />
        </Field>
      </FieldGroup>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={signIn.isPending} type="submit">
        {signIn.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
