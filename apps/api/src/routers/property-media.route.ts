import {
  addPropertyMedia,
  deletePropertyMedia,
  listPropertyMedia,
  reorderPropertyMedia,
  setPropertyCover,
  updatePropertyPublishState,
} from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const propertyMediaRouter = createTRPCRouter({
  /** List all media for a property. */
  listMedia: membershipProcedure
    .input(z.object({ propertyId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return listPropertyMedia(db, input.propertyId);
    }),

  /** Add a media item (image, floor plan, virtual tour) to a property. */
  addMedia: membershipProcedure
    .input(
      z.object({
        propertyId: z.string().uuid(),
        kind: z.enum(["image", "floor_plan", "virtual_tour"]).default("image"),
        url: z.string().url(),
        isCover: z.boolean().default(false),
        sortOrder: z.number().int().min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      // Verify property belongs to this company
      const property = await db.property.findFirst({
        where: {
          id: input.propertyId,
          companyId: ctx.auth.activeMembership.companyId,
          deletedAt: null,
        },
      });

      if (!property) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Property not found." });
      }

      return addPropertyMedia(db, input);
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return deletePropertyMedia(db, {
        mediaId: input.mediaId,
        propertyId: input.propertyId,
      });
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return setPropertyCover(db, {
        mediaId: input.mediaId,
        propertyId: input.propertyId,
      });
    }),

  /** Reorder media items (batch update sort_order). */
  reorderMedia: membershipProcedure
    .input(
      z.object({
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return reorderPropertyMedia(db, input.items);
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return updatePropertyPublishState(db, {
        propertyId: input.propertyId,
        companyId: ctx.auth.activeMembership.companyId,
        publishState: input.publishState,
      });
    }),
});
