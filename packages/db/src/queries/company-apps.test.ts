import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import {
  getCompanyAppsState,
  setCompanyEnabledAppIds,
} from "./company-apps";

describe("company apps state", () => {
  test("loads enabled apps from the active company scope", async () => {
    const findFirst = mock(async (_query: unknown) => ({
      enabledApps: ["analytics", "inbox"],
      planTier: "pro" as const,
    }));
    const db = {
      company: { findFirst },
    } as unknown as Db;

    const result = await getCompanyAppsState(db, "company-1");

    expect(result).toEqual({
      enabledIds: ["analytics", "inbox"],
      planTier: "pro",
    });
    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      select: {
        enabledApps: true,
        planTier: true,
      },
      where: {
        deletedAt: null,
        id: "company-1",
      },
    });
  });

  test("writes enabled app ids through the injected database client", async () => {
    const update = mock(async (_query: unknown) => ({ id: "company-1" }));
    const db = {
      company: { update },
    } as unknown as Db;

    await setCompanyEnabledAppIds(db, {
      companyId: "company-1",
      enabledIds: ["analytics"],
    });

    expect(update.mock.calls[0]?.[0]).toEqual({
      data: {
        enabledApps: ["analytics"],
      },
      where: { id: "company-1" },
    });
  });
});
