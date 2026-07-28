import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ErrorFallback } from "@/components/error-fallback";
import { QaMaintenance } from "@/components/platform/qa-maintenance";
import { QaMaintenanceHeader } from "@/components/platform/qa-maintenance-header";
import { QaMaintenanceSkeleton } from "@/components/platform/qa-maintenance-skeleton";
import { ScrollableContent } from "@/components/scrollable-content";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "QA maintenance | Plot Keys",
};

export default async function QaMaintenancePage() {
  const session = await requireOnboardedSession();

  if (session.activeMembership.role !== "platform_admin") {
    redirect("/");
  }

  batchPrefetch([
    trpc.qaMaintenance.candidates.queryOptions(),
    trpc.qaMaintenance.preview.queryOptions(),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6">
          <QaMaintenanceHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<QaMaintenanceSkeleton />}>
              <QaMaintenance />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
