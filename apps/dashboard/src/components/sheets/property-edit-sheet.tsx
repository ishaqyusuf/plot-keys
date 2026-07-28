"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PropertyForm } from "@/components/forms/property-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import type { PropertyTableRow } from "@/components/tables/properties/columns";
import { usePropertyParams } from "@/hooks/use-property-params";
import { useTRPC } from "@/trpc/client";
import { findDashboardListItemInQueryCache } from "@/utils/dashboard-list-contract";

export function PropertyEditSheet() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { createProperty, details, propertyId, setParams } =
    usePropertyParams();
  const isOpen = Boolean(propertyId && !details && !createProperty);
  const cachedProperty = propertyId
    ? findDashboardListItemInQueryCache<PropertyTableRow>(
        queryClient,
        trpc.properties.list.infiniteQueryKey(),
        propertyId,
      )
    : undefined;

  const { data: detail, isLoading } = useQuery(
    trpc.properties.get.queryOptions(
      { propertyId: propertyId! },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );
  const formProperty = isLoading ? cachedProperty : detail?.property;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          closeLabel="Close listing sheet"
          description="Update pricing, details, and publish state without leaving the inventory view."
          onClose={() => setParams(null)}
          title="Edit Listing"
        />

        {isLoading && !cachedProperty ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : formProperty ? (
          <PropertyForm
            key={`${formProperty.id}:${isLoading ? "cached" : "detail"}`}
            mode="edit"
            onCancel={() => setParams(null)}
            onSuccess={() => setParams(null)}
            property={formProperty}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
