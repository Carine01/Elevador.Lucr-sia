import { CreditUsageChart } from '@/components/analytics/CreditUsageChart';
import { FeatureUsageChart } from '@/components/analytics/FeatureUsageChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { ROICard } from '@/components/analytics/ROICard';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

export default function Analytics() {
  const { data: overview } = trpc.analytics.getOverview.useQuery({ period: '30d' });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Acompanhe suas métricas e resultados
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Análises</p>
              <p className="text-2xl font-bold">{overview?.totalAnalyses || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-amber-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Leads</p>
              <p className="text-2xl font-bold">{overview?.leadsGenerated || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">{overview?.conversionRate || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Créditos Usados</p>
              <p className="text-2xl font-bold">{overview?.creditsUsed || 0}</p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <CreditUsageChart />
        <FeatureUsageChart />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ConversionFunnel />
        </div>
        <ROICard />
      </div>
    </div>
  );
}
