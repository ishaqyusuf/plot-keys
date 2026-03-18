import { compare, hash } from "bcrypt-ts";
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

const BCRYPT_COST = 12;

async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_COST);
}

async function verifyPasswordHash(
  password: string,
  storedHash: string,
): Promise<boolean> {
  return compare(password, storedHash);
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
    passwordHash: await hashPassword(input.password),
    phoneNumber: input.phoneNumber,
  });

  // Create a Better Auth account record so the user can sign in via Better Auth
  await db.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: await hashPassword(input.password),
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

  if (!(await verifyPasswordHash(input.password, user.passwordHash))) {
    throw new Error("Incorrect email or password.");
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email before signing in.");
  }

  return user;
}

/**
 * Sign a cookie value using HMAC-SHA256, matching the format that
 * Better Auth / better-call expects: `{value}.{base64Signature}`.
 *
 * Returns the raw signed value (NOT URL-encoded). The cookie serializer
 * (Next.js `cookies().set()`) handles encoding.
 */
async function signCookieValue(value: string, secret: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${value}.${base64Sig}`;
}

function getAuthSecret(): string {
  return process.env.BETTER_AUTH_SECRET ?? "plotkeys-local-dev-secret";
}

/**
 * Creates a Better Auth session in the DB and returns both:
 *  - `sessionToken`: the raw token stored in the DB
 *  - `signedSessionToken`: the cookie-ready value (signed with HMAC-SHA256)
 *
 * The dashboard must set the cookie to `signedSessionToken` so that
 * Better Auth's `getSignedCookie` can verify it on subsequent requests.
 */
export async function createBetterAuthSession(
  userId: string,
): Promise<{ sessionToken: string; signedSessionToken: string; expiresAt: Date }> {
  const db = requireDb();
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await db.session.create({
    data: {
      id: crypto.randomUUID(),
      expiresAt,
      token: sessionToken,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const signedSessionToken = await signCookieValue(sessionToken, getAuthSecret());

  return { sessionToken, signedSessionToken, expiresAt };
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
