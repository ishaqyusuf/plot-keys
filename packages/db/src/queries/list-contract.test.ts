import { describe, expect, test } from "bun:test";

import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

describe("dashboard list contract", () => {
  test("normalizes page size with explicit min, max, and default behavior", () => {
    expect(normalizeListPageSize(undefined)).toBe(50);
    expect(normalizeListPageSize("not-a-number")).toBe(50);
    expect(normalizeListPageSize("0")).toBe(1);
    expect(normalizeListPageSize("500")).toBe(100);
    expect(normalizeListPageSize("12.9")).toBe(12);
    expect(normalizeListPageSize(undefined, { defaultSize: 20 })).toBe(20);
  });

  test("normalizes offset cursor values for infinite query input", () => {
    expect(normalizeListOffsetCursor(undefined)).toBe(0);
    expect(normalizeListOffsetCursor("abc")).toBe(0);
    expect(normalizeListOffsetCursor("-10")).toBe(0);
    expect(normalizeListOffsetCursor("25.8")).toBe(25);
  });

  test("returns next cursor metadata when more rows exist", () => {
    expect(
      createPaginatedListResult(["a", "b"], {
        count: 5,
        offset: 0,
        size: 2,
      }),
    ).toEqual({
      data: ["a", "b"],
      meta: {
        count: 5,
        cursor: "2",
        hasNextPage: true,
        size: 2,
      },
    });
  });

  test("returns final-page metadata without a next cursor", () => {
    expect(
      createPaginatedListResult(["e"], {
        count: 5,
        offset: 4,
        size: 2,
      }),
    ).toEqual({
      data: ["e"],
      meta: {
        count: 5,
        cursor: null,
        hasNextPage: false,
        size: 2,
      },
    });
  });
});
