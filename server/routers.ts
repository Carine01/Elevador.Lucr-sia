import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscriptionRouter } from "./routers/subscription";
import { bioRadarRouter } from "./routers/bioRadar";
import { contentRouter } from "./routers/content";
import { crmRouter } from "./routers/crm";
import { calendarRouter } from "./routers/calendar";
import { diagnosticoRouter } from "./routers/diagnostico";
import { gamificationRouter } from "./routers/gamification";
import { quizRouter } from "./routers/quiz";
import { adminRouter } from "./routers/admin";
import { healthRouter } from "./routers/health";
import { getDbSync } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { logger } from "./_core/logger";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    // 🔒 LGPD: Direito ao esquecimento
    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.user.id;
      const db = getDbSync();
      
      if (!db) {
        logger.error("Database not available for account deletion", { userId });
        throw new Error("Serviço temporariamente indisponível. Tente novamente mais tarde.");
      }
      
      try {
        // Deletar em cascata (foreign keys configuradas com onDelete: "cascade")
        await db.delete(users).where(eq(users.id, userId));
        
        // Limpar cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
        
        logger.info("Conta deletada pelo usuário (LGPD)", { userId });
        
        return { 
          success: true,
          message: "Conta deletada permanentemente"
        };
      } catch (error) {
        logger.error("Erro ao deletar conta", { userId, error });
        throw new Error("Erro ao deletar conta. Entre em contato com suporte.");
      }
    }),
  }),

  // 🚀 HEALTH CHECK - CRÍTICO PARA RAILWAY
  health: healthRouter,

  // Feature routers
  subscription: subscriptionRouter,
  bioRadar: bioRadarRouter,
  content: contentRouter,
  
  // 🚀 NOVOS ROUTERS - Backend Real
  crm: crmRouter,
  calendar: calendarRouter,
  diagnostico: diagnosticoRouter,
  gamification: gamificationRouter,
  quiz: quizRouter,
  
  // 🔒 ADMIN
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
