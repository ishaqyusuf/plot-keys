"use client";

import { Button } from "@plotkeys/ui/button";
import {
  EmptyState as CoreEmptyState,
  NoResults as CoreNoResults,
} from "@/components/tables/core";
import { usePropertyFilterParams } from "@/hooks/use-property-filter-params";
import { usePropertyParams } from "@/hooks/use-property-params";

export function EmptyState() {
  const { setParams } = usePropertyParams();

  return (
    <CoreEmptyState
      action={
        <Button
          variant="outline"
          onClick={() => setParams({ createProperty: true })}
        >
          Create listing
        </Button>
      }
      description={
        <>
          You haven't created any listings yet. <br />
          Go ahead and create your first one.
        </>
      }
      title="No listings"
    />
  );
}

export function NoResults() {
  const { setFilter } = usePropertyFilterParams();

  return <CoreNoResults onClear={() => setFilter(null)} />;
}
