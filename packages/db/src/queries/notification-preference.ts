import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Notification preference CRUD
// ---------------------------------------------------------------------------

export async function listNotificationPreferences(
  db: Db,
  input: { companyId: string; userId: string },
) {
  return db.notificationPreference.findMany({
    where: { companyId: input.companyId, userId: input.userId },
    orderBy: { type: "asc" },
  });
}

export async function upsertNotificationPreference(
  db: Db,
  input: {
    companyId: string;
    userId: string;
    type: string;
    inApp: boolean;
    email: boolean;
  },
) {
  return db.notificationPreference.upsert({
    where: {
      companyId_userId_type: {
        companyId: input.companyId,
        userId: input.userId,
        type: input.type,
      },
    },
    create: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
      inApp: input.inApp,
      email: input.email,
    },
    update: {
      inApp: input.inApp,
      email: input.email,
    },
  });
}

export async function getNotificationPreference(
  db: Db,
  input: { companyId: string; userId: string; type: string },
) {
  return db.notificationPreference.findFirst({
    where: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
    },
  });
}
