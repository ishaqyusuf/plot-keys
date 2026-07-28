"use client";

import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useAppointmentFilterParams } from "@/hooks/use-appointment-filter-params";

export function EmptyState() {
  return (
    <CoreEmptyState
      description="No appointments found for this view yet."
      title="Nothing on the schedule"
    />
  );
}

export function NoResults() {
  const { setFilter } = useAppointmentFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
