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
import type { AppointmentStatus } from "@/components/appointments/appointment-utils";
import { useTRPC } from "@/trpc/client";
import type { AppointmentTableRow } from "./columns";

const statusFlow: Partial<
  Record<AppointmentStatus, { label: string; next: AppointmentStatus }>
> = {
  confirmed: { label: "Mark completed", next: "completed" },
  pending: { label: "Confirm appointment", next: "confirmed" },
};

type Props = {
  row: AppointmentTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const flow = statusFlow[row.status];
  const invalidateAppointments = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.appointments.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.appointments.stats.queryKey(),
      }),
    ]);
  };
  const updateStatusMutation = useMutation(
    trpc.appointments.updateStatus.mutationOptions({
      onSuccess: invalidateAppointments,
    }),
  );
  const deleteMutation = useMutation(
    trpc.appointments.delete.mutationOptions({
      onSuccess: invalidateAppointments,
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
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => {
                updateStatusMutation.mutate({
                  appointmentId: row.id,
                  status: flow.next,
                });
              }}
            >
              {flow.label}
            </DropdownMenuItem>
          ) : null}

          {row.status !== "cancelled" ? (
            <DropdownMenuItem
              className="text-destructive"
              disabled={isPending}
              onClick={() => {
                updateStatusMutation.mutate({
                  appointmentId: row.id,
                  status: "cancelled",
                });
              }}
            >
              Cancel appointment
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            disabled={isPending}
            onClick={() => {
              deleteMutation.mutate({ appointmentId: row.id });
            }}
          >
            Delete appointment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
