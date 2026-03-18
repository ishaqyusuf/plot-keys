import { authRoutes } from "@plotkeys/auth/shared";
import { createPrismaClient } from "@plotkeys/db";
import { templateCatalog } from "@plotkeys/section-registry";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
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
import { canAccessTemplateTier } from "@plotkeys/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import { FlowShell } from "../../components/flow-shell";
import { OnboardingSignupNotification } from "../../components/onboarding-signup-notification";
import { requireAuthenticatedSession } from "../../lib/session";
import { readPendingOnboardingCookie } from "../../lib/session-cookie";
import { completeOnboardingAction } from "../actions";

const onboardingSteps = [
  "Review reserved workspace identity",
  "Set the primary market",
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

  // --- Load saved onboarding state from DB (durable, survives cookie expiry) ---
  const prisma = createPrismaClient().db;
  const savedOnboarding = prisma
    ? await prisma.tenantOnboarding.findUnique({
        where: { userId: session.user.id },
      })
    : null;

  // Fall back to cookie for sessions that pre-date DB persistence
  const cookieStore = await cookies();
  const pendingOnboarding = readPendingOnboardingCookie(cookieStore);

  const companyName =
    savedOnboarding?.companyName ??
    pendingOnboarding?.company ??
    params.company ??
    "";
  const subdomain =
    savedOnboarding?.subdomain ??
    pendingOnboarding?.subdomain ??
    params.subdomain ??
    "";

  // Pre-fill any in-progress values saved on previous visits
  const savedMarket = savedOnboarding?.market ?? "";
  const savedTemplateKey = savedOnboarding?.templateKey ?? "template-1";

  const isResumed = Boolean(savedOnboarding && !savedOnboarding.completedAt && savedMarket);

  const starterTemplates = templateCatalog.filter((template) =>
    canAccessTemplateTier("starter", template.tier),
  );

  return (
    <>
      <OnboardingSignupNotification
        companyName={companyName || session.user.name || ""}
        dashboardHostname={
          subdomain ? `dashboard.${subdomain}.plotkeys.com` : ""
        }
        email={session.user.email ?? "owner@plotkeys.app"}
        fullName={session.user.name ?? "Workspace owner"}
        show={params.signup === "successful"}
        siteHostname={subdomain ? `${subdomain}.plotkeys.com` : ""}
        subdomain={subdomain}
      />
      <FlowShell
        badge="Flow 03"
        description={
          isResumed
            ? "Resuming your in-progress workspace setup. Your previous selections are pre-filled — update anything and click Finish to complete."
            : "Onboarding now finishes the tenant setup started during signup. Your company name and PlotKeys hostnames are already reserved, so this step only needs the remaining launch details before creating the tenant company, owner membership, initial published site configuration, and pending website/dashboard domain records."
        }
        sidePanel={
          <>
            <p className="text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
              {isResumed ? "Resuming onboarding" : "Onboarding payload"}
            </p>
            <div className="mt-6 grid gap-3">
              {onboardingSteps.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[calc(var(--radius-md)-0.1rem)] border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-4 text-sm leading-7 text-primary-foreground/85"
                >
                  <span className="mr-2 text-primary-foreground/70">
                    0{index + 1}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </>
        }
        title={
          isResumed
            ? "Resume your workspace setup."
            : "Set up the tenant company and bootstrap the first website."
        }
      >
        <form action={completeOnboardingAction} className="flex flex-col gap-6">
          <Card className="border-border/60 bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Reserved during signup
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Company</p>
                <p>{companyName || "Not available yet"}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Website</p>
                <p>
                  {subdomain
                    ? `${subdomain}.plotkeys.com`
                    : "Not available yet"}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Dashboard</p>
                <p>
                  {subdomain
                    ? `dashboard.${subdomain}.plotkeys.com`
                    : "Not available yet"}
                </p>
              </div>
            </CardContent>
          </Card>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="onboarding-market">
                Primary market
              </FieldLabel>
              <Input
                defaultValue={savedMarket}
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
              <Select defaultValue={savedTemplateKey} name="template">
                <SelectTrigger className="w-full" id="onboarding-template">
                  <SelectValue placeholder="Choose a starter template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {starterTemplates.map((template) => (
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
          ) : !companyName || !subdomain ? (
            <Alert variant="destructive">
              <AlertDescription>
                Your reserved company details are missing. Please restart from
                signup so onboarding can finish workspace setup.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={!companyName || !subdomain} type="submit">
              {isResumed ? "Resume and finish" : "Finish onboarding"}
            </Button>
            <Button asChild variant="secondary">
              <Link href={authRoutes.signOut}>Cancel</Link>
            </Button>
          </div>
        </form>
      </FlowShell>
    </>
  );
}
