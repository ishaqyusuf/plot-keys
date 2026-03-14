import type { TRPCContext } from "../../context";

export async function getHealth(ctx: TRPCContext) {
  return {
    api: "ok",
    database: ctx.db.status,
    timestamp: new Date().toISOString(),
  };
}
