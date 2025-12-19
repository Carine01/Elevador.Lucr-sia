import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { dailyMetrics, users, subscription, leads } from '../../drizzle/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { db } from '../db';

export const analyticsRouter = router({
  // Métricas gerais do dashboard
  getOverview: protectedProcedure
    .input(z.object({
      period: z.enum(['7d', '30d', '90d']).default('30d'),
    }))
    .query(async ({ ctx, input }) => {
      const days = input.period === '7d' ? 7 : input.period === '30d' ? 30 : 90;
      const startDate = startOfDay(subDays(new Date(), days));

      const metrics = await ctx.db
        .select({
          bioRadarAnalyses: sql<number>`SUM(${dailyMetrics.bioRadarAnalyses})`,
          ebooksGenerated: sql<number>`SUM(${dailyMetrics.ebooksGenerated})`,
          promptsGenerated: sql<number>`SUM(${dailyMetrics.promptsGenerated})`,
          adsGenerated: sql<number>`SUM(${dailyMetrics.adsGenerated})`,
          creditsConsumed: sql<number>`SUM(${dailyMetrics.creditsConsumed})`,
          leadsGenerated: sql<number>`SUM(${dailyMetrics.leadsGenerated})`,
          leadsConverted: sql<number>`SUM(${dailyMetrics.leadsConverted})`,
          revenue: sql<number>`SUM(${dailyMetrics.revenue})`,
        })
        .from(dailyMetrics)
        .where(
          and(
            eq(dailyMetrics.userId, ctx.userId),
            gte(dailyMetrics.date, format(startDate, 'yyyy-MM-dd'))
          )
        );

      const result = metrics[0] || {};
      
      return {
        totalAnalyses: result.bioRadarAnalyses || 0,
        totalEbooks: result.ebooksGenerated || 0,
        totalPrompts: result.promptsGenerated || 0,
        totalAds: result.adsGenerated || 0,
        creditsUsed: result.creditsConsumed || 0,
        leadsGenerated: result.leadsGenerated || 0,
        leadsConverted: result.leadsConverted || 0,
        conversionRate: result.leadsGenerated > 0 
          ? ((result.leadsConverted / result.leadsGenerated) * 100).toFixed(1)
          : '0',
        revenue: result.revenue || 0,
      };
    }),

  // Gráfico de uso de créditos
  getCreditUsageChart: protectedProcedure
    .input(z.object({
      period: z.enum(['7d', '30d']).default('30d'),
    }))
    .query(async ({ ctx, input }) => {
      const days = input.period === '7d' ? 7 : 30;
      const startDate = startOfDay(subDays(new Date(), days));

      const data = await ctx.db
        .select({
          date: dailyMetrics.date,
          consumed: dailyMetrics.creditsConsumed,
          added: dailyMetrics.creditsAdded,
        })
        .from(dailyMetrics)
        .where(
          and(
            eq(dailyMetrics.userId, ctx.userId),
            gte(dailyMetrics.date, format(startDate, 'yyyy-MM-dd'))
          )
        )
        .orderBy(dailyMetrics.date);

      return data.map(d => ({
        date: d.date,
        consumed: d.consumed || 0,
        added: d.added || 0,
        balance: (d.added || 0) - (d.consumed || 0),
      }));
    }),

  // Gráfico de uso de features
  getFeatureUsageChart: protectedProcedure
    .input(z.object({
      period: z.enum(['7d', '30d']).default('30d'),
    }))
    .query(async ({ ctx, input }) => {
      const days = input.period === '7d' ? 7 : 30;
      const startDate = startOfDay(subDays(new Date(), days));

      const data = await ctx.db
        .select({
          date: dailyMetrics.date,
          bioRadar: dailyMetrics.bioRadarAnalyses,
          ebooks: dailyMetrics.ebooksGenerated,
          prompts: dailyMetrics.promptsGenerated,
          ads: dailyMetrics.adsGenerated,
        })
        .from(dailyMetrics)
        .where(
          and(
            eq(dailyMetrics.userId, ctx.userId),
            gte(dailyMetrics.date, format(startDate, 'yyyy-MM-dd'))
          )
        )
        .orderBy(dailyMetrics.date);

      return data;
    }),

  // Funil de conversão
  getConversionFunnel: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.userId),
      with: { subscription: true },
    });

    // Contar leads em cada estágio
    const allLeads = await ctx.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(leads)
      .where(eq(leads.userId, ctx.userId));

    const contacted = await ctx.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(leads)
      .where(
        and(
          eq(leads.userId, ctx.userId),
          sql`${leads.status} IN ('em_contato', 'agendado', 'faturado')`
        )
      );

    const scheduled = await ctx.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(leads)
      .where(
        and(
          eq(leads.userId, ctx.userId),
          sql`${leads.status} IN ('agendado', 'faturado')`
        )
      );

    const converted = await ctx.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(leads)
      .where(
        and(
          eq(leads.userId, ctx.userId),
          eq(leads.status, 'faturado')
        )
      );

    return [
      { stage: 'Leads Gerados', count: allLeads[0]?.count || 0 },
      { stage: 'Contatados', count: contacted[0]?.count || 0 },
      { stage: 'Agendados', count: scheduled[0]?.count || 0 },
      { stage: 'Convertidos', count: converted[0]?.count || 0 },
    ];
  }),

  // ROI por funcionalidade
  getFeatureROI: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.userId),
      with: { subscription: true },
    });

    const plan = user?.subscription?.plan || 'free';
    const planCost = plan === 'pro' ? 2900 : plan === 'pro_plus' ? 7900 : 0; // em centavos

    // Calcular revenue gerado por leads
    const leadsRevenue = await ctx.db
      .select({
        total: sql<number>`SUM(${dailyMetrics.revenue})`,
      })
      .from(dailyMetrics)
      .where(eq(dailyMetrics.userId, ctx.userId));

    const totalRevenue = leadsRevenue[0]?.total || 0;
    const roi = planCost > 0 ? ((totalRevenue - planCost) / planCost) * 100 : 0;

    return {
      planCost,
      revenue: totalRevenue,
      roi: roi.toFixed(1),
      features: [
        { name: 'Radar de Bio', usage: 45, impact: 'Alto' },
        { name: 'E-books', usage: 30, impact: 'Médio' },
        { name: 'Prompts', usage: 15, impact: 'Médio' },
        { name: 'Anúncios', usage: 10, impact: 'Baixo' },
      ],
    };
  }),

  // Top features mais usadas
  getTopFeatures: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

    const metrics = await ctx.db
      .select({
        bioRadar: sql<number>`SUM(${dailyMetrics.bioRadarAnalyses})`,
        ebooks: sql<number>`SUM(${dailyMetrics.ebooksGenerated})`,
        prompts: sql<number>`SUM(${dailyMetrics.promptsGenerated})`,
        ads: sql<number>`SUM(${dailyMetrics.adsGenerated})`,
      })
      .from(dailyMetrics)
      .where(
        and(
          eq(dailyMetrics.userId, ctx.userId),
          gte(dailyMetrics.date, thirtyDaysAgo)
        )
      );

    const result = metrics[0] || {};

    return [
      { name: 'Radar de Bio', count: result.bioRadar || 0 },
      { name: 'E-books', count: result.ebooks || 0 },
      { name: 'Prompts', count: result.prompts || 0 },
      { name: 'Anúncios', count: result.ads || 0 },
    ].sort((a, b) => b.count - a.count);
  }),
});
