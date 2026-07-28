import { getDashboardOverview } from "@plotkeys/db/queries";
import { isVercelDomainProvisioningConfigured } from "@plotkeys/utils";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const overviewRouter = createTRPCRouter({
  summary: membershipProcedure.query(async ({ ctx }) => {
    const overview = await getDashboardOverview(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );

    return {
      ...overview,
      domainProvisioningConfigured: isVercelDomainProvisioningConfigured(),
    };
  }),
});
