"use client";

import { Button } from "@plotkeys/ui/button";
import { CalendarRange, SearchX } from "lucide-react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

type AppointmentsNoResultsProps = {
  onClear: () => void;
};

export function AppointmentsEmptyState() {
  return (
    <DashboardEmptyState
      description="No appointments found for this view yet."
      icon={<CalendarRange className="size-5" />}
      title="Nothing on the schedule"
    />
  );
}

export function AppointmentsNoResults({ onClear }: AppointmentsNoResultsProps) {
  return (
    <div className="flex min-h-72 items-center justify-center px-5 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="size-5" />
        </div>
        <h3 className="font-medium text-foreground">No appointments found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another search term or clear the current appointment search.
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
