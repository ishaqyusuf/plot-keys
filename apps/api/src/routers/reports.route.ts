import {
  getAgentPerformanceReport,
  getListingsReport,
  getMonthlyBusinessSummary,
} from "@plotkeys/db/queries";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import { getReportsInputSchema } from "../schemas/reports.schema";

export const reportsRouter = createTRPCRouter({
  get: membershipProcedure
    .input(getReportsInputSchema)
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;
      const [summary, agentReport, listingsReport] = await Promise.all([
        getMonthlyBusinessSummary(db, companyId, input),
        getAgentPerformanceReport(db, companyId, input),
        getListingsReport(db, companyId),
      ]);

      return {
        agentReport,
        listingsReport,
        summary,
      };
    }),
});
