"use client";

import { authRoutes } from "@plotkeys/auth/shared";
import { verifyEmailInputSchema } from "@plotkeys/api/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useZodForm } from "../../hooks/use-zod-form";
import { useTRPC } from "../../trpc/client";
import { AuthFormError } from "./auth-form-error";
import { persistSession } from "./session-bridge";

export function VerifyEmailForm({
  initialError,
  onboarding,
  token,
}: {
  initialError?: string;
  onboarding?: {
    company: string;
    subdomain: string;
  };
  token: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const [formError, setFormError] = useState<string | null>(initialError ?? null);
  const form = useZodForm(verifyEmailInputSchema, {
    defaultValues: {
      company: onboarding?.company ?? "",
      subdomain: onboarding?.subdomain ?? "",
      token,
    },
  });
  const verifyEmailMutation = useMutation(
    trpc.auth.verifyEmail.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        await persistSession(result.sessionToken, onboarding);
        router.push(result.redirectTo);
        router.refresh();
      },
    }),
  );

  async function onSubmit() {
    setFormError(null);
    await verifyEmailMutation.mutateAsync({
      company: form.getValues("company") || undefined,
      subdomain: form.getValues("subdomain") || undefined,
      token: form.getValues("token"),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" {...form.register("company")} />
      <input type="hidden" {...form.register("subdomain")} />
      <input type="hidden" {...form.register("token")} />

      <AuthFormError
        message={formError ?? form.formState.errors.token?.message}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          disabled={!token || verifyEmailMutation.isPending}
          onClick={form.handleSubmit(onSubmit)}
          type="button"
        >
          {verifyEmailMutation.isPending
            ? "Verifying..."
            : "Verify and continue"}
        </Button>
        <Button asChild variant="secondary">
          <Link href={authRoutes.signUp}>Back to sign up</Link>
        </Button>
      </div>
    </div>
  );
}
