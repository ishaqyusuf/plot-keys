import { authRoutes } from "@plotkeys/auth";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { SubdomainField } from "../../components/subdomain-field";
import { getCurrentAppSession } from "../../lib/session";
import { signUpAction } from "../actions";

const signUpBenefits = [
  "Reserve your PlotKeys website and dashboard subdomains early",
  "Create the owner account and move directly into company setup",
  "Carry your chosen hostnames into onboarding without re-entering them",
];

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getCurrentAppSession();

  if (session) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  const params = (await searchParams) ?? {};

  return (
    <FlowShell
      badge="Flow 01"
      description="Signup now captures the future tenant identity up front. It creates the owner account, validates the requested subdomain, and carries the website and dashboard hostnames into onboarding."
      sidePanel={
        <>
          <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
            What this step guarantees
          </p>
          <ul className="mt-6 grid gap-3">
            {signUpBenefits.map((item) => (
              <li
                key={item}
                className="rounded-[calc(var(--radius-md)-0.1rem)] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-100"
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      }
      title="Create the account that will own the tenant workspace."
    >
      <form action={signUpAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sign-up-name">Full name</Label>
          <Input
            id="sign-up-name"
            name="name"
            placeholder="Amara Okafor"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sign-up-email">Email address</Label>
          <Input
            id="sign-up-email"
            name="email"
            placeholder="founder@astergrove.com"
            required
            type="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            minLength={8}
            name="password"
            placeholder="Create a secure password"
            required
            type="password"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sign-up-company">Company name</Label>
          <Input
            id="sign-up-company"
            name="company"
            placeholder="Aster Grove Realty"
            required
          />
        </div>
        <SubdomainField />

        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Button type="submit">Create account and continue</Button>
          <Button asChild variant="secondary">
            <Link href={authRoutes.signIn}>Already have an account</Link>
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
