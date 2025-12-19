import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

export function ROICard() {
  const { data } = trpc.analytics.getDashboard.useQuery({ days: 30 });
  const { data: subscription } = trpc.subscription.getSubscription.useQuery();

  if (!data) return null;

  // Cálculo simplificado de ROI
  const subscriptionCost = subscription?.plan === 'pro' ? 29 : subscription?.plan === 'pro_plus' ? 79 : 0;
  const estimatedRevenue = data.totalCheckoutsCompleted * 500; // Assumindo R$500 por conversão
  const roi = subscriptionCost > 0 ? ((estimatedRevenue - subscriptionCost) / subscriptionCost) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">ROI Estimado</h3>
        <TrendingUp className="w-5 h-5 text-amber-600" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Investimento</p>
          <p className="text-2xl font-bold">R$ {subscriptionCost.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Receita Estimada</p>
          <p className="text-2xl font-bold text-green-600">R$ {estimatedRevenue.toFixed(2)}</p>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">Retorno</p>
          <p className="text-3xl font-bold text-amber-600">{roi.toFixed(0)}%</p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        *Baseado em conversões dos últimos 30 dias
      </p>
    </Card>
  );
}
