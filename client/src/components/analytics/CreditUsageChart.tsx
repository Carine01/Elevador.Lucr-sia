import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function CreditUsageChart() {
  const { data, isLoading } = trpc.analytics.getCreditUsageChart.useQuery({ period: '30d' });

  if (isLoading) return <Card className="p-6">Carregando...</Card>;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Uso de Créditos (30 dias)</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="consumed" stroke="#ef4444" name="Consumidos" />
          <Line type="monotone" dataKey="added" stroke="#22c55e" name="Adicionados" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
