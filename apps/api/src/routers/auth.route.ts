import {
  authSessionCookieName,
  createBetterAuthSession,
  getAppSessionFromBetterAuth,
  resolvePostLoginRoute,
  signInUser,
  signUpUser,
  verifyUserEmail,
} from "@plotkeys/auth";
import {
  createPrismaClient,
  findCompanyBySlug,
  findTenantOnboardingByUserId,
  getSessionUserByTokenUserId,
  resolveTenantByHostname,
  upsertTenantOnboarding,
} from "@plotkeys/db";
import {
  buildSitefrontHostname,
  buildTenantDashboardUrl,
  extractDashboardTenantSlug,
  normalizeSubdomainLabel,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";

import {
  planAuthEmailVerifiedNotification,
  planAuthVerificationRequestedNotification,
} from "../lib/auth-notifications";
import { createTRPCRouter, publicProcedure } from "../lib.trpc";
import {
  signInInputSchema,
  signUpInputSchema,
  verifyEmailInputSchema,
} from "../schemas/auth.schema";

const reservedSubdomains = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "mail",
  "support",
  "www",
]);

function requireDb() {
  const client = createPrismaClient();

  if (!client.db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "DATABASE_URL is not configured.",
    });
  }

  return client.db;
}

async function assertSubdomainAvailability(
  db: NonNullable<ReturnType<typeof createPrismaClient>["db"]>,
  subdomain: string,
) {
  if (!subdomain || subdomain.length < 3) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Choose a subdomain with at least 3 characters.",
    });
  }

  if (reservedSubdomains.has(subdomain)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "That subdomain is reserved. Choose another one.",
    });
  }

  const existingCompany = await findCompanyBySlug(db, subdomain);

  if (existingCompany) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That subdomain is already in use.",
    });
  }
}

async function resolvePostAuthRedirect(
  userId: string,
  tenantSlug?: string | null,
) {
  const { signedSessionToken } = await createBetterAuthSession(userId);

  // Build synthetic headers so we can load the session from the DB
  const syntheticHeaders = new Headers({
    cookie: `${authSessionCookieName}=${signedSessionToken}`,
  });
  if (tenantSlug) {
    syntheticHeaders.set("x-tenant-subdomain", tenantSlug);
  }
  const appSession = await getAppSessionFromBetterAuth(syntheticHeaders);

  return {
    redirectTo: resolvePostLoginRoute(appSession?.activeMembership),
    sessionToken: signedSessionToken,
  };
}

async function getRequestedTenantSlug(
  db: NonNullable<ReturnType<typeof createPrismaClient>["db"]>,
  headers: Headers,
) {
  const forwardedTenantSlug = headers.get("x-tenant-subdomain");

  if (forwardedTenantSlug) {
    return normalizeSubdomainLabel(forwardedTenantSlug);
  }

  const forwardedTenantHostname = headers.get("x-tenant-hostname");

  if (forwardedTenantHostname) {
    const resolvedTenant = await resolveTenantByHostname(
      db,
      forwardedTenantHostname,
    );
    return resolvedTenant?.companySlug ?? null;
  }

  const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
  const tenantSlug = extractDashboardTenantSlug(host);

  return tenantSlug ? normalizeSubdomainLabel(tenantSlug) : null;
}

async function assertTenantScopedAuthAccess(input: {
  db: NonNullable<ReturnType<typeof createPrismaClient>["db"]>;
  requestedTenantSlug: string;
  userId: string;
}) {
  const [user, onboarding] = await Promise.all([
    getSessionUserByTokenUserId(input.db, input.userId),
    findTenantOnboardingByUserId(input.db, input.userId),
  ]);

  const hasMembershipForTenant =
    user?.memberships.some(
      (membership) => membership.company.slug === input.requestedTenantSlug,
    ) ?? false;
  const canResumeOnboarding =
    onboarding?.completedAt == null &&
    onboarding?.subdomain === input.requestedTenantSlug;

  if (!hasMembershipForTenant && !canResumeOnboarding) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "This account does not have access to the current tenant workspace.",
    });
  }
}

export const authRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(signInInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const requestedTenantSlug = await getRequestedTenantSlug(db, ctx.headers);

      if (!requestedTenantSlug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Sign in from your tenant workspace URL. The shared app host only supports signup.",
        });
      }

      try {
        const user = await signInUser(input);
        await assertTenantScopedAuthAccess({
          db,
          requestedTenantSlug,
          userId: user.id,
        });

        return resolvePostAuthRedirect(user.id, requestedTenantSlug);
      } catch (error) {
        throw new TRPCError({
          code: error instanceof TRPCError ? error.code : "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Unable to sign in right now.",
        });
      }
    }),
  signUp: publicProcedure
    .input(signUpInputSchema)
    .mutation(async ({ input }) => {
      const subdomain = normalizeSubdomainLabel(input.subdomain);
      const db = requireDb();

      try {
        await assertSubdomainAvailability(db, subdomain);

        const { user, verificationToken } = await signUpUser({
          db,
          email: input.email,
          emailVerified: false,
          name: input.name,
          password: input.password,
          phoneNumber: input.phoneNumber,
        });

        // Persist onboarding identity to the DB immediately so it can be
        // resumed from any device/session even if the cookie expires.
        await upsertTenantOnboarding(db, {
          companyName: input.company.trim(),
          currentStep: "market",
          subdomain,
          userId: user.id,
        });

        await planAuthVerificationRequestedNotification({
          companyName: input.company.trim(),
          email: user.email,
          fullName: input.name.trim(),
          phoneNumber: user.phoneNumber,
          subdomain,
          token: verificationToken,
          userId: user.id,
        });

        return {
          email: user.email,
          onboarding: {
            company: input.company.trim(),
            subdomain,
          },
          redirectTo: buildTenantDashboardUrl(subdomain, {
            pathname: "/onboarding",
          }),
          verificationToken,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Unable to create account.",
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(verifyEmailInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const requestedTenantSlug = await getRequestedTenantSlug(db, ctx.headers);

      if (requestedTenantSlug && input.subdomain) {
        const inputSubdomain = normalizeSubdomainLabel(input.subdomain);

        if (inputSubdomain !== requestedTenantSlug) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Verification must continue on the matching tenant host.",
          });
        }
      }

      try {
        const user = await verifyUserEmail(input.token);
        const resolvedTenantSlug = requestedTenantSlug
          ? requestedTenantSlug
          : input.subdomain
            ? normalizeSubdomainLabel(input.subdomain)
            : null;

        if (resolvedTenantSlug) {
          await assertTenantScopedAuthAccess({
            db,
            requestedTenantSlug: resolvedTenantSlug,
            userId: user.id,
          });
        }

        if (input.company && input.subdomain) {
          const subdomain = normalizeSubdomainLabel(input.subdomain);

          await planAuthEmailVerifiedNotification({
            companyName: input.company.trim(),
            email: user.email,
            fullName: user.name ?? "Workspace owner",
            phoneNumber: user.phoneNumber,
            siteHostname: buildSitefrontHostname(subdomain),
            userId: user.id,
          });
        }

        return resolvePostAuthRedirect(user.id, resolvedTenantSlug);
      } catch (error) {
        throw new TRPCError({
          code: error instanceof TRPCError ? error.code : "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Unable to verify that email address.",
        });
      }
    }),
});
