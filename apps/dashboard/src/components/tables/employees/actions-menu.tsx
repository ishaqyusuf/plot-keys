"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EmployeeStatus } from "@/components/employees/employee-utils";
import { useTRPC } from "@/trpc/client";
import type { EmployeeTableRow } from "./columns";

type Props = {
  row: EmployeeTableRow;
};

const statusFlow: Partial<
  Record<EmployeeStatus, { label: string; next: EmployeeStatus }>
> = {
  active: { label: "Set on leave", next: "on_leave" },
  on_leave: { label: "Reactivate", next: "active" },
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const flow = statusFlow[row.status];
  const invalidateEmployees = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.employees.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.employees.stats.queryKey(),
      }),
    ]);
  };
  const updateStatusMutation = useMutation(
    trpc.employees.updateStatus.mutationOptions({
      onSuccess: invalidateEmployees,
    }),
  );
  const deleteMutation = useMutation(
    trpc.employees.delete.mutationOptions({
      onSuccess: invalidateEmployees,
    }),
  );
  const isPending = updateStatusMutation.isPending || deleteMutation.isPending;

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {flow ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  updateStatusMutation.mutate({
                    employeeId: row.id,
                    status: flow.next,
                  });
                }}
              >
                {flow.label}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}

          <DropdownMenuItem
            className="text-destructive"
            disabled={isPending}
            onClick={() => {
              deleteMutation.mutate({ employeeId: row.id });
            }}
          >
            Remove employee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
