import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { subscription as subscriptionTable, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { env } from "../_core/env";
import { logger } from "../_core/logger";

// Inicializar Stripe com timeout e retry
const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
  timeout: 10000, // 10 segundos
  maxNetworkRetries: 2,
});

/**
 * Valida se um Price ID do Stripe existe e está ativo
 */
async function validatePriceId(priceId: string): Promise<boolean> {
  try {
    const price = await stripe.prices.retrieve(priceId);
    return price.active;
  } catch (error: any) {
    logger.error("Error validating Stripe Price ID", {
      priceId,
      error: error.message,
    });
    return false;
  }
}

// Definição dos planos
export const PLANS = {
  free: {
    id: "free",
    name: "Grátis",
    price: 0,
    priceId: null,
    credits: 1,
    features: [
      "1 diagnóstico/mês",
      "Radar de Bio básico",
      "Suporte por email",
    ],
  },
  pro: {
    id: "pro",
    name: "PRO",
    price: 29,
    priceId: env.STRIPE_PRO_PRICE_ID || "",
    credits: 10,
    features: [
      "10 diagnósticos/mês",
      "Gerador de E-books",
      "Biblioteca de Prompts",
      "Gerador de Anúncios",
      "Suporte prioritário",
    ],
  },
  pro_plus: {
    id: "pro_plus",
    name: "PRO+",
    price: 79,
    priceId: env.STRIPE_PRO_PLUS_PRICE_ID || "",
    credits: -1, // Ilimitado
    features: [
      "Diagnósticos ilimitados",
      "Todos os módulos premium",
      "Automação de Blogs",
      "RobôChat assistente",
      "Geração de audiobooks",
      "Suporte VIP 24/7",
    ],
  },
} as const;

export const subscriptionRouter = router({
  // Listar planos disponíveis
  getPlans: publicProcedure.query(() => {
    return Object.values(PLANS);
  }),

  // Obter assinatura do usuário
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const [userSubscription] = await db
      .select()
      .from(subscriptionTable)
      .where(eq(subscriptionTable.userId, ctx.user.id))
      .limit(1);

    if (!userSubscription) {
      // Criar assinatura gratuita padrão
      const [newSubscription] = await db
        .insert(subscriptionTable)
        .values({
          userId: ctx.user.id,
          plan: "free",
          status: "active",
          creditsRemaining: PLANS.free.credits,
          monthlyCreditsLimit: PLANS.free.credits,
        })
        .$returningId();

      const [created] = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.id, newSubscription.id))
        .limit(1);

      return created;
    }

    return userSubscription;
  }),

  // Criar sessão de checkout do Stripe
  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["pro", "pro_plus"]),
        successUrl: z.string(),
        cancelUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      logger.info("Creating checkout session", {
        userId: ctx.user.id,
        plan: input.plan,
      });

      const planConfig = PLANS[input.plan];

      // Validar configuração do plano
      if (!planConfig.priceId) {
        logger.error("Price ID not configured for plan", { plan: input.plan });
        throw new Error(
          `Configuração inválida: Price ID não encontrado para o plano ${planConfig.name}`
        );
      }

      // Validar Price ID no Stripe
      const isPriceValid = await validatePriceId(planConfig.priceId);
      if (!isPriceValid) {
        logger.error("Invalid or inactive Stripe Price ID", {
          plan: input.plan,
          priceId: planConfig.priceId,
        });
        throw new Error(
          `Price ID inválido ou inativo no Stripe. Entre em contato com o suporte.`
        );
      }

      // Verificar assinatura atual
      const [existingSubscription] = await db
        .select()
        .from(subscriptionTable)
        .where(
          and(
            eq(subscriptionTable.userId, ctx.user.id),
            eq(subscriptionTable.status, "active")
          )
        )
        .limit(1);

      // Impedir upgrade para plano igual ou inferior
      if (existingSubscription && existingSubscription.plan !== "free") {
        const planHierarchy = { free: 0, pro: 1, pro_plus: 2 };
        const currentPlanLevel = planHierarchy[existingSubscription.plan];
        const requestedPlanLevel = planHierarchy[input.plan];

        if (requestedPlanLevel <= currentPlanLevel) {
          logger.warn("Attempted to downgrade/same-grade plan", {
            userId: ctx.user.id,
            currentPlan: existingSubscription.plan,
            requestedPlan: input.plan,
          });
          throw new Error(
            `Você já possui o plano ${PLANS[existingSubscription.plan].name} ou superior. Para fazer downgrade, cancele sua assinatura atual primeiro.`
          );
        }
      }

      try {
        // Criar ou obter customer do Stripe
        let customerId = existingSubscription?.stripeCustomerId;

        if (!customerId) {
          logger.info("Creating new Stripe customer", { userId: ctx.user.id });
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              userId: ctx.user.id.toString(),
            },
          });
          customerId = customer.id;
          logger.info("Stripe customer created", {
            userId: ctx.user.id,
            customerId,
          });
        }

        // Criar sessão de checkout
        logger.info("Creating Stripe checkout session", {
          userId: ctx.user.id,
          customerId,
          priceId: planConfig.priceId,
        });

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [
            {
              price: planConfig.priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: {
            userId: ctx.user.id.toString(),
            plan: input.plan,
          },
        });

        logger.info("Checkout session created successfully", {
          userId: ctx.user.id,
          sessionId: session.id,
          plan: input.plan,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        logger.error("Error creating checkout session", {
          userId: ctx.user.id,
          plan: input.plan,
          error: error.message,
          stripeError: error.type,
        });

        // Mensagens de erro mais amigáveis
        if (error.type === "StripeInvalidRequestError") {
          throw new Error(
            "Erro ao processar o pagamento. Verifique as configurações do Stripe."
          );
        } else if (error.type === "StripeAPIError") {
          throw new Error(
            "Erro temporário na comunicação com o Stripe. Tente novamente em alguns instantes."
          );
        } else {
          throw new Error(
            "Erro ao criar sessão de checkout. Por favor, tente novamente."
          );
        }
      }
    }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    logger.info("Cancelling subscription", { userId: ctx.user.id });

    const [userSubscription] = await db
      .select()
      .from(subscriptionTable)
      .where(
        and(
          eq(subscriptionTable.userId, ctx.user.id),
          eq(subscriptionTable.status, "active")
        )
      )
      .limit(1);

    if (!userSubscription) {
      logger.warn("No active subscription found for cancellation", {
        userId: ctx.user.id,
      });
      throw new Error("Nenhuma assinatura ativa encontrada");
    }

    if (userSubscription.plan === "free") {
      logger.warn("Attempted to cancel free plan", { userId: ctx.user.id });
      throw new Error("Não é possível cancelar o plano gratuito");
    }

    try {
      // Cancelar no Stripe
      if (userSubscription.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(
          userSubscription.stripeSubscriptionId
        );
        logger.info("Stripe subscription cancelled", {
          userId: ctx.user.id,
          subscriptionId: userSubscription.stripeSubscriptionId,
        });
      }

      // Atualizar no banco
      await db
        .update(subscriptionTable)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
        })
        .where(eq(subscriptionTable.id, userSubscription.id));

      logger.info("Subscription cancelled successfully", {
        userId: ctx.user.id,
        plan: userSubscription.plan,
      });

      return {
        success: true,
        message: "Assinatura cancelada com sucesso",
      };
    } catch (error: any) {
      logger.error("Error cancelling subscription", {
        userId: ctx.user.id,
        error: error.message,
      });
      throw new Error(
        "Erro ao cancelar assinatura. Por favor, tente novamente ou entre em contato com o suporte."
      );
    }
  }),

  // Atualizar créditos (uso interno)
  updateCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        operation: z.enum(["add", "subtract"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [userSubscription] = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, ctx.user.id))
        .limit(1);

      if (!userSubscription) {
        throw new Error("Assinatura não encontrada");
      }

      // Se for PRO+, créditos são ilimitados
      if (userSubscription.plan === "pro_plus") {
        return {
          success: true,
          creditsRemaining: -1,
          message: "Plano PRO+ tem créditos ilimitados",
        };
      }

      const currentCredits = userSubscription.creditsRemaining;
      const newCredits =
        input.operation === "add"
          ? currentCredits + input.amount
          : currentCredits - input.amount;

      if (newCredits < 0) {
        throw new Error("Créditos insuficientes");
      }

      await db
        .update(subscriptionTable)
        .set({
          creditsRemaining: newCredits,
        })
        .where(eq(subscriptionTable.id, userSubscription.id));

      return {
        success: true,
        creditsRemaining: newCredits,
      };
    }),

  // Verificar se tem créditos suficientes
  checkCredits: protectedProcedure
    .input(
      z.object({
        required: z.number().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const [userSubscription] = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, ctx.user.id))
        .limit(1);

      if (!userSubscription) {
        return {
          hasCredits: false,
          creditsRemaining: 0,
          plan: "free",
        };
      }

      // PRO+ tem créditos ilimitados
      if (userSubscription.plan === "pro_plus") {
        return {
          hasCredits: true,
          creditsRemaining: -1,
          plan: userSubscription.plan,
        };
      }

      const hasCredits = userSubscription.creditsRemaining >= input.required;

      return {
        hasCredits,
        creditsRemaining: userSubscription.creditsRemaining,
        plan: userSubscription.plan,
      };
    }),

  // Portal do cliente (gerenciar assinatura)
  createPortalSession: protectedProcedure
    .input(
      z.object({
        returnUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      logger.info("Creating portal session", { userId: ctx.user.id });

      const [userSubscription] = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, ctx.user.id))
        .limit(1);

      if (!userSubscription?.stripeCustomerId) {
        logger.error("Customer ID not found for portal session", {
          userId: ctx.user.id,
        });
        throw new Error(
          "Customer ID não encontrado. Assine um plano primeiro."
        );
      }

      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: userSubscription.stripeCustomerId,
          return_url: input.returnUrl,
        });

        logger.info("Portal session created successfully", {
          userId: ctx.user.id,
          customerId: userSubscription.stripeCustomerId,
        });

        return {
          url: session.url,
        };
      } catch (error: any) {
        logger.error("Error creating portal session", {
          userId: ctx.user.id,
          error: error.message,
        });
        throw new Error(
          "Erro ao acessar o portal de gerenciamento. Tente novamente."
        );
      }
    }),
});
