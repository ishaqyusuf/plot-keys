"use client";

import type { AppRouter } from "@plotkeys/api/router";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BillingInfo = RouterOutputs["billing"]["getInfo"];

export type BillingLineItem = BillingInfo["recentItems"][number];

const billingStatusVariant: Record<
  string,
  "default" | "outline" | "secondary"
> = {
  active: "default",
  cancelled: "outline",
  expired: "outline",
  pending: "secondary",
};

export function formatBillingDate(date: Date | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount / 100);
}

function formatKind(kind: string) {
  return kind.replaceAll("_", " ");
}

export function BillingItemCell({ item }: { item: BillingLineItem }) {
  return (
    <p className="text-sm font-medium capitalize">{formatKind(item.kind)}</p>
  );
}

export function BillingDateCell({ date }: { date: Date | null }) {
  return (
    <span className="text-sm text-muted-foreground">
      {formatBillingDate(date)}
    </span>
  );
}

export function BillingReferenceCell({
  providerRef,
}: {
  providerRef: string | null;
}) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {providerRef ?? "-"}
    </span>
  );
}

export function BillingAmountCell({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) {
  return (
    <span className="text-sm font-medium">
      {formatAmount(amount, currency)}
    </span>
  );
}

export function BillingStatusCell({ item }: { item: BillingLineItem }) {
  const canRepair =
    item.kind === "subscription" &&
    item.status === "pending" &&
    item.providerRef;

  return (
    <div className="flex items-center justify-end gap-2">
      <Badge variant={billingStatusVariant[item.status] ?? "outline"}>
        {item.status}
      </Badge>
      {canRepair ? (
        <Button
          onClick={() => {
            window.location.assign(
              `/billing/callback?reference=${encodeURIComponent(
                item.providerRef ?? "",
              )}`,
            );
          }}
          variant="outline"
          size="sm"
          type="button"
        >
          <Icon.RefreshCcw className="mr-1.5 size-3.5" />
          Repair
        </Button>
      ) : null}
    </div>
  );
}
