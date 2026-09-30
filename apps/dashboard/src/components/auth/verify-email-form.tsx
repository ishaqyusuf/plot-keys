"use client";

import { verifyEmailInputSchema } from "@plotkeys/api/schemas/auth";
import { authRoutes } from "@plotkeys/auth/shared";
import { Button } from "@plotkeys/ui/button";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";
import { AuthFormError } from "./auth-form-error";
import { persistSession } from "./session-bridge";

export function VerifyEmailForm({
  initialError,
  signUpPath = authRoutes.signUp,
  onboarding,
  token,
}: {
  initialError?: string;
  signUpPath?: string;
  onboarding?: {
    company: string;
    subdomain: string;
  };
  token: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const redirectTo = searchParams.get("redirect");
  const [formError, setFormError] = useState<string | null>(
    initialError ?? null,
  );
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
        router.push(redirectTo || result.redirectTo);
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

      <div className="flow-actions">
        <Button className="flow-back" variant="outline" asChild>
          <Link
            href={
              redirectTo
                ? `${signUpPath}?redirect=${encodeURIComponent(redirectTo)}`
                : signUpPath
            }
          >
            Back to sign up
          </Link>
        </Button>
        <SubmitButton
          className="flow-submit"
          disabled={!token}
          isSubmitting={verifyEmailMutation.isPending}
          onClick={form.handleSubmit(onSubmit)}
          type="button"
        >
          Verify and continue <span aria-hidden="true">→</span>
        </SubmitButton>
      </div>
    </div>
  );
}
