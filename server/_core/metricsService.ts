import { db } from '../db';
import { dailyMetrics } from '../../drizzle/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import type { DailyMetrics } from '../../drizzle/schema';

export async function recordMetric(
  userId: number,
  metric: keyof Omit<DailyMetrics, 'id' | 'userId' | 'date' | 'createdAt' | 'creditsByFeature'>,
  increment: number = 1
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Tentar inserir novo registro
    await db.insert(dailyMetrics).values({
      userId,
      date: today,
      [metric]: increment,
    });
  } catch (error) {
    // Se já existe, incrementar
    await db
      .update(dailyMetrics)
      .set({
        [metric]: sql`${dailyMetrics[metric]} + ${increment}`,
      })
      .where(
        and(
          eq(dailyMetrics.userId, userId),
          eq(dailyMetrics.date, today)
        )
      );
  }
}

export async function recordCreditUsage(
  userId: number,
  feature: string,
  credits: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const existing = await db.query.dailyMetrics.findFirst({
    where: and(
      eq(dailyMetrics.userId, userId),
      eq(dailyMetrics.date, today)
    ),
  });

  if (existing) {
    const creditsByFeature = existing.creditsByFeature || {};
    creditsByFeature[feature] = (creditsByFeature[feature] || 0) + credits;
    
    await db
      .update(dailyMetrics)
      .set({
        creditsUsed: (existing.creditsUsed || 0) + credits,
        creditsByFeature,
      })
      .where(eq(dailyMetrics.id, existing.id));
  } else {
    await db.insert(dailyMetrics).values({
      userId,
      date: today,
      creditsUsed: credits,
      creditsByFeature: { [feature]: credits },
    });
  }
}

export async function getMetricsSummary(
  userId: number,
  startDate: string,
  endDate: string
) {
  const metrics = await db.query.dailyMetrics.findMany({
    where: and(
      eq(dailyMetrics.userId, userId),
      gte(dailyMetrics.date, startDate),
      lte(dailyMetrics.date, endDate)
    ),
    orderBy: dailyMetrics.date,
  });

  const summary = {
    totalCreditsUsed: 0,
    totalBioRadarAnalyses: 0,
    totalLeadsCaptured: 0,
    totalEbooksGenerated: 0,
    totalPromptsGenerated: 0,
    totalAdsGenerated: 0,
    totalCheckoutsStarted: 0,
    totalCheckoutsCompleted: 0,
    conversionRate: 0,
    dailyData: metrics,
    featureUsage: {} as Record<string, number>,
  };

  metrics.forEach(m => {
    summary.totalCreditsUsed += m.creditsUsed || 0;
    summary.totalBioRadarAnalyses += m.bioRadarAnalyses || 0;
    summary.totalLeadsCaptured += m.leadsCaptured || 0;
    summary.totalEbooksGenerated += m.ebooksGenerated || 0;
    summary.totalPromptsGenerated += m.promptsGenerated || 0;
    summary.totalAdsGenerated += m.adsGenerated || 0;
    summary.totalCheckoutsStarted += m.checkoutsStarted || 0;
    summary.totalCheckoutsCompleted += m.checkoutsCompleted || 0;
    
    // Agregar uso por feature
    if (m.creditsByFeature) {
      Object.entries(m.creditsByFeature).forEach(([feature, count]) => {
        summary.featureUsage[feature] = (summary.featureUsage[feature] || 0) + count;
      });
    }
  });

  if (summary.totalCheckoutsStarted > 0) {
    summary.conversionRate = (summary.totalCheckoutsCompleted / summary.totalCheckoutsStarted) * 100;
  }

  return summary;
}
