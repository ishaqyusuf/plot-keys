import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ErrorFallback } from "@/components/error-fallback";
import { NotificationsTable } from "@/components/tables/notifications";
import { NotificationsSkeleton } from "@/components/tables/notifications/skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadNotificationsFilterParams } from "@/lib/notifications-filter-params";
import { requireOnboardedSession } from "@/lib/session";
import { batchPrefetch, HydrateClient, trpc } from "@/trpc/server";
import { getInitialTableSettings } from "@/utils/columns";

export const metadata: Metadata = {
  title: "Notifications | Plot Keys",
};

type NotificationsPageProps = {
  searchParams?: Promise<
    SearchParams & {
      filter?: string;
      q?: string;
      sort?: string | string[];
    }
  >;
};

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  await requireOnboardedSession();
  const params = (await searchParams) ?? {};
  const filters = loadNotificationsFilterParams(params);
  const { sort } = loadSortParams(params);
  const onlyUnread = filters.filter === "unread";
  const listInput = { onlyUnread, q: filters.q, sort };
  const initialSettings = await getInitialTableSettings("notifications");

  batchPrefetch([
    trpc.notifications.list.infiniteQueryOptions(listInput, {
      getNextPageParam: ({ meta }) => meta?.cursor,
    }),
    trpc.notifications.unreadCount.queryOptions(),
  ]);

  return (
    <DashboardPage>
      <HydrateClient>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<NotificationsSkeleton />}>
            <NotificationsTable initialSettings={initialSettings} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </DashboardPage>
  );
}
