import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { TrendingUp, DollarSign } from 'lucide-react';

export function ROICard() {
  const { data, isLoading } = trpc.analytics.getFeatureROI.useQuery();

  if (isLoading) return <Card className="p-6">Carregando...</Card>;

  const roiNumber = parseFloat(data?.roi || '0');
  const isPositive = roiNumber > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">ROI</h3>
        <DollarSign className="w-5 h-5 text-green-500" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Investimento</p>
          <p className="text-2xl font-bold">
            R$ {((data?.planCost || 0) / 100).toFixed(2)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Retorno</p>
          <p className="text-2xl font-bold">
            R$ {((data?.revenue || 0) / 100).toFixed(2)}
          </p>
        </div>
        
        <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-5 h-5" />
          <span className="text-3xl font-bold">{data?.roi}%</span>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Features mais impactantes:</p>
          <div className="space-y-1">
            {data?.features.map(f => (
              <div key={f.name} className="flex justify-between text-sm">
                <span>{f.name}</span>
                <span className="text-muted-foreground">{f.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
