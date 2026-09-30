import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import { buildDashboardUrl, buildTenantDashboardUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
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

export const metadata: Metadata = {
  title: "Verify Email | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const params = {
    company: firstSearchParam(rawParams.company),
    email: firstSearchParam(rawParams.email),
    error: firstSearchParam(rawParams.error),
    subdomain: firstSearchParam(rawParams.subdomain),
    token: firstSearchParam(rawParams.token),
  };
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const currentOrigin = host ? `${protocol}://${host}` : null;

  if (params.subdomain) {
    const tenantOnboardingUrl = new URL(
      buildTenantDashboardUrl(params.subdomain, {
        currentOrigin,
        pathname: "/onboarding",
      }),
    );

    if (params.company) {
      tenantOnboardingUrl.searchParams.set("company", params.company);
    }
    if (params.email) {
      tenantOnboardingUrl.searchParams.set("email", params.email);
    }
    if (params.error) {
      tenantOnboardingUrl.searchParams.set("error", params.error);
    }
    tenantOnboardingUrl.searchParams.set("subdomain", params.subdomain);
    if (params.token) {
      tenantOnboardingUrl.searchParams.set("token", params.token);
    }

    redirect(tenantOnboardingUrl.toString());
  }

  const email = params.email ?? "your email address";
  const token = params.token ?? "";
  const verificationLink = new URL(currentOrigin ?? buildDashboardUrl());
  verificationLink.pathname = "/verify-email";
  if (params.company) {
    verificationLink.searchParams.set("company", params.company);
  }
  if (params.email) {
    verificationLink.searchParams.set("email", params.email);
  }
  if (params.subdomain) {
    verificationLink.searchParams.set("subdomain", params.subdomain);
  }
  if (params.token) {
    verificationLink.searchParams.set("token", params.token);
  }
  const onboarding =
    params.company && params.subdomain
      ? {
          company: params.company,
          subdomain: params.subdomain,
        }
      : undefined;

  return (
    <FlowShell
      badge="Step 2 of 3"
      brandName={params.company ?? "PlotKeys"}
      headerAction={<ThemeToggle />}
      step={2}
      description="Confirm your email to continue setting up your company."
      sidePanel={<OnboardingProgress currentStep={1} steps={accountSteps} />}
      title="Check your email."
    >
      <div className="flex flex-col gap-5">
        <VerificationIntro
          company={params.company}
          email={email}
          subdomain={params.subdomain}
        />

        {process.env.NODE_ENV === "development" ? (
          <FlowDevTools>
            <Alert>
              <AlertDescription className="flex flex-col gap-3">
                <span>
                  Dev shortcut: use the same verification link from the email
                  for quick testing.
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
            path: "/sign-up",
          })}
          initialError={params.error}
          onboarding={onboarding}
          token={token}
        />
      </div>
    </FlowShell>
  );
}
