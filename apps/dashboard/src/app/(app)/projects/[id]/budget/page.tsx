import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { ProjectBudgetTable } from "@/components/tables/projects/budget";
import { ProjectBudgetSkeleton } from "@/components/tables/projects/budget-skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Project budget | Plot Keys",
};

type BudgetPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectBudgetPage({ params }: BudgetPageProps) {
  await requireOnboardedSession();
  const { id: projectId } = await params;

  batchPrefetch([trpc.projects.getBudgetDetail.queryOptions({ projectId })]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<ProjectBudgetSkeleton />}>
            <ProjectBudgetTable projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
