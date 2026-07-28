import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { buildDashboardUrl, buildTenantDashboardUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { FlowShell } from "@/components/flow-shell";

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
      badge="Flow 02"
      description="Signup now pauses here until the account owner confirms the email address. Verification completes the auth handoff, restores the reserved onboarding payload, and then continues into workspace setup."
      sidePanel={
        <>
          <p className="text-sm font-medium text-primary-foreground/80">
            Handoff contract
          </p>
          <div className="mt-6">
            {[
              "Verification proves the email owner is real.",
              "Verified users without onboarding completion go to /onboarding.",
              "Verified users with onboarding complete go to /.",
            ].map((item) => (
              <div
                key={item}
                className="border-primary-foreground/15 border-t py-4 text-primary-foreground/85 text-sm leading-7 first:border-t-0"
              >
                {item}
              </div>
            ))}
          </div>
        </>
      }
      title="Verify the account before company onboarding begins."
    >
      <div className="flex flex-col gap-5">
        <Badge variant="secondary">Verification pending</Badge>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          We created the account for <strong>{email}</strong>. Check your email
          and use the verification link we sent there. That link brings you back
          to tenant onboarding on the correct dashboard host.
        </p>

        {process.env.NODE_ENV === "development" ? (
          <Alert>
            <AlertDescription className="flex flex-col gap-3">
              <span>
                Dev shortcut: use the same verification link from the email for
                quick testing.
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
        ) : null}

        <VerifyEmailForm
          initialError={params.error}
          onboarding={onboarding}
          token={token}
        />
      </div>
    </FlowShell>
  );
}
