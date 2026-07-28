"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { LeaveRequestForm } from "@/components/forms/leave-request-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useLeaveRequestParams } from "@/hooks/use-leave-request-params";
import { useTRPC } from "@/trpc/client";

export function LeaveRequestCreateSheet() {
  const trpc = useTRPC();
  const { createLeaveRequest, setParams } = useLeaveRequestParams();
  const isOpen = Boolean(createLeaveRequest);
  const { data: employees, isLoading } = useQuery(
    trpc.employees.list.queryOptions(
      {
        size: 200,
        status: "active",
      },
      {
        enabled: isOpen,
        staleTime: 30 * 1000,
      },
    ),
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Capture time away and route it into the approval queue."
          onClose={() => setParams(null)}
          title="New leave request"
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <LeaveRequestForm
            employees={employees?.data ?? []}
            onCancel={() => setParams(null)}
            onSuccess={() => setParams(null)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
