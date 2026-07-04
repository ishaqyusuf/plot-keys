"use client";

import {
  DashboardSection,
  DashboardSectionDescription,
  DashboardSectionHeader,
  DashboardSectionTitle,
} from "@/components/dashboard/dashboard-page";
import { integrations } from "./catalog";
import { type CompanyIntegration, IntegrationCard } from "./columns";
import { IntegrationsEmptyState } from "./empty-states";

export function IntegrationsOverviewGrid({
  integration,
}: {
  integration: CompanyIntegration;
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader>
        <div>
          <DashboardSectionTitle>Available integrations</DashboardSectionTitle>
          <DashboardSectionDescription>
            Turn on the services that matter to your growth workflow and
            configure credentials in settings.
          </DashboardSectionDescription>
        </div>
      </DashboardSectionHeader>
      <div className="grid gap-6 sm:grid-cols-2">
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
    </DashboardSection>
  );
}
