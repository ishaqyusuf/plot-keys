import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { buildTenantDashboardUrl } from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "../../components/auth/verify-email-form";
import { FlowShell } from "../../components/flow-shell";

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    company?: string;
    email?: string;
    error?: string;
    subdomain?: string;
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
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
  const verificationLink = new URL(currentOrigin ?? "http://localhost:3901");
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
          <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
            Handoff contract
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Verification proves the email owner is real.",
              "Verified users without onboarding completion go to /onboarding.",
              "Verified users with onboarding complete go to /.",
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
          <Alert className="border-primary/20 bg-primary/5">
            <AlertDescription className="flex flex-col gap-3">
              <span>
                Dev shortcut: use the same verification link from the email for
                quick testing.
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
          onboarding={onboarding}
          token={token}
        />
      </div>
    </FlowShell>
  );
}
