import {
  countUnreadNotifications,
  createNotification,
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

export const notificationsRouter = createTRPCRouter({
  /** List recent notifications for the current user. */
  list: membershipProcedure
    .input(
      z.object({
        take: z.number().int().min(1).max(100).default(50),
        onlyUnread: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      return listNotificationsForUser(db, {
        companyId: ctx.auth.activeMembership.companyId,
        userId: ctx.auth.session.user.id,
        take: input.take,
        onlyUnread: input.onlyUnread,
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
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

      return markNotificationRead(db, {
        notificationId: input.notificationId,
        userId: ctx.auth.session.user.id,
      });
    }),

  /** Mark all notifications as read. */
  markAllRead: membershipProcedure.mutation(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable." });

    return markAllNotificationsRead(db, {
      companyId: ctx.auth.activeMembership.companyId,
      userId: ctx.auth.session.user.id,
    });
  }),
});
