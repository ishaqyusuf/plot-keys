import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { DomainsTable } from "@/components/tables/domains";
import { DomainsSkeleton } from "@/components/tables/domains/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Domains | Plot Keys",
};

type DomainsPageProps = {
  searchParams?: Promise<{
    connected?: string;
    error?: string;
    removed?: string;
    synced?: string;
  }>;
};

export default async function DomainsPage({ searchParams }: DomainsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  batchPrefetch([
    trpc.workspace.getTenantDomainStatus.queryOptions(),
    trpc.workspace.getCustomDomainDnsInstructions.queryOptions(),
  ]);

  return (
    <DashboardPage>
      {params.error ? (
        <Alert variant="destructive">
          <AlertDescription>{params.error}</AlertDescription>
        </Alert>
      ) : null}

      {params.synced ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>
            Domain sync queued. Refresh the page in a few moments to check
            updated statuses.
          </AlertDescription>
        </Alert>
      ) : null}

      {params.connected ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>
            Custom domain connected. Configure the DNS records below, then sync
            to verify.
          </AlertDescription>
        </Alert>
      ) : null}

      {params.removed ? (
        <Alert className="border-primary/20 bg-primary/10 text-foreground">
          <AlertDescription>
            Custom domain removed successfully.
          </AlertDescription>
        </Alert>
      ) : null}

      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<DomainsSkeleton />}>
            <DomainsTable />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
