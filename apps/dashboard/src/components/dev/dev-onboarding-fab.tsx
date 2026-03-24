"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevOnboardingFab must not be imported in production.");
}

/**
 * Dev-only FAB for the onboarding page.
 *
 * Each step has a preset FormData payload that mirrors the native form.
 * Clicking "Fill & advance" submits the preset via the saveOnboardingStepAction
 * server action and then refreshes the router so the next step loads.
 *
 * Step 6 (launch) is intentionally left out — the user picks their template
 * manually after seeing the recommendations.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  completeOnboardingAction,
  saveOnboardingStepAction,
} from "../../app/actions";
import { DevFabShell } from "./dev-fab-shell";

type StepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness"
  | "launch";

const STEP_ORDER: StepId[] = [
  "business-identity",
  "market-focus",
  "brand-style",
  "contact-operations",
  "content-readiness",
  "launch",
];

function nextStepId(current: StepId): StepId {
  const idx = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
}

/** Builds a FormData matching the native form for each step. */
function buildFormData(stepId: StepId): FormData {
  const fd = new FormData();
  const next = nextStepId(stepId);

  switch (stepId) {
    case "business-identity":
      fd.append("currentStep", "business-identity");
      fd.append("nextStep", next);
      fd.append("businessType", "residential-sales");
      fd.append("primaryGoal", "generate-leads");
      fd.append("tagline", "Your trusted real estate partner");
      break;

    case "market-focus":
      fd.append("currentStep", "market-focus");
      fd.append("nextStep", next);
      fd.append("locations", "Lekki, Victoria Island, Ikoyi");
      fd.append("propertyTypes", "apartments");
      fd.append("propertyTypes", "houses");
      fd.append("propertyTypes", "luxury");
      // targetAudience is a TagInput — leave empty (optional field)
      break;

    case "brand-style":
      fd.append("currentStep", "brand-style");
      fd.append("nextStep", next);
      fd.append("tone", "professional");
      fd.append("stylePreference", "minimal");
      fd.append("preferredColorHint", "Deep navy");
      break;

    case "contact-operations":
      fd.append("currentStep", "contact-operations");
      fd.append("nextStep", next);
      fd.append("phone", "+2348012345678");
      fd.append("contactEmail", "info@astergrove.com");
      fd.append("whatsapp", "+2348012345678");
      fd.append("officeAddress", "5 Marina Road, Victoria Island, Lagos");
      break;

    case "content-readiness":
      fd.append("currentStep", "content-readiness");
      fd.append("nextStep", next);
      fd.append("hasLogo", "on");
      fd.append("hasListings", "on");
      fd.append("hasTestimonials", "on");
      break;

    case "launch":
      // launch uses completeOnboardingAction — handled separately
      break;
  }

  return fd;
}

type Props = {
  /** The currently displayed step — passed down from the server component. */
  currentStepId: StepId;
  /** Subdomain slug already known from onboarding state (needed for launch). */
  subdomain?: string;
};

export function DevOnboardingFab({ currentStepId, subdomain }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const isLaunch = currentStepId === "launch";

  async function handleFill() {
    setBusy(true);
    try {
      if (isLaunch) {
        // Complete onboarding: pick a safe default template + market
        const fd = new FormData();
        fd.append("market", "Lekki, Lagos");
        fd.append("template", "template-1");
        await completeOnboardingAction(fd);
      } else {
        const fd = buildFormData(currentStepId);
        await saveOnboardingStepAction(fd);
      }
      router.refresh();
    } catch (err) {
      console.error("[DevOnboardingFab]", err);
    } finally {
      setBusy(false);
    }
  }

  const stepLabel =
    currentStepId === "business-identity"
      ? "Business Identity"
      : currentStepId === "market-focus"
        ? "Market Focus"
        : currentStepId === "brand-style"
          ? "Brand Style"
          : currentStepId === "contact-operations"
            ? "Contact & Ops"
            : currentStepId === "content-readiness"
              ? "Content Readiness"
              : "Launch";

  return (
    <DevFabShell label="Onboarding">
      <div className="px-4 py-3">
        <p className="mb-2 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          Current step:{" "}
          <span className="text-amber-700 dark:text-amber-400">{stepLabel}</span>
        </p>

        <button
          type="button"
          disabled={busy}
          onClick={handleFill}
          className="w-full rounded-lg bg-amber-500 px-3 py-2 font-mono text-xs font-bold text-amber-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-50"
        >
          {busy
            ? "Submitting…"
            : isLaunch
              ? "⚡ Complete onboarding"
              : "⚡ Fill & advance step"}
        </button>

        {isLaunch && (
          <p className="mt-2 font-mono text-[10px] text-slate-400">
            Submits: market=&ldquo;Lekki, Lagos&rdquo; template=template-1
          </p>
        )}
        {!isLaunch && subdomain && (
          <p className="mt-2 font-mono text-[10px] text-slate-400">
            Subdomain: {subdomain}
          </p>
        )}
      </div>
    </DevFabShell>
  );
}
