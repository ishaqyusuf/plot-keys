import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import { activateSubscriptionPayment } from "./billing";

describe("subscription payment activation", () => {
  test("uses the injected database for plan, license, and billing updates", async () => {
    const companyUpdate = mock(async (_query: unknown) => ({
      id: "company-1",
    }));
    const licenseCreate = mock(async (query: unknown) => query);
    const billingCreate = mock(async (query: unknown) => query);
    const billingUpdateMany = mock(async (_query: unknown) => ({ count: 0 }));
    const transaction = mock(async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    );
    const db = {
      $transaction: transaction,
      billingLineItem: {
        create: billingCreate,
        updateMany: billingUpdateMany,
      },
      company: { update: companyUpdate },
      tenantTemplateLicense: {
        create: licenseCreate,
        findMany: mock(async (_query: unknown) => []),
        updateMany: mock(async (query: unknown) => query),
      },
    } as unknown as Db;
    const paidAt = new Date("2026-07-28T12:00:00.000Z");

    await activateSubscriptionPayment(db, {
      allowedTemplateKeys: ["starter-template"],
      amountMinorUnits: 2_000_000,
      companyId: "company-1",
      currency: "NGN",
      paidAt,
      planTier: "plus",
      reference: "paystack-reference",
    });

    expect(companyUpdate.mock.calls[0]?.[0]).toEqual({
      data: {
        planStatus: "active",
        planTier: "plus",
      },
      where: { id: "company-1" },
    });
    expect(licenseCreate.mock.calls[0]?.[0]).toEqual({
      data: {
        companyId: "company-1",
        source: "plan_included",
        templateKey: "starter-template",
      },
    });
    expect(billingUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        kind: "subscription",
        providerRef: "paystack-reference",
      },
    });
    expect(billingCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        amountMinorUnits: 2_000_000,
        companyId: "company-1",
        currency: "NGN",
        paidAt,
        providerRef: "paystack-reference",
        status: "active",
      },
    });
  });
});
