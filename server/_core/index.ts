import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import cors from "cors";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";
import { logger } from "./logger";
import { getDb } from "../db";
import { subscription as subscriptionTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { PLANS } from "../routers/subscription";

// Inicializar Stripe
const stripe = new Stripe(ENV.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

// Verificar disponibilidade de porta
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// ==================== WEBHOOK HANDLERS ====================
// BUG-001: Implementar webhook do Stripe

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) {
    logger.error('Database not available in webhook handler');
    return;
  }

  const userId = parseInt(session.metadata?.userId || '0');
  const plan = session.metadata?.plan as 'pro' | 'pro_plus';
  
  if (!userId || !plan) {
    logger.error('Missing userId or plan in checkout session', { session });
    return;
  }

  const planConfig = PLANS[plan];
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  try {
    await db
      .update(subscriptionTable)
      .set({
        plan,
        status: 'active',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        creditsRemaining: planConfig.credits === -1 ? -1 : planConfig.credits,
        monthlyCreditsLimit: planConfig.credits === -1 ? -1 : planConfig.credits,
        renewalDate,
      })
      .where(eq(subscriptionTable.userId, userId));

    logger.info('Checkout completed successfully', { userId, plan });
  } catch (error) {
    logger.error('Error handling checkout completed', error);
    throw error;
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const [userSub] = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (!userSub) {
    logger.warn('Subscription not found in database', { subscriptionId: subscription.id });
    return;
  }

  const status = subscription.status === 'active' ? 'active' : 
                 subscription.status === 'canceled' ? 'cancelled' : 'inactive';

  try {
    await db
      .update(subscriptionTable)
      .set({ status })
      .where(eq(subscriptionTable.id, userSub.id));

    logger.info('Subscription status updated', { subscriptionId: subscription.id, status });
  } catch (error) {
    logger.error('Error updating subscription status', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const db = await getDb();
  if (!db) return;

  const [userSub] = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.stripeSubscriptionId, invoice.subscription as string))
    .limit(1);

  if (!userSub) {
    logger.warn('Subscription not found for payment', { invoiceId: invoice.id });
    return;
  }

  const planConfig = PLANS[userSub.plan];
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  try {
    await db
      .update(subscriptionTable)
      .set({
        creditsRemaining: planConfig.credits,
        renewalDate,
      })
      .where(eq(subscriptionTable.id, userSub.id));

    logger.info('Credits renewed after payment', { userId: userSub.userId, plan: userSub.plan });
    
    // Notificar renovação de assinatura
    const { notifySubscriptionRenewed } = await import('./notificationService');
    await notifySubscriptionRenewed(userSub.userId, userSub.plan, planConfig.credits);
  } catch (error) {
    logger.error('Error renewing credits', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  logger.error('Payment failed for invoice', { invoiceId: invoice.id });
  // Aqui você pode implementar lógica de notificação ao usuário
}

// ==================== SERVER SETUP ====================

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ==================== CORS CONFIGURATION ====================
  // BUG-009: Configurar CORS apropriadamente
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://yourdomain.com'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, postman, etc)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS blocked origin', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  // ==================== RATE LIMITING ====================
  // BUG-004: Adicionar rate limiting
  const publicApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 requisições por IP
    message: {
      error: 'Muitas requisições. Tente novamente em 15 minutos.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authenticatedApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Usuários autenticados: 100 req/15min
    message: {
      error: 'Limite de requisições atingido. Aguarde antes de tentar novamente.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // ==================== STRIPE WEBHOOK ====================
  // BUG-001: Webhook do Stripe
  // IMPORTANTE: Deve vir ANTES do express.json()
  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature'];
      
      if (!sig || !ENV.STRIPE_WEBHOOK_SECRET) {
        logger.warn('Webhook signature missing');
        return res.status(400).send('Webhook signature missing');
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          ENV.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        logger.error(`Webhook signature verification failed`, err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Processar eventos
      try {
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
          }
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionChange(subscription);
            break;
          }
          case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            await handlePaymentSucceeded(invoice);
            break;
          }
          case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            await handlePaymentFailed(invoice);
            break;
          }
          default:
            logger.info('Unhandled webhook event type', { type: event.type });
        }

        res.json({ received: true });
      } catch (error) {
        logger.error('Error processing webhook', error);
        res.status(500).send('Webhook processing failed');
      }
    }
  );

  // ==================== BODY PARSERS ====================
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ==================== tRPC API ====================
  app.use(
    "/api/trpc",
    publicApiLimiter, // Rate limiting para API pública
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ==================== STATIC FILES / VITE ====================
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ==================== START SERVER ====================
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    logger.warn(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
