"use client";

import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Checkbox } from "@plotkeys/ui/checkbox";
import {
  buildLocalSitefrontHostname,
  buildTenantDashboardUrl,
} from "@plotkeys/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { clearPendingOnboarding } from "@/components/auth/session-bridge";
import { createQuickFillAdapter, QuickFill } from "@/components/quick-fill";
import { useZodForm } from "@/hooks/use-zod-form";
import { useTRPC } from "@/trpc/client";
import {
  type SavedOnboardingState,
  StepActions,
} from "./onboarding-step-shared";

const contentFlags = [
  {
    description: "You have a logo file ready to upload.",
    label: "I have a logo",
    name: "hasLogo",
  },
  {
    description: "You have active property listings to add.",
    label: "I have listings ready",
    name: "hasListings",
  },
  {
    description: "You have written content such as an about section.",
    label: "I have existing written content",
    name: "hasExistingContent",
  },
  {
    description: "You have agent profiles to add to the site.",
    label: "I have agents to feature",
    name: "hasAgents",
  },
  {
    description: "You have completed projects or case studies.",
    label: "I have project case studies",
    name: "hasProjects",
  },
  {
    description: "You have client reviews or recommendations.",
    label: "I have testimonials",
    name: "hasTestimonials",
  },
  {
    description: "You plan to publish blog or market insight articles.",
    label: "I plan to publish blog content",
    name: "hasBlogContent",
  },
] as const;

const contentReadinessSchema = z.object({
  hasAgents: z.boolean(),
  hasBlogContent: z.boolean(),
  hasExistingContent: z.boolean(),
  hasListings: z.boolean(),
  hasLogo: z.boolean(),
  hasProjects: z.boolean(),
  hasTestimonials: z.boolean(),
});

type ContentReadinessValues = z.infer<typeof contentReadinessSchema>;

export function ContentReadinessStepForm({
  companyName,
  backPath,
  logoUrl,
  saved,
  subdomain,
}: {
  companyName: string;
  backPath: string | null;
  logoUrl?: string | null;
  saved: SavedOnboardingState | null;
  subdomain: string;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const [formError, setFormError] = useState<string | null>(null);
  const saveProgressMutation = useMutation(
    trpc.onboarding.saveProgress.mutationOptions(),
  );
  const completeOnboardingMutation = useMutation(
    trpc.onboarding.complete.mutationOptions(),
  );
  const form = useZodForm(contentReadinessSchema, {
    defaultValues: {
      hasAgents: Boolean(saved?.hasAgents),
      hasBlogContent: Boolean(saved?.hasBlogContent),
      hasExistingContent: Boolean(saved?.hasExistingContent),
      hasListings: Boolean(saved?.hasListings),
      hasLogo: Boolean(saved?.hasLogo),
      hasProjects: Boolean(saved?.hasProjects),
      hasTestimonials: Boolean(saved?.hasTestimonials),
    },
  });

  async function onSubmit(values: ContentReadinessValues) {
    setFormError(null);

    try {
      const market =
        saved?.market ??
        saved?.locations?.find((value) => value.trim().length > 0) ??
        "";
      const templateKey =
        saved?.templateKey ?? saved?.recommendedTemplateKey ?? "template-1";

      if (!companyName || !subdomain) {
        throw new Error(
          "Your company setup details are missing. Please start again from signup.",
        );
      }

      if (!market) {
        throw new Error(
          "Primary market is required before opening the builder.",
        );
      }

      await saveProgressMutation.mutateAsync({
        currentStep: "content-readiness",
        hasAgents: values.hasAgents,
        hasBlogContent: values.hasBlogContent,
        hasExistingContent: values.hasExistingContent,
        hasListings: values.hasListings,
        hasLogo: values.hasLogo,
        hasProjects: values.hasProjects,
        hasTestimonials: values.hasTestimonials,
        market,
        templateKey,
      });

      const result = await completeOnboardingMutation.mutateAsync({
        companyName,
        logoUrl: logoUrl ?? null,
        market,
        subdomain,
        templateKey,
      });
      const tenantHostname = window.location.hostname.endsWith(".localhost")
        ? buildLocalSitefrontHostname(subdomain)
        : undefined;
      const redirectUrl = new URL(
        buildTenantDashboardUrl(subdomain, {
          currentOrigin: window.location.origin,
          pathname: "/sign-in",
          tenantHostname,
        }),
      );

      redirectUrl.searchParams.set(
        "redirect",
        `/builder?configId=${result.configId}&onboarding=1`,
      );

      await clearPendingOnboarding().catch(() => undefined);
      router.push(redirectUrl.toString());
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to finish onboarding.",
      );
    }
  }

  const pending =
    saveProgressMutation.isPending || completeOnboardingMutation.isPending;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-3">
        {contentFlags.map((flag) => (
          <Controller
            key={flag.name}
            control={form.control}
            name={flag.name}
            render={({ field }) => {
              const checkboxId = `content-flag-${flag.name}`;

              return (
                <label
                  htmlFor={checkboxId}
                  className="flex cursor-pointer items-start gap-3 border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-primary"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={field.value}
                    className="mt-0.5"
                    onCheckedChange={(nextChecked) =>
                      field.onChange(nextChecked === true)
                    }
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      {flag.label}
                    </span>
                    <span className="block text-muted-foreground">
                      {flag.description}
                    </span>
                  </span>
                </label>
              );
            }}
          />
        ))}
      </div>
      {formError ? (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <StepActions
        backPath={backPath}
        pending={pending}
        quickFill={
          <QuickFill
            args={{ form: createQuickFillAdapter(form) }}
            name="onboarding-content-readiness"
          />
        }
        submitLabel="Open builder"
      />
    </form>
  );
}
