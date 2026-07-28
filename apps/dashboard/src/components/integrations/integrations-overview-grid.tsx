"use client";

import {
  type CompanyIntegration,
  IntegrationCard,
} from "@/components/integrations/integration-card";
import { integrations } from "@/components/integrations/integration-catalog";
import { IntegrationsEmptyState } from "@/components/integrations/integrations-empty-states";
import { IntegrationsSection } from "@/components/integrations/integrations-section";

export function IntegrationsOverviewGrid({
  integration,
}: {
  integration: CompanyIntegration;
}) {
  return (
    <IntegrationsSection
      description="Turn on the services that matter to your growth workflow and configure credentials in settings."
      title="Available integrations"
    >
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {integrations.length > 0 ? (
          integrations.map((app) => (
            <IntegrationCard
              key={app.key}
              app={app}
              integration={integration}
            />
          ))
        ) : (
          <div className="sm:col-span-2">
            <IntegrationsEmptyState />
          </div>
        )}
      </div>
    </IntegrationsSection>
  );
}
