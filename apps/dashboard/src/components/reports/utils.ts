export type ReportPeriod = {
  label: string;
  month: number;
  year: number;
};

export function getReportPeriod(input: {
  month?: string;
  now?: Date;
  year?: string;
}) {
  const now = input.now ?? new Date();
  const parsedYear = input.year
    ? Number.parseInt(input.year, 10)
    : now.getFullYear();
  const parsedMonth = input.month
    ? Number.parseInt(input.month, 10)
    : now.getMonth() + 1;

  const year =
    Number.isFinite(parsedYear) && parsedYear >= 2020 && parsedYear <= 2100
      ? parsedYear
      : now.getFullYear();
  const month =
    Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getMonth() + 1;

  return { month, year };
}

export function getRecentReportPeriods(now = new Date()): ReportPeriod[] {
  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);

    return {
      label: date.toLocaleString("en-GB", {
        month: "short",
        year: "numeric",
      }),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
