"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useDeferredValue, useMemo } from "react";
import {
  DashboardTablePage,
  DashboardTablePageBody,
} from "@/components/dashboard/dashboard-page";
import { usePropertiesFilterParams } from "@/hooks/use-properties-filter-params";
import { useSortParams } from "@/hooks/use-sort-params";
import { useTRPC } from "@/trpc/client";
import type { TableSettings } from "@/utils/table-settings";
import {
  PropertiesEmptyState,
  PropertiesNoResults,
} from "./empty-states";
import { PropertiesDataTable } from "./data-table";
import { PropertiesHeader } from "./table-header";

const statusVariant: Record<string, "default" | "outline" | "secondary"> = {
  active: "default",
  off_market: "outline",
  rented: "secondary",
  sold: "outline",
};

const publishVariant: Record<
  string,
  "default" | "outline" | "secondary" | "destructive"
> = {
  archived: "secondary",
  draft: "outline",
  published: "default",
};

const typeLabels: Record<string, string> = {
  commercial: "Commercial",
  industrial: "Industrial",
  land: "Land",
  mixed_use: "Mixed use",
  residential: "Home",
};

type PropertiesTableProps = {
  initialSettings?: Partial<TableSettings>;
  siteUrl: string;
};

export function PropertiesTable({
  initialSettings,
  siteUrl,
}: PropertiesTableProps) {
  const trpc = useTRPC();
  const { filters, hasFilters } = usePropertiesFilterParams();
  const { params } = useSortParams();
  const deferredSearch = useDeferredValue(filters.q);
  const infiniteQueryOptions = trpc.workspace.listProperties.infiniteQueryOptions(
    {
      ...filters,
      q: deferredSearch,
      sort: params.sort,
    },
    {
      getNextPageParam: ({ meta }) => meta?.cursor,
    },
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(infiniteQueryOptions);
  const properties = useMemo(
    () => data.pages.flatMap((page) => page.data),
    [data],
  );
  const fetchMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);
  const count = data.pages[0]?.meta.count ?? properties.length;
  const query = filters.q?.trim() ?? "";

  return (
    <DashboardTablePage>
      <PropertiesHeader
        count={count}
        query={query}
        siteUrl={siteUrl}
      />

      <DashboardTablePageBody>
        {properties.length === 0 ? (
          <div className="p-5">
            {hasFilters ? <PropertiesNoResults /> : <PropertiesEmptyState />}
          </div>
        ) : (
          <PropertiesDataTable
            properties={properties}
            fetchNextPage={fetchMore}
            hasNextPage={Boolean(hasNextPage)}
            initialSettings={initialSettings}
            isFetchingNextPage={isFetchingNextPage}
            publishVariant={publishVariant}
            statusVariant={statusVariant}
            typeLabels={typeLabels}
          />
        )}
      </DashboardTablePageBody>
    </DashboardTablePage>
  );
}
