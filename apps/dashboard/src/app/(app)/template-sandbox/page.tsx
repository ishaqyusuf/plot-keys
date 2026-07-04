import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { TemplateSandboxSkeleton } from "@/components/template-sandbox/skeleton";
import { TemplateSandboxIndex } from "@/components/template-sandbox/template-sandbox-index";
import { getBaseUrl } from "@/lib/get-base-url";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Template Sandbox | Plot Keys",
};

export default async function TemplateSandboxPage() {
  const currentOrigin = await getBaseUrl();

  batchPrefetch([
    trpc.templateSandbox.list.queryOptions(),
    trpc.workspace.getTemplateCatalog.queryOptions(),
  ]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<TemplateSandboxSkeleton />}>
            <TemplateSandboxIndex currentOrigin={currentOrigin} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
