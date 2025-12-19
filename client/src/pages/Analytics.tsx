import { CreditUsageChart } from '@/components/analytics/CreditUsageChart';
import { FeatureUsageChart } from '@/components/analytics/FeatureUsageChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { ROICard } from '@/components/analytics/ROICard';

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Acompanhe suas métricas e performance
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <CreditUsageChart />
        </div>
        
        <FeatureUsageChart />
        <ConversionFunnel />
        
        <ROICard />
      </div>
    </div>
  );
}
