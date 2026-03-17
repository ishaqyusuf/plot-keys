import "server-only";

import { randomUUID } from "node:crypto";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import {
  createPrismaClient,
  createUser,
  type Db,
  findUserByEmail,
  getSessionUserByTokenUserId,
  verifyUserEmailByIdentity,
} from "@plotkeys/db";
import { z } from "zod";
import { authCookiePrefix, authRoutes } from "./shared";

export { auth } from "./better-auth";
export {
  authCookiePrefix,
  authRoutes,
  authSessionCookieName,
  sessionBridgeInputSchema,
  type SessionBridgeInput,
} from "./shared";

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export function resolvePostVerificationRoute(
  onboardingStatus: OnboardingStatus,
) {
  return onboardingStatus === "completed"
    ? authRoutes.dashboardHome
    : authRoutes.onboarding;
}

export type AuthenticatedUser = {
  email?: string;
  id: string;
  name?: string;
  phoneNumber?: string | null;
};

export type ActiveMembership = {
  companyId: string;
  role: import("@plotkeys/db").MembershipRole;
};

export type AuthSessionContext = {
  activeMembership: ActiveMembership | null;
  session: {
    user: AuthenticatedUser;
  } | null;
};

export type AppSession = {
  activeMembership:
    | (ActiveMembership & {
        companyName: string;
        companySlug: string;
      })
    | null;
  onboardingStatus: OnboardingStatus;
  user: {
    email: string;
    emailVerified: boolean;
    id: string;
    name: string | null;
    phoneNumber: string | null;
  };
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${derivedKey}`;
}

function verifyPasswordHash(password: string, storedHash: string) {
  const [salt, storedDerivedKey] = storedHash.split(":");

  if (!salt || !storedDerivedKey) {
    return false;
  }

  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(storedDerivedKey, "hex"),
  );
}

function requireDb() {
  const client = createPrismaClient();

  if (!client.db) {
    throw new Error("DATABASE_URL is not configured for auth flows.");
  }

  return client.db;
}

export function createAuthConfig() {
  return {
    appName: "PlotKeys",
    basePath: "/api/auth",
    cookiePrefix: authCookiePrefix,
  };
}

export async function signUpUser(input: {
  db?: Db;
  email: string;
  emailVerified?: boolean;
  name: string;
  password: string;
  phoneNumber: string;
}) {
  const db = input.db ?? requireDb();
  const email = input.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(db, email);

  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  const user = await createUser(db, {
    email,
    emailVerified: input.emailVerified ?? false,
    name: input.name,
    passwordHash: hashPassword(input.password),
    phoneNumber: input.phoneNumber,
  });

  // Create a Better Auth account record so the user can sign in via Better Auth
  await db.account.create({
    data: {
      id: randomUUID(),
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: hashPassword(input.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const { createEmailVerificationToken } = await import("./tokens");

  return {
    user,
    verificationToken: createEmailVerificationToken({
      email: user.email,
      userId: user.id,
    }),
  };
}

export async function verifyUserEmail(token: string) {
  const db = requireDb();
  const { decodeVerificationToken } = await import("./tokens");
  const payload = decodeVerificationToken(token);
  const user = await verifyUserEmailByIdentity(db, {
    email: payload.email,
    userId: payload.userId,
  });

  if (!user) {
    throw new Error(
      "No matching account was found for this verification link.",
    );
  }

  return user;
}

export async function signInUser(input: { email: string; password: string }) {
  const db = requireDb();
  const user = await findUserByEmail(db, input.email);

  if (!user || !user.passwordHash) {
    throw new Error("Incorrect email or password.");
  }

  if (!verifyPasswordHash(input.password, user.passwordHash)) {
    throw new Error("Incorrect email or password.");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email before signing in.");
  }

  return user;
}

export async function createBetterAuthSession(
  userId: string,
): Promise<{ sessionToken: string; expiresAt: Date }> {
  const db = requireDb();
  const sessionToken = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await db.session.create({
    data: {
      id: randomUUID(),
      expiresAt,
      token: sessionToken,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return { sessionToken, expiresAt };
}

export async function getAppSessionFromBetterAuth(
  headers: Headers,
): Promise<AppSession | null> {
  const { auth } = await import("./better-auth");

  try {
    const result = await auth.api.getSession({ headers });

    if (!result?.session) {
      return null;
    }

    const db = requireDb();
    const user = await getSessionUserByTokenUserId(db, result.user.id);

    if (!user) {
      return null;
    }

    const membership = user.memberships[0] ?? null;

    return {
      activeMembership: membership
        ? {
            companyId: membership.companyId,
            companyName: membership.company.name,
            companySlug: membership.company.slug,
            role: membership.role,
          }
        : null,
      onboardingStatus: membership ? "completed" : "not_started",
      user: {
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    } satisfies AppSession;
  } catch {
    return null;
  }
}

export function hasActiveMembership(
  auth: AuthSessionContext,
): auth is AuthSessionContext & {
  activeMembership: ActiveMembership;
  session: NonNullable<AuthSessionContext["session"]>;
} {
  return auth.session !== null && auth.activeMembership !== null;
}
