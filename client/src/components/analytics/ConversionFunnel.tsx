import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingCart, CheckCircle } from 'lucide-react';

export function ConversionFunnel() {
  const { data } = trpc.analytics.getDashboard.useQuery({ days: 30 });

  if (!data) return null;

  const steps = [
    {
      icon: Users,
      label: 'Análises de Bio',
      value: data.totalBioRadarAnalyses,
      percentage: 100,
    },
    {
      icon: TrendingUp,
      label: 'Leads Capturados',
      value: data.totalLeadsCaptured,
      percentage: data.totalBioRadarAnalyses > 0 
        ? (data.totalLeadsCaptured / data.totalBioRadarAnalyses) * 100 
        : 0,
    },
    {
      icon: ShoppingCart,
      label: 'Checkouts Iniciados',
      value: data.totalCheckoutsStarted,
      percentage: data.totalLeadsCaptured > 0 
        ? (data.totalCheckoutsStarted / data.totalLeadsCaptured) * 100 
        : 0,
    },
    {
      icon: CheckCircle,
      label: 'Conversões',
      value: data.totalCheckoutsCompleted,
      percentage: data.conversionRate,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Funil de Conversão</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{step.label}</p>
                    <p className="text-2xl font-bold">{step.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Taxa</p>
                  <p className="text-lg font-semibold">{step.percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all"
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
              
              {/* Seta conectando etapas */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-full h-4 w-px bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
