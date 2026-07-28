import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import { getNotificationBellDataForUser } from "./notifications";

describe("notification bell data", () => {
  test("scopes unread count and recent notifications to company and user", async () => {
    const createdAt = new Date("2026-07-28T12:00:00.000Z");
    const notification = {
      body: null,
      companyId: "company-1",
      createdAt,
      id: "notification-1",
      isRead: false,
      link: null,
      title: "New lead",
      type: "lead.created",
      updatedAt: createdAt,
      userId: "user-1",
    };
    const count = mock(async (query: unknown) => {
      const input = query as { where?: { isRead?: boolean } };
      return input.where?.isRead === false ? 2 : 1;
    });
    const findMany = mock(async (_query: unknown) => [notification]);
    const transaction = mock(async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    );
    const db = {
      $transaction: transaction,
      notification: { count, findMany },
    } as unknown as Db;

    const result = await getNotificationBellDataForUser(db, {
      companyId: "company-1",
      take: 5,
      userId: "user-1",
    });

    expect(result).toEqual({
      recent: [notification],
      unreadCount: 2,
    });
    expect(count.mock.calls).toContainEqual([
      {
        where: {
          companyId: "company-1",
          isRead: false,
          userId: "user-1",
        },
      },
    ]);
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 5,
      where: {
        companyId: "company-1",
        userId: "user-1",
      },
    });
  });
});
