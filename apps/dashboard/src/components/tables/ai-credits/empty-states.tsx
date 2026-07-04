import { Bot } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";

export function AiCreditsUsageEmptyState() {
  return (
    <DashboardEmptyState
      description="AI feature consumption will appear here after your team uses Smart Fill, page generation, or project summaries."
      icon={<Bot className="size-5" />}
      title="No AI usage yet"
    />
  );
}
