import { authRoutes } from "@plotkeys/auth/shared";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import { resolveDashboardLandingRoute } from "@plotkeys/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { FlowShell } from "@/components/flow-shell";
import {
  accountSteps,
  OnboardingProgress,
} from "@/components/onboarding/onboarding-progress";
import { getCurrentAppSession, getTenantSlugFromHost } from "@/lib/session";
import { getTenantSignInUrlForSubdomain } from "@/lib/tenant-dashboard-url";
import { tenantRedirect } from "@/lib/tenant-url-server";

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
      badge="Step 1 of 3"
      description="Set up your owner account and choose an address for your company website."
      headerAction={<ThemeToggle />}
      sidePanel={<OnboardingProgress currentStep={0} steps={accountSteps} />}
      title="Create your company account."
    >
      <SignUpForm initialError={params.error} />
    </FlowShell>
  );
}
