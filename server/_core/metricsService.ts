import { db } from '../db';
import { dailyMetrics } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { format } from 'date-fns';

export async function recordMetric(
  userId: number,
  metric: 'bioRadarAnalyses' | 'ebooksGenerated' | 'promptsGenerated' | 'adsGenerated' | 'creditsConsumed' | 'leadsGenerated',
  increment: number = 1
): Promise<void> {
  const today = format(new Date(), 'yyyy-MM-dd');

  // Buscar ou criar registro do dia
  const existing = await db.query.dailyMetrics.findFirst({
    where: and(
      eq(dailyMetrics.userId, userId),
      eq(dailyMetrics.date, today)
    ),
  });

  if (existing) {
    // Atualizar existente
    await db
      .update(dailyMetrics)
      .set({ [metric]: (existing[metric] || 0) + increment })
      .where(eq(dailyMetrics.id, existing.id));
  } else {
    // Criar novo
    await db.insert(dailyMetrics).values({
      userId,
      date: today,
      [metric]: increment,
    });
  }
}
