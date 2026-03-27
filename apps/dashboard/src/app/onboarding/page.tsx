import { authRoutes } from "@plotkeys/auth/shared";
import { createPrismaClient } from "@plotkeys/db";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { buildTenantDashboardUrl } from "@plotkeys/utils";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "../../components/auth/verify-email-form";
import { FlowShell } from "../../components/flow-shell";
import {
  BrandStyleStepForm,
  BusinessIdentityStepForm,
  ContactOperationsStepForm,
  ContentReadinessStepForm,
  MarketFocusStepForm,
} from "../../components/onboarding/onboarding-step-forms";
import { OnboardingSignupNotification } from "../../components/onboarding-signup-notification";
import { getCurrentAppSession, getTenantSlugFromHost } from "../../lib/session";
import { readPendingOnboardingCookie } from "../../lib/session-cookie";

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

type StepId =
  | "business-identity"
  | "market-focus"
  | "brand-style"
  | "contact-operations"
  | "content-readiness";

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

type OnboardingPageProps = {
  searchParams?: Promise<{
    company?: string;
    email?: string;
    error?: string;
    signup?: string;
    step?: string;
    subdomain?: string;
    token?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = (await searchParams) ?? {};
  const tenantSlug = await getTenantSlugFromHost();
  const session = await getCurrentAppSession();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;

  if (!session) {
    if (tenantSlug && params.token) {
      const verificationLink = new URL(
        buildTenantDashboardUrl(params.subdomain ?? tenantSlug, {
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
          badge="Flow 02"
          description="Email verification now continues on the tenant workspace host so onboarding stays scoped to the right company from the first click."
          sidePanel={
            <>
              <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
                Handoff contract
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "Verification happens on the tenant workspace host.",
                  "Successful verification continues directly into onboarding.",
                  "The shared app host is only used to create new workspaces.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[calc(var(--radius-md)-0.1rem)] border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-4 text-sm leading-7 text-primary-foreground/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </>
          }
          title="Verify the account before tenant onboarding begins."
        >
          <div className="flex flex-col gap-5">
            <Badge variant="secondary">Verification pending</Badge>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">
              We created the account for{" "}
              <strong>{params.email ?? "your email address"}</strong>. Check
              your email and use the verification link we sent there. That link
              brings you back to this tenant dashboard and continues onboarding.
            </p>

            {process.env.NODE_ENV === "development" ? (
              <Alert className="border-primary/20 bg-primary/5">
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    Dev shortcut: use the same verification link from the email
                    for quick testing.
                  </span>
                  <span className="break-all font-mono text-xs text-foreground/80">
                    {verificationLink.toString()}
                  </span>
                  <div>
                    <Button asChild size="sm" variant="secondary">
                      <Link href={verificationLink.toString()}>
                        Open verification link
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}

            <VerifyEmailForm
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
      redirect(authRoutes.signIn);
    }

    redirect(authRoutes.signUp);
  }

  if (session.activeMembership) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  // Load saved onboarding state from DB (durable, survives cookie expiry)
  const prisma = createPrismaClient().db;
  const savedOnboarding = prisma
    ? await prisma.tenantOnboarding.findUnique({
        where: { userId: session.user.id },
      })
    : null;

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
    redirect(
      `${authRoutes.signIn}?error=${encodeURIComponent("This onboarding flow belongs to a different tenant workspace.")}`,
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
        description={stepDescription(currentStepId)}
        sidePanel={
          <StepSidePanel
            companyName={companyName}
            currentStepId={currentStepId}
            subdomain={subdomain}
          />
        }
        title={stepTitle(currentStepId)}
      >
        {params.error ? (
          <Alert className="mb-4" variant="destructive">
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
      return "What's your brand personality?";
    case "contact-operations":
      return "How do clients reach you?";
    case "content-readiness":
      return "What content do you already have?";
  }
}

function stepDescription(step: StepId): string {
  switch (step) {
    case "business-identity":
      return "We use this to shape your website copy, section headings, and the overall story your site tells.";
    case "market-focus":
      return "Your market focus helps us recommend the right sections and pre-populate your listings area.";
    case "brand-style":
      return "Your tone and style guide the design system, color palette, and typography defaults we apply to your site.";
    case "contact-operations":
      return "These details pre-fill your contact page, footer, and inquiry CTA so your site is ready from day one.";
    case "content-readiness":
      return "Knowing what you already have helps us hide empty sections and decide where to generate placeholder content before we open your builder workspace.";
  }
}

// ---------------------------------------------------------------------------
// Side panel
// ---------------------------------------------------------------------------

type StepSidePanelProps = {
  companyName: string;
  currentStepId: StepId;
  subdomain: string;
};

function StepSidePanel({
  companyName,
  currentStepId,
  subdomain,
}: StepSidePanelProps) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
        Onboarding checklist
      </p>
      <div className="mt-6 grid gap-3">
        {STEPS.map((step) => {
          const currentIdx = STEPS.findIndex((s) => s.id === currentStepId);
          const stepIdx = STEPS.findIndex((s) => s.id === step.id);
          const isDone = stepIdx < currentIdx;
          const isCurrent = step.id === currentStepId;

          return (
            <div
              key={step.id}
              className={`rounded-[calc(var(--radius-md)-0.1rem)] border px-4 py-3 text-sm leading-7 ${
                isCurrent
                  ? "border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                  : isDone
                    ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground/50 line-through"
                    : "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground/40"
              }`}
            >
              <span className="mr-2 text-primary-foreground/60">
                0{STEPS.findIndex((s) => s.id === step.id) + 1}
              </span>
              {step.label}
            </div>
          );
        })}
      </div>
      {companyName && subdomain ? (
        <div className="mt-8 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-4 text-sm text-primary-foreground/70">
          <p className="font-medium text-primary-foreground/90">
            {companyName}
          </p>
          <p className="mt-1">{subdomain}.plotkeys.com</p>
        </div>
      ) : null}
    </>
  );
}
