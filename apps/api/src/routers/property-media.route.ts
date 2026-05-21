import {
  addPropertyMedia,
  deletePropertyMedia,
  getAssetForCompany,
  listPropertyMedia,
  reorderPropertyMedia,
  setPropertyCover,
  updatePropertyPublishState,
} from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

async function getCompanyPropertyOrThrow(
  db: NonNullable<Parameters<typeof listPropertyMedia>[0]>,
  input: { companyId: string; propertyId: string },
) {
  const property = await db.property.findFirst({
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

async function syncPropertyCoverImageUrl(
  db: NonNullable<Parameters<typeof listPropertyMedia>[0]>,
  input: { companyId: string; propertyId: string },
) {
  const cover = await db.propertyMedia.findFirst({
    include: { asset: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    where: {
      isCover: true,
      kind: "image",
      property: {
        companyId: input.companyId,
        deletedAt: null,
        id: input.propertyId,
      },
    },
  });

  await db.property.update({
    data: { imageUrl: cover?.asset?.publicUrl ?? cover?.url ?? null },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.propertyId,
    },
  });
}

export const propertyMediaRouter = createTRPCRouter({
  /** List all media for a property. */
  listMedia: membershipProcedure
    .input(z.object({ propertyId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await getCompanyPropertyOrThrow(db, {
        companyId: ctx.auth.activeMembership.companyId,
        propertyId: input.propertyId,
      });

      return listPropertyMedia(db, input.propertyId);
    }),

  /** Add a media item (image, floor plan, virtual tour) to a property. */
  addMedia: membershipProcedure
    .input(
      z
        .object({
          assetId: z.string().uuid().optional().nullable(),
          altText: z.string().trim().max(240).optional().nullable(),
          caption: z.string().trim().max(500).optional().nullable(),
          propertyId: z.string().uuid(),
          kind: z
            .enum(["image", "floor_plan", "virtual_tour"])
            .default("image"),
          url: z.string().url().optional().nullable(),
          isCover: z.boolean().default(false),
          sortOrder: z.number().int().min(0).default(0),
        })
        .refine((value) => value.assetId || value.url, {
          message: "An asset or URL is required.",
          path: ["assetId"],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await getCompanyPropertyOrThrow(db, {
        companyId: ctx.auth.activeMembership.companyId,
        propertyId: input.propertyId,
      });

      if (input.assetId) {
        const asset = await getAssetForCompany(db, {
          assetId: input.assetId,
          companyId: ctx.auth.activeMembership.companyId,
        });
        if (!asset || asset.status !== "ready") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Asset is not available.",
          });
        }
      }

      const media = await addPropertyMedia(db, input);
      if (input.isCover && input.kind === "image") {
        await syncPropertyCoverImageUrl(db, {
          companyId: ctx.auth.activeMembership.companyId,
          propertyId: input.propertyId,
        });
      }

      return media;
    }),

  /** Delete a media item. */
  deleteMedia: membershipProcedure
    .input(
      z.object({
        mediaId: z.string().uuid(),
        propertyId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await getCompanyPropertyOrThrow(db, {
        companyId: ctx.auth.activeMembership.companyId,
        propertyId: input.propertyId,
      });

      const media = await deletePropertyMedia(db, {
        mediaId: input.mediaId,
        propertyId: input.propertyId,
      });
      if (media.isCover && media.kind === "image") {
        await syncPropertyCoverImageUrl(db, {
          companyId: ctx.auth.activeMembership.companyId,
          propertyId: input.propertyId,
        });
      }

      return media;
    }),

  /** Set a media item as the cover image. */
  setCover: membershipProcedure
    .input(
      z.object({
        mediaId: z.string().uuid(),
        propertyId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await getCompanyPropertyOrThrow(db, {
        companyId: ctx.auth.activeMembership.companyId,
        propertyId: input.propertyId,
      });

      const media = await setPropertyCover(db, {
        mediaId: input.mediaId,
        propertyId: input.propertyId,
      });
      if (media.kind === "image") {
        await syncPropertyCoverImageUrl(db, {
          companyId: ctx.auth.activeMembership.companyId,
          propertyId: input.propertyId,
        });
      }

      return media;
    }),

  /** Reorder media items (batch update sort_order). */
  reorderMedia: membershipProcedure
    .input(
      z.object({
        propertyId: z.string().uuid(),
        items: z.array(
          z.object({
            id: z.string().uuid(),
            sortOrder: z.number().int().min(0),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await getCompanyPropertyOrThrow(db, {
        companyId: ctx.auth.activeMembership.companyId,
        propertyId: input.propertyId,
      });

      return reorderPropertyMedia(
        db,
        input.items.map((item) => ({ ...item, propertyId: input.propertyId })),
      );
    }),

  /** Change publish state of a property (draft → published → archived). */
  updatePublishState: membershipProcedure
    .input(
      z.object({
        propertyId: z.string().uuid(),
        publishState: z.enum(["draft", "published", "archived"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return updatePropertyPublishState(db, {
        propertyId: input.propertyId,
        companyId: ctx.auth.activeMembership.companyId,
        publishState: input.publishState,
      });
    }),
});
