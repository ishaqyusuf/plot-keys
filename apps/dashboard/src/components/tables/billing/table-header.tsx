import { Badge } from "@plotkeys/ui/badge";
import type { BillingInterval } from "@plotkeys/utils";
import { planTrialDays, tierLabels } from "@plotkeys/utils";

import {
  DashboardFilterTab,
  DashboardFilterTabs,
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

type BillingPageHeaderProps = {
  currentStatus: "active" | "past_due" | "canceled";
  currentTier: "starter" | "plus" | "pro";
  selectedInterval: BillingInterval;
};

const statusLabels = {
  active: "Active",
  canceled: "Canceled",
  past_due: "Past due",
};

export function BillingPageHeader({
  currentStatus,
  currentTier,
  selectedInterval,
}: BillingPageHeaderProps) {
  return (
    <DashboardPageHeader>
      <DashboardPageHeaderRow>
        <DashboardPageIntro>
          <DashboardPageEyebrow>Revenue workspace</DashboardPageEyebrow>
          <DashboardPageTitle>Billing &amp; plans</DashboardPageTitle>
          <DashboardPageDescription>
            Manage your subscription, compare plan levels, and review billing
            history. Every plan includes a {planTrialDays}-day free trial.
          </DashboardPageDescription>
        </DashboardPageIntro>
        <DashboardPageActions>
          <Badge
            variant={currentStatus === "active" ? "default" : "secondary"}
          >
            {statusLabels[currentStatus]}
          </Badge>
        </DashboardPageActions>
      </DashboardPageHeaderRow>
      <DashboardPageToolbar>
        <DashboardToolbarGroup className="text-sm text-muted-foreground">
          Current plan: {tierLabels[currentTier]}
        </DashboardToolbarGroup>
        <DashboardToolbarGroup>
          <DashboardFilterTabs>
            <DashboardFilterTab
              active={selectedInterval === "monthly"}
              href="/billing?interval=monthly"
            >
              Monthly
            </DashboardFilterTab>
            <DashboardFilterTab
              active={selectedInterval === "annual"}
              href="/billing?interval=annual"
            >
              Annual
            </DashboardFilterTab>
          </DashboardFilterTabs>
          <Badge variant="secondary">Save 20%</Badge>
        </DashboardToolbarGroup>
      </DashboardPageToolbar>
    </DashboardPageHeader>
  );
}
