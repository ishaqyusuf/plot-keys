import {
  type CompanyPlanTier,
  findAppById,
  isAppAvailable,
} from "@plotkeys/app-store/registry";
import {
  findCompanyById,
  getCompanyAppsState,
  setCompanyEnabledAppIds,
} from "@plotkeys/db/queries";
import { tierLabels } from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  assertMinRole,
  createTRPCRouter,
  membershipProcedure,
} from "../lib.trpc";

export const appsRouter = createTRPCRouter({
  get: membershipProcedure.query(async ({ ctx }) => {
    const state = await getCompanyAppsState(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );

    if (!state) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found.",
      });
    }

    return state;
  }),

  setEnabled: membershipProcedure
    .input(
      z.object({
        appId: z.string().trim().min(1),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;
      assertMinRole(ctx.auth.activeMembership.role, "admin");

      const app = findAppById(input.appId);
      if (!app) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown app.",
        });
      }

      const company = await findCompanyById(db, companyId);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found.",
        });
      }

      const planTier = (company.planTier ?? "starter") as CompanyPlanTier;

      if (input.enabled && !isAppAvailable(app, planTier)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `${app.label} requires the ${tierLabels[app.planGate]} plan.`,
        });
      }

      const enabledIds = new Set(company.enabledApps ?? []);
      if (input.enabled) {
        enabledIds.add(app.id);
      } else {
        enabledIds.delete(app.id);
      }

      await setCompanyEnabledAppIds(db, {
        companyId,
        enabledIds: Array.from(enabledIds),
      });

      return { appId: app.id, enabled: input.enabled };
    }),
});
