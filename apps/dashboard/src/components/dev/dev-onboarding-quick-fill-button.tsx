"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error(
    "DevOnboardingQuickFillButton must not be imported in production.",
  );
}

import { DevFormQuickFillButton } from "./dev-form-quick-fill-button";
import type { QuickFillProfile } from "./quick-fill";

type StepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness"
  | "launch";

const STEP_PROFILE: Record<StepId, QuickFillProfile> = {
  "brand-style": "onboarding-brand-style",
  "business-identity": "onboarding-business-identity",
  "contact-operations": "onboarding-contact-operations",
  "content-readiness": "onboarding-content-readiness",
  launch: "onboarding-launch",
  "market-focus": "onboarding-market-focus",
};

type DevOnboardingQuickFillButtonProps = {
  stepId: StepId;
};

export function DevOnboardingQuickFillButton({
  stepId,
}: DevOnboardingQuickFillButtonProps) {
  return <DevFormQuickFillButton profile={STEP_PROFILE[stepId]} />;
}
