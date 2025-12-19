import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { userOnboarding } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { trackEvent, ANALYTICS_EVENTS } from '../../shared/analytics';
import { db } from '../db';

export const onboardingRouter = router({
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    let progress = await db.query.userOnboarding.findFirst({
      where: eq(userOnboarding.userId, ctx.user.id),
    });

    // Criar registro se não existir
    if (!progress) {
      await db.insert(userOnboarding).values({
        userId: ctx.user.id,
      });
      
      progress = await db.query.userOnboarding.findFirst({
        where: eq(userOnboarding.userId, ctx.user.id),
      });
    }

    const completed = [
      progress?.welcomeTourCompleted,
      progress?.bioRadarTutorialCompleted,
      progress?.firstEbookGenerated,
      progress?.firstPromptGenerated,
      progress?.profileCompleted,
    ].filter(Boolean).length;

    return {
      ...progress,
      totalSteps: 5,
      completedSteps: completed,
      percentage: (completed / 5) * 100,
      isComplete: completed === 5,
    };
  }),

  completeStep: protectedProcedure
    .input(z.object({
      step: z.enum([
        'welcomeTourCompleted',
        'bioRadarTutorialCompleted',
        'firstEbookGenerated',
        'firstPromptGenerated',
        'profileCompleted',
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(userOnboarding)
        .set({ [input.step]: true })
        .where(eq(userOnboarding.userId, ctx.user.id));

      // Verificar se completou tudo
      const progress = await db.query.userOnboarding.findFirst({
        where: eq(userOnboarding.userId, ctx.user.id),
      });

      const allComplete =
        progress?.welcomeTourCompleted &&
        progress?.bioRadarTutorialCompleted &&
        progress?.firstEbookGenerated &&
        progress?.firstPromptGenerated &&
        progress?.profileCompleted;

      if (allComplete && !progress?.completedAt) {
        await db
          .update(userOnboarding)
          .set({ completedAt: new Date() })
          .where(eq(userOnboarding.userId, ctx.user.id));

        trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {}, ctx.user.id);
      }

      return { success: true };
    }),
});
