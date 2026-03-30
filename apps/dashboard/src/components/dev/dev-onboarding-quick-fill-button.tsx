"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error(
    "DevOnboardingQuickFillButton must not be imported in production.",
  );
}

import { DevFormQuickFillButton } from "./dev-form-quick-fill-button";

type DevOnboardingQuickFillButtonProps = {
  onFill: () => void | Promise<void>;
};

export function DevOnboardingQuickFillButton({
  onFill,
}: DevOnboardingQuickFillButtonProps) {
  return <DevFormQuickFillButton onFill={onFill} />;
}
