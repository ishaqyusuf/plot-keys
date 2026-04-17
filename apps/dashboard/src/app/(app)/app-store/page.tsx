import {
  APP_REGISTRY,
  type AppDefinition,
  type CompanyPlanTier,
  isAppAvailable,
} from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@plotkeys/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";

import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardToolbarGroup,
} from "../../../components/dashboard/dashboard-page";
import { getCompanyAppsContext } from "../../../lib/company-apps";
import { AppToggle } from "./_components/app-toggle";

type AppStatus = "enabled" | "available" | "locked";

function getStatus(
  app: AppDefinition,
  planTier: CompanyPlanTier,
  enabledIds: Set<string>,
): AppStatus {
  if (!isAppAvailable(app, planTier)) return "locked";
  if (enabledIds.has(app.id)) return "enabled";
  return "available";
}

const planLabels: Record<CompanyPlanTier, string> = {
  starter: "Starter",
  plus: "Plus",
  pro: "Pro",
};

export default async function AppStorePage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;
  const { availableApps, enabledApps, planTier } =
    await getCompanyAppsContext();
  const enabledIds = new Set(enabledApps.map((app) => app.id));

  const byCategory = new Map<string, AppDefinition[]>();
  for (const app of APP_REGISTRY) {
    const list = byCategory.get(app.category) ?? [];
    list.push(app);
    byCategory.set(app.category, list);
  }

  const lockedApp = locked
    ? APP_REGISTRY.find((a) => a.id === locked)
    : undefined;

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Platform workspace</DashboardPageEyebrow>
            <DashboardPageTitle>App Store</DashboardPageTitle>
            <DashboardPageDescription>
              Enable the feature modules your team needs. Your current plan is{" "}
              <strong>{planLabels[planTier]}</strong> with {enabledApps.length}{" "}
              of {availableApps.length} available apps enabled.
            </DashboardPageDescription>
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge variant="secondary">{planLabels[planTier]} plan</Badge>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
        <DashboardPageToolbar>
          <DashboardToolbarGroup className="text-sm text-muted-foreground">
            {enabledApps.length} enabled of {availableApps.length} available
            apps
          </DashboardToolbarGroup>
        </DashboardPageToolbar>
      </DashboardPageHeader>
      {lockedApp ? (
        <div className="mt-4 rounded-md border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>{lockedApp.label}</strong> isn&rsquo;t enabled for your
          workspace. Enable it below
          {isAppAvailable(lockedApp, planTier)
            ? "."
            : ` or upgrade to ${planLabels[lockedApp.planGate]} to unlock it.`}
        </div>
      ) : null}
      <div className="flex flex-col gap-10">
        {Array.from(byCategory.entries()).map(([category, apps]) => (
          <DashboardSection key={category}>
            <DashboardSectionHeader>
              <div>
                <DashboardSectionTitle>{category}</DashboardSectionTitle>
                <DashboardSectionDescription>
                  Turn on the modules that match this operational area.
                </DashboardSectionDescription>
              </div>
            </DashboardSectionHeader>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => {
                const status = getStatus(app, planTier, enabledIds);
                return (
                  <Card key={app.id} className="border-border/70 bg-card/82">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <RegistryIcon name={app.icon} className="size-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {app.label}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {app.category}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 min-h-[3rem]">
                        {app.description}
                      </CardDescription>
                      {status === "locked" ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href="/billing">
                            <Lock className="mr-1.5 size-3.5" />
                            Upgrade to {planLabels[app.planGate]}
                          </Link>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {status === "enabled" ? "Enabled" : "Disabled"}
                          </span>
                          <AppToggle
                            appId={app.id}
                            enabled={status === "enabled"}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DashboardSection>
        ))}
      </div>
    </DashboardPage>
  );
}

function StatusBadge({ status }: { status: AppStatus }) {
  if (status === "enabled") {
    return <Badge variant="default">Enabled</Badge>;
  }
  if (status === "locked") {
    return <Badge variant="outline">Locked</Badge>;
  }
  return <Badge variant="secondary">Available</Badge>;
}
