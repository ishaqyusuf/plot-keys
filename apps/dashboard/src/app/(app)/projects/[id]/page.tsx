import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectDetailContent } from "@/components/projects/project-detail-content";
import { ProjectDetailSkeleton } from "@/components/projects/project-detail-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project details | Plot Keys",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  prefetch(trpc.projects.getOverviewDetail.queryOptions({ projectId }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectDetailSkeleton />}>
            <ProjectDetailContent projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
