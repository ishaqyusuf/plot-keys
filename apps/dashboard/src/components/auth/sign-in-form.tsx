"use client";

import {
  type SignInInput,
  signInInputSchema,
} from "@plotkeys/api/schemas/auth";
import { authRoutes } from "@plotkeys/auth/shared";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useZodForm } from "../../hooks/use-zod-form";
import { useTRPC } from "../../trpc/client";
import { AuthFormError } from "./auth-form-error";
import { persistSession } from "./session-bridge";

const DevLoginFab =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("../dev/dev-login-fab").then((m) => m.DevLoginFab))
    : null;

export function SignInForm({
  initialError,
  showCreateAccount = true,
}: {
  initialError?: string;
  showCreateAccount?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const redirectTo = searchParams.get("redirect");
  const [formError, setFormError] = useState<string | null>(
    initialError ?? null,
  );
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
        // console.log("Sign-in successful, session token received:", result);
        await persistSession(result.sessionToken);
        router.push(redirectTo || result.redirectTo);
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
      {DevLoginFab && <DevLoginFab onFill={(values) => form.reset(values)} />}

      <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm leading-7 text-muted-foreground">
        Sign-in is scoped to the current tenant host. Dev account autofill only
        shows saved accounts that match this workspace.
      </div>

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

      <div className="flex flex-col gap-3">
        <Button
          className="h-11 w-full"
          disabled={signInMutation.isPending}
          type="submit"
        >
          {signInMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
        {showCreateAccount ? (
          <Button asChild className="w-full" variant="secondary">
            <Link
              href={
                redirectTo
                  ? `${authRoutes.signUp}?redirect=${encodeURIComponent(redirectTo)}`
                  : authRoutes.signUp
              }
            >
              Create account
            </Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
