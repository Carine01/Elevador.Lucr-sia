/**
 * ==========================================
 * STRIPE WEBHOOK HANDLERS
 * ==========================================
 * Handlers isolados para eventos do Stripe
 * Implementa idempotência para evitar processamento duplicado
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { subscription as subscriptionTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { PLANS } from "../routers/subscription";
import { logger } from "./logger";

// ==========================================
// IDEMPOTENCY CACHE
// ==========================================
// Armazena IDs de eventos já processados
// Em produção, considere usar Redis ou banco de dados
const processedEvents = new Map<string, number>();
const MAX_CACHE_SIZE = 1000;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Verifica se um evento já foi processado (idempotência)
 */
function isEventProcessed(eventId: string): boolean {
  const timestamp = processedEvents.get(eventId);
  if (!timestamp) return false;

  // Verificar se o evento expirou
  if (Date.now() - timestamp > CACHE_TTL) {
    processedEvents.delete(eventId);
    return false;
  }

  return true;
}

/**
 * Marca um evento como processado
 */
function markEventProcessed(eventId: string): void {
  // Limpar cache se estiver muito grande
  if (processedEvents.size >= MAX_CACHE_SIZE) {
    const oldestEntries = Array.from(processedEvents.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, Math.floor(MAX_CACHE_SIZE / 2));

    oldestEntries.forEach(([key]) => processedEvents.delete(key));
  }

  processedEvents.set(eventId, Date.now());
}

// ==========================================
// WEBHOOK HANDLERS
// ==========================================

/**
 * Handler para checkout.session.completed
 * Ativa a assinatura após pagamento bem-sucedido
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  eventId: string
): Promise<void> {
  // Verificar idempotência
  if (isEventProcessed(eventId)) {
    logger.info("Event already processed (idempotency)", { eventId });
    return;
  }

  const db = await getDb();
  if (!db) {
    logger.error("Database not available in webhook handler", { eventId });
    throw new Error("Database unavailable");
  }

  // Validar metadata
  const userId = parseInt(session.metadata?.userId || "0");
  const plan = session.metadata?.plan as "pro" | "pro_plus";

  if (!userId || !plan) {
    logger.error("Missing required metadata in checkout session", {
      eventId,
      sessionId: session.id,
      metadata: session.metadata,
    });
    throw new Error("Invalid session metadata");
  }

  // Validar plano
  if (!PLANS[plan]) {
    logger.error("Invalid plan in checkout session", {
      eventId,
      plan,
    });
    throw new Error(`Invalid plan: ${plan}`);
  }

  const planConfig = PLANS[plan];
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  try {
    await db
      .update(subscriptionTable)
      .set({
        plan,
        status: "active",
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        creditsRemaining:
          planConfig.credits === -1 ? -1 : planConfig.credits,
        monthlyCreditsLimit:
          planConfig.credits === -1 ? -1 : planConfig.credits,
        renewalDate,
      })
      .where(eq(subscriptionTable.userId, userId));

    // Marcar evento como processado
    markEventProcessed(eventId);

    logger.info("Checkout completed successfully", {
      eventId,
      userId,
      plan,
      sessionId: session.id,
    });
  } catch (error) {
    logger.error("Error handling checkout completed", {
      eventId,
      error,
    });
    throw error;
  }
}

/**
 * Handler para customer.subscription.updated e customer.subscription.deleted
 * Atualiza status da assinatura
 */
export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventId: string
): Promise<void> {
  // Verificar idempotência
  if (isEventProcessed(eventId)) {
    logger.info("Event already processed (idempotency)", { eventId });
    return;
  }

  const db = await getDb();
  if (!db) {
    logger.error("Database not available in webhook handler", { eventId });
    return;
  }

  try {
    const [userSub] = await db
      .select()
      .from(subscriptionTable)
      .where(eq(subscriptionTable.stripeSubscriptionId, subscription.id))
      .limit(1);

    if (!userSub) {
      logger.warn("Subscription not found in database", {
        eventId,
        subscriptionId: subscription.id,
      });
      return;
    }

    // Mapear status do Stripe para nosso sistema
    const statusMap: Record<string, "active" | "inactive" | "cancelled"> = {
      active: "active",
      canceled: "cancelled",
      cancelled: "cancelled",
      past_due: "inactive",
      unpaid: "inactive",
      incomplete: "inactive",
      incomplete_expired: "cancelled",
      trialing: "active",
    };

    const status = statusMap[subscription.status] || "inactive";

    await db
      .update(subscriptionTable)
      .set({ status })
      .where(eq(subscriptionTable.id, userSub.id));

    // Marcar evento como processado
    markEventProcessed(eventId);

    logger.info("Subscription status updated", {
      eventId,
      subscriptionId: subscription.id,
      oldStatus: userSub.status,
      newStatus: status,
      stripeStatus: subscription.status,
    });
  } catch (error) {
    logger.error("Error updating subscription status", {
      eventId,
      error,
    });
  }
}

/**
 * Handler para invoice.payment_succeeded
 * Renova créditos mensais após pagamento bem-sucedido
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  eventId: string
): Promise<void> {
  // Verificar idempotência
  if (isEventProcessed(eventId)) {
    logger.info("Event already processed (idempotency)", { eventId });
    return;
  }

  const db = await getDb();
  if (!db) {
    logger.error("Database not available in webhook handler", { eventId });
    return;
  }

  // Verificar se é uma fatura de assinatura
  if (!invoice.subscription) {
    logger.info("Invoice is not for a subscription, skipping", {
      eventId,
      invoiceId: invoice.id,
    });
    return;
  }

  try {
    const [userSub] = await db
      .select()
      .from(subscriptionTable)
      .where(
        eq(subscriptionTable.stripeSubscriptionId, invoice.subscription as string)
      )
      .limit(1);

    if (!userSub) {
      logger.warn("Subscription not found for payment", {
        eventId,
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription,
      });
      return;
    }

    // Não renovar créditos do plano gratuito
    if (userSub.plan === "free") {
      logger.info("Skipping credit renewal for free plan", {
        eventId,
        userId: userSub.userId,
      });
      return;
    }

    const planConfig = PLANS[userSub.plan];
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    await db
      .update(subscriptionTable)
      .set({
        creditsRemaining: planConfig.credits,
        renewalDate,
      })
      .where(eq(subscriptionTable.id, userSub.id));

    // Marcar evento como processado
    markEventProcessed(eventId);

    logger.info("Credits renewed after payment", {
      eventId,
      userId: userSub.userId,
      plan: userSub.plan,
      creditsRenewed: planConfig.credits,
      invoiceId: invoice.id,
    });
  } catch (error) {
    logger.error("Error renewing credits", {
      eventId,
      error,
    });
  }
}

/**
 * Handler para invoice.payment_failed
 * Registra falhas de pagamento
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  eventId: string
): Promise<void> {
  // Verificar idempotência
  if (isEventProcessed(eventId)) {
    logger.info("Event already processed (idempotency)", { eventId });
    return;
  }

  logger.error("Payment failed for invoice", {
    eventId,
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amountDue: invoice.amount_due,
    currency: invoice.currency,
    attemptCount: invoice.attempt_count,
  });

  // Marcar evento como processado
  markEventProcessed(eventId);

  // TODO: Implementar notificação ao usuário
  // - Enviar email de falha de pagamento
  // - Criar notificação no sistema
  // - Atualizar status se necessário após X tentativas
}

/**
 * Limpa o cache de eventos processados
 * Útil para testes ou manutenção
 */
export function clearProcessedEventsCache(): void {
  processedEvents.clear();
  logger.info("Processed events cache cleared");
}

/**
 * Retorna estatísticas do cache de idempotência
 */
export function getIdempotencyCacheStats() {
  return {
    size: processedEvents.size,
    maxSize: MAX_CACHE_SIZE,
    ttl: CACHE_TTL,
  };
}
