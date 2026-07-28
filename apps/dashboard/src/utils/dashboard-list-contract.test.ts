import { describe, expect, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";

import {
  type DashboardListPage,
  findDashboardListItemInQueryCache,
  flattenDashboardListPages,
  getDashboardInfiniteListState,
  getDashboardListNextCursor,
  getDashboardListTotalCount,
} from "./dashboard-list-contract";

const pages: DashboardListPage<string>[] = [
  {
    data: ["a", "b"],
    meta: { count: 3, cursor: "2", hasNextPage: true, size: 2 },
  },
  {
    data: ["c"],
    meta: { count: 3, cursor: null, hasNextPage: false, size: 2 },
  },
];

describe("dashboard list contract", () => {
  test("flattens infinite query pages into table rows", () => {
    expect(flattenDashboardListPages(pages)).toEqual(["a", "b", "c"]);
  });

  test("uses server count metadata while preserving finite fallback behavior", () => {
    expect(getDashboardListTotalCount(pages, 99)).toBe(3);
    expect(getDashboardListTotalCount([], 2)).toBe(2);
  });

  test("reads the next cursor from page metadata", () => {
    expect(getDashboardListNextCursor(pages[0]!)).toBe("2");
    expect(getDashboardListNextCursor(pages[1]!)).toBeNull();
  });

  test("returns flattened items and total count together", () => {
    expect(getDashboardInfiniteListState(pages)).toEqual({
      items: ["a", "b", "c"],
      totalCount: 3,
    });
  });

  test("finds a list item from cached infinite-query pages", () => {
    const queryClient = new QueryClient();
    const queryKey = ["customers", "get"];

    queryClient.setQueryData(queryKey, {
      pages: [
        {
          data: [
            { id: "customer-1", name: "Ada" },
            { id: "customer-2", name: "Grace" },
          ],
          meta: { count: 2, cursor: null, hasNextPage: false, size: 20 },
        },
      ],
    });

    expect(
      findDashboardListItemInQueryCache<{
        id: string;
        name: string;
      }>(queryClient, queryKey, "customer-2"),
    ).toEqual({ id: "customer-2", name: "Grace" });
    expect(
      findDashboardListItemInQueryCache(queryClient, queryKey, "missing"),
    ).toBeUndefined();
  });
});
