import type { TRPCContext } from "../../context";

export async function getHealth(ctx: TRPCContext) {
  return {
    api: "ok",
    auth: ctx.auth.session ? "session-present" : "anonymous",
    companyId: ctx.auth.activeMembership?.companyId ?? null,
    databaseDriver: ctx.db.driver,
    databaseProvider: ctx.databaseProvider,
    database: ctx.db.status,
    timestamp: new Date().toISOString(),
  };
}
