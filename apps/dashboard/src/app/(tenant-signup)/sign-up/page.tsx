import { authRoutes } from "@plotkeys/auth/shared";
import { resolveDashboardLandingRoute } from "@plotkeys/utils";
import { redirect } from "next/navigation";

import { SignUpForm } from "../../../components/auth/sign-up-form";
import { FlowShell } from "../../../components/flow-shell";
import {
  getCurrentAppSession,
  getTenantSlugFromHost,
} from "../../../lib/session";
import { getTenantSignInUrlForSubdomain } from "../../../lib/tenant-dashboard-url";

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
  const tenantSlug = await getTenantSlugFromHost();

  if (tenantSlug) {
    redirect(authRoutes.signIn);
  }

  const session = await getCurrentAppSession();

  if (session?.activeMembership) {
    redirect(
      await getTenantSignInUrlForSubdomain(
        session.activeMembership.companySlug,
        resolveDashboardLandingRoute(session.activeMembership.workRole),
      ),
    );
  }

  if (session) {
    redirect(authRoutes.onboarding);
  }

  const params = (await searchParams) ?? {};

  return (
    <FlowShell
      badge="Tenant signup"
      description="Create the owner account for a new tenant workspace, reserve the subdomain, and continue directly into onboarding."
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
