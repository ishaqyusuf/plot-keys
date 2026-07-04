import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectWorkforceTable } from "@/components/tables/projects/workforce";
import { ProjectWorkforceSkeleton } from "@/components/tables/projects/workforce-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project workforce | Plot Keys",
};

type WorkforcePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkforcePage({
  params,
}: WorkforcePageProps) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  batchPrefetch([
    trpc.projects.getWorkforceDetail.queryOptions({ projectId }),
  ]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectWorkforceSkeleton />}>
            <ProjectWorkforceTable projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
