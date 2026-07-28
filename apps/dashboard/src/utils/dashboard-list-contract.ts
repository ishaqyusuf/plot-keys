import type { QueryClient, QueryKey } from "@tanstack/react-query";

export type DashboardListMeta = {
  count: number;
  cursor: string | null;
  hasNextPage: boolean;
  size: number;
};

export type DashboardListPage<T> = {
  data: T[];
  meta: DashboardListMeta;
};

export type DashboardInfiniteListState<T> = {
  items: T[];
  totalCount: number;
};

export function flattenDashboardListPages<T>(
  pages: ReadonlyArray<DashboardListPage<T>>,
): T[] {
  return pages.flatMap((page) => page.data);
}

export function getDashboardListTotalCount<T>(
  pages: ReadonlyArray<DashboardListPage<T>>,
  fallbackCount = 0,
): number {
  return pages[0]?.meta.count ?? fallbackCount;
}

export function getDashboardListNextCursor<T>(
  page: DashboardListPage<T>,
): string | null {
  return page.meta.cursor;
}

export function getDashboardInfiniteListState<T>(
  pages: ReadonlyArray<DashboardListPage<T>>,
): DashboardInfiniteListState<T> {
  const items = flattenDashboardListPages(pages);

  return {
    items,
    totalCount: getDashboardListTotalCount(pages, items.length),
  };
}

type CachedDashboardInfiniteData<T> = {
  pages?: ReadonlyArray<DashboardListPage<T>>;
};

export function findDashboardListItemInQueryCache<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  itemId: string,
): T | undefined {
  const cachedQueries = queryClient.getQueriesData<
    CachedDashboardInfiniteData<T>
  >({
    queryKey,
  });

  for (const [, cachedData] of cachedQueries) {
    const item = cachedData?.pages
      ?.flatMap((page) => page.data ?? [])
      .find((candidate) => candidate.id === itemId);

    if (item) {
      return item;
    }
  }

  return undefined;
}
