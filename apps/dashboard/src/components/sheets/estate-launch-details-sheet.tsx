"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import {
  EstateLaunchDetailsForm,
  type EstateLaunchDetailsFormRecord,
} from "@/components/forms/estate-launch-details-form";

type EstateLaunchDetailsSheetProps = {
  estate: EstateLaunchDetailsFormRecord;
};

export function EstateLaunchDetailsSheet({
  estate,
}: EstateLaunchDetailsSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">Edit launch</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <DashboardSheetHeader
          description="Manage the flyer-style launch content buyers use to understand location, trust, amenities, and the presale deal."
          title="Edit estate launch"
        />
        <EstateLaunchDetailsForm
          estate={estate}
          onSuccess={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
