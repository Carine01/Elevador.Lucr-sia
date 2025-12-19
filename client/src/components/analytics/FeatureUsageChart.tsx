import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const FEATURE_NAMES: Record<string, string> = {
  'bio-radar': 'Radar de Bio',
  'ebook-generation': 'E-books',
  'prompt-generation': 'Prompts',
  'ad-generation': 'Anúncios',
  'cover-generation': 'Capas',
};

export function FeatureUsageChart() {
  const { data, isLoading } = trpc.analytics.getFeatureUsage.useQuery({ days: 30 });

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </Card>
    );
  }

  const chartData = data?.map(d => ({
    name: FEATURE_NAMES[d.name] || d.name,
    count: d.count,
  })) || [];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Features Mais Usadas</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} usos`, 'Quantidade']} />
          <Bar dataKey="count" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
