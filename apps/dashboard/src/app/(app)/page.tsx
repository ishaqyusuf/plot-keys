import { buildTenantSiteUrl } from "@plotkeys/utils";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardHome } from "@/components/dashboard/home";
import { ensureDashboardHomeBuilderConfiguration } from "@/components/dashboard/home/builder-configuration";
import { DashboardHomeSkeleton } from "@/components/dashboard/home/skeleton";
import { DevTenantFabLoader } from "@/components/dev/dev-tenant-fab-loader";
import { ErrorFallback } from "@/components/error-fallback";
import { ScrollableContent } from "@/components/scrollable-content";
import { getBaseUrl } from "@/lib/get-base-url";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Dashboard | Plot Keys",
};

export default async function DashboardHomePage() {
  const session = await requireOnboardedSession();
  const currentOrigin = await getBaseUrl();
  const liveSiteUrl = buildTenantSiteUrl(session.activeMembership.companySlug, {
    currentOrigin,
  });

  await ensureDashboardHomeBuilderConfiguration();
  prefetch(trpc.overview.summary.queryOptions());

  return (
    <>
      <HydrateClient>
        <ScrollableContent>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<DashboardHomeSkeleton />}>
              <DashboardHome
                companyName={session.activeMembership.companyName}
                liveSiteUrl={liveSiteUrl}
              />
            </Suspense>
          </ErrorBoundary>
        </ScrollableContent>
      </HydrateClient>
      <DevTenantFabLoader />
    </>
  );
}
