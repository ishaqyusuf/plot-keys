import {
  createProperty,
  deleteProperty,
  getEstateByIdForCompany,
  getPropertyDetailAnalytics,
  getPropertyForCompany,
  listFilteredPropertiesForCompany,
  togglePropertyFeatured,
  updateProperty,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";
import {
  createPropertyInputSchema,
  listPropertiesInputSchema,
  propertyIdInputSchema,
  propertyIdsInputSchema,
  updatePropertyInputSchema,
} from "../schemas/properties.schema";

async function assertEstateScope(
  db: Parameters<typeof getEstateByIdForCompany>[0],
  companyId: string,
  estateId: string | null | undefined,
) {
  if (!estateId) {
    return;
  }

  const estate = await getEstateByIdForCompany(db, companyId, estateId);

  if (!estate) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Estate not found.",
    });
  }
}

export const propertiesRouter = createTRPCRouter({
  create: membershipProcedure
    .input(createPropertyInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      await assertEstateScope(ctx.db.db, companyId, input.estateId);

      return createProperty(ctx.db.db, {
        companyId,
        ...input,
        paymentPlansJson: (input.paymentPlansJson ?? undefined) as never,
      });
    }),

  delete: membershipProcedure
    .input(propertyIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await deleteProperty(
        ctx.db.db,
        input.propertyId,
        ctx.auth.activeMembership.companyId,
      );

      if (result.count === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found.",
        });
      }

      return { propertyId: input.propertyId };
    }),

  deleteMany: membershipProcedure
    .input(propertyIdsInputSchema)
    .mutation(async ({ ctx, input }) => {
      const propertyIds = Array.from(new Set(input.propertyIds));
      const results = await Promise.all(
        propertyIds.map((propertyId) =>
          deleteProperty(
            ctx.db.db,
            propertyId,
            ctx.auth.activeMembership.companyId,
          ),
        ),
      );

      if (results.some((result) => result.count === 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "One or more properties were not found.",
        });
      }

      return { ids: propertyIds };
    }),

  get: membershipProcedure
    .input(propertyIdInputSchema)
    .query(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const property = await getPropertyForCompany(
        ctx.db.db,
        input.propertyId,
        companyId,
      );

      if (!property) {
        return null;
      }

      const analytics = await getPropertyDetailAnalytics(
        ctx.db.db,
        companyId,
        input.propertyId,
      );

      return { analytics, property };
    }),

  list: membershipProcedure
    .input(listPropertiesInputSchema)
    .query(async ({ ctx, input }) => {
      return listFilteredPropertiesForCompany(
        ctx.db.db,
        ctx.auth.activeMembership.companyId,
        input ?? {},
      );
    }),

  toggleFeatured: membershipProcedure
    .input(propertyIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await togglePropertyFeatured(
        ctx.db.db,
        input.propertyId,
        ctx.auth.activeMembership.companyId,
      );

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found.",
        });
      }

      return { featured: result.featured, propertyId: result.id };
    }),

  update: membershipProcedure
    .input(updatePropertyInputSchema)
    .mutation(async ({ ctx, input }) => {
      const companyId = ctx.auth.activeMembership.companyId;
      const { propertyId, ...data } = input;
      await assertEstateScope(ctx.db.db, companyId, data.estateId);

      const property = await updateProperty(ctx.db.db, propertyId, companyId, {
        ...data,
        paymentPlansJson: (data.paymentPlansJson ?? undefined) as never,
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found.",
        });
      }

      return property;
    }),
});
