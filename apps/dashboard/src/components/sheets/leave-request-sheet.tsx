"use client";

import { Button } from "@plotkeys/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@plotkeys/ui/sheet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { DashboardSheetHeader } from "@/components/sheets/dashboard-sheet-layout";
import { LeaveRequestForm } from "@/components/forms/leave-request-form";
import { useTRPC } from "@/trpc/client";

export function LeaveRequestSheet() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const { data: employees } = useSuspenseQuery(
    trpc.workspace.listEmployees.queryOptions({
      size: 200,
      status: "active",
    }),
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size="sm">
          <CalendarPlus className="size-4" />
          Submit request
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <DashboardSheetHeader
          description="Capture time away and route it into the approval queue."
          title="New leave request"
        />
        <LeaveRequestForm
          employees={employees.data}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
