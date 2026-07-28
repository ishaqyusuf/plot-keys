import {
  getCompanyIntegration,
  upsertCompanyIntegration,
} from "@plotkeys/db/queries";

import {
  assertMinRole,
  createTRPCRouter,
  membershipProcedure,
} from "../lib.trpc";
import { updateIntegrationInputSchema } from "../schemas/integrations.schema";

export const integrationsRouter = createTRPCRouter({
  get: membershipProcedure.query(async ({ ctx }) => {
    return getCompanyIntegration(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  update: membershipProcedure
    .input(updateIntegrationInputSchema)
    .mutation(async ({ ctx, input }) => {
      assertMinRole(ctx.auth.activeMembership.role, "admin");

      return upsertCompanyIntegration(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input,
      );
    }),
});
