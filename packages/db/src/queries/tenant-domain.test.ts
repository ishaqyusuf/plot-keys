import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import { getDashboardTenantState } from "./tenant-domain";

describe("dashboard tenant state", () => {
  test("checks onboarding by active company slug", async () => {
    const findFirst = mock(async (_query: unknown) => ({
      id: "company-1",
      slug: "acme",
    }));
    const db = {
      company: { findFirst },
    } as unknown as Db;

    const result = await getDashboardTenantState(db, {
      tenantHostname: null,
      tenantSlug: "acme",
    });

    expect(result).toEqual({ onboarded: true, tenantSlug: "acme" });
    expect(findFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        deletedAt: null,
        slug: "acme",
      },
    });
  });

  test("resolves an active custom hostname to its company slug", async () => {
    const findFirst = mock(async (_query: unknown) => ({
      company: {
        deletedAt: null,
        id: "company-1",
        slug: "acme",
      },
      hostname: "dashboard.acme.example",
    }));
    const db = {
      tenantDomain: { findFirst },
    } as unknown as Db;

    const result = await getDashboardTenantState(db, {
      tenantHostname: "Dashboard.Acme.Example:443",
      tenantSlug: null,
    });

    expect(result).toEqual({ onboarded: true, tenantSlug: "acme" });
    expect(findFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        deletedAt: null,
        hostname: "dashboard.acme.example",
        status: "active",
      },
    });
  });
});
