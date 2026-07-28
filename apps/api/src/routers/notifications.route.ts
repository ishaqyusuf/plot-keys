import {
  countUnreadNotifications,
  getNotificationBellDataForUser,
  listNotificationPreferences,
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
  upsertNotificationPreference,
} from "@plotkeys/db/queries";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const notificationsRouter = createTRPCRouter({
  bell: membershipProcedure.query(async ({ ctx }) => {
    const data = await getNotificationBellDataForUser(ctx.db.db, {
      companyId: ctx.auth.activeMembership.companyId,
      take: 5,
      userId: ctx.auth.session.user.id,
    });

    return {
      recent: data.recent.map((notification) => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
      })),
      unreadCount: data.unreadCount,
    };
  }),

  /** List recent notifications for the current user. */
  list: membershipProcedure
    .input(
      z.object({
        cursor: z.union([z.string(), z.number()]).optional().nullable(),
        end: z.string().optional().nullable(),
        onlyUnread: z.boolean().default(false),
        q: z.string().optional().nullable(),
        size: z.union([z.string(), z.number()]).optional().nullable(),
        sort: z.array(z.string()).optional().nullable(),
        start: z.string().optional().nullable(),
        take: z.number().int().min(1).max(100).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) {
        return {
          data: [],
          meta: { count: 0, cursor: null, hasNextPage: false, size: 0 },
        };
      }

      return listNotificationsForUser(db, {
        companyId: ctx.auth.activeMembership.companyId,
        cursor: input.cursor,
        end: input.end,
        onlyUnread: input.onlyUnread,
        q: input.q,
        size: input.size,
        sort: input.sort,
        start: input.start,
        take: input.take,
        userId: ctx.auth.session.user.id,
      });
    }),

  /** Count of unread notifications (for the badge). */
  unreadCount: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) return 0;

    return countUnreadNotifications(db, {
      companyId: ctx.auth.activeMembership.companyId,
      userId: ctx.auth.session.user.id,
    });
  }),

  /** Mark a single notification as read. */
  markRead: membershipProcedure
    .input(z.object({ notificationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return markNotificationRead(db, {
        notificationId: input.notificationId,
        userId: ctx.auth.session.user.id,
      });
    }),

  /** Mark selected notifications as read. */
  markManyRead: membershipProcedure
    .input(z.object({ notificationIds: z.array(z.string().uuid()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await Promise.all(
        input.notificationIds.map((notificationId) =>
          markNotificationRead(db, {
            notificationId,
            userId: ctx.auth.session.user.id,
          }),
        ),
      );

      return { ids: input.notificationIds };
    }),

  /** Mark all notifications as read. */
  markAllRead: membershipProcedure.mutation(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "DB unavailable.",
      });

    return markAllNotificationsRead(db, {
      companyId: ctx.auth.activeMembership.companyId,
      userId: ctx.auth.session.user.id,
    });
  }),

  /** List notification preferences for the current user. */
  listPreferences: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) return [];

    return listNotificationPreferences(db, {
      companyId: ctx.auth.activeMembership.companyId,
      userId: ctx.auth.session.user.id,
    });
  }),

  /** Update one notification preference for the current user. */
  updatePreference: membershipProcedure
    .input(
      z.object({
        email: z.boolean(),
        inApp: z.boolean(),
        type: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return upsertNotificationPreference(db, {
        companyId: ctx.auth.activeMembership.companyId,
        email: input.email,
        inApp: input.inApp,
        type: input.type,
        userId: ctx.auth.session.user.id,
      });
    }),
});
