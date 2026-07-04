"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { getConnectedIntegrationCount } from "./columns";
import { IntegrationsOverviewGrid } from "./table";
import { IntegrationsPageHeader } from "./table-header";

export function IntegrationsTable() {
  const trpc = useTRPC();
  const { data: integration } = useSuspenseQuery(
    trpc.workspace.getCompanyIntegration.queryOptions(),
  );
  const connectedCount = getConnectedIntegrationCount(integration);

  return (
    <div className="flex flex-col gap-5">
      <IntegrationsPageHeader connectedCount={connectedCount} />
      <IntegrationsOverviewGrid integration={integration} />
    </div>
  );
}
