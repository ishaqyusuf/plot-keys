import { authRoutes } from "@plotkeys/auth";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { getCurrentAppSession } from "../../lib/session";
import { signInAction } from "../actions";

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getCurrentAppSession();

  if (session) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  const params = (await searchParams) ?? {};

  return (
    <FlowShell
      badge="Access existing workspace"
      description="Successful sign-in now checks the stored user record, validates the password hash, and routes back into the active tenant journey."
      sidePanel={
        <>
          <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
            Planned redirect logic
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Verified but not onboarded -> /onboarding",
              "Verified and onboarded -> /",
              "Published site and builder remain tied to the active company",
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
      title="Sign back in and continue where the tenant left off."
    >
      <form action={signInAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sign-in-email">Email address</Label>
          <Input
            id="sign-in-email"
            name="email"
            placeholder="founder@astergrove.com"
            type="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sign-in-password">Password</Label>
          <Input
            id="sign-in-password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
        </div>

        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button type="submit">Sign in</Button>
          <Button asChild variant="secondary">
            <Link href={authRoutes.signUp}>Create account</Link>
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
