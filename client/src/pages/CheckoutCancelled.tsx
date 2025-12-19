import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CheckoutCancelled() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-md w-full">
        {/* Cancel Icon */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-slate-600 to-slate-700">
            <XCircle className="w-12 h-12 text-slate-300" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Checkout Cancelado
            </h1>
            <p className="text-lg text-slate-400">
              Não se preocupe, nenhuma cobrança foi realizada.
            </p>
          </div>

          {/* Message */}
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
            <p className="text-slate-300">
              Você cancelou o processo de pagamento. Seus dados estão seguros e
              nenhuma cobrança foi efetuada.
            </p>
            <p className="text-sm text-slate-400">
              Caso tenha encontrado algum problema ou dúvida, estamos aqui para
              ajudar!
            </p>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-amber-200 font-medium mb-2">
              💡 Lembre-se dos benefícios:
            </p>
            <ul className="text-xs text-slate-300 space-y-1 text-left">
              <li>• Geração ilimitada de conteúdo com IA</li>
              <li>• Prompts otimizados para Midjourney</li>
              <li>• Anúncios de alta conversão</li>
              <li>• Suporte prioritário</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/pricing")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Ver Planos Novamente
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>

          {/* Help Section */}
          <div className="pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-2">
              Precisa de ajuda ou tem dúvidas?
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="link"
                className="text-amber-500 hover:text-amber-400"
                onClick={() => {
                  // Aqui você pode adicionar link para suporte ou FAQ
                  window.open("mailto:suporte@elevare.ai", "_blank");
                }}
              >
                Falar com Suporte
              </Button>
              <span className="text-slate-600">•</span>
              <Button
                variant="link"
                className="text-amber-500 hover:text-amber-400"
                onClick={() => navigate("/pricing")}
              >
                Ver FAQ
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-500 mt-4">
            Você pode assinar a qualquer momento.
            <br />
            Cancele quando quiser, sem taxas ou multas.
          </p>
        </div>
      </Card>
    </div>
  );
}
