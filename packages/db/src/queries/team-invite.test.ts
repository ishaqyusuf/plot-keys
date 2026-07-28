import { describe, expect, mock, test } from "bun:test";

import type { Db } from "../prisma";
import { getTeamInviteProfileCompletionData } from "./team";

function createInvite() {
  return {
    acceptedAt: new Date(),
    company: {
      id: "company-1",
      name: "Acme",
      slug: "acme",
    },
    companyId: "company-1",
    email: "agent@example.com",
    role: "agent" as const,
    token: "invite-token",
    workRole: "sales_agent" as const,
  };
}

describe("team invite profile completion data", () => {
  test("rejects a session email that does not own the invite", async () => {
    const findAgent = mock(async (_query: unknown) => null);
    const db = {
      agent: { findFirst: findAgent },
      teamInvite: {
        findUnique: mock(async (_query: unknown) => createInvite()),
      },
    } as unknown as Db;

    const result = await getTeamInviteProfileCompletionData(db, {
      token: "invite-token",
      userEmail: "other@example.com",
    });

    expect(result).toEqual({ ok: false, reason: "email-mismatch" });
    expect(findAgent).not.toHaveBeenCalled();
  });

  test("scopes the invited agent profile to company and email", async () => {
    const findAgent = mock(async (_query: unknown) => null);
    const db = {
      agent: { findFirst: findAgent },
      teamInvite: {
        findUnique: mock(async (_query: unknown) => createInvite()),
      },
    } as unknown as Db;

    const result = await getTeamInviteProfileCompletionData(db, {
      token: "invite-token",
      userEmail: "agent@example.com",
    });

    expect(result.ok).toBe(true);
    expect(findAgent.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        email: "agent@example.com",
      },
    });
  });
});
