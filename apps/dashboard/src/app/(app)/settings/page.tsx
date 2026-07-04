import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { SettingsTable } from "@/components/tables/settings";
import { SettingsSkeleton } from "@/components/tables/settings/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Settings | Plot Keys",
};

type SettingsPageProps = {
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const canEdit =
    session.activeMembership.role === "owner" ||
    session.activeMembership.role === "admin";

  batchPrefetch([trpc.workspace.getCompanySettings.queryOptions()]);

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {params.error ? (
          <Alert variant="destructive">
            <AlertDescription>{params.error}</AlertDescription>
          </Alert>
        ) : null}

        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Settings saved.</AlertDescription>
          </Alert>
        ) : null}

        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<SettingsSkeleton />}>
              <SettingsTable
                canEdit={canEdit}
                companyName={session.activeMembership.companyName}
                companySlug={session.activeMembership.companySlug}
              />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </DashboardPage>
  );
}
