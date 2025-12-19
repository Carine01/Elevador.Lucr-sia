import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Check } from 'lucide-react';
import ElevareDashboardLayout from '@/components/ElevareDashboardLayout';

export default function Notifications() {
  const { data: notifications, refetch } = trpc.notifications.getAll.useQuery({ limit: 100 });
  
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  
  const deleteAllMutation = trpc.notifications.deleteAll.useMutation({
    onSuccess: () => refetch(),
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'credits_low':
      case 'credits_depleted':
        return '⚠️';
      case 'subscription_renewed':
        return '🎉';
      case 'subscription_expiring':
        return '⏰';
      case 'achievement_unlocked':
        return '🏆';
      case 'welcome':
        return '🚀';
      case 'milestone':
        return '🎯';
      default:
        return 'ℹ️';
    }
  };

  return (
    <ElevareDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Notificações</h1>
            <p className="text-slate-400">
              Todas as suas notificações em um só lugar
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir todas as notificações?')) {
                  deleteAllMutation.mutate();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar todas
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {notifications?.length === 0 ? (
            <Card className="p-8 text-center bg-slate-900 border-slate-800">
              <p className="text-slate-400">Nenhuma notificação</p>
            </Card>
          ) : (
            notifications?.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 bg-slate-900 border-slate-800 ${
                  !notification.read ? 'border-amber-500 border-2' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-white">{notification.title}</p>
                    <p className="text-sm text-slate-400">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  
                  {!notification.read && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                      Novo
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ElevareDashboardLayout>
  );
}
