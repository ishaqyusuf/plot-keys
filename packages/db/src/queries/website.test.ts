import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import { getLivePreviewData } from "./website";

describe("website preview tenant scope", () => {
  test("scopes hostname and company lookups to the active company", async () => {
    const findTenantDomain = mock(async (_query: unknown) => null);
    const findCompany = mock(async (_query: unknown) => null);
    const db = {
      company: { findFirst: findCompany },
      tenantDomain: { findFirst: findTenantDomain },
    } as unknown as Db;

    const result = await getLivePreviewData(db, {
      companyId: "company-1",
      hostname: "preview.example.com",
    });

    expect(result).toEqual({ status: "company-not-found" });
    expect(findTenantDomain.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        hostname: "preview.example.com",
      },
    });
    expect(findCompany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        deletedAt: null,
        id: "company-1",
      },
    });
  });

  test("rejects a URL subdomain that does not match the active company", async () => {
    const db = {
      company: {
        findFirst: mock(async (_query: unknown) => ({
          id: "company-1",
          market: null,
          name: "Acme",
          slug: "acme",
        })),
      },
      tenantDomain: {
        findFirst: mock(async (_query: unknown) => null),
      },
    } as unknown as Db;

    const result = await getLivePreviewData(db, {
      companyId: "company-1",
      subdomain: "another-company",
    });

    expect(result).toEqual({ status: "company-not-found" });
  });
});
