import { authRoutes } from "@plotkeys/auth";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { verifyEmailAction } from "../actions";

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    email?: string;
    error?: string;
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = (await searchParams) ?? {};
  const email = params.email ?? "your email address";
  const token = params.token ?? "";

  return (
    <FlowShell
      badge="Flow 02"
      description="This verification route still works for manual or legacy email checks, but the primary signup flow now moves straight into onboarding with an active session."
      sidePanel={
        <>
          <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
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
                className="rounded-[calc(var(--radius-md)-0.1rem)] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </>
      }
      title="Verify the account before company onboarding begins."
    >
      <div className="grid gap-5">
        <Badge variant="accent">Verification pending</Badge>
        <p className="max-w-2xl text-base leading-8 text-slate-600">
          We created the account for <strong>{email}</strong>. Clicking below
          simulates opening the email verification link and completes the
          verified-account handoff into onboarding.
        </p>

        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <form action={verifyEmailAction}>
            <input name="token" type="hidden" value={token} />
            <Button disabled={!token} type="submit">
              Verify and continue
            </Button>
          </form>
          <Button asChild variant="secondary">
            <Link href={authRoutes.signUp}>Back to sign up</Link>
          </Button>
        </div>
      </div>
    </FlowShell>
  );
}
