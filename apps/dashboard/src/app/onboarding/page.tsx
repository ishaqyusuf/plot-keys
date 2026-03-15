import { authRoutes } from "@plotkeys/auth";
import { templateCatalog } from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { Label } from "@plotkeys/ui/label";
import { Select } from "@plotkeys/ui/select";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { OnboardingSignupNotification } from "../../components/onboarding-signup-notification";
import { SubdomainField } from "../../components/subdomain-field";
import { requireAuthenticatedSession } from "../../lib/session";
import { completeOnboardingAction } from "../actions";

const onboardingSteps = [
  "Company name and market",
  "Preferred PlotKeys subdomain",
  "Primary launch template",
  "Automatic live-site bootstrap",
];

type OnboardingPageProps = {
  searchParams?: Promise<{
    company?: string;
    error?: string;
    signup?: string;
    subdomain?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const session = await requireAuthenticatedSession();
  const params = (await searchParams) ?? {};

  if (session.activeMembership) {
    return (
      <meta content={`0;url=${authRoutes.dashboardHome}`} httpEquiv="refresh" />
    );
  }

  return (
    <>
      <OnboardingSignupNotification
        companyName={params.company ?? session.user.name ?? ""}
        dashboardHostname={
          params.subdomain ? `dashboard.${params.subdomain}.plotkeys.com` : ""
        }
        email={session.user.email ?? "owner@plotkeys.app"}
        fullName={session.user.name ?? "Workspace owner"}
        show={params.signup === "successful"}
        siteHostname={
          params.subdomain ? `${params.subdomain}.plotkeys.com` : ""
        }
        subdomain={params.subdomain ?? ""}
      />
      <FlowShell
        badge="Flow 03"
        description="Onboarding now finishes the tenant setup started during signup. Completing it creates the tenant company, owner membership, initial published site configuration, and pending website/dashboard domain records."
        sidePanel={
          <>
            <p className="text-sm uppercase tracking-[0.32em] text-teal-100">
              Onboarding payload
            </p>
            <div className="mt-6 grid gap-3">
              {onboardingSteps.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[calc(var(--radius-md)-0.1rem)] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-slate-100"
                >
                  <span className="mr-2 text-teal-200">0{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </>
        }
        title="Set up the tenant company and bootstrap the first website."
      >
        <form action={completeOnboardingAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="onboarding-company">Company name</Label>
            <Input
              defaultValue={params.company ?? session.user.name ?? ""}
              id="onboarding-company"
              name="company"
              placeholder="Aster Grove Realty"
              required
            />
          </div>
          <SubdomainField
            defaultValue={params.subdomain ?? ""}
            description="This subdomain powers both the tenant website and the dashboard host under PlotKeys."
            id="onboarding-subdomain"
          />
          <div className="grid gap-2">
            <Label htmlFor="onboarding-market">Primary market</Label>
            <Input
              id="onboarding-market"
              name="market"
              placeholder="Lekki, Lagos"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="onboarding-template">Default template</Label>
            <Select
              defaultValue="template-1"
              id="onboarding-template"
              name="template"
            >
              {templateCatalog.map((template) => (
                <option key={template.key} value={template.key}>
                  {template.name}
                </option>
              ))}
            </Select>
          </div>

          {params.error ? (
            <Alert variant="destructive">
              <AlertDescription>{params.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Button type="submit">Finish onboarding</Button>
            <Button asChild variant="secondary">
              <Link href={authRoutes.signOut}>Cancel</Link>
            </Button>
          </div>
        </form>
      </FlowShell>
    </>
  );
}
