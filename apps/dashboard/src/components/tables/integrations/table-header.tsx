import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

import {
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardPageToolbar,
  DashboardToolbarGroup,
} from "@/components/dashboard/dashboard-page";
import { integrations } from "./catalog";

type IntegrationsPageHeaderProps = {
  connectedCount: number;
};

export function IntegrationsPageHeader({
  connectedCount,
}: IntegrationsPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Connection workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Integrations</DashboardPageTitle>
          <DashboardPageDescription>
            Connect analytics, communication, and scheduling tools to your
            website and operational stack.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Button asChild variant="outline" size="sm">
            <Link href="/settings/integrations">
              <Settings className="mr-1.5 size-3.5" />
              Configure credentials
            </Link>
          </Button>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
      <DashboardPageToolbar>
        <DashboardToolbarGroup>
          <Badge variant="secondary">
            {connectedCount} of {integrations.length} connected
          </Badge>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}
