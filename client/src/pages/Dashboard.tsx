import ElevareDashboardLayout from "@/components/ElevareDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      description: "Descubra por que seu Instagram não converte",
      icon: Target,
      color: "from-amber-500 to-orange-500",
      href: "/dashboard/radar-bio",
      badge: "Grátis",
    },
    {
      title: "Robô Produtor",
      description: "Crie anúncios e conteúdos que vendem sozinhos",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/robo-produtor",
      badge: subscription?.plan === "free" ? "PRO" : null,
    },
    {
      title: "Gerador de E-books",
      description: "Isca digital que gera leads todos os dias",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      href: "/dashboard/ebooks",
      badge: subscription?.plan === "free" ? "PRO" : null,
    },
    {
      title: "Upgrade de Plano",
      description: "Desbloqueie crescimento e automação total",
      icon: CreditCard,
      color: "from-green-500 to-emerald-500",
      href: "/pricing",
      badge: subscription?.plan === "free" ? "Upgrade" : "Ativo",
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
      <Card className="bg-gradient-to-r from-purple-100 to-amber-100 border-purple-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Bem-vindo, {user?.name?.split(" ")[0] || "Usuário"}! 👋
            </h2>
            <p className="text-slate-700">
              <strong>Venda como ciência, não como esperança.</strong>
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Elevare Inteligência de Vendas - O pilar que une neurovendas,
              comportamento e engenharia de conversão.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-white border-gray-200 p-6 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-amber-100 rounded-lg">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Funcionalidades Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isPro = feature.badge === "PRO";
            return (
              <Card
                key={feature.title}
                className="bg-white border-gray-200 p-6 hover:border-purple-300 transition-all hover:shadow-lg cursor-pointer group"
                onClick={() => navigate(feature.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {feature.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isPro 
                        ? "bg-red-100 text-red-600 font-bold" 
                        : feature.badge === "Upgrade"
                        ? "bg-green-100 text-green-600 font-bold"
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  {feature.description}
                </p>
                {isPro && (
                  <p className="text-xs font-bold text-red-500 mb-3">
                    🔒 Disponível no PRO
                  </p>
                )}
                <div className="flex items-center text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">{isPro ? "Ver planos" : "Acessar"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-purple-100 to-amber-100 border-purple-200 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Comece Agora! 🚀
            </h3>
            <p className="text-slate-600">
              Faça seu primeiro diagnóstico com o Radar de Bio e descubra como
              melhorar sua presença no Instagram
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/radar-bio")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-6 rounded-lg text-lg whitespace-nowrap"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Manifesto */}
      <Card className="bg-white border-gray-200 p-8 mt-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Manifesto Elevare</h3>
        <div className="space-y-3 text-slate-700">
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
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <p className="text-slate-600 italic">
            "A cliente não compra o procedimento — compra a promessa. Elevare
            Inteligência de Vendas ensina você a entregar exatamente essa
            promessa."
          </p>
        </div>
      </Card>
    </ElevareDashboardLayout>
  );
}
