"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import { DashboardTablePage } from "@/components/dashboard/dashboard-page";
import { useNotificationsFilterParams } from "@/hooks/use-notifications-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import {
  NotificationsEmptyState,
  NotificationsNoResults,
} from "./empty-states";
import { NotificationsDataTable } from "./table";
import { NotificationsPageHeader } from "./table-header";

type NotificationsTableProps = {
  initialSettings?: Partial<TableSettings>;
};

export function NotificationsTable({
  initialSettings,
}: NotificationsTableProps) {
  const trpc = useTRPC();
  const { filters, setFilters } = useNotificationsFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const onlyUnread = filters.filter === "unread";
  const hasSearch = filters.q !== null;
  const listInput = {
    onlyUnread,
    q: deferredSearch,
    sort: params.sort,
  };
  const infiniteQueryOptions = trpc.notifications.list.infiniteQueryOptions(
    listInput,
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const notifications = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const notificationCount = data.pages[0]?.meta.count ?? notifications.length;
  const { data: unreadCount } = useSuspenseQuery(
    trpc.notifications.unreadCount.queryOptions(),
  );

  return (
    <div className="flex flex-col gap-5">
      <NotificationsPageHeader
        notificationCount={notificationCount}
        onlyUnread={onlyUnread}
        unreadCount={unreadCount}
      />

      {notifications.length ? (
        <DashboardTablePage>
          <NotificationsDataTable
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            notificationCount={notificationCount}
            notifications={notifications}
          />
        </DashboardTablePage>
      ) : hasSearch ? (
        <NotificationsNoResults onClear={() => setFilters({ q: null })} />
      ) : (
        <NotificationsEmptyState onlyUnread={onlyUnread} />
      )}
    </div>
  );
}
