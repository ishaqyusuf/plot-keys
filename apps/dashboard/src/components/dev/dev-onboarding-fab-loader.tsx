"use client";

import dynamic from "next/dynamic";

const DevOnboardingFab =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () => import("./dev-onboarding-fab").then((m) => m.DevOnboardingFab),
        { ssr: false },
      )
    : null;

type DevOnboardingFabLoaderProps = {
  currentStepId: string;
  subdomain: string;
};

export function DevOnboardingFabLoader({
  currentStepId,
  subdomain,
}: DevOnboardingFabLoaderProps) {
  if (!DevOnboardingFab) {
    return null;
  }

  return (
    <DevOnboardingFab currentStepId={currentStepId} subdomain={subdomain} />
  );
}
