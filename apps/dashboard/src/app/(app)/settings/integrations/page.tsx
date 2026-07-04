import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { IntegrationSettingsTable } from "@/components/tables/integrations/settings";
import { IntegrationSettingsSkeleton } from "@/components/tables/integrations/settings-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Integration Settings | Plot Keys",
};

type IntegrationsPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function IntegrationsPage({
  searchParams,
}: IntegrationsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  batchPrefetch([trpc.workspace.getCompanyIntegration.queryOptions()]);

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Integrations saved.</AlertDescription>
          </Alert>
        ) : null}

        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<IntegrationSettingsSkeleton />}>
              <IntegrationSettingsTable />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </DashboardPage>
  );
}
