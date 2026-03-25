import {
  type AuthSessionContext,
  getAppSessionFromBetterAuth,
} from "@plotkeys/auth";
import { createDatabaseClient } from "@plotkeys/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TRPCContext = {
  auth: AuthSessionContext;
  db: ReturnType<typeof createDatabaseClient>;
  databaseProvider: ReturnType<typeof createDatabaseClient>["provider"];
  headers: Headers;
};

async function resolveAuthContext(
  headers: Headers,
): Promise<AuthSessionContext> {
  try {
    const session = await getAppSessionFromBetterAuth(headers);

    if (!session) {
      return { activeMembership: null, session: null };
    }

    return {
      activeMembership: session.activeMembership
        ? {
            companyId: session.activeMembership.companyId,
            role: session.activeMembership.role,
            workRole: session.activeMembership.workRole,
          }
        : null,
      session: {
        user: {
          email: session.user.email,
          id: session.user.id,
          name: session.user.name ?? undefined,
          phoneNumber: session.user.phoneNumber,
        },
      },
    };
  } catch {
    return { activeMembership: null, session: null };
  }
}

export async function buildRequestContext(
  headers: Headers,
): Promise<TRPCContext> {
  const db = createDatabaseClient();

  return {
    auth: await resolveAuthContext(headers),
    databaseProvider: db.provider,
    db,
    headers,
  };
}

export async function createTRPCContext(
  opts: FetchCreateContextFnOptions,
): Promise<TRPCContext> {
  return await buildRequestContext(opts.req.headers);
}
