import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { subscription as subscriptionTable, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { env } from "../_core/env";

// Inicializar Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

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
      const planConfig = PLANS[input.plan];

      if (!planConfig.priceId) {
        throw new Error("Price ID não configurado para este plano");
      }

      // Verificar se já tem assinatura ativa
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

      // Criar ou obter customer do Stripe
      let customerId = existingSubscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email || undefined,
          name: ctx.user.name || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
          },
        });
        customerId = customer.id;
      }

      // Criar sessão de checkout
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

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  // Cancelar assinatura
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
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
      throw new Error("Nenhuma assinatura ativa encontrada");
    }

    if (userSubscription.plan === "free") {
      throw new Error("Não é possível cancelar o plano gratuito");
    }

    // Cancelar no Stripe
    if (userSubscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(userSubscription.stripeSubscriptionId);
    }

    // Atualizar no banco
    await db
      .update(subscriptionTable)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
      })
      .where(eq(subscriptionTable.id, userSubscription.id));

    return {
      success: true,
      message: "Assinatura cancelada com sucesso",
    };
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
      const [userSubscription] = await db
        .select()
        .from(subscriptionTable)
        .where(eq(subscriptionTable.userId, ctx.user.id))
        .limit(1);

      if (!userSubscription?.stripeCustomerId) {
        throw new Error("Customer ID não encontrado");
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: input.returnUrl,
      });

      return {
        url: session.url,
      };
    }),

  // Obter saldo de créditos
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      with: { subscription: true },
    });

    if (!user) {
      return {
        balance: 0,
        plan: 'free',
        isUnlimited: false,
      };
    }

    return {
      balance: user.creditsBalance || 0,
      plan: user.subscription?.plan || 'free',
      isUnlimited: user.subscription?.plan === 'pro_plus',
    };
  }),

  // Obter histórico de créditos (stub por enquanto)
  getCreditHistory: protectedProcedure.query(async ({ ctx }) => {
    // Retornar histórico de uso de créditos
    // Por enquanto retorna vazio, implementar tabela de histórico depois
    return [];
  }),
});
