"use client";

export const budgetLineCategories = [
  "preliminaries",
  "substructure",
  "superstructure",
  "mep",
  "finishing",
  "external_works",
  "contingency",
  "professional_fees",
  "other",
] as const;

export type BudgetLineCategory = (typeof budgetLineCategories)[number];

export const budgetLineCategoryLabels: Record<string, string> = {
  contingency: "Contingency",
  external_works: "External Works",
  finishing: "Finishing",
  mep: "MEP",
  other: "Other",
  preliminaries: "Preliminaries",
  professional_fees: "Professional Fees",
  substructure: "Substructure",
  superstructure: "Superstructure",
};

export function formatBudgetCurrency(minor: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    currency,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(minor / 100);
}

export function toMinorUnits(value: string | number | null | undefined) {
  const numericValue = Number(value ?? 0);

  if (Number.isNaN(numericValue)) return 0;

  return Math.max(0, Math.round(numericValue * 100));
}
