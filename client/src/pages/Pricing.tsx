import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Sparkles, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function Pricing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: plans } = trpc.subscription.getPlans.useQuery();
  const { data: subscription } = trpc.subscription.getSubscription.useQuery(
    undefined,
    { enabled: !!user }
  );
  const createCheckout = trpc.subscription.createCheckout.useMutation();

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast.error("Faça login para assinar um plano");
      navigate("/");
      return;
    }

    if (planId === "free") {
      toast.info("Você já está no plano gratuito");
      return;
    }

    setLoadingPlan(planId);

    try {
      const result = await createCheckout.mutateAsync({
        plan: planId as "pro" | "pro_plus",
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Erro ao criar checkout. Tente novamente.");
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return Zap;
      case "pro":
        return Sparkles;
      case "pro_plus":
        return Crown;
      default:
        return Zap;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "from-slate-500 to-slate-600";
      case "pro":
        return "from-amber-500 to-orange-500";
      case "pro_plus":
        return "from-purple-500 to-pink-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription?.plan === planId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comece grátis e evolua conforme sua clínica cresce. Cancele quando
            quiser.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan) => {
            const Icon = getPlanIcon(plan.id);
            const isPopular = plan.id === "pro";
            const isPremium = plan.id === "pro_plus";
            const isCurrent = isCurrentPlan(plan.id);

            return (
              <Card
                key={plan.id}
                className={`relative bg-slate-800/50 border-slate-700 p-8 hover:border-slate-600 transition-all ${
                  isPopular || isPremium ? "scale-105 shadow-2xl" : ""
                }`}
              >
                {/* Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Premium
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getPlanColor(
                    plan.id
                  )} flex items-center justify-center mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      R$ {plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-400">/mês</span>
                    )}
                  </div>
                  {plan.id === "pro_plus" && plan.credits === -1 && (
                    <p className="text-sm text-purple-400 mt-2">
                      Créditos Ilimitados
                    </p>
                  )}
                  {plan.id !== "pro_plus" && (
                    <p className="text-sm text-slate-400 mt-2">
                      {plan.credits} crédito{plan.credits > 1 ? "s" : ""}/mês
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={
                    loadingPlan === plan.id || isCurrent || !user
                  }
                  className={`w-full ${
                    isPopular || isPremium
                      ? `bg-gradient-to-r ${getPlanColor(
                          plan.id
                        )} hover:opacity-90`
                      : "bg-slate-700 hover:bg-slate-600"
                  } text-white font-semibold py-6 rounded-lg text-lg`}
                >
                  {loadingPlan === plan.id
                    ? "Processando..."
                    : isCurrent
                    ? "Plano Atual"
                    : plan.price === 0
                    ? "Começar Grátis"
                    : "Assinar Agora"}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-slate-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem
                taxas ou multas.
              </p>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                O que são créditos?
              </h3>
              <p className="text-slate-400">
                Créditos são usados para gerar conteúdo com IA. Cada tipo de
                conteúdo consome uma quantidade diferente de créditos.
              </p>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Posso fazer upgrade/downgrade?
              </h3>
              <p className="text-slate-400">
                Sim! Você pode mudar de plano a qualquer momento. O valor será
                ajustado proporcionalmente.
              </p>
            </Card>
          </div>
        </div>

        {/* Back to Dashboard */}
        {user && (
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
