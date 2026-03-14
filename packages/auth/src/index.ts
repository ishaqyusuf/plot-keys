import type { MembershipRole } from "@plotkeys/db";
import { z } from "zod";

export const authRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  signOut: "/sign-out",
};

export const authCookiePrefix = "plotkeys";

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

export function createAuthConfig() {
  return {
    appName: "PlotKeys",
    basePath: "/api/auth",
    cookiePrefix: authCookiePrefix,
  };
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
