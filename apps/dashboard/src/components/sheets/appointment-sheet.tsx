"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function AppointmentSheet() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const { data: agents } = useSuspenseQuery(
    trpc.workspace.listAgents.queryOptions({ size: 100 }),
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <CalendarPlus className="size-4" />
          Schedule
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description="Add upcoming viewings and assign them to the right team member without leaving the schedule view."
          title="Schedule appointment"
        />
        <AppointmentForm agents={agents.data} onCancel={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
