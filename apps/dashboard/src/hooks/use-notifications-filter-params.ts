"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import {
  notificationsFilterParams,
  type NotificationsFilters,
} from "@/lib/notifications-filter-params";

const clearNotificationsFilters: NotificationsFilters = {
  filter: null,
  q: null,
};

export function useNotificationsFilterParams() {
  const [filters, setFilterParams] = useQueryStates(notificationsFilterParams);
  const setFilters = useCallback(
    (next: Partial<NotificationsFilters> | null) => {
      void setFilterParams(next ?? clearNotificationsFilters);
    },
    [setFilterParams],
  );

  return {
    filters,
    hasFilters: Object.values(filters).some((value) => value !== null),
    setFilters,
  };
}
