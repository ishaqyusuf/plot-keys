import { authRoutes } from "@plotkeys/auth";
import { templateCatalog } from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@plotkeys/ui/field";
import { Input } from "@plotkeys/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@plotkeys/ui/select";
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
            <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
              Onboarding payload
            </p>
            <div className="mt-6 grid gap-3">
              {onboardingSteps.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[calc(var(--radius-md)-0.1rem)] border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-4 text-sm leading-7 text-primary-foreground/85"
                >
                  <span className="mr-2 text-primary-foreground/70">0{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </>
        }
        title="Set up the tenant company and bootstrap the first website."
      >
        <form action={completeOnboardingAction} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="onboarding-company">Company name</FieldLabel>
              <Input
                defaultValue={params.company ?? session.user.name ?? ""}
                id="onboarding-company"
                name="company"
                placeholder="Aster Grove Realty"
                required
              />
            </Field>
            <SubdomainField
              defaultValue={params.subdomain ?? ""}
              description="This subdomain powers both the tenant website and the dashboard host under PlotKeys."
              id="onboarding-subdomain"
            />
            <Field>
              <FieldLabel htmlFor="onboarding-market">Primary market</FieldLabel>
              <Input
                id="onboarding-market"
                name="market"
                placeholder="Lekki, Lagos"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="onboarding-template">
                Default template
              </FieldLabel>
              <Select defaultValue="template-1" name="template">
                <SelectTrigger className="w-full" id="onboarding-template">
                  <SelectValue placeholder="Choose a starter template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {templateCatalog.map((template) => (
                      <SelectItem key={template.key} value={template.key}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Start from a predefined section layout that can still be edited
                later in the builder.
              </FieldDescription>
            </Field>
          </FieldGroup>

          {params.error ? (
            <Alert variant="destructive">
              <AlertDescription>{params.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
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
