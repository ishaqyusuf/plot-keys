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
import { useAgentParams } from "@/hooks/use-agent-params";
import { useTRPC } from "@/trpc/client";
import type { AgentTableRow } from "./columns";

type Props = {
  row: AgentTableRow;
};

export function ActionsMenu({ row }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { setParams } = useAgentParams();
  const invalidateAgents = async () => {
    await queryClient.invalidateQueries({
      queryKey: trpc.agents.list.infiniteQueryKey(),
    });
  };
  const deleteMutation = useMutation(
    trpc.agents.delete.mutationOptions({
      onSuccess: invalidateAgents,
    }),
  );
  const toggleFeaturedMutation = useMutation(
    trpc.agents.toggleFeatured.mutationOptions({
      onSuccess: invalidateAgents,
    }),
  );
  const isPending =
    deleteMutation.isPending || toggleFeaturedMutation.isPending;

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icon.MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setParams({ agentId: row.id })}>
            Edit agent
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
              toggleFeaturedMutation.mutate({ agentId: row.id });
            }}
          >
            {row.featured ? "Unfeature agent" : "Feature agent"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            disabled={isPending}
            onClick={() => {
              deleteMutation.mutate({ agentId: row.id });
            }}
          >
            Delete agent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
