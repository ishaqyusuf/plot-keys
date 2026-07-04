"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { CreateEstateForm } from "@/components/forms/estate-form";

export function EstateCreateSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">Create estate launch</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description="Group land listings into a presale campaign with launch copy, plan import, and purchase pipeline support."
          title="Create estate launch"
        />
        <CreateEstateForm />
      </SheetContent>
    </Sheet>
  );
}
