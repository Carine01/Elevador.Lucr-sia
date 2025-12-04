import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import {
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const features = [
    {
      icon: Zap,
      title: "Radar de Bio",
      description: "Analise sua bio do Instagram com IA e receba recomendações",
    },
    {
      icon: Sparkles,
      title: "Gerador de Conteúdo",
      description: "Crie posts, e-books e anúncios em minutos com IA",
    },
    {
      icon: BookOpen,
      title: "E-books Profissionais",
      description: "Gere e-books completos com capa e áudio automaticamente",
    },
    {
      icon: TrendingUp,
      title: "Analytics Completo",
      description: "Acompanhe seu crescimento e resultados em tempo real",
    },
  ];

  const benefits = [
    "Economize horas em criação de conteúdo",
    "Aumente suas vendas com copywriting estratégico",
    "Automatize sua presença nas redes sociais",
    "Acesse ferramentas de IA de ponta",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Elevare</h1>
              <p className="text-xs text-slate-400">NeuroVendas</p>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
          >
            Entrar
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-400">Powered by IA Avançada</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme Sua Estética em um Negócio{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Lucrativo
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Gere conteúdo estratégico, automatize suas vendas e cresça com IA.
            Tudo que você precisa para dominar o Instagram e vender mais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 rounded-lg text-lg h-auto"
            >
              Começar Teste Grátis (5 dias)
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800 font-semibold px-8 py-6 rounded-lg text-lg h-auto"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Tudo que Você Precisa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="bg-slate-800/50 border-slate-700 p-6 hover:border-slate-600 transition-all"
                >
                  <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Por Que Escolher Elevare?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Planos Simples e Transparentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Grátis",
                price: "R$ 0",
                period: "5 dias de teste",
                features: [
                  "Radar de Bio",
                  "3 análises/mês",
                  "Suporte por email",
                ],
              },
              {
                name: "PRO",
                price: "R$ 107",
                period: "/mês",
                features: [
                  "Tudo do Grátis",
                  "30 posts/mês",
                  "5 e-books/mês",
                  "Suporte prioritário",
                ],
                highlight: true,
              },
              {
                name: "PRO+",
                price: "R$ 147",
                period: "/mês",
                features: [
                  "Tudo do PRO",
                  "Ilimitado",
                  "Audiobooks",
                  "Mentoria exclusiva",
                ],
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-amber-500/20 to-orange-500/10 border-amber-500/50 scale-105"
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li
                      key={fidx}
                      className="flex items-center gap-2 text-slate-300"
                    >
                      <CheckCircle className="w-4 h-4 text-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className={`w-full font-semibold py-6 rounded-lg ${
                    plan.highlight
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-white"
                  }`}
                >
                  Começar Agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Transformar Sua Estética?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Comece seu teste grátis agora. Sem cartão de crédito necessário.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 rounded-lg text-lg h-auto"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-slate-400">
        <p>&copy; 2025 Elevare NeuroVendas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
