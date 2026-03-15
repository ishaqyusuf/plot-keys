import { authRoutes } from "@plotkeys/auth";
import { FlowShell } from "../../components/flow-shell";
import { SignUpForm } from "../../components/auth/sign-up-form";
import { getCurrentAppSession } from "../../lib/session";

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
          <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
            What this step guarantees
          </p>
          <ul className="mt-6 grid gap-3">
            {signUpBenefits.map((item) => (
              <li
                key={item}
                className="rounded-[calc(var(--radius-md)-0.1rem)] border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-4 text-sm leading-7 text-primary-foreground/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      }
      title="Create the account that will own the tenant workspace."
    >
      <SignUpForm initialError={params.error} />
    </FlowShell>
  );
}
