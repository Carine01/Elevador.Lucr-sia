import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  // Buscar assinatura atualizada
  const { data: subscription, isLoading } =
    trpc.subscription.getSubscription.useQuery(undefined, {
      enabled: !!user,
      // Refetch para garantir dados atualizados após checkout
      refetchInterval: 2000,
      refetchOnMount: true,
    });

  // Countdown automático
  useEffect(() => {
    if (countdown > 0 && !isLoading && subscription) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isLoading && subscription) {
      handleRedirect();
    }
  }, [countdown, isLoading, subscription]);

  const handleRedirect = () => {
    setRedirecting(true);
    navigate("/dashboard");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Processando pagamento...
            </h2>
            <p className="text-slate-400">
              Aguarde enquanto confirmamos sua assinatura.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const planName = subscription?.plan
    ? subscription.plan === "pro"
      ? "PRO"
      : subscription.plan === "pro_plus"
      ? "PRO+"
      : "Grátis"
    : "seu novo plano";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Pagamento Confirmado! 🎉
            </h1>
            <p className="text-lg text-slate-300">
              Bem-vindo ao plano{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                {planName}
              </span>
            </p>
          </div>

          {/* Subscription Details */}
          {subscription && subscription.plan !== "free" && (
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Plano:</span>
                <span className="text-white font-semibold">{planName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Créditos:</span>
                <span className="text-white font-semibold">
                  {subscription.creditsRemaining === -1
                    ? "Ilimitados"
                    : subscription.creditsRemaining}
                </span>
              </div>
              {subscription.renewalDate && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Próxima renovação:</span>
                  <span className="text-white font-semibold">
                    {new Date(subscription.renewalDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <p className="text-slate-400">
            Sua assinatura foi ativada com sucesso! Agora você tem acesso a
            todos os recursos premium.
          </p>

          {/* Countdown */}
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Redirecionando para o dashboard em{" "}
              <span className="font-bold text-amber-500">{countdown}s</span>
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRedirect}
                disabled={redirecting}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
              >
                {redirecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    Ir para o Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <Button
                onClick={() => navigate("/pricing")}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Ver Planos
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-500 mt-6">
            Você receberá um email de confirmação em breve.
            <br />
            Dúvidas? Entre em contato com nosso suporte.
          </p>
        </div>
      </Card>
    </div>
  );
}
