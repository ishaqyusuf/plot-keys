import {
  createEstate,
  createEstateLayoutForCompany,
  createPlot,
  deleteEstate,
  deletePlot,
  getEstateByIdForCompany,
  getEstateDetailForCompany,
  listEstatesForCompany,
  listPlotsForEstate,
  resolveUniqueEstateSlug,
  updateEstate,
  updatePlot,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  createEstateInputSchema,
  createEstateLayoutInputSchema,
  createPlotInputSchema,
  estateIdInputSchema,
  estateSlugInputSchema,
  plotIdInputSchema,
  updateEstateInputSchema,
  updatePlotInputSchema,
} from "../schemas/estates.schema";

export const estatesRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createEstateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const slug = await resolveUniqueEstateSlug(ctx.db.db, {
        companyId,
        requestedSlug: input.slug ?? input.title,
      });

      return createEstate(ctx.db.db, {
        companyId,
        ...input,
        slug,
      });
    }),

  createLayout: membershipProcedure
    .input(createEstateLayoutInputSchema)
    .mutation(async ({ ctx, input }) => {
      const layout = await createEstateLayoutForCompany(ctx.db.db, {
        companyId: ctx.auth.activeMembership.companyId,
        estateId: input.estateId,
        sourceUrl: input.sourceUrl,
      });

      if (!layout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Estate launch not found.",
        });
      }

      return layout;
    }),

  createPlot: membershipProcedure
    .input(createPlotInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const estate = await getEstateByIdForCompany(
        ctx.db.db,
        companyId,
        input.estateId,
      );

      if (!estate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Estate launch not found.",
        });
      }

      return createPlot(ctx.db.db, {
        companyId,
        ...input,
        coordinatesJson: (input.coordinatesJson ?? undefined) as never,
        metadataJson: (input.metadataJson ?? undefined) as never,
        tagsJson: (input.tagsJson ?? undefined) as never,
      });
    }),

  delete: membershipProcedure
    .input(estateIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deleteEstate(
        ctx.db.db,
        input.estateId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Estate launch not found.",
        });
      }

      return { estateId: input.estateId };
    }),

  deletePlot: membershipProcedure
    .input(plotIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deletePlot(
        ctx.db.db,
        input.plotId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plot not found.",
        });
      }

      return { plotId: input.plotId };
    }),

  get: membershipProcedure
    .input(estateSlugInputSchema)
    .query(async ({ ctx, input }) => {
      return getEstateDetailForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input.slug,
      );
    }),

  list: membershipProcedure.query(async ({ ctx }) => {
    return listEstatesForCompany(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );
  }),

  listPlots: membershipProcedure
    .input(estateIdInputSchema)
    .query(async ({ ctx, input }) => {
      return listPlotsForEstate(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input.estateId,
      );
    }),

  update: membershipProcedure
    .input(updateEstateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const { estateId, ...data } = input;
      const slug = data.slug
        ? await resolveUniqueEstateSlug(ctx.db.db, {
            companyId,
            excludeEstateId: estateId,
            requestedSlug: data.slug,
          })
        : undefined;
      const estate = await updateEstate(ctx.db.db, estateId, companyId, {
        ...data,
        slug,
      });

      if (!estate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Estate launch not found.",
        });
      }

      return estate;
    }),

  updatePlot: membershipProcedure
    .input(updatePlotInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { plotId, ...data } = input;
      const plot = await updatePlot(
        ctx.db.db,
        plotId,
        ctx.auth.activeMembership.companyId,
        {
          ...data,
          coordinatesJson: (data.coordinatesJson ?? undefined) as never,
          metadataJson: (data.metadataJson ?? undefined) as never,
          tagsJson: (data.tagsJson ?? undefined) as never,
        },
      );

      if (!plot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plot not found.",
        });
      }

      return plot;
    }),
});
