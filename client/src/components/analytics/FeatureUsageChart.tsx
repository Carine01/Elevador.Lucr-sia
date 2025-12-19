import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function FeatureUsageChart() {
  const { data, isLoading } = trpc.analytics.getFeatureUsageChart.useQuery({ period: '30d' });

  if (isLoading) return <Card className="p-6">Carregando...</Card>;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Uso de Funcionalidades</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bioRadar" fill="#F59E0B" name="Bio Radar" />
          <Bar dataKey="ebooks" fill="#8B5CF6" name="E-books" />
          <Bar dataKey="prompts" fill="#3B82F6" name="Prompts" />
          <Bar dataKey="ads" fill="#10B981" name="Anúncios" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
