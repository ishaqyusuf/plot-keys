import {
  authRoutes,
  createSessionToken,
  getAppSessionFromSessionToken,
  signInUser,
  signUpUser,
  verifyUserEmail,
} from "@plotkeys/auth";
import {
  createPrismaClient,
  findCompanyBySlug,
} from "@plotkeys/db";
import { normalizeSubdomainLabel } from "@plotkeys/utils";
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

async function resolvePostAuthRedirect(userId: string) {
  const sessionToken = createSessionToken(userId);
  const appSession = await getAppSessionFromSessionToken(sessionToken);

  return {
    redirectTo: appSession?.activeMembership
      ? authRoutes.dashboardHome
      : authRoutes.onboarding,
    sessionToken,
  };
}

export const authRouter = createTRPCRouter({
  signIn: publicProcedure.input(signInInputSchema).mutation(async ({ input }) => {
    try {
      const user = await signInUser(input);

      return resolvePostAuthRedirect(user.id);
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error instanceof Error ? error.message : "Unable to sign in right now.",
      });
    }
  }),
  signUp: publicProcedure.input(signUpInputSchema).mutation(async ({ input }) => {
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
      await planAuthVerificationRequestedNotification({
        companyName: input.company.trim(),
        email: user.email,
        fullName: input.name.trim(),
        phoneNumber: user.phoneNumber,
        token: verificationToken,
        userId: user.id,
      });

      return {
        email: user.email,
        onboarding: {
          company: input.company.trim(),
          subdomain,
        },
        redirectTo: authRoutes.signUpSuccess,
        verificationToken,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          error instanceof Error ? error.message : "Unable to create account.",
      });
    }
  }),
  verifyEmail: publicProcedure
    .input(verifyEmailInputSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await verifyUserEmail(input.token);

        if (input.company && input.subdomain) {
          const subdomain = normalizeSubdomainLabel(input.subdomain);

          await planAuthEmailVerifiedNotification({
            companyName: input.company.trim(),
            email: user.email,
            fullName: user.name ?? "Workspace owner",
            phoneNumber: user.phoneNumber,
            siteHostname: `${subdomain}.plotkeys.com`,
            userId: user.id,
          });
        }

        return resolvePostAuthRedirect(user.id);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Unable to verify that email address.",
        });
      }
    }),
});
