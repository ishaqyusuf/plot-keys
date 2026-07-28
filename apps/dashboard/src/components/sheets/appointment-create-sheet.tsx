"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useAppointmentParams } from "@/hooks/use-appointment-params";
import { useTRPC } from "@/trpc/client";

export function AppointmentCreateSheet() {
  const trpc = useTRPC();
  const { createAppointment, setParams } = useAppointmentParams();
  const isOpen = Boolean(createAppointment);
  const { data: agents } = useSuspenseQuery(
    trpc.agents.list.queryOptions({ size: 100 }),
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Add upcoming viewings and assign them to the right team member without leaving the schedule view."
          onClose={() => setParams(null)}
          title="Schedule Appointment"
        />

        <AppointmentForm
          agents={agents.data}
          onCancel={() => setParams(null)}
        />
      </SheetContent>
    </Sheet>
  );
}
