import { db } from "../db";
import { subscription } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { InsufficientCreditsError } from "./errors";

export interface CreditCheckResult {
  success: boolean;
  error?: string;
}

// Tipos de operações válidas que consomem créditos
export type CreditOperation = 
  | 'ebook-generation'
  | 'ad-generation'
  | 'prompt-generation'
  | 'cover-generation'
  | 'bio-radar';

/**
 * Verifica e consome créditos para uma operação
 * @param userId ID do usuário
 * @param operation Tipo de operação (usado para determinar custo)
 * @returns Resultado da verificação
 */
export async function checkAndConsumeCredit(
  userId: number,
  operation: CreditOperation
): Promise<CreditCheckResult> {
  // Determinar custo baseado na operação
  const creditCosts: Record<CreditOperation, number> = {
    'ebook-generation': 5,
    'ad-generation': 2,
    'prompt-generation': 1,
    'cover-generation': 3,
    'bio-radar': 1,
  };

  const cost = creditCosts[operation];

  // Buscar assinatura do usuário
  const [userSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  if (!userSubscription) {
    return {
      success: false,
      error: "Assinatura não encontrada. Por favor, configure sua assinatura.",
    };
  }

  // PRO+ tem créditos ilimitados
  if (userSubscription.plan === "pro_plus") {
    return { success: true };
  }

  // Verificar se tem créditos suficientes
  if (userSubscription.creditsRemaining < cost) {
    return {
      success: false,
      error: `Créditos insuficientes. Esta operação requer ${cost} crédito(s), mas você possui apenas ${userSubscription.creditsRemaining}.`,
    };
  }

  // Consumir créditos
  await db
    .update(subscription)
    .set({
      creditsRemaining: userSubscription.creditsRemaining - cost,
    })
    .where(eq(subscription.id, userSubscription.id));

  return { success: true };
}
