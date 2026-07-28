import {
  APP_REGISTRY,
  type AppDefinition,
  type CompanyPlanTier,
  isAppAvailable,
} from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@plotkeys/ui/card";
import { Icon } from "@plotkeys/ui/icons";
import { tierLabels } from "@plotkeys/utils";
import Link from "next/link";

import type { CompanyAppsContext } from "@/lib/company-apps";
import { AppToggle } from "./app-toggle";

type AppStatus = "enabled" | "available" | "locked";
type AppStoreTab = "all" | "installed";

type Props = {
  context: CompanyAppsContext;
  q?: string;
  tab?: string;
};

type AppLogoInput = {
  app: AppDefinition;
};

function getStatus(
  app: AppDefinition,
  planTier: CompanyPlanTier,
  enabledIds: Set<string>,
): AppStatus {
  if (!isAppAvailable(app, planTier)) return "locked";
  if (enabledIds.has(app.id)) return "enabled";
  return "available";
}

function resolveTab(value: string | undefined): AppStoreTab {
  return value === "installed" ? "installed" : "all";
}

function matchesSearch(app: AppDefinition, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) return true;

  return [
    app.category,
    app.description,
    app.icon,
    app.id,
    app.label,
    app.planGate,
  ].some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(normalized),
  );
}

export function AppStoreView({ context, q, tab }: Props) {
  const { enabledApps, planTier } = context;
  const enabledIds = new Set(enabledApps.map((app) => app.id));
  const currentTab = resolveTab(tab);
  const search = q?.trim() ?? "";
  const visibleApps = APP_REGISTRY.filter((app) => {
    const status = getStatus(app, planTier, enabledIds);

    return (
      (currentTab !== "installed" || status === "enabled") &&
      matchesSearch(app, search)
    );
  });

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto mt-8">
      {visibleApps.map((app) => {
        const status = getStatus(app, planTier, enabledIds);

        return (
          <Card key={app.id} className="w-full flex flex-col">
            <div className="pt-6 px-6 h-16 flex items-center justify-between">
              <AppLogo app={app} />

              <div className="flex items-center gap-2">
                {status === "enabled" ? (
                  <div className="rounded-full bg-success/10 px-3 py-1 font-mono text-[10px] text-success">
                    Installed
                  </div>
                ) : null}
              </div>
            </div>

            <CardHeader className="pb-0">
              <div className="flex items-center space-x-2 pb-4">
                <CardTitle className="text-md font-medium leading-none p-0 m-0">
                  {app.label}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="text-xs text-muted-foreground pb-4">
              <p>{app.description}</p>
            </CardContent>

            <div className="px-6 pb-6 flex gap-2 mt-auto">
              {status === "locked" ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/billing">
                    <Icon.Lock className="mr-1.5 size-3.5" />
                    Upgrade to {tierLabels[app.planGate]}
                  </Link>
                </Button>
              ) : (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {status === "enabled" ? "Enabled" : "Disabled"}
                  </span>
                  <AppToggle appId={app.id} enabled={status === "enabled"} />
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {!search && !visibleApps.length && (
        <div className="col-span-full flex flex-col items-center justify-center h-[calc(100vh-400px)]">
          <h3 className="text-lg font-semibold text-foreground">
            No apps installed
          </h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            You haven't installed any apps yet. Go to the 'All Apps' tab to
            browse available apps.
          </p>
        </div>
      )}

      {search && !visibleApps.length && (
        <div className="col-span-full flex flex-col items-center justify-center h-[calc(100vh-400px)]">
          <h3 className="text-lg font-semibold text-foreground">
            No apps found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
            No apps found for your search, let us know if you want to see a
            specific app in the app store.
          </p>

          <Button variant="outline" className="mt-4" asChild>
            <Link href="/app-store">Clear search</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function AppLogo({ app }: AppLogoInput) {
  return (
    <div className="flex size-8 items-center justify-center text-primary">
      <RegistryIcon className="size-6" name={app.icon} />
    </div>
  );
}
