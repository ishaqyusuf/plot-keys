"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

export function useProjectCacheInvalidation(projectId: string) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return async function invalidateProjectCache() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getOverviewDetail.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.get.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getBudget.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getBudgetDetail.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.getWorkforceDetail.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.listWorkers.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.listPayrollRuns.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.listCustomerAccess.queryKey({ projectId }),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey({}),
      }),
      queryClient.invalidateQueries({
        queryKey: trpc.projects.stats.queryKey(),
      }),
    ]);
    router.refresh();
  };
}
