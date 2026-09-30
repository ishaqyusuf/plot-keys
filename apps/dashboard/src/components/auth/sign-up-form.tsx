"use client";

import {
  type SignUpInput,
  signUpInputSchema,
} from "@plotkeys/api/schemas/auth";
import { authRoutes } from "@plotkeys/auth/shared";
import { Button } from "@plotkeys/ui/button";
import { Field, FieldGroup, FieldLabel } from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import {
  buildLocalSitefrontHostname,
  buildTenantDashboardUrl,
} from "@plotkeys/utils";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { FlowDevTools } from "@/components/flow-dev-tools";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { SubdomainField } from "@/components/subdomain-field";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";
import { AuthFormError } from "./auth-form-error";

const addAccountIfDev =
  process.env.NODE_ENV === "development"
    ? async (values: SignUpInput) => {
        const { useDevToolsStore } = await import("@/stores/dev-tools");
        useDevToolsStore.getState().addAccount({
          company: values.company,
          email: values.email,
          name: values.name,
          password: values.password,
          role: "Admin",
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
  const signUpMutation = useMutation(
    trpc.auth.signUp.mutationOptions({
      onError(error) {
        setFormError(error.message);
      },
      async onSuccess(result) {
        // Save the new account to the dev store so the dev login picker can use it.
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

        const onboardingUrl = `${buildTenantDashboardUrl(
          result.onboarding.subdomain,
          {
            currentOrigin: window.location.origin,
            pathname: "/onboarding",
            tenantHostname: window.location.hostname.endsWith(".localhost")
              ? buildLocalSitefrontHostname(result.onboarding.subdomain)
              : undefined,
          },
        )}?${params.toString()}`;

        router.push(onboardingUrl);
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
      <p className="flow-section-title">Your account</p>
      <FieldGroup>
        <div className="flow-two-columns">
          <Field>
            <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
            <Input
              autoComplete="name"
              id="sign-up-name"
              placeholder="Amara Okafor"
              aria-invalid={Boolean(form.formState.errors.name)}
              aria-describedby={
                form.formState.errors.name ? "sign-up-name-error" : undefined
              }
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p id="sign-up-name-error" className="flow-inline-error">
                {form.formState.errors.name?.message}
              </p>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="sign-up-email">Email address</FieldLabel>
            <Input
              autoComplete="email"
              id="sign-up-email"
              placeholder="founder@astergrove.com"
              type="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              aria-describedby={
                form.formState.errors.email ? "sign-up-email-error" : undefined
              }
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p id="sign-up-email-error" className="flow-inline-error">
                {form.formState.errors.email?.message}
              </p>
            ) : null}
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
          <Input
            autoComplete="new-password"
            id="sign-up-password"
            placeholder="Create a secure password"
            type="password"
            aria-invalid={Boolean(form.formState.errors.password)}
            aria-describedby={
              form.formState.errors.password
                ? "sign-up-password-error"
                : undefined
            }
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p id="sign-up-password-error" className="flow-inline-error">
              {form.formState.errors.password?.message}
            </p>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="sign-up-phone">WhatsApp number</FieldLabel>
          <Input
            autoComplete="tel"
            id="sign-up-phone"
            placeholder="+2348012345678"
            type="tel"
            aria-invalid={Boolean(form.formState.errors.phoneNumber)}
            aria-describedby={
              form.formState.errors.phoneNumber
                ? "sign-up-phone-error"
                : undefined
            }
            {...form.register("phoneNumber")}
          />
          {form.formState.errors.phoneNumber ? (
            <p id="sign-up-phone-error" className="flow-inline-error">
              {form.formState.errors.phoneNumber?.message}
            </p>
          ) : null}
        </Field>
      </FieldGroup>
      <p className="flow-section-title">Your company</p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sign-up-company">Company name</FieldLabel>
          <Input
            autoComplete="organization"
            id="sign-up-company"
            placeholder="Aster Grove Realty"
            aria-invalid={Boolean(form.formState.errors.company)}
            aria-describedby={
              form.formState.errors.company
                ? "sign-up-company-error"
                : undefined
            }
            {...form.register("company")}
          />
          {form.formState.errors.company ? (
            <p id="sign-up-company-error" className="flow-inline-error">
              {form.formState.errors.company?.message}
            </p>
          ) : null}
        </Field>
        <SubdomainField
          description="Choose an address for your company website."
          inputProps={{
            "aria-invalid": Boolean(form.formState.errors.subdomain),
            "aria-describedby": form.formState.errors.subdomain
              ? "sign-up-subdomain-error"
              : undefined,
            name: subdomainField.name,
            onBlur: subdomainField.onBlur,
            onChange: subdomainField.onChange,
            ref: subdomainField.ref,
          }}
          value={subdomainValue}
        />
        {form.formState.errors.subdomain ? (
          <p id="sign-up-subdomain-error" className="flow-inline-error">
            {form.formState.errors.subdomain.message}
          </p>
        ) : null}
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

      <div className="flow-actions">
        <Button className="flow-back" variant="outline" asChild>
          <Link
            href={
              redirectTo
                ? `${authRoutes.signIn}?redirect=${encodeURIComponent(redirectTo)}`
                : authRoutes.signIn
            }
          >
            Sign in
          </Link>
        </Button>
        <SubmitButton
          className="flow-submit"
          isSubmitting={signUpMutation.isPending}
        >
          Create account <span aria-hidden="true">→</span>
        </SubmitButton>
      </div>
      <FlowDevTools>
        <QuickFill
          args={{ form: createQuickFillAdapter(form) }}
          name="auth-sign-up"
        />
      </FlowDevTools>
    </form>
  );
}
