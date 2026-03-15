import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { createPrismaClient, type MembershipRole } from "@plotkeys/db";
import { z } from "zod";

export const authRoutes = {
  dashboardHome: "/",
  onboarding: "/onboarding",
  signIn: "/sign-in",
  signOut: "/sign-out",
  signUp: "/sign-up",
  signUpSuccess: "/verify-email",
  verifyEmail: "/verify-email",
};

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export function resolvePostVerificationRoute(
  onboardingStatus: OnboardingStatus,
) {
  return onboardingStatus === "completed"
    ? authRoutes.dashboardHome
    : authRoutes.onboarding;
}

export const authCookiePrefix = "plotkeys";
export const authSessionCookieName = `${authCookiePrefix}_session`;

export const authHeaderNames = {
  activeCompanyId: "x-plotkeys-company-id",
  role: "x-plotkeys-role",
  userEmail: "x-plotkeys-user-email",
  userId: "x-plotkeys-user-id",
  userName: "x-plotkeys-user-name",
} as const;

const membershipRoleSchema = z.enum([
  "platform_admin",
  "owner",
  "admin",
  "agent",
  "staff",
]);

const requestAuthHeadersSchema = z.object({
  activeCompanyId: z.string().trim().min(1).optional(),
  role: membershipRoleSchema.optional(),
  userEmail: z.string().email().optional(),
  userId: z.string().trim().min(1).optional(),
  userName: z.string().trim().min(1).optional(),
});

const sessionTokenSchema = z.object({
  exp: z.number().int().positive(),
  userId: z.string().trim().min(1),
});

const verificationTokenSchema = sessionTokenSchema.extend({
  email: z.string().email(),
});

export type AuthenticatedUser = {
  email?: string;
  id: string;
  name?: string;
};

export type ActiveMembership = {
  companyId: string;
  role: MembershipRole;
};

export type AuthSessionContext = {
  activeMembership: ActiveMembership | null;
  headers: RequestAuthHeaders;
  session: {
    user: AuthenticatedUser;
  } | null;
};

export type RequestAuthHeaders = z.infer<typeof requestAuthHeadersSchema>;

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
  };
};

type SignedTokenPayload = {
  exp: number;
  userId: string;
};

type VerificationTokenPayload = SignedTokenPayload & {
  email: string;
};

function getAuthSecret() {
  return process.env.BETTER_AUTH_SECRET ?? "plotkeys-local-dev-secret";
}

function createSignature(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

function encodeToken(payload: SignedTokenPayload | VerificationTokenPayload) {
  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `${serialized}.${createSignature(serialized)}`;
}

function decodeToken<TPayload extends SignedTokenPayload>(
  token: string,
  schema: z.ZodSchema<TPayload>,
) {
  const [serialized, signature] = token.split(".");

  if (!serialized || !signature) {
    throw new Error("Invalid token format.");
  }

  const expectedSignature = createSignature(serialized);

  if (
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new Error("Invalid token signature.");
  }

  const payload = schema.parse(
    JSON.parse(Buffer.from(serialized, "base64url").toString("utf8")),
  );

  if (payload.exp <= Date.now()) {
    throw new Error("Token has expired.");
  }

  return payload;
}

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

function requirePrismaClient() {
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

export function createEmailVerificationToken(
  input: Pick<VerificationTokenPayload, "email" | "userId">,
) {
  return encodeToken({
    ...input,
    exp: Date.now() + 1000 * 60 * 30,
  });
}

export function createSessionToken(userId: string) {
  return encodeToken({
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    userId,
  });
}

export function readSessionToken(token: string) {
  return decodeToken(token, sessionTokenSchema);
}

export async function signUpUser(input: {
  email: string;
  emailVerified?: boolean;
  name: string;
  password: string;
}) {
  const prisma = requirePrismaClient();
  const email = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      email,
      emailVerified: input.emailVerified ?? false,
      id: randomUUID(),
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
    },
  });

  return {
    user,
    verificationToken: createEmailVerificationToken({
      email: user.email,
      userId: user.id,
    }),
  };
}

export async function verifyUserEmail(token: string) {
  const prisma = requirePrismaClient();
  const payload = decodeToken(token, verificationTokenSchema);
  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      email: payload.email,
      id: payload.userId,
    },
  });

  if (!user) {
    throw new Error(
      "No matching account was found for this verification link.",
    );
  }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });
}

export async function signInUser(input: { email: string; password: string }) {
  const prisma = requirePrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      email: input.email.trim().toLowerCase(),
    },
  });

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

export async function getAppSessionFromSessionToken(token: string) {
  const prisma = requirePrismaClient();
  const payload = readSessionToken(token);
  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      id: payload.userId,
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
    },
  } satisfies AppSession;
}

export function readRequestAuthHeaders(headers: Headers): RequestAuthHeaders {
  return requestAuthHeadersSchema.parse({
    activeCompanyId: headers.get(authHeaderNames.activeCompanyId) ?? undefined,
    role: headers.get(authHeaderNames.role) ?? undefined,
    userEmail: headers.get(authHeaderNames.userEmail) ?? undefined,
    userId: headers.get(authHeaderNames.userId) ?? undefined,
    userName: headers.get(authHeaderNames.userName) ?? undefined,
  });
}

export function resolveSessionFromHeaders(
  headers: Headers,
): AuthSessionContext {
  const requestHeaders = readRequestAuthHeaders(headers);

  if (!requestHeaders.userId) {
    return {
      activeMembership: null,
      headers: requestHeaders,
      session: null,
    };
  }

  return {
    activeMembership:
      requestHeaders.activeCompanyId && requestHeaders.role
        ? {
            companyId: requestHeaders.activeCompanyId,
            role: requestHeaders.role,
          }
        : null,
    headers: requestHeaders,
    session: {
      user: {
        email: requestHeaders.userEmail,
        id: requestHeaders.userId,
        name: requestHeaders.userName,
      },
    },
  };
}

export function hasActiveMembership(
  auth: AuthSessionContext,
): auth is AuthSessionContext & {
  activeMembership: ActiveMembership;
  session: NonNullable<AuthSessionContext["session"]>;
} {
  return auth.session !== null && auth.activeMembership !== null;
}
