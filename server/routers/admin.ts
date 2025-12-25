import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { users, subscription as subscriptionTable, Subscription } from "../../drizzle/schema";
import { eq, desc, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Middleware que valida se usuário é admin
const adminOnly = protectedProcedure.use(async (opts) => {
  if (opts.ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Acesso negado. Apenas administradores.",
    });
  }
  return opts.next();
});

export const adminRouter = router({
  // Dashboard Stats
  getStats: adminOnly.query(async () => {
    const dbInstance = await db;
    
    const [totalUsersResult] = await dbInstance.select({ count: count() }).from(users);
    const [activeSubsResult] = await dbInstance.select({ count: count() })
      .from(subscriptionTable)
      .where(eq(subscriptionTable.status, "active"));
    
    // Calcular MRR baseado nos planos ativos
    const subs = await dbInstance.select()
      .from(subscriptionTable)
      .where(eq(subscriptionTable.status, "active"));
    
    const mrr = subs.reduce((acc: number, sub: Subscription) => {
      const prices: Record<string, number> = {
        essencial: 97,
        profissional: 197,
        free: 0,
      };
      return acc + (prices[sub.plan] || 0);
    }, 0);

    return {
      totalUsers: totalUsersResult?.count || 0,
      activeSubscriptions: activeSubsResult?.count || 0,
      mrr,
    };
  }),

  // Lista de usuários com paginação
  getUsers: adminOnly
    .input(z.object({ 
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const dbInstance = await db;
      const offset = (input.page - 1) * input.limit;
      
      const usersList = await dbInstance.select()
        .from(users)
        .limit(input.limit)
        .offset(offset)
        .orderBy(desc(users.createdAt));
      
      const [totalResult] = await dbInstance.select({ count: count() }).from(users);
      
      return { 
        users: usersList, 
        total: totalResult?.count || 0,
        page: input.page,
        limit: input.limit,
      };
    }),

  // Detalhes de um usuário específico
  getUserDetail: adminOnly
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const dbInstance = await db;
      
      const [user] = await dbInstance.select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);
      
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
      }

      const [subscription] = await dbInstance.select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, input.userId))
        .limit(1);

      return { user, subscription };
    }),
});
