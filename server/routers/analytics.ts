import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getMetricsSummary } from '../_core/metricsService';

export const analyticsRouter = router({
  getDashboard: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      return await getMetricsSummary(ctx.user.id, startDate, endDate);
    }),

  getCreditHistory: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const data = await getMetricsSummary(ctx.user.id, startDate, endDate);
      
      return data.dailyData.map(d => ({
        date: d.date,
        creditsUsed: d.creditsUsed || 0,
      }));
    }),

  getFeatureUsage: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const data = await getMetricsSummary(ctx.user.id, startDate, endDate);
      
      return Object.entries(data.featureUsage).map(([name, count]) => ({
        name,
        count,
      }));
    }),
});
