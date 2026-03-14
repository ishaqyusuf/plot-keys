import {
  type AuthSessionContext,
  resolveSessionFromHeaders,
} from "@plotkeys/auth";
import { createDatabaseClient } from "@plotkeys/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TRPCContext = {
  auth: AuthSessionContext;
  db: ReturnType<typeof createDatabaseClient>;
  headers: Headers;
};

export function buildRequestContext(headers: Headers): TRPCContext {
  return {
    auth: resolveSessionFromHeaders(headers),
    db: createDatabaseClient(),
    headers,
  };
}

export async function createTRPCContext(
  opts: FetchCreateContextFnOptions,
): Promise<TRPCContext> {
  return buildRequestContext(opts.req.headers);
}
