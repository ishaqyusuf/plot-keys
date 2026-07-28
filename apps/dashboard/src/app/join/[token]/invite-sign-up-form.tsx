"use client";

import {
  type InviteSignUpInput,
  inviteSignUpInputSchema,
} from "@plotkeys/api/schemas/auth";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { AuthFormError } from "@/components/auth/auth-form-error";
import { persistSession } from "@/components/auth/session-bridge";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useDevToolsStore } from "@/stores/dev-tools";
import { useTRPC } from "@/trpc/client";

type Props = {
  companyName: string;
  companySlug: string;
  email: string;
  token: string;
};

export function InviteSignUpForm({
  companyName,
  companySlug,
  email,
  token,
}: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const addAccount = useDevToolsStore((state) => state.addAccount);
  const [formError, setFormError] = useState<string | null>(null);
  const lastSubmittedValues = useRef<InviteSignUpInput | null>(null);
  const form = useZodForm(inviteSignUpInputSchema, {
    defaultValues: {
      name: "",
      password: "",
      token,
    },
  });
  const signUpForInviteMutation = useMutation(
    trpc.auth.signUpForInvite.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        const values = lastSubmittedValues.current;

        if (process.env.NODE_ENV === "development" && values) {
          addAccount({
            company: companyName,
            email,
            name: values.name,
            password: values.password,
            role: "Invitee",
            subdomain: companySlug,
          });
        }

        await persistSession(result.sessionToken);
        router.push(result.redirectTo);
        router.refresh();
      },
    }),
  );

  async function onSubmit(values: InviteSignUpInput) {
    setFormError(null);
    lastSubmittedValues.current = values;
    await signUpForInviteMutation.mutateAsync(values);
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <input type="hidden" {...form.register("token")} />
      <div className="flex justify-end">
        <QuickFill
          args={{ form: createQuickFillAdapter(form) }}
          name="invite-sign-up"
        />
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel>Email address</FieldLabel>
          <Input disabled value={email} />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-name">Full name</FieldLabel>
          <Input
            autoComplete="name"
            id="invite-name"
            placeholder="Enter your full name"
            {...form.register("name")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-password">Password</FieldLabel>
          <Input
            autoComplete="new-password"
            id="invite-password"
            placeholder="Create a password"
            type="password"
            {...form.register("password")}
          />
        </Field>
      </FieldGroup>

      <AuthFormError
        message={
          formError ??
          form.formState.errors.name?.message ??
          form.formState.errors.password?.message ??
          form.formState.errors.token?.message
        }
      />

      <SubmitButton
        isSubmitting={signUpForInviteMutation.isPending}
        className="w-full"
      >
        Create account and accept invite
      </SubmitButton>
    </form>
  );
}
