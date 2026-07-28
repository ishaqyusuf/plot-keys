import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectWorkforceContent } from "@/components/projects/project-workforce-content";
import { ProjectWorkforceSkeleton } from "@/components/projects/project-workforce-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project workforce | Plot Keys",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkforcePage({ params }: Props) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  prefetch(trpc.projects.getWorkforceDetail.queryOptions({ projectId }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectWorkforceSkeleton />}>
            <ProjectWorkforceContent projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
