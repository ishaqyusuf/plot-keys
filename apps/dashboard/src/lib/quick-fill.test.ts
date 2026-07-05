// @ts-nocheck
import { describe, expect, test } from "bun:test";
import {
  buildQuickFillDates,
  createQuickFillAdapter,
  fillQuickFillProfile,
  mergeRowsByDate,
  type PricingPlanQuickFillRow,
  parseQuickFillArgs,
} from "./quick-fill";

describe("quick-fill helpers", () => {
  test("fills explicit form profiles through an adapter", () => {
    const values = {
      bio: "",
      displayOrder: "",
      email: "",
      featured: "false",
      imageUrl: "",
      name: "",
      phone: "",
      title: "",
    };
    const form = createQuickFillAdapter({
      getValues: () => values,
      reset: (nextValues) => Object.assign(values, nextValues),
      setValue: (name, value) => {
        values[name as keyof typeof values] = String(value);
      },
    });

    fillQuickFillProfile({
      args: { form },
      name: "new-agent",
    });

    expect(values.name).not.toBe("");
    expect(values.email).toContain("@");
    expect(values.featured).toBe("true");
  });

  test("validates quick-fill args at the boundary", () => {
    expect(() =>
      parseQuickFillArgs({
        form: {},
        name: "new-agent",
      } as never),
    ).toThrow();
  });

  test("builds monthly and yearly date ranges", () => {
    expect(
      buildQuickFillDates({
        endDate: "2026-04-30",
        interval: "monthly",
        startDate: "2026-01-31",
      }),
    ).toEqual(["2026-01-31", "2026-02-28", "2026-03-31", "2026-04-30"]);

    expect(
      buildQuickFillDates({
        endDate: "2028-01-31",
        interval: "yearly",
        startDate: "2026-01-31",
      }),
    ).toEqual(["2026-01-31", "2027-01-31", "2028-01-31"]);
  });

  test("merges dated rows without replacing existing dated values", () => {
    const rows = mergeRowsByDate({
      blankRow: () => ({ amount: "", effectiveFrom: "" }),
      dates: ["2026-01-01", "2026-02-01"],
      getDate: (row) => row.effectiveFrom,
      hasValue: (row) => Boolean(row.amount || row.effectiveFrom),
      rowForDate: (date) => ({ amount: "1000", effectiveFrom: date }),
      rows: [{ amount: "2000", effectiveFrom: "2026-01-01" }],
      sortRows: (first, second) =>
        first.effectiveFrom.localeCompare(second.effectiveFrom),
    });

    expect(rows).toEqual([
      { amount: "2000", effectiveFrom: "2026-01-01" },
      { amount: "1000", effectiveFrom: "2026-02-01" },
      { amount: "", effectiveFrom: "" },
    ]);
  });

  test("fills typed pricing plan rows", () => {
    let rows: PricingPlanQuickFillRow[] = [];

    fillQuickFillProfile({
      args: {
        createRow: () => ({
          amount: "",
          id: crypto.randomUUID(),
          initialDepositPercent: "",
          months: "",
        }),
        hasValue: (row) =>
          Boolean(row.amount || row.initialDepositPercent || row.months),
        rows,
        setRows: (updater) => {
          rows = updater(rows);
        },
        sortRows: (first, second) =>
          Number(first.months || 0) - Number(second.months || 0),
      },
      name: "pricing-plans",
      template: {
        amount: "1000000",
        count: "3",
        initialDepositPercent: "20",
        months: "6",
      },
    });

    expect(
      rows.map(({ amount, initialDepositPercent, months }) => ({
        amount,
        initialDepositPercent,
        months,
      })),
    ).toEqual([
      { amount: "1000000", initialDepositPercent: "20", months: "6" },
      { amount: "2000000", initialDepositPercent: "20", months: "12" },
      { amount: "3000000", initialDepositPercent: "20", months: "18" },
    ]);
  });
});
