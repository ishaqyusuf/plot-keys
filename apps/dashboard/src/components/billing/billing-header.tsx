import type { BillingInterval } from "@plotkeys/utils";
import { planTrialDays, tierLabels } from "@plotkeys/utils";
import { HeaderLinkTab, HeaderLinkTabList } from "@/components/header-link-tab";

type Props = {
  currentStatus: "active" | "past_due" | "canceled";
  currentTier: "starter" | "plus" | "pro";
  selectedInterval: BillingInterval;
};

const statusLabels = {
  active: "Active",
  canceled: "Canceled",
  past_due: "Past due",
};

export function BillingHeader({
  currentStatus,
  currentTier,
  selectedInterval,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Revenue workspace
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Billing &amp; plans
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your subscription, compare plan levels, and review billing
            history. Every plan includes a {planTrialDays}-day free trial.
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            {statusLabels[currentStatus]}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          Current plan: {tierLabels[currentTier]}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <HeaderLinkTabList>
            <HeaderLinkTab
              active={selectedInterval === "monthly"}
              href="/billing?interval=monthly"
            >
              Monthly
            </HeaderLinkTab>
            <HeaderLinkTab
              active={selectedInterval === "annual"}
              href="/billing?interval=annual"
            >
              Annual
            </HeaderLinkTab>
          </HeaderLinkTabList>
          <span className="text-sm text-muted-foreground">Save 20%</span>
        </div>
      </div>
    </div>
  );
}
