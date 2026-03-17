import "server-only";

import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createPrismaClient } from "@plotkeys/db";
import { authCookiePrefix } from "./shared";

function requirePrismaForAuth() {
  const { db } = createPrismaClient();

  if (!db) {
    throw new Error("DATABASE_URL is not configured for Better Auth.");
  }

  return db;
}

export const auth = betterAuth({
  database: prismaAdapter(requirePrismaForAuth(), {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  advanced: {
    cookiePrefix: authCookiePrefix,
    generateId: () => randomUUID(),
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
        defaultValue: null,
      },
      passwordHash: {
        type: "string",
        required: false,
        input: false,
        returned: false,
      },
    },
  },
});

export type Auth = typeof auth;
