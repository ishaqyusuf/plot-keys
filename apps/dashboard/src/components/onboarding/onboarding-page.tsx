import "server-only";

import { authRoutes } from "@plotkeys/auth/shared";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import {
  buildDashboardUrl,
  buildTenantDashboardUrl,
  resolveDashboardLandingRoute,
} from "@plotkeys/utils";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { VerificationIntro } from "@/components/auth/verification-intro";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { FlowDevTools } from "@/components/flow-dev-tools";
import { FlowShell } from "@/components/flow-shell";
import {
  accountSteps,
  OnboardingProgress,
} from "@/components/onboarding/onboarding-progress";
import { BrandStyleStepForm } from "@/components/onboarding/steps/brand-style-step-form";
import { BusinessIdentityStepForm } from "@/components/onboarding/steps/business-identity-step-form";
import { ContactOperationsStepForm } from "@/components/onboarding/steps/contact-operations-step-form";
import { ContentReadinessStepForm } from "@/components/onboarding/steps/content-readiness-step-form";
import { MarketFocusStepForm } from "@/components/onboarding/steps/market-focus-step-form";
import type { OnboardingStepId as StepId } from "@/components/onboarding/steps/onboarding-step-shared";
import { OnboardingSignupNotification } from "@/components/onboarding-signup-notification";
import { getCurrentAppSession, getTenantSlugFromHost } from "@/lib/session";
import { readPendingOnboardingCookie } from "@/lib/session-cookie";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";
import { tenantRedirect } from "@/lib/tenant-url-server";
import { getQueryClient, trpc } from "@/trpc/server";

const STEPS: { id: StepId; label: string }[] = [
  { id: "business-identity", label: "Business identity" },
  { id: "market-focus", label: "Market focus" },
  { id: "brand-style", label: "Brand style" },
  { id: "contact-operations", label: "Contact & operations" },
  { id: "content-readiness", label: "Content readiness" },
];

function nextStep(current: StepId): StepId {
  const idx = STEPS.findIndex((s) => s.id === current);
  return STEPS[Math.min(idx + 1, STEPS.length - 1)]!.id;
}

function prevStepPath(current: StepId): string | null {
  const idx = STEPS.findIndex((s) => s.id === current);
  if (idx <= 0) return null;
  return `/onboarding?step=${STEPS[idx - 1]!.id}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export async function OnboardingPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = {
    company: firstSearchParam(rawParams.company),
    email: firstSearchParam(rawParams.email),
    error: firstSearchParam(rawParams.error),
    signup: firstSearchParam(rawParams.signup),
    step: firstSearchParam(rawParams.step),
    subdomain: firstSearchParam(rawParams.subdomain),
    token: firstSearchParam(rawParams.token),
  };
  const tenantSlug = await getTenantSlugFromHost();
  const session = await getCurrentAppSession();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;

  if (!session) {
    if (params.token && (tenantSlug || params.subdomain)) {
      const verificationLink = new URL(
        buildTenantDashboardUrl(params.subdomain ?? tenantSlug!, {
          currentOrigin,
          pathname: "/onboarding",
        }),
      );

      if (params.company) {
        verificationLink.searchParams.set("company", params.company);
      }
      if (params.email) {
        verificationLink.searchParams.set("email", params.email);
      }
      if (params.subdomain) {
        verificationLink.searchParams.set("subdomain", params.subdomain);
      }
      verificationLink.searchParams.set("token", params.token);

      return (
        <FlowShell
          badge="Step 2 of 3"
          step={2}
          brandName={params.company ?? "PlotKeys"}
          description="Confirm your email to continue setting up your company."
          headerAction={<ThemeToggle />}
          sidePanel={
            <OnboardingProgress currentStep={1} steps={accountSteps} />
          }
          title="Check your email."
        >
          <div className="flex flex-col gap-5">
            <VerificationIntro
              company={params.company}
              email={params.email ?? "your email address"}
              subdomain={params.subdomain}
            />

            {process.env.NODE_ENV === "development" ? (
              <FlowDevTools>
                <Alert>
                  <AlertDescription className="flex flex-col gap-3">
                    <span>
                      Dev shortcut: use the same verification link from the
                      email for quick testing.
                    </span>
                    <span className="break-all font-mono text-xs text-foreground/80">
                      {verificationLink.toString()}
                    </span>
                    <div>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={verificationLink.toString()}>
                          Open verification link
                        </Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </FlowDevTools>
            ) : null}

            <VerifyEmailForm
              signUpPath={buildDashboardUrl({
                currentUrl: currentOrigin,
                path: authRoutes.signUp,
              })}
              initialError={params.error}
              onboarding={
                params.company && params.subdomain
                  ? {
                      company: params.company,
                      subdomain: params.subdomain,
                    }
                  : undefined
              }
              token={params.token ?? ""}
            />
          </div>
        </FlowShell>
      );
    }

    if (tenantSlug) {
      await tenantRedirect(authRoutes.signIn);
    }

    redirect(authRoutes.signUp);
  }

  if (session.activeMembership) {
    if (tenantSlug) {
      await tenantRedirect(
        resolveDashboardLandingRoute(session.activeMembership.workRole),
      );
    }

    redirect(
      await getTenantSignInUrlForSubdomain(
        session.activeMembership.companySlug,
        resolveDashboardLandingRoute(session.activeMembership.workRole),
      ),
    );
  }

  const queryClient = getQueryClient();
  const savedOnboarding = await queryClient
    .fetchQuery(trpc.onboarding.get.queryOptions())
    .catch(() => null);

  // Fall back to cookie for sessions that pre-date DB persistence
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  const companyName =
    savedOnboarding?.companyName ??
    pendingOnboarding?.company ??
    params.company ??
    "";
  const subdomain =
    savedOnboarding?.subdomain ??
    pendingOnboarding?.subdomain ??
    params.subdomain ??
    "";
  if (subdomain && !tenantSlug) {
    redirect(
      buildTenantDashboardUrl(subdomain, {
        currentOrigin,
        pathname: "/onboarding",
      }),
    );
  }

  if (tenantSlug && tenantSlug !== subdomain) {
    await tenantRedirect(
      `${authRoutes.signIn}?error=${encodeURIComponent("This website setup belongs to a different company dashboard.")}`,
    );
  }

  // Resolve which step to show
  const rawStep =
    params.step ?? savedOnboarding?.currentStep ?? "business-identity";
  const normalizedStep =
    rawStep === "launch" || rawStep === "template-configuration"
      ? "content-readiness"
      : rawStep;
  const validStepIds = STEPS.map((s) => s.id);
  const currentStepId: StepId = (
    validStepIds.includes(normalizedStep as StepId)
      ? normalizedStep
      : "business-identity"
  ) as StepId;

  const currentStepIdx = STEPS.findIndex((s) => s.id === currentStepId);
  const backPath = prevStepPath(currentStepId);
  const next = nextStep(currentStepId);

  return (
    <>
      <OnboardingSignupNotification
        companyName={companyName || session.user.name || ""}
        dashboardHostname={
          subdomain
            ? buildTenantDashboardUrl(subdomain).replace(/^https?:\/\//, "")
            : ""
        }
        email={session.user.email ?? "owner@plotkeys.app"}
        fullName={session.user.name ?? "Workspace owner"}
        show={params.signup === "successful"}
        siteHostname={subdomain ? `${subdomain}.plotkeys.com` : ""}
        subdomain={subdomain}
      />
      <FlowShell
        badge={`Step ${currentStepIdx + 1} of ${STEPS.length}`}
        brandEditable={currentStepId === "business-identity"}
        step={currentStepIdx + 1}
        totalSteps={STEPS.length}
        eyebrow="Make it yours"
        brandLogoUrl={pendingOnboarding?.logoUrl ?? null}
        brandName={companyName || "PlotKeys"}
        description={stepDescription(currentStepId)}
        headerAction={<ThemeToggle />}
        sidePanel={
          <OnboardingProgress currentStep={currentStepIdx} steps={STEPS} />
        }
        title={stepTitle(currentStepId)}
      >
        {params.error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {currentStepId === "business-identity" && (
          <BusinessIdentityStepForm
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "market-focus" && (
          <MarketFocusStepForm
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "brand-style" && (
          <BrandStyleStepForm
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "contact-operations" && (
          <ContactOperationsStepForm
            backPath={backPath}
            nextStep={next}
            saved={savedOnboarding}
          />
        )}
        {currentStepId === "content-readiness" && (
          <ContentReadinessStepForm
            backPath={backPath}
            companyName={companyName}
            logoUrl={pendingOnboarding?.logoUrl ?? null}
            saved={savedOnboarding}
            subdomain={subdomain}
          />
        )}
      </FlowShell>
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stepTitle(step: StepId): string {
  switch (step) {
    case "business-identity":
      return "Tell us about your business.";
    case "market-focus":
      return "Where do you operate?";
    case "brand-style":
      return "Set the tone for your brand.";
    case "contact-operations":
      return "Make it easy to reach you.";
    case "content-readiness":
      return "What is ready to share?";
  }
}

function stepDescription(step: StepId): string {
  switch (step) {
    case "business-identity":
      return "A few details to shape your website and the story it tells.";
    case "market-focus":
      return "Tell us where you work and who you work with.";
    case "brand-style":
      return "Choose a tone and style that feels like your business.";
    case "contact-operations":
      return "Add the details clients will use to get in touch.";
    case "content-readiness":
      return "Select what you have ready. You can add everything else later.";
  }
}
