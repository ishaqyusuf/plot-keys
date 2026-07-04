"use client";

export const workerPayBasis = [
  "daily",
  "weekly",
  "monthly",
  "fixed_contract",
  "milestone_based",
] as const;

export type WorkerPayBasis = (typeof workerPayBasis)[number];

export const workerPayBasisLabels: Record<string, string> = {
  daily: "Daily",
  fixed_contract: "Fixed contract",
  milestone_based: "Milestone",
  monthly: "Monthly",
  weekly: "Weekly",
};

export const workerStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
  terminated: { label: "Terminated", variant: "destructive" },
};

export const payrollRunStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  }
> = {
  draft: { label: "Draft", variant: "outline" },
  finalized: { label: "Finalized", variant: "secondary" },
  paid: { label: "Paid", variant: "default" },
};

export function formatProjectCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    currency,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(minor / 100);
}

export function formatProjectDate(date: Date | string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function toMinorUnits(value: string | number | null | undefined) {
  const numericValue = Number(value ?? 0);

  if (Number.isNaN(numericValue)) return 0;

  return Math.max(0, Math.round(numericValue * 100));
}
