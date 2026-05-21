import { addPropertyMedia } from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createAssetService } from "../lib/asset-service";
import { createPublicImageProvider } from "../lib/public-image-providers";
import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

const providerSchema = z.enum(["unsplash", "pexels", "pixabay"]);

async function getCompanyPropertyOrThrow(
  db: NonNullable<Parameters<typeof addPropertyMedia>[0]>,
  input: { companyId: string; propertyId: string },
) {
  const property = await db.property.findFirst({
    select: { id: true },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.propertyId,
    },
  });

  if (!property) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Property not found." });
  }

  return property;
}

export const publicImagesRouter = createTRPCRouter({
  search: membershipProcedure
    .input(
      z.object({
        orientation: z.enum(["landscape", "portrait", "square"]).optional(),
        page: z.number().int().min(1).default(1),
        provider: providerSchema.default("unsplash"),
        query: z.string().trim().min(2).max(100),
      }),
    )
    .query(async ({ input }) => {
      const provider = createPublicImageProvider(input.provider);
      return provider.search(input);
    }),

  importToProperty: membershipProcedure
    .input(
      z.object({
        imageId: z.string().trim().min(1),
        isCover: z.boolean().default(false),
        propertyId: z.string().uuid(),
        provider: providerSchema.default("unsplash"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });
      }

      const companyId = ctx.auth.activeMembership.companyId;
      await getCompanyPropertyOrThrow(db, {
        companyId,
        propertyId: input.propertyId,
      });

      const provider = createPublicImageProvider(input.provider);
      if (!provider.getById) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provider does not support direct imports yet.",
        });
      }

      const image = await provider.getById(input.imageId);
      await provider.trackSelection?.(image);

      const assetService = createAssetService(db);
      const asset = await assetService.createFromRemoteUrl({
        companyId,
        fileName: `${image.provider}-${image.id}`,
        originKind: image.provider,
        originMeta: {
          attributionText: image.attributionText,
          authorName: image.authorName,
          authorUrl: image.authorUrl,
          licenseLabel: image.licenseLabel,
          provider: image.provider,
          providerImageId: image.id,
          sourceUrl: image.sourceUrl,
        },
        scope: "properties",
        scopeId: input.propertyId,
        url: image.fullUrl,
      });

      const media = await addPropertyMedia(db, {
        assetId: asset.id,
        altText: image.attributionText ?? image.authorName,
        caption: image.attributionText,
        isCover: input.isCover,
        kind: "image",
        propertyId: input.propertyId,
      });

      if (input.isCover) {
        await db.property.update({
          data: { imageUrl: asset.publicUrl },
          where: {
            companyId,
            deletedAt: null,
            id: input.propertyId,
          },
        });
      }

      return media;
    }),
});
