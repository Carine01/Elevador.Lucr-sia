import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { users, subscription } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { logger } from './logger';

export interface CreditCost {
  'bio-radar': 1;
  'ebook-generation': 2;
  'prompt-generation': 1;
  'ad-generation': 1;
  'cover-generation': 1;
}

const CREDIT_COSTS: Record<string, number> = {
  'bio-radar': 1,
  'ebook-generation': 2,
  'prompt-generation': 1,
  'ad-generation': 1,
  'cover-generation': 1,
};

const FREE_FEATURES = ['bio-radar']; // Bio Radar tem 1 uso grátis/mês

export async function checkAndConsumeCredit(
  userId: number,
  feature: keyof CreditCost
): Promise<{ success: boolean; remaining?: number; error?: string }> {
  try {
    // Buscar usuário e assinatura
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { subscription: true },
    });

    if (!user) {
      logger.error('User not found for credit check', { userId, feature });
      return { success: false, error: 'Usuário não encontrado' };
    }

    const plan = user.subscription?.plan || 'free';
    const creditsBalance = user.creditsBalance || 0;
    const cost = CREDIT_COSTS[feature] || 1;

    logger.info('Checking credits', { userId, feature, plan, creditsBalance, cost });

    // PRO+ tem créditos ilimitados
    if (plan === 'pro_plus') {
      logger.info('PRO+ user has unlimited credits', { userId, feature });
      return { success: true, remaining: 999999 };
    }

    // Verificar se tem créditos suficientes
    if (creditsBalance < cost) {
      logger.warn('Insufficient credits', { userId, feature, creditsBalance, cost });
      return {
        success: false,
        error: `Créditos insuficientes. Necessário: ${cost}, disponível: ${creditsBalance}`,
      };
    }

    // Consumir créditos
    await db
      .update(users)
      .set({ creditsBalance: creditsBalance - cost })
      .where(eq(users.id, userId));

    const remaining = creditsBalance - cost;
    logger.info('Credits consumed', { userId, feature, cost, remaining });

    return { success: true, remaining };
  } catch (error) {
    logger.error('Error consuming credit', { 
      error: error instanceof Error ? error.message : String(error),
      userId,
      feature
    });
    return { success: false, error: 'Erro ao processar créditos' };
  }
}

export async function addCredits(userId: number, amount: number): Promise<void> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      logger.error('User not found for adding credits', { userId, amount });
      throw new Error('User not found');
    }

    await db
      .update(users)
      .set({ creditsBalance: (user.creditsBalance || 0) + amount })
      .where(eq(users.id, userId));

    logger.info('Credits added', { userId, amount, newBalance: (user.creditsBalance || 0) + amount });
  } catch (error) {
    logger.error('Error adding credits', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      amount
    });
    throw error;
  }
}

export async function resetMonthlyCredits(userId: number, plan: string): Promise<void> {
  const PLAN_CREDITS = {
    free: 1,
    pro: 10,
    pro_plus: 999999,
  };

  const credits = PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS] || 1;

  try {
    await db
      .update(users)
      .set({ creditsBalance: credits })
      .where(eq(users.id, userId));

    logger.info('Monthly credits reset', { userId, plan, credits });
  } catch (error) {
    logger.error('Error resetting monthly credits', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      plan
    });
    throw error;
  }
}
