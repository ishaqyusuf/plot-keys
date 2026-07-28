"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { CreateEstateForm } from "@/components/forms/estate-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useEstateParams } from "@/hooks/use-estate-params";

export function EstateCreateSheet() {
  const { createEstate, setParams } = useEstateParams();
  const isOpen = Boolean(createEstate);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Group land listings into a presale campaign with launch copy, plan import, and purchase pipeline support."
          onClose={() => setParams(null)}
          title="Create estate launch"
        />

        <CreateEstateForm onSuccess={() => setParams(null)} />
      </SheetContent>
    </Sheet>
  );
}
