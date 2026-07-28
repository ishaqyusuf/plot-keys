"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { PropertyForm } from "@/components/forms/property-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { usePropertyParams } from "@/hooks/use-property-params";

const listingTypes = [
  "",
  "residential",
  "commercial",
  "land",
  "industrial",
  "mixed_use",
] as const;

function getListingType(value: string | null) {
  return listingTypes.includes(value as (typeof listingTypes)[number])
    ? (value as (typeof listingTypes)[number])
    : undefined;
}

export function PropertyCreateSheet() {
  const {
    createProperty,
    estateId,
    propertyLocation,
    propertyType,
    setParams,
  } = usePropertyParams();
  const isOpen = Boolean(createProperty);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          closeLabel="Close listing sheet"
          description="Add a home or land listing using fields that match the listing type."
          onClose={() => setParams(null)}
          title="Create Listing"
        />

        <PropertyForm
          defaults={{
            estateId: estateId ?? undefined,
            location: propertyLocation,
            type: getListingType(propertyType),
          }}
          mode="create"
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
