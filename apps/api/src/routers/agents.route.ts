import {
  createAgent,
  deleteAgent,
  getAgentForCompany,
  listAgentsForCompany,
  toggleAgentFeatured,
  updateAgent,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  agentIdInputSchema,
  agentIdsInputSchema,
  createAgentInputSchema,
  listAgentsInputSchema,
  updateAgentInputSchema,
} from "../schemas/agents.schema";

export const agentsRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createAgentInputSchema)
    .mutation(async ({ ctx, input }) => {
      return createAgent(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        ...input,
      });
    }),

  delete: membershipProcedure
    .input(agentIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deleteAgent(
        ctx.db.db,
        input.agentId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      return { agentId: input.agentId };
    }),

  deleteMany: membershipProcedure
    .input(agentIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const agentIds = Array.from(new Set(input.agentIds));
      const results = await Promise.all(
        agentIds.map((agentId) =>
          deleteAgent(ctx.db.db, agentId, ctx.auth.activeMembership.companyId),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more agents were not found.",
        });
      }

      return { ids: agentIds };
    }),

  get: membershipProcedure
    .input(agentIdInputSchema)
    .query(async ({ ctx, input }) => {
      const agent = await getAgentForCompany(
        ctx.db.db,
        input.agentId,
        ctx.auth.activeMembership.companyId,
      );

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      return agent;
    }),

  list: membershipProcedure
    .input(listAgentsInputSchema)
    .query(async ({ ctx, input }) => {
      return listAgentsForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input,
      );
    }),

  toggleFeatured: membershipProcedure
    .input(agentIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await toggleAgentFeatured(
        ctx.db.db,
        input.agentId,
        ctx.auth.activeMembership.companyId,
      );

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      return { agentId: result.id, featured: result.featured };
    }),

  update: membershipProcedure
    .input(updateAgentInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { agentId, ...data } = input;
      const agent = await updateAgent(
        ctx.db.db,
        agentId,
        ctx.auth.activeMembership.companyId,
        data,
      );

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      return agent;
    }),
});
