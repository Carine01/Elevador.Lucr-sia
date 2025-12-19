import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

export function ConversionFunnel() {
  const { data, isLoading } = trpc.analytics.getConversionFunnel.useQuery();

  if (isLoading) return <Card className="p-6">Carregando...</Card>;

  const maxCount = Math.max(...(data?.map(d => d.count) || [1]));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Funil de Conversão</h3>
      
      <div className="space-y-4">
        {data?.map((stage, index) => {
          const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const dropoff = index > 0 && data[index - 1]
            ? ((data[index - 1].count - stage.count) / data[index - 1].count) * 100
            : 0;

          return (
            <div key={stage.stage}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{stage.stage}</span>
                <span className="text-sm text-muted-foreground">
                  {stage.count} {dropoff > 0 && `(-${dropoff.toFixed(0)}%)`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 10 && `${percentage.toFixed(0)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
