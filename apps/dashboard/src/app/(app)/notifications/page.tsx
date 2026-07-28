import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { NotificationsHeader } from "@/components/notifications-header";
import { ScrollableContent } from "@/components/scrollable-content";
import { DataTable } from "@/components/tables/notifications/data-table";
import { NotificationsSkeleton } from "@/components/tables/notifications/skeleton";
import {
  loadNotificationsFilterParams,
  resolveNotificationsListInput,
} from "@/hooks/use-notifications-filter-params";
import { loadSortParams } from "@/hooks/use-sort-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Notifications | Plot Keys",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function NotificationsPage({ searchParams }: Props) {
  await requireOnboardedSession();
  const params = await searchParams;
  const filters = loadNotificationsFilterParams(params);
  const { sort } = loadSortParams(params);
  const listInput = resolveNotificationsListInput(filters, sort);
  const initialSettings = await getInitialTableSettings("notifications");

  batchPrefetch([
    trpc.notifications.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.notifications.unreadCount.queryOptions(),
  ]);

  return (
    <HydrateClient>
      <ScrollableContent>
        <div className="flex flex-col gap-6">
          <NotificationsHeader />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<NotificationsSkeleton />}>
              <DataTable initialSettings={initialSettings} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </ScrollableContent>
    </HydrateClient>
  );
}
