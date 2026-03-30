"use client";

import {
  type SignUpInput,
  signUpInputSchema,
} from "@plotkeys/api/schemas/auth";
import { authRoutes } from "@plotkeys/auth/shared";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { buildTenantDashboardUrl } from "@plotkeys/utils";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useZodForm } from "../../hooks/use-zod-form";
import { useTRPC } from "../../trpc/client";
import { DevFormQuickFillButton } from "../dev/dev-form-quick-fill-button";
import { createQuickFillAdapter, QuickFill } from "../dev/quick-fill";
import { SubdomainField } from "../subdomain-field";
import { AuthFormError } from "./auth-form-error";

const addAccountIfDev =
  process.env.NODE_ENV === "development"
    ? async (values: SignUpInput) => {
        const { useDevToolsStore } = await import("../../stores/dev-tools");
        useDevToolsStore.getState().addAccount({
          company: values.company,
          email: values.email,
          name: values.name,
          password: values.password,
          subdomain: values.subdomain,
        });
      }
    : null;

export function SignUpForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const redirectTo = searchParams.get("redirect");
  const [formError, setFormError] = useState<string | null>(
    initialError ?? null,
  );
  // Capture last submitted values so we can persist to dev store on success.
  const lastSubmittedValues = useRef<SignUpInput | null>(null);
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
  const quickFill = new QuickFill(createQuickFillAdapter(form));
  const signUpMutation = useMutation(
    trpc.auth.signUp.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        // Save the new account to the dev store so DevLoginFab can use it.
        if (addAccountIfDev && lastSubmittedValues.current) {
          await addAccountIfDev(lastSubmittedValues.current);
        }

        const params = new URLSearchParams({
          company: result.onboarding.company,
          email: result.email,
          signup: "successful",
          subdomain: result.onboarding.subdomain,
          token: result.verificationToken,
        });
        if (redirectTo) {
          params.set("redirect", redirectTo);
        }

        const tenantOnboardingUrl = buildTenantDashboardUrl(
          result.onboarding.subdomain,
          {
            currentOrigin: window.location.origin,
            pathname: "/onboarding",
          },
        );

        router.push(`${tenantOnboardingUrl}?${params.toString()}`);
        router.refresh();
      },
    }),
  );

  async function onSubmit(values: SignUpInput) {
    setFormError(null);
    lastSubmittedValues.current = values;
    await signUpMutation.mutateAsync(values);
  }

  const subdomainField = form.register("subdomain");
  const subdomainValue = form.watch("subdomain");

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex justify-end">
        <DevFormQuickFillButton onFill={() => quickFill.fill("auth-sign-up")} />
      </div>

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
          value={subdomainValue}
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
          <Link
            href={
              redirectTo
                ? `${authRoutes.signIn}?redirect=${encodeURIComponent(redirectTo)}`
                : authRoutes.signIn
            }
          >
            Already have an account
          </Link>
        </Button>
      </div>
    </form>
  );
}
