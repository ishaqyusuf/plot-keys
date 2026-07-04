"use client";

import { Button } from "@plotkeys/ui/button";
import { SearchX, Target } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { LeadStatus } from "@/components/leads/lead-utils";

type LeadsEmptyStateProps = {
  activeStatus?: LeadStatus;
};

type LeadsNoResultsProps = {
  onClear: () => void;
};

export function LeadsEmptyState({ activeStatus }: LeadsEmptyStateProps) {
  return (
    <DashboardEmptyState
      description={
        activeStatus
          ? `No ${activeStatus} leads yet.`
          : "Leads from your website contact form will appear here once demand starts coming in."
      }
      icon={<Target className="size-5" />}
      title="No leads yet"
    />
  );
}

export function LeadsNoResults({ onClear }: LeadsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No leads found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current lead search.
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
