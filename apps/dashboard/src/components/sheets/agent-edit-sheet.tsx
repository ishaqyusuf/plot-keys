"use client";

import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { Skeleton } from "@plotkeys/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentForm, type AgentFormRecord } from "@/components/forms/agent-form";
import { StackedSheetHeader } from "@/components/stacked-sheet-header";
import { useAgentParams } from "@/hooks/use-agent-params";
import { useTRPC } from "@/trpc/client";
import { findDashboardListItemInQueryCache } from "@/utils/dashboard-list-contract";

export function AgentEditSheet() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { agentId, createAgent, inviteAgent, setParams } = useAgentParams();
  const isOpen = Boolean(agentId && !createAgent && !inviteAgent);

  const { data: agent, isLoading } = useQuery(
    trpc.agents.get.queryOptions(
      { agentId: agentId! },
      {
        enabled: isOpen,
        placeholderData: () =>
          agentId
            ? findDashboardListItemInQueryCache<AgentFormRecord>(
                queryClient,
                trpc.agents.list.infiniteQueryKey(),
                agentId,
              )
            : undefined,
        staleTime: 30 * 1000,
      },
    ),
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && setParams(null)}>
      <SheetContent stack>
        <StackedSheetHeader
          description="Update the agent profile, ordering, and featured status without leaving the team workspace."
          onClose={() => setParams(null)}
          title="Edit Agent"
        />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : agent ? (
          <AgentForm
            agent={agent}
            key={agent.id}
            mode="edit"
            onCancel={() => setParams(null)}
            onSuccess={() => setParams(null)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
