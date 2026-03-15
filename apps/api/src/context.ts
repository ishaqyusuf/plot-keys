import {
  authSessionCookieName,
  type AuthSessionContext,
  getAppSessionFromSessionToken,
  resolveSessionFromHeaders,
} from "@plotkeys/auth";
import { createDatabaseClient } from "@plotkeys/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TRPCContext = {
  auth: AuthSessionContext;
  db: ReturnType<typeof createDatabaseClient>;
  databaseProvider: ReturnType<typeof createDatabaseClient>["provider"];
  headers: Headers;
};

function readCookieValue(cookieHeader: string, cookieName: string) {
  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name === cookieName) {
      return valueParts.join("=");
    }
  }

  return null;
}

async function resolveAuthContext(headers: Headers): Promise<AuthSessionContext> {
  const headerAuth = resolveSessionFromHeaders(headers);

  if (headerAuth.session) {
    return headerAuth;
  }

  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    return headerAuth;
  }

  const sessionToken = readCookieValue(cookieHeader, authSessionCookieName);

  if (!sessionToken) {
    return headerAuth;
  }

  try {
    const session = await getAppSessionFromSessionToken(sessionToken);

    if (!session) {
      return headerAuth;
    }

    return {
      activeMembership: session.activeMembership
        ? {
            companyId: session.activeMembership.companyId,
            role: session.activeMembership.role,
          }
        : null,
      headers: headerAuth.headers,
      session: {
        user: {
          email: session.user.email,
          id: session.user.id,
          name: session.user.name ?? undefined,
        },
      },
    };
  } catch {
    return headerAuth;
  }
}

export async function buildRequestContext(headers: Headers): Promise<TRPCContext> {
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
