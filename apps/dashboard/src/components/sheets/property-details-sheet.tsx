"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { PropertyDetails } from "@/components/property-details";
import { usePropertyParams } from "@/hooks/use-property-params";

export function PropertyDetailsSheet() {
  const { details, propertyId, setParams } = usePropertyParams();
  const isOpen = Boolean(propertyId && details);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) =>
        !open && setParams({ details: null, propertyId: null })
      }
    >
      <SheetContent style={{ maxWidth: 620 }} className="pb-4">
        <PropertyDetails />
      </SheetContent>
    </Sheet>
  );
}
