"use client";

import {
  authRoutes,
} from "@plotkeys/auth/shared";
import {
  signUpInputSchema,
  type SignUpInput,
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
import { SubdomainField } from "../subdomain-field";
import { AuthFormError } from "./auth-form-error";

export function SignUpForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const [formError, setFormError] = useState<string | null>(initialError ?? null);
  const form = useZodForm(signUpInputSchema, {
    defaultValues: {
      company: "",
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
      subdomain: "",
    },
  });
  const signUpMutation = useMutation(
    trpc.auth.signUp.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        const params = new URLSearchParams({
          company: result.onboarding.company,
          email: result.email,
          subdomain: result.onboarding.subdomain,
          token: result.verificationToken,
        });

        router.push(`${result.redirectTo}?${params.toString()}`);
        router.refresh();
      },
    }),
  );

  async function onSubmit(values: SignUpInput) {
    setFormError(null);
    await signUpMutation.mutateAsync(values);
  }

  const subdomainField = form.register("subdomain");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
          <Input
            id="sign-up-name"
            placeholder="Amara Okafor"
            {...form.register("name")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-up-email">Email address</FieldLabel>
          <Input
            id="sign-up-email"
            placeholder="founder@astergrove.com"
            type="email"
            {...form.register("email")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
          <Input
            id="sign-up-password"
            placeholder="Create a secure password"
            type="password"
            {...form.register("password")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-up-phone">WhatsApp number</FieldLabel>
          <Input
            id="sign-up-phone"
            placeholder="+2348012345678"
            type="tel"
            {...form.register("phoneNumber")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-up-company">Company name</FieldLabel>
          <Input
            id="sign-up-company"
            placeholder="Aster Grove Realty"
            {...form.register("company")}
          />
        </Field>
        <SubdomainField
          inputProps={{
            name: subdomainField.name,
            onBlur: subdomainField.onBlur,
            onChange: subdomainField.onChange,
            ref: subdomainField.ref,
          }}
        />
      </FieldGroup>

      <AuthFormError
        message={
          formError ??
          form.formState.errors.name?.message ??
          form.formState.errors.email?.message ??
          form.formState.errors.password?.message ??
          form.formState.errors.phoneNumber?.message ??
          form.formState.errors.company?.message ??
          form.formState.errors.subdomain?.message
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={signUpMutation.isPending} type="submit">
          {signUpMutation.isPending
            ? "Creating account..."
            : "Create account and continue"}
        </Button>
        <Button asChild variant="secondary">
          <Link href={authRoutes.signIn}>Already have an account</Link>
        </Button>
      </div>
    </form>
  );
}
