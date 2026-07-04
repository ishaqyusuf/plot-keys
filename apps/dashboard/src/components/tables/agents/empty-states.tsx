"use client";

import { Button } from "@plotkeys/ui/button";
import { SearchX, UsersRound } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

type AgentsNoResultsProps = {
  onClear: () => void;
};

export function AgentsEmptyState() {
  return (
    <DashboardEmptyState
      description="Invite your first agent and they will complete their profile themselves."
      icon={<UsersRound className="size-5" />}
      title="No agents yet"
    />
  );
}

export function AgentsNoResults({ onClear }: AgentsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No agents found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current agent search.
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
