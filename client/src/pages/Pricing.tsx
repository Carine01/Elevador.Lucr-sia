import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Crown } from "lucide-react";
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

    setLoadingPlan(planId);

    try {
      const result = await createCheckout.mutateAsync({
        plan: planId as "essencial" | "profissional",
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
      case "essencial":
        return Sparkles;
      case "profissional":
        return Crown;
      default:
        return Sparkles;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "essencial":
        return "from-purple-500 to-violet-500";
      case "profissional":
        return "from-amber-500 to-orange-500";
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
            Entre no Sistema Elevare
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Você não está comprando aulas. Está entrando em um sistema de crescimento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan) => {
            const Icon = getPlanIcon(plan.id);
            const isProfissional = plan.id === "profissional";
            const isCurrent = isCurrentPlan(plan.id);

            return (
              <Card
                key={plan.id}
                className={`relative bg-slate-800/50 border-slate-700 p-8 hover:border-slate-600 transition-all ${
                  isProfissional ? "scale-105 shadow-2xl border-amber-500/50" : ""
                }`}
              >
                {/* Badge */}
                {isProfissional && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      RECOMENDADO
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
                    <span className="text-slate-400">/mês</span>
                  </div>
                  {plan.credits === -1 ? (
                    <p className="text-sm text-amber-400 mt-2 font-semibold">
                      ⚡ Créditos Ilimitados
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 mt-2">
                      {plan.credits} créditos/mês
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
                  disabled={loadingPlan === plan.id || isCurrent}
                  className={`w-full ${
                    isProfissional
                      ? `bg-gradient-to-r ${getPlanColor(plan.id)} hover:opacity-90`
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white font-semibold py-6 rounded-lg text-lg`}
                >
                  {loadingPlan === plan.id
                    ? "Processando..."
                    : isCurrent
                    ? "Acesso Atual"
                    : "Fazer Parte do Elevare"}
                </Button>
                
                <p className="mt-4 text-xs text-center text-slate-500">
                  Você não está comprando aulas.<br/>Está entrando em um sistema de crescimento.
                </p>
              </Card>
            );
          })}
        </div>

        {/* Filtro psicológico */}
        <div className="mt-12 text-center max-w-xl mx-auto">
          <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-700 pt-6">
            Se você procura teste grátis, o Elevare não é pra você.<br/>
            <span className="text-amber-400 font-medium">Se você procura direção, estrutura e resultado — seja bem-vinda.</span>
          </p>
        </div>

        {/* Guarantee */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            🔒 Pagamento 100% seguro via Stripe • Cancele quando quiser
          </p>
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
                Posso fazer upgrade?
              </h3>
              <p className="text-slate-400">
                Sim! Você pode mudar para o Plano Profissional a qualquer momento 
                e aproveitar os créditos ilimitados.
              </p>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Voltar para Início
          </Button>
        </div>
      </div>
    </div>
  );
}
