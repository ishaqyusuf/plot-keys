"use client";

import {
  authRoutes,
} from "@plotkeys/auth";
import {
  signInInputSchema,
  type SignInInput,
} from "@plotkeys/api/schemas/auth";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useZodForm } from "../../hooks/use-zod-form";
import { useTRPC } from "../../trpc/client";
import { AuthFormError } from "./auth-form-error";
import { persistSession } from "./session-bridge";

export function SignInForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const [formError, setFormError] = useState<string | null>(initialError ?? null);
  const form = useZodForm(signInInputSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const signInMutation = useMutation(
    trpc.auth.signIn.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        await persistSession(result.sessionToken);
        router.push(result.redirectTo);
        router.refresh();
      },
    }),
  );

  async function onSubmit(values: SignInInput) {
    setFormError(null);
    await signInMutation.mutateAsync(values);
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sign-in-email">Email address</FieldLabel>
          <Input
            id="sign-in-email"
            placeholder="founder@astergrove.com"
            type="email"
            {...form.register("email")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
          <Input
            id="sign-in-password"
            placeholder="Enter your password"
            type="password"
            {...form.register("password")}
          />
        </Field>
      </FieldGroup>

      <AuthFormError
        message={
          formError ??
          form.formState.errors.email?.message ??
          form.formState.errors.password?.message
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={signInMutation.isPending} type="submit">
          {signInMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
        <Button asChild variant="secondary">
          <Link href={authRoutes.signUp}>Create account</Link>
        </Button>
      </div>
    </form>
  );
}
