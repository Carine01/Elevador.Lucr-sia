import { Router } from 'express';
import Stripe from 'stripe';
import { getDb } from '../db';
import { subscription, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../_core/logger';
import { ENV } from '../_core/env';

const router = Router();
const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover' as const,
});

// Mapa de IDs processados (idempotência)
const processedEvents = new Set<string>();

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    logger.error('Missing stripe-signature header');
    return res.status(400).send('Missing signature');
  }

  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    logger.error('Webhook signature verification failed', { error: err });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotência: evitar processar evento duplicado
  if (processedEvents.has(event.id)) {
    logger.info('Event already processed, skipping', { eventId: event.id });
    return res.json({ received: true, skipped: true });
  }

  logger.info('Webhook received', { type: event.type, eventId: event.id });

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        logger.info('Unhandled webhook event type', { type: event.type });
    }

    // Marcar como processado
    processedEvents.add(event.id);
    
    // Limpar cache após 1 hora
    setTimeout(() => processedEvents.delete(event.id), 60 * 60 * 1000);

    res.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook', {
      type: event.type,
      eventId: event.id,
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================
// HANDLERS DE EVENTOS
// ============================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  if (!subscriptionId) {
    logger.warn('Checkout completed without subscription', { sessionId: session.id });
    return;
  }

  // Buscar subscription no Stripe para obter detalhes
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0].price.id;

  // Mapear priceId para plano
  const planMap: Record<string, 'essencial' | 'profissional'> = {
    [ENV.STRIPE_ESSENCIAL_PRICE_ID]: 'essencial',
    [ENV.STRIPE_PROFISSIONAL_PRICE_ID]: 'profissional',
  };

  const plan = planMap[priceId];
  
  if (!plan) {
    logger.error('Unknown price ID in checkout', { priceId });
    return;
  }

  // Definir créditos por plano
  const creditsMap = {
    essencial: 5,
    profissional: -1, // ilimitado
  };

  // Buscar usuário pelo Stripe Customer ID
  const [userSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeCustomerId, customerId))
    .limit(1);

  if (!userSub) {
    logger.error('User subscription not found for customer', { customerId });
    return;
  }

  // Type assertion for current_period_end which exists at runtime
  const currentPeriodEnd = (stripeSubscription as any).current_period_end as number;

  // Atualizar assinatura
  await db
    .update(subscription)
    .set({
      plan,
      status: 'active',
      stripeSubscriptionId: subscriptionId,
      creditsRemaining: creditsMap[plan],
      monthlyCreditsLimit: creditsMap[plan],
      renewalDate: new Date(currentPeriodEnd * 1000),
    })
    .where(eq(subscription.userId, userSub.userId));

  logger.info('Subscription activated', {
    userId: userSub.userId,
    plan,
    subscriptionId,
  });

  // TODO: Enviar email de confirmação
  // await sendEmail(welcomeEmail({ userName: user.name, ... }));
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  const subscriptionId = stripeSubscription.id;

  const [userSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!userSub) {
    logger.warn('Subscription not found in database', { subscriptionId });
    return;
  }

  const status = stripeSubscription.status === 'active' ? 'active' : 'inactive';

  // Type assertion for current_period_end which exists at runtime
  const currentPeriodEnd = (stripeSubscription as any).current_period_end as number;

  await db
    .update(subscription)
    .set({
      status,
      renewalDate: new Date(currentPeriodEnd * 1000),
    })
    .where(eq(subscription.id, userSub.id));

  logger.info('Subscription updated', {
    userId: userSub.userId,
    status,
    subscriptionId,
  });
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  const subscriptionId = stripeSubscription.id;

  const [userSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!userSub) {
    logger.warn('Subscription not found in database', { subscriptionId });
    return;
  }

  // Downgrade para plano free
  await db
    .update(subscription)
    .set({
      plan: 'free',
      status: 'cancelled',
      creditsRemaining: 1,
      monthlyCreditsLimit: 1,
      cancelledAt: new Date(),
    })
    .where(eq(subscription.id, userSub.id));

  logger.info('Subscription cancelled', {
    userId: userSub.userId,
    subscriptionId,
  });

  // TODO: Enviar email de cancelamento
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  // Type assertion for subscription property which exists at runtime
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  const [userSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!userSub) {
    return;
  }

  // Bloquear acesso (status inactive)
  await db
    .update(subscription)
    .set({
      status: 'inactive',
    })
    .where(eq(subscription.id, userSub.id));

  logger.warn('Payment failed, subscription blocked', {
    userId: userSub.userId,
    subscriptionId,
    invoiceId: invoice.id,
  });

  // TODO: Enviar email de falha de pagamento
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  // Type assertion for subscription property which exists at runtime
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  const [userSub] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (!userSub) {
    return;
  }

  // Resetar créditos mensais
  const creditsMap = {
    free: 1,
    essencial: 5,
    profissional: -1,
  };

  await db
    .update(subscription)
    .set({
      status: 'active',
      creditsRemaining: creditsMap[userSub.plan],
    })
    .where(eq(subscription.id, userSub.id));

  logger.info('Payment succeeded, credits reset', {
    userId: userSub.userId,
    subscriptionId,
    plan: userSub.plan,
  });
}

export default router;
