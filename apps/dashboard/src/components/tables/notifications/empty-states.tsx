"use client";

import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useNotificationsFilterParams } from "@/hooks/use-notifications-filter-params";

type Props = {
  onlyUnread: boolean;
};

export function EmptyState({ onlyUnread }: Props) {
  return (
    <CoreEmptyState
      description={
        onlyUnread ? "No unread notifications." : "No notifications yet."
      }
      title="Nothing in the inbox"
    />
  );
}

export function NoResults() {
  const { setFilter } = useNotificationsFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
