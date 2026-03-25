import {
  createPrismaClient,
  type Db,
  findUserByEmail,
  getSessionUserByTokenUserId,
  resolveTenantByHostname,
  verifyUserEmailByIdentity,
} from "@plotkeys/db";
import {
  extractDashboardTenantSlug,
  resolveDashboardLandingRoute,
  resolveDashboardSessionScope,
} from "@plotkeys/utils";
import { hash } from "bcrypt-ts";
import {
  authCookiePrefix,
  authRoutes,
  authSessionCookieName,
  getScopedAuthSessionCookieName,
  platformSessionScope,
} from "./shared";

export { auth } from "./better-auth";
export {
  authCookiePrefix,
  authRoutes,
  authSessionCookieName,
  getScopedAuthSessionCookieName,
  platformSessionScope,
  type SessionBridgeInput,
  sessionBridgeInputSchema,
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

async function resolveRequestedTenantSlug(
  headers: Headers,
  db: Db,
): Promise<string | null> {
  const forwardedTenantSlug = headers.get("x-tenant-subdomain");

  if (forwardedTenantSlug) {
    return forwardedTenantSlug.trim().toLowerCase();
  }

  const forwardedTenantHostname = headers.get("x-tenant-hostname");

  if (forwardedTenantHostname) {
    const resolvedTenant = await resolveTenantByHostname(
      db,
      forwardedTenantHostname,
    );
    return resolvedTenant?.companySlug ?? null;
  }

  const host =
    headers.get("x-forwarded-host") ??
    headers.get("host") ??
    headers.get("origin");

  return host ? extractDashboardTenantSlug(host) : null;
}

function resolveSessionCookieScope(headers: Headers) {
  const forwardedTenantSlug = headers.get("x-tenant-subdomain");

  if (forwardedTenantSlug) {
    return forwardedTenantSlug.trim().toLowerCase();
  }

  const forwardedTenantHostname = headers.get("x-tenant-hostname");

  if (forwardedTenantHostname) {
    return (
      resolveDashboardSessionScope(forwardedTenantHostname) ??
      platformSessionScope
    );
  }

  const host =
    headers.get("x-forwarded-host") ??
    headers.get("host") ??
    headers.get("origin");

  return resolveDashboardSessionScope(host) ?? platformSessionScope;
}

function getCookieValueFromHeader(cookieHeader: string, cookieName: string) {
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();

    if (trimmed.startsWith(`${cookieName}=`)) {
      return trimmed.slice(cookieName.length + 1);
    }
  }

  return null;
}

function removeCookieFromHeader(cookieHeader: string, cookieName: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.startsWith(`${cookieName}=`))
    .join("; ");
}

async function withResolvedSessionCookie(headers: Headers) {
  const normalizedHeaders = new Headers(headers);
  const cookieHeader = headers.get("cookie") ?? "";

  if (!cookieHeader) {
    return normalizedHeaders;
  }

  const scopedCookieName = getScopedAuthSessionCookieName(
    resolveSessionCookieScope(headers),
  );
  const scopedCookieValue = getCookieValueFromHeader(
    cookieHeader,
    scopedCookieName,
  );
  const legacyCookieValue = getCookieValueFromHeader(
    cookieHeader,
    authSessionCookieName,
  );

  if (!scopedCookieValue && !legacyCookieValue) {
    return normalizedHeaders;
  }

  const cookieWithoutCanonicalSession = removeCookieFromHeader(
    cookieHeader,
    authSessionCookieName,
  );
  const resolvedSessionCookie = `${authSessionCookieName}=${scopedCookieValue ?? legacyCookieValue}`;

  normalizedHeaders.set(
    "cookie",
    cookieWithoutCanonicalSession
      ? `${cookieWithoutCanonicalSession}; ${resolvedSessionCookie}`
      : resolvedSessionCookie,
  );

  return normalizedHeaders;
}

export type ActiveMembership = {
  companyId: string;
  role: import("@plotkeys/db").MembershipRole;
  workRole: string;
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

  // Use Better Auth to create the user + account in one call
  const { auth } = await import("./better-auth");
  const result = await auth.api.signUpEmail({
    body: {
      email,
      name: input.name,
      password: input.password,
    },
  });

  if (!result?.user) {
    throw new Error("Failed to create account.");
  }

  // Store extra fields Better Auth doesn't handle
  const user = await db.user.update({
    data: {
      emailVerified: input.emailVerified ?? false,
      passwordHash: await hashPassword(input.password),
      phoneNumber: input.phoneNumber,
    },
    where: { id: result.user.id },
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

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  // Verify via Better Auth
  const { auth } = await import("./better-auth");
  const result = await auth.api.signInEmail({
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });

  if (!result?.user) {
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
export async function createBetterAuthSession(userId: string): Promise<{
  sessionToken: string;
  signedSessionToken: string;
  expiresAt: Date;
}> {
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

  const signedSessionToken = await signCookieValue(
    sessionToken,
    getAuthSecret(),
  );

  return { sessionToken, signedSessionToken, expiresAt };
}

export async function getAppSessionFromBetterAuth(
  headers: Headers,
): Promise<AppSession | null> {
  const { auth } = await import("./better-auth");
  const db = requireDb();

  try {
    const result = await auth.api.getSession({
      headers: await withResolvedSessionCookie(headers),
    });

    if (!result?.session) {
      return null;
    }

    const user = await getSessionUserByTokenUserId(db, result.user.id);
    const requestedTenantSlug = await resolveRequestedTenantSlug(headers, db);

    if (!user) {
      return null;
    }

    const membership = requestedTenantSlug
      ? (user.memberships.find(
          (candidate) => candidate.company.slug === requestedTenantSlug,
        ) ?? null)
      : (user.memberships[0] ?? null);

    return {
      activeMembership: membership
        ? {
            companyId: membership.companyId,
            companyName: membership.company.name,
            companySlug: membership.company.slug,
            role: membership.role,
            workRole: membership.workRole,
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

export function resolvePostLoginRoute(
  activeMembership: ActiveMembership | null | undefined,
) {
  if (!activeMembership) {
    return authRoutes.onboarding;
  }

  return resolveDashboardLandingRoute(activeMembership.workRole);
}

export function hasActiveMembership(
  auth: AuthSessionContext,
): auth is AuthSessionContext & {
  activeMembership: ActiveMembership;
  session: NonNullable<AuthSessionContext["session"]>;
} {
  return auth.session !== null && auth.activeMembership !== null;
}
