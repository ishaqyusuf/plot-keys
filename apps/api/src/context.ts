import {
  type AuthSessionContext,
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

export function buildRequestContext(headers: Headers): TRPCContext {
  const db = createDatabaseClient();

  return {
    auth: resolveSessionFromHeaders(headers),
    databaseProvider: db.provider,
    db,
    headers,
  };
}

export async function createTRPCContext(
  opts: FetchCreateContextFnOptions,
): Promise<TRPCContext> {
  return buildRequestContext(opts.req.headers);
}
