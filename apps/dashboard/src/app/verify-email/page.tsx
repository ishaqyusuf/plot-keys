import { Badge } from "@plotkeys/ui/badge";
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
  const email = params.email ?? "your email address";
  const token = params.token ?? "";
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
          We created the account for <strong>{email}</strong>. Open the
          verification link from email or use the action below to complete the
          verified-account handoff into onboarding.
        </p>

        <VerifyEmailForm
          initialError={params.error}
          onboarding={onboarding}
          token={token}
        />
      </div>
    </FlowShell>
  );
}
