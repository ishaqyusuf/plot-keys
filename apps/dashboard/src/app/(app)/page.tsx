import type { Metadata } from "next";
import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import { buildTenantSiteUrl } from "@plotkeys/utils";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ensureBuilderConfigurationExists } from "@/app/actions";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { DashboardHome } from "@/components/dashboard/home";
import { DashboardHomeSkeleton } from "@/components/dashboard/home/skeleton";
import { DevTenantFabLoader } from "@/components/dev/dev-tenant-fab-loader";
import { ErrorFallback } from "@/components/error-fallback";
import { getBaseUrl } from "@/lib/get-base-url";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard | Plot Keys",
};

type DashboardHomePageProps = {
  searchParams?: Promise<{
    domains?: string;
    error?: string;
  }>;
};

export default async function DashboardHomePage({
  searchParams,
}: DashboardHomePageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const currentOrigin = await getBaseUrl();
  const liveSiteUrl = buildTenantSiteUrl(session.activeMembership.companySlug, {
    currentOrigin,
  });

  await ensureBuilderConfigurationExists();
  batchPrefetch([trpc.workspace.getDashboardOverview.queryOptions()]);

  return (
    <>
      <DashboardPage>
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<DashboardHomeSkeleton />}>
              <DashboardHome
                companyName={session.activeMembership.companyName}
                liveSiteUrl={liveSiteUrl}
              />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </DashboardPage>
      <DevTenantFabLoader />
    </>
  );
}
