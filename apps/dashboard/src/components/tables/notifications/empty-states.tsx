"use client";

import { Button } from "@plotkeys/ui/button";
import { BellIcon, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

type NotificationsEmptyStateProps = {
  onlyUnread: boolean;
};

type NotificationsNoResultsProps = {
  onClear: () => void;
};

export function NotificationsEmptyState({
  onlyUnread,
}: NotificationsEmptyStateProps) {
  return (
    <DashboardEmptyState
      description={
        onlyUnread ? "No unread notifications." : "No notifications yet."
      }
      icon={<BellIcon className="size-5" />}
      title="Nothing in the inbox"
    />
  );
}

export function NotificationsNoResults({
  onClear,
}: NotificationsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">
          No notifications found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current notification search.
        </p>
        <Button
          className="mt-4"
          onClick={onClear}
          size="sm"
          type="button"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
