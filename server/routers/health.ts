import { router, publicProcedure } from "../_core/trpc";

/**
 * Health Check Router
 * Usado pelo Railway para verificar se o serviço está funcionando
 */
export const healthRouter = router({
  check: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })),
});

export type HealthRouter = typeof healthRouter;
