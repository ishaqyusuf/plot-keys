"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo, useRef } from "react";
import {
  BulkClientDeleteAction,
  CoreDataTableContent,
  CoreDataTableShell,
  useDashboardTable,
  useDashboardTableRuntime,
  useDashboardTableSettings,
} from "@/components/tables/core";
import {
  resolveBlogListInput,
  useBlogFilterParams,
} from "@/hooks/use-blog-filter-params";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { useSortParams } from "@/hooks/use-sort-params";
import { useBlogStore } from "@/store/blog";
import { useTRPC } from "@/trpc/client";
import { getDashboardInfiniteListState } from "@/utils/dashboard-list-contract";
import type { TableSettings } from "@/utils/table-settings";
import { type BlogPostTableRow, columns } from "./columns";
import { EmptyState, NoResults } from "./empty-states";
import { DataTableHeader } from "./table-header";

type Props = {
  initialSettings?: Partial<TableSettings>;
};

export function DataTable({ initialSettings }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const parentRef = useRef<HTMLDivElement>(null);
  useScrollHeader(parentRef);
  const { rowSelection, setColumns, setRowSelection } = useBlogStore();
  const { filter, hasFilters } = useBlogFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filter.q);
  const {
    columnVisibility,
    setColumnVisibility,
    columnSizing,
    setColumnSizing,
    columnOrder,
    setColumnOrder,
  } = useDashboardTableSettings({
    columns,
    initialSettings,
    tableId: "blog",
  });
  const listInput = resolveBlogListInput(filter, params.sort, {
    q: deferredSearch,
  });
  const infiniteQueryOptions = trpc.blog.list.infiniteQueryOptions(listInput, {
    getNextPageParam: ({ meta }) => meta?.cursor,
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const { items: posts } = useMemo(
    () => getDashboardInfiniteListState<BlogPostTableRow>(data.pages),
    [data.pages],
  );
  const invalidateBlogPosts = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.blog.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.blog.stats.queryKey(),
      }),
    ]);
  }, [queryClient, trpc]);
  const deleteBlogPostsMutation = useMutation(
    trpc.blog.deleteMany.mutationOptions({
      onSuccess: invalidateBlogPosts,
    }),
  );
  const table = useDashboardTable({
    columnOrder,
    columns,
    columnSizing,
    columnVisibility,
    data: posts,
    rowSelection,
    setColumnOrder,
    setColumnSizing,
    setColumnVisibility,
    setRowSelection,
  });

  const {
    clearSelection,
    contentRuntime,
    selectedCount,
    selectedIds,
    shellRuntime,
  } = useDashboardTableRuntime({
    columnVisibility,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    parentRef,
    rowSelection,
    setColumns,
    setRowSelection,
    table,
    tableId: "blog",
  });
  const handleBulkDeletePosts = useCallback(() => {
    deleteBlogPostsMutation.mutate({ blogPostIds: selectedIds });
    clearSelection();
  }, [deleteBlogPostsMutation, selectedIds, clearSelection]);

  if (hasFilters && !posts.length) {
    return <NoResults />;
  }

  if (!posts.length) {
    return <EmptyState activeStatus={listInput.status} />;
  }

  return (
    <CoreDataTableShell
      bottomBar={
        <BulkClientDeleteAction
          count={selectedCount}
          disabled={deleteBlogPostsMutation.isPending}
          label="posts"
          onConfirm={handleBulkDeletePosts}
        />
      }
      runtime={shellRuntime}
    >
      <CoreDataTableContent
        table={table}
        header={DataTableHeader}
        runtime={contentRuntime}
      />
    </CoreDataTableShell>
  );
}
