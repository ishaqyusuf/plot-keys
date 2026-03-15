import { randomUUID } from "node:crypto";

import type { Db } from "../prisma";

export async function findUserByEmail(db: Db, email: string) {
  return db.user.findFirst({
    where: {
      deletedAt: null,
      email: email.trim().toLowerCase(),
    },
  });
}

export async function createUser(
  db: Db,
  input: {
  email: string;
  emailVerified: boolean;
  name: string;
  passwordHash: string;
},
) {
  return db.user.create({
    data: {
      email: input.email.trim().toLowerCase(),
      emailVerified: input.emailVerified,
      id: randomUUID(),
      name: input.name.trim(),
      passwordHash: input.passwordHash,
    },
  });
}

export async function getSessionUserByTokenUserId(db: Db, userId: string) {
  return db.user.findFirst({
    where: {
      deletedAt: null,
      id: userId,
    },
    include: {
      memberships: {
        include: {
          company: true,
        },
        where: {
          deletedAt: null,
          status: "active",
        },
      },
    },
  });
}

export async function verifyUserEmailByIdentity(
  db: Db,
  input: {
    email: string;
    userId: string;
  },
) {
  const user = await db.user.findFirst({
    where: {
      deletedAt: null,
      email: input.email,
      id: input.userId,
    },
  });

  if (!user) {
    return null;
  }

  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });
}
