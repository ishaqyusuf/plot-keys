import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { BuilderTemplatePreview } from "@/components/builder/builder-template-preview";
import { BuilderTemplatePreviewSkeleton } from "@/components/builder/builder-template-preview-skeleton";
import { ErrorFallback } from "@/components/error-fallback";
import { requireOnboardedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Builder Preview | Plot Keys",
};

export default async function BuilderPreviewPage() {
  await requireOnboardedSession();

  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <Suspense fallback={<BuilderTemplatePreviewSkeleton />}>
        <BuilderTemplatePreview />
      </Suspense>
    </ErrorBoundary>
  );
}
