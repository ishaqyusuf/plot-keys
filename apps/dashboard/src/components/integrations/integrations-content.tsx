"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getConnectedIntegrationCount } from "@/components/integrations/integration-card";
import { IntegrationsHeader } from "@/components/integrations/integrations-header";
import { IntegrationsOverviewGrid } from "@/components/integrations/integrations-overview-grid";
import { useTRPC } from "@/trpc/client";

export function IntegrationsContent() {
  const trpc = useTRPC();
  const { data: integration } = useSuspenseQuery(
    trpc.integrations.get.queryOptions(),
  );
  const connectedCount = getConnectedIntegrationCount(integration);

  return (
    <div className="flex flex-col gap-5">
      <IntegrationsHeader connectedCount={connectedCount} />
      <IntegrationsOverviewGrid integration={integration} />
    </div>
  );
}
