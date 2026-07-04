"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { DepartmentForm } from "@/components/forms/department-form";

export function DepartmentSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add department
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <DashboardSheetHeader
          description="Define an internal team grouping before assigning employees."
          title="Add department"
        />
        <DepartmentForm onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
