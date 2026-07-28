export type PayrollStatus = "paid" | "pending";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const payrollStatusConfig: Record<
  PayrollStatus,
  { label: string; variant: "default" | "secondary" }
> = {
  paid: { label: "Paid", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
};

export function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    currency,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function getPayrollPeriod(params: { month?: string; year?: string }) {
  const now = new Date();
  const parsedYear = params.year
    ? Number.parseInt(params.year, 10)
    : now.getFullYear();
  const parsedMonth = params.month
    ? Number.parseInt(params.month, 10)
    : now.getMonth() + 1;

  const periodYear =
    Number.isFinite(parsedYear) && parsedYear >= 2020 && parsedYear <= 2100
      ? parsedYear
      : now.getFullYear();
  const periodMonth =
    Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getMonth() + 1;

  return { periodMonth, periodYear };
}

export function formatPayrollPeriod(periodYear: number, periodMonth: number) {
  return `${monthNames[periodMonth - 1] ?? "Unknown"} ${periodYear}`;
}
