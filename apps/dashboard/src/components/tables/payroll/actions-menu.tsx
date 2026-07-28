"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { PayrollEntryTableRow } from "./columns";

type Props = {
  row: PayrollEntryTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const invalidatePayroll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.payroll.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.payroll.summary.queryKey(),
      }),
    ]);
  };
  const markPaidMutation = useMutation(
    trpc.payroll.markPaid.mutationOptions({
      onSuccess: invalidatePayroll,
    }),
  );

  if (row.status !== "pending") {
    return <span className="text-xs text-muted-foreground">No actions</span>;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={markPaidMutation.isPending}
            onClick={() => {
              markPaidMutation.mutate({ payrollEntryId: row.id });
            }}
          >
            Mark paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
