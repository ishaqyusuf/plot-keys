"use client";

import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { useDepartmentsFilterParams } from "@/hooks/use-departments-filter-params";

export function EmptyState() {
  return (
    <CoreEmptyState
      description="Create your first department to start structuring the workforce."
      title="No departments yet"
    />
  );
}

export function NoResults() {
  const { setFilter } = useDepartmentsFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
