import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { notifications } from '../../drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export const notificationsRouter = router({
  getAll: protectedProcedure
    .input(z.object({
      limit: z.number().default(50),
      onlyUnread: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const where = input.onlyUnread
        ? and(eq(notifications.userId, ctx.user.id), eq(notifications.read, false))
        : eq(notifications.userId, ctx.user.id);

      return await ctx.db.query.notifications.findMany({
        where,
        orderBy: desc(notifications.createdAt),
        limit: input.limit,
      });
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const unread = await ctx.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false)
        )
      );

    return unread[0]?.count || 0;
  }),

  markAsRead: protectedProcedure
    .input(z.object({
      notificationId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(notifications)
        .set({
          read: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(notifications.id, input.notificationId),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({
        read: true,
        readAt: new Date(),
      })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  delete: protectedProcedure
    .input(z.object({
      notificationId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, input.notificationId),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .delete(notifications)
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),
});
