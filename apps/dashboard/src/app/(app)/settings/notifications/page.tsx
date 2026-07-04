import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { NotificationPreferencesTable } from "@/components/tables/notification-preferences";
import { NotificationPreferencesSkeleton } from "@/components/tables/notification-preferences/skeleton";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Notification Preferences | Plot Keys",
};

type NotificationPreferencesPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function NotificationPreferencesPage({
  searchParams,
}: NotificationPreferencesPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};

  batchPrefetch([trpc.notifications.listPreferences.queryOptions()]);

  return (
    <DashboardPage className="max-w-none">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {params.saved ? (
          <Alert className="border-primary/20 bg-primary/10 text-foreground">
            <AlertDescription>Notification preferences saved.</AlertDescription>
          </Alert>
        ) : null}

        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<NotificationPreferencesSkeleton />}>
              <NotificationPreferencesTable />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </DashboardPage>
  );
}
