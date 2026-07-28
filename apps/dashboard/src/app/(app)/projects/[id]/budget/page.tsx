import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectBudgetContent } from "@/components/projects/project-budget-content";
import { ProjectBudgetSkeleton } from "@/components/projects/project-budget-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project budget | Plot Keys",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectBudgetPage({ params }: Props) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  prefetch(trpc.projects.getBudgetDetail.queryOptions({ projectId }));

  return (
    <HydrateClient>
      <ScrollableContent>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectBudgetSkeleton />}>
            <ProjectBudgetContent projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </ScrollableContent>
    </HydrateClient>
  );
}
