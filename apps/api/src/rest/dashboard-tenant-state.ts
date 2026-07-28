import type { Db } from "@plotkeys/db";
import { getDashboardTenantState } from "@plotkeys/db/queries";

export async function handleDashboardTenantState(request: Request, db: Db) {
  const searchParams = new URL(request.url).searchParams;
  const tenantHostname = searchParams.get("hostname");
  const tenantSlug = searchParams.get("slug");
  const state = await getDashboardTenantState(db, {
    tenantHostname,
    tenantSlug,
  });

  return Response.json(state);
}
