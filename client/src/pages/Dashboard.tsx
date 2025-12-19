import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  Target,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: subscription } = trpc.subscription.getSubscription.useQuery();
  const { data: contentStats } = trpc.content.listGenerated.useQuery({
    limit: 100,
  });

  const features = [
    {
      title: "Radar de Bio",
      description: "Analise sua bio do Instagram e receba recomendações",
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      href: "/dashboard/radar-bio",
      badge: "Grátis",
    },
    {
      title: "Gerador de E-books",
      description: "Crie e-books profissionais com IA em minutos",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      href: "/dashboard/ebooks",
      badge: subscription?.plan === "free" ? "PRO" : null,
    },
    {
      title: "Robô Produtor",
      description: "Gere prompts e anúncios otimizados com neurovendas",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/robo-produtor",
      badge: subscription?.plan === "free" ? "PRO" : null,
    },
    {
      title: "Planos e Preços",
      description: "Faça upgrade e desbloqueie todos os recursos",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
      href: "/pricing",
      badge: subscription?.plan === "free" ? "Upgrade" : null,
    },
  ];

  const ebooksCount = contentStats?.filter((c: any) => c.type === "ebook").length || 0;
  const adsCount = contentStats?.filter((c: any) => c.type === "ad").length || 0;
  const promptsCount = contentStats?.filter((c: any) => c.type === "prompt").length || 0;

  const stats = [
    {
      label: "E-books Criados",
      value: ebooksCount.toString(),
      icon: BookOpen,
    },
    {
      label: "Anúncios Gerados",
      value: adsCount.toString(),
      icon: Sparkles,
    },
    {
      label: "Créditos Disponíveis",
      value:
        subscription?.plan === "pro_plus"
          ? "∞"
          : subscription?.creditsRemaining?.toString() || "0",
      icon: Zap,
    },
    {
      label: "Plano Atual",
      value:
        subscription?.plan === "free"
          ? "Grátis"
          : subscription?.plan === "pro"
          ? "PRO"
          : "PRO+",
      icon: Target,
    },
  ];

  return (
    <ElevareDashboardLayout>
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Bem-vindo, {user?.name?.split(" ")[0] || "Usuário"}! 👋
            </h2>
            <p className="text-slate-300">
              <strong>Venda como ciência, não como esperança.</strong>
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Elevare Inteligência de Vendas - O pilar que une neurovendas,
              comportamento e engenharia de conversão.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid and Credits Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </Card>
          );
        })}
        <CreditsDisplay />
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6">
          Funcionalidades Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-slate-800/50 border-slate-700 p-6 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/50 cursor-pointer group"
                onClick={() => navigate(feature.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-amber-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Acessar</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Comece Agora! 🚀
            </h3>
            <p className="text-slate-400">
              Faça seu primeiro diagnóstico com o Radar de Bio e descubra como
              melhorar sua presença no Instagram
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/radar-bio")}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-6 rounded-lg text-lg"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Manifesto */}
      <Card className="bg-slate-800/50 border-slate-700 p-8 mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Manifesto Elevare</h3>
        <div className="space-y-3 text-slate-300">
          <p>
            <strong>Vender é traduzir valor, não baixar preço.</strong>
          </p>
          <p>
            <strong>É conduzir, não pressionar.</strong>
          </p>
          <p>
            <strong>
              É mostrar o caminho da transformação que a cliente já deseja.
            </strong>
          </p>
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-slate-300 italic">
            "A cliente não compra o procedimento — compra a promessa. Elevare
            Inteligência de Vendas ensina você a entregar exatamente essa
            promessa."
          </p>
        </div>
      </Card>
    </ElevareDashboardLayout>
  );
}
