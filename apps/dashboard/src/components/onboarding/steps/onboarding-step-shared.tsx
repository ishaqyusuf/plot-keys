"use client";

import { Button } from "@plotkeys/ui/button";
import { SubmitButton } from "@plotkeys/ui/submit-button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { useTRPC } from "@/trpc/client";

export type OnboardingStepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness";

export type SavedOnboardingState = {
  businessSummary?: string | null;
  businessType?: string | null;
  companyName?: string | null;
  contactEmail?: string | null;
  currentStep?: string | null;
  hasAgents?: boolean;
  hasBlogContent?: boolean;
  hasExistingContent?: boolean;
  hasListings?: boolean;
  hasLogo?: boolean;
  hasProjects?: boolean;
  hasTestimonials?: boolean;
  locations?: string[] | null;
  market?: string | null;
  officeAddress?: string | null;
  phone?: string | null;
  preferredColorHint?: string | null;
  primaryGoal?: string | null;
  propertyTypes?: string[] | null;
  recommendedTemplateKey?: string | null;
  stylePreference?: string | null;
  subdomain?: string | null;
  tagline?: string | null;
  targetAudience?: string[] | null;
  templateKey?: string | null;
  tone?: string | null;
  whatsapp?: string | null;
};

type OnboardingProgressPayload = {
  businessType?: string | null;
  contactEmail?: string | null;
  currentStep: OnboardingStepId;
  locations?: string[];
  market?: string;
  officeAddress?: string | null;
  phone?: string | null;
  preferredColorHint?: string | null;
  primaryGoal?: string | null;
  propertyTypes?: string[];
  stylePreference?: string | null;
  tagline?: string | null;
  targetAudience?: string[];
  tone?: string | null;
  whatsapp?: string | null;
};

export function StepActions({
  backPath,
  pending,
  quickFill,
  submitLabel = "Continue",
}: {
  backPath: string | null;
  pending: boolean;
  quickFill: ReactNode;
  submitLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {quickFill}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton isSubmitting={pending}>{submitLabel}</SubmitButton>
        {backPath ? (
          <Button variant="secondary" asChild>
            <Link href={backPath}>Back</Link>
          </Button>
        ) : (
          <Button variant="secondary" asChild>
            <Link href="/sign-out">Cancel</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export function useSaveOnboardingStep(
  step: OnboardingStepId,
  nextStep: OnboardingStepId,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const mutation = useMutation(trpc.onboarding.saveProgress.mutationOptions());

  async function saveStep(
    payload: Omit<OnboardingProgressPayload, "currentStep">,
  ) {
    const nextParams = new URLSearchParams(searchParams.toString());

    try {
      await mutation.mutateAsync({
        currentStep: nextStep,
        ...payload,
      });
      nextParams.set("step", nextStep);
      nextParams.delete("error");
      router.replace(`/onboarding?${nextParams.toString()}`);
      router.refresh();
    } catch (error) {
      nextParams.set("step", step);
      nextParams.set(
        "error",
        error instanceof Error
          ? error.message
          : "Unable to save onboarding progress.",
      );
      router.replace(`/onboarding?${nextParams.toString()}`);
    }
  }

  return {
    pending: mutation.isPending,
    saveStep,
  };
}
