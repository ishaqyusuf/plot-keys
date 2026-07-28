"use client";

import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";
import { useCallback } from "react";
import type { loadSortParams } from "@/hooks/use-sort-params";

export const notificationsFilterParamsSchema = {
  end: parseAsString,
  filter: parseAsString,
  q: parseAsString,
  start: parseAsString,
};

export const loadNotificationsFilterParams = createLoader(
  notificationsFilterParamsSchema,
);

export type NotificationsFilters = Awaited<
  ReturnType<typeof loadNotificationsFilterParams>
>;
type NotificationsSort = Awaited<ReturnType<typeof loadSortParams>>["sort"];
type NotificationsListInputOptions = {
  q?: string | null;
};

export function resolveNotificationsListInput(
  filters: NotificationsFilters,
  sort: NotificationsSort,
  options: NotificationsListInputOptions = {},
) {
  const onlyUnread = filters.filter === "unread";

  return {
    end: filters.end,
    onlyUnread,
    q: options.q ?? filters.q,
    sort,
    start: filters.start,
  };
}

const clearNotificationsFilters: NotificationsFilters = {
  end: null,
  filter: null,
  q: null,
  start: null,
};

export function useNotificationsFilterParams() {
  const [filter, setFilterParams] = useQueryStates(
    notificationsFilterParamsSchema,
  );
  const setFilter = useCallback(
    (next: Partial<NotificationsFilters> | null) => {
      void setFilterParams(next ?? clearNotificationsFilters);
    },
    [setFilterParams],
  );

  return {
    filter,
    filters: filter,
    setFilter,
    setFilters: setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}
