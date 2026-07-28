import { authRoutes } from "@plotkeys/auth/shared";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import { resolveDashboardLandingRoute } from "@plotkeys/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { FlowShell } from "@/components/flow-shell";
import { getCurrentAppSession, getTenantSlugFromHost } from "@/lib/session";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";
import { tenantRedirect } from "@/lib/tenant-url-server";

const signUpBenefits = [
  "Reserve your PlotKeys website and dashboard links early",
  "Create the owner account and move directly into website setup",
  "Carry your chosen hostnames into onboarding without re-entering them",
];

export const metadata: Metadata = {
  title: "Sign Up | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstSearchParam(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignUpPage({ searchParams }: Props) {
  const tenantSlug = await getTenantSlugFromHost();

  if (tenantSlug) {
    await tenantRedirect(authRoutes.signIn);
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

  const rawParams = await searchParams;
  const params = {
    error: firstSearchParam(rawParams.error),
  };

  return (
    <FlowShell
      badge="Website launch"
      description="Create the owner account for your company website, reserve the subdomain, and continue directly into setup."
      headerAction={<ThemeToggle />}
      sidePanel={
        <>
          <p className="text-sm font-medium text-primary-foreground/80">
            What this step guarantees
          </p>
          <ul className="mt-6">
            {signUpBenefits.map((item) => (
              <li
                key={item}
                className="border-primary-foreground/15 border-t py-4 text-primary-foreground/85 text-sm leading-7 first:border-t-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      }
      title="Create the account that will launch your company website."
    >
      <SignUpForm initialError={params.error} />
    </FlowShell>
  );
}
