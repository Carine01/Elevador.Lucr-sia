import { db } from '../db';
import { notifications, type Notification } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface CreateNotificationParams {
  userId: number;
  type: Notification['type'];
  title: string;
  message: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  await db.insert(notifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    metadata: params.metadata,
    actionUrl: params.actionUrl,
    actionLabel: params.actionLabel,
  });
}

// Notificações predefinidas
export async function notifyCreditsLow(userId: number, creditsRemaining: number): Promise<void> {
  await createNotification({
    userId,
    type: 'credits_low',
    title: 'Créditos baixos! ⚠️',
    message: `Você tem apenas ${creditsRemaining} crédito(s) restante(s). Faça upgrade para continuar usando.`,
    actionUrl: '/pricing',
    actionLabel: 'Ver Planos',
  });
}

export async function notifyCreditsDepleted(userId: number): Promise<void> {
  await createNotification({
    userId,
    type: 'credits_depleted',
    title: 'Créditos esgotados! 🚫',
    message: 'Seus créditos acabaram. Faça upgrade agora para continuar usando todas as funcionalidades.',
    actionUrl: '/pricing',
    actionLabel: 'Fazer Upgrade',
  });
}

export async function notifySubscriptionRenewed(userId: number, plan: string, credits: number): Promise<void> {
  await createNotification({
    userId,
    type: 'subscription_renewed',
    title: 'Assinatura renovada! 🎉',
    message: `Sua assinatura ${plan === 'pro' ? 'PRO' : 'PRO+'} foi renovada com sucesso. Você recebeu ${credits} novos créditos!`,
    metadata: { plan, credits },
  });
}

export async function notifySubscriptionExpiring(userId: number, daysRemaining: number): Promise<void> {
  await createNotification({
    userId,
    type: 'subscription_expiring',
    title: 'Assinatura expirando em breve ⏰',
    message: `Sua assinatura expira em ${daysRemaining} dia(s). Renove agora para não perder acesso.`,
    actionUrl: '/billing',
    actionLabel: 'Renovar',
  });
}

export async function notifyAchievementUnlocked(
  userId: number,
  achievement: string,
  description: string
): Promise<void> {
  await createNotification({
    userId,
    type: 'achievement_unlocked',
    title: `Conquista desbloqueada! 🏆`,
    message: `Parabéns! Você conquistou: ${achievement}`,
    metadata: { achievement, description },
  });
}

export async function notifyWelcome(userId: number, userName: string): Promise<void> {
  await createNotification({
    userId,
    type: 'welcome',
    title: `Bem-vindo ao Elevare, ${userName}! 🚀`,
    message: 'Comece explorando o Radar de Bio para analisar perfis do Instagram e capturar leads qualificados.',
    actionUrl: '/dashboard/radar-bio',
    actionLabel: 'Experimentar Agora',
  });
}

export async function notifyMilestone(
  userId: number,
  milestone: string,
  description: string
): Promise<void> {
  await createNotification({
    userId,
    type: 'milestone',
    title: `Milestone atingido! 🎯`,
    message: description,
    metadata: { milestone },
  });
}
