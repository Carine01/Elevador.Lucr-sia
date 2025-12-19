import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export function CreditUsageChart() {
  const { data, isLoading } = trpc.analytics.getCreditHistory.useQuery({ days: 30 });

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Uso de Créditos (Últimos 30 dias)</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
            formatter={(value) => [`${value} créditos`, 'Usados']}
          />
          <Line 
            type="monotone" 
            dataKey="creditsUsed" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
