import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectDetailTable } from "@/components/tables/projects/detail";
import { ProjectDetailSkeleton } from "@/components/tables/projects/detail-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project details | Plot Keys",
};

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  batchPrefetch([trpc.projects.getOverviewDetail.queryOptions({ projectId })]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailTable projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
