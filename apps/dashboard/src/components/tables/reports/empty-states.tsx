import { FileBarChart2 } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function AgentPerformanceEmptyState() {
  return (
    <p className="text-muted-foreground text-sm">
      No agents found. Add agents to see performance data.
    </p>
  );
}

export function ListingsPerformanceEmptyState() {
  return (
    <p className="text-muted-foreground text-sm">
      No properties found. Add properties to see listing data.
    </p>
  );
}

export function ReportsEmptyState() {
  return (
    <DashboardEmptyState
      description="Reports will become more useful as agents, listings, and business events accumulate."
      icon={<FileBarChart2 className="size-5" />}
      title="No report data yet"
    />
  );
}
