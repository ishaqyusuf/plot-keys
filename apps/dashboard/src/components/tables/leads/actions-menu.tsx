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
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/components/leads/lead-utils";
import { useTRPC } from "@/trpc/client";
import type { LeadTableRow } from "./columns";

const statusFlow: Partial<
  Record<LeadStatus, { label: string; next: LeadStatus }>
> = {
  contacted: { label: "Mark qualified", next: "qualified" },
  new: { label: "Mark contacted", next: "contacted" },
  qualified: { label: "Mark closed", next: "closed" },
};

type Props = {
  row: LeadTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const flow = statusFlow[row.status];
  const invalidateLeads = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.leads.list.infiniteQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.leads.stats.queryKey(),
      }),
    ]);
  };
  const updateStatusMutation = useMutation(
    trpc.leads.updateStatus.mutationOptions({
      onSuccess: invalidateLeads,
    }),
  );
  const convertMutation = useMutation(
    trpc.leads.convertToCustomer.mutationOptions({
      async onSuccess() {
        await Promise.all([
          invalidateLeads(),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.get.infiniteQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.customers.stats.queryKey(),
          }),
        ]);
        router.push("/customers");
      },
    }),
  );
  const isPending = updateStatusMutation.isPending || convertMutation.isPending;

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
                  leadId: row.id,
                  status: flow.next,
                });
              }}
            >
              {flow.label}
            </DropdownMenuItem>
          ) : null}

          {row.status === "qualified" ? (
            <>
              {flow ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  convertMutation.mutate({ leadId: row.id });
                }}
              >
                Convert to customer
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
