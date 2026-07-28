import {
  getAgentPerformanceStats,
  getAnalyticsSummary,
  getLeadSourceBreakdown,
  getPageViewsByDay,
  getPropertyAnalytics,
  getTopPages,
  getTrafficSources,
} from "@plotkeys/db/queries";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const analyticsRouter = createTRPCRouter({
  get: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    const companyId = ctx.auth.activeMembership.companyId;
    const [
      summary,
      pageViewsByDay,
      topPages,
      trafficSources,
      propertyViews,
      leadSources,
      agentStats,
    ] = await Promise.all([
      getAnalyticsSummary(db, companyId),
      getPageViewsByDay(db, companyId, 30),
      getTopPages(db, companyId),
      getTrafficSources(db, companyId),
      getPropertyAnalytics(db, companyId),
      getLeadSourceBreakdown(db, companyId),
      getAgentPerformanceStats(db, companyId),
    ]);

    return {
      ...summary,
      agentStats,
      leadSources,
      pageViewsByDay,
      propertyViews,
      topPages,
      trafficSources,
    };
  }),
});
