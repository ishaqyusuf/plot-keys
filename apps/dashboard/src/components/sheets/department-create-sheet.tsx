"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { DepartmentForm } from "@/components/forms/department-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useDepartmentParams } from "@/hooks/use-department-params";

export function DepartmentCreateSheet() {
  const { createDepartment, setParams } = useDepartmentParams();
  const isOpen = Boolean(createDepartment);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Define an internal team grouping before assigning employees."
          onClose={() => setParams(null)}
          title="Add department"
        />

        <DepartmentForm
          onCancel={() => setParams(null)}
          onSuccess={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
